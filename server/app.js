import {createServer} from 'node:http';
import {randomBytes,randomUUID,scrypt as scryptCallback,timingSafeEqual,createHmac} from 'node:crypto';
import {promisify} from 'node:util';
import {setTimeout as delay} from 'node:timers/promises';
import {openStore} from './store.js';
import {makeTransport,buildMail,escapeHtml} from './mail.js';
import {createSuppressionClient} from './suppressions.js';
const scrypt=promisify(scryptCallback);
export const normalizeEmail=v=>String(v??'').trim().toLowerCase();
export const validEmail=v=>v.length<=254&&/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(v)&&!v.includes('..')&&!v.startsWith('.')&&!v.includes('.@')&&v.split('@')[0].length<=64&&v.split('@')[1].split('.').every(label=>label.length<=63);
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const now=()=>new Date().toISOString();
const text=(v,n)=>String(v??'').trim().slice(0,n);
const retryable=new Set(['queued','sending','accepted','unknown']);
const campaignName=c=>String(c?.name||'').trim().toLocaleLowerCase('es').replace(/\s+/g,' ');
const familyIds=(state,cid)=>{const c=state.campaigns.find(x=>x.id===cid);return new Set(state.campaigns.filter(x=>c&&campaignName(x)===campaignName(c)).map(x=>x.id));};
const isBlocked=(state,cid,email)=>{const ids=familyIds(state,cid);return state.deliveries.some(d=>ids.has(d.campaignId)&&d.email===email&&d.kind==='campaign'&&retryable.has(d.status));};
// Unifica la vista de campañas del mismo nombre sin borrar originales ni snapshots.
export function campaignView(state){
 const groups=new Map();for(const c of state.campaigns){const key=campaignName(c);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(c);}
 const aliases=new Map(),campaigns=[];
 const count=c=>state.deliveries.filter(d=>d.campaignId===c.id&&d.kind==='campaign'&&retryable.has(d.status)).length;
 for(const members of groups.values()){
  members.sort((a,b)=>count(b)-count(a)||Number(!!b.testedAt)-Number(!!a.testedAt)||String(a.createdAt).localeCompare(String(b.createdAt))||a.id.localeCompare(b.id));
  const c=members[0];for(const m of members)aliases.set(m.id,c.id);
  campaigns.push({...c,combinedCampaigns:members.length});
 }
 campaigns.sort((a,b)=>count(b)-count(a)||String(a.createdAt).localeCompare(String(b.createdAt))||a.id.localeCompare(b.id));
 return {...state,campaigns,defaultCampaignId:campaigns[0]?.id||'',deliveries:state.deliveries.map(({snapshot,...d})=>({...d,originalCampaignId:d.campaignId,campaignId:aliases.get(d.campaignId)||d.campaignId})),jobs:state.jobs.map(j=>({...j,campaignId:aliases.get(j.campaignId)||j.campaignId}))};
}
const safeCompare=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);};
async function body(req){let size=0,chunks=[];for await(const c of req){size+=c.length;if(size>3e6)fail(413,'El archivo supera el tamaño permitido.');chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString()||'{}');}catch{fail(400,'JSON inválido.');}}
function cleanCampaign(b){
 const c={name:text(b.name,100),subject:text(b.subject,150).replace(/[\r\n]/g,' '),body:text(b.body,12000),link:text(b.link,1000)};
 if(!c.name||!c.subject||c.body.length<20)fail(400,'Completá nombre, asunto y un mensaje de al menos 20 caracteres.');
 try{const u=new URL(c.link);if(!['https:','http:'].includes(u.protocol)||u.username||u.password)throw 0;}catch{fail(400,'Ingresá un enlace web válido.');}return c;
}
export async function createApplication(env,{transport:providedTransport,store:providedStore,suppressionClient}={}){
 if(!/^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(env.ADMIN_PASSWORD_HASH||''))throw new Error('Configurá ADMIN_PASSWORD_HASH con npm run password.');
 if((env.UNSUBSCRIBE_SECRET||'').length<32)throw new Error('UNSUBSCRIBE_SECRET debe tener al menos 32 caracteres.');
 if(!validEmail(normalizeEmail(env.ADMIN_EMAIL)))throw new Error('Configurá ADMIN_EMAIL.');
 const publicUrl=new URL(env.PUBLIC_API_URL||'http://localhost:3001');
 if(!['http:','https:'].includes(publicUrl.protocol))throw new Error('PUBLIC_API_URL inválida.');
 if(env.NODE_ENV==='production'&&publicUrl.protocol!=='https:')throw new Error('Usar PUBLIC_API_URL HTTPS en producción.');
 const remote=suppressionClient===undefined?createSuppressionClient(env):suppressionClient;
 const store=providedStore||await openStore(env.DATA_DIR||'./data');
 const transport=providedTransport===undefined?makeTransport(env):providedTransport;
 const origins=new Set((env.FRONTEND_ORIGINS||'http://localhost:5173').split(',').map(x=>x.trim()).filter(Boolean));
 const sessions=new Map(),attempts=new Map();let worker=null,closing=false;
 const cap=Math.max(1,Math.min(50,Number(env.HOURLY_LIMIT)||50));
 const token=email=>Buffer.from(email).toString('base64url')+'.'+createHmac('sha256',env.UNSUBSCRIBE_SECRET).update(email).digest('hex');
 const unsub=email=>remote?remote.unsubscribeUrl(token(email)):new URL('/unsubscribe?token='+token(email),publicUrl).href;
 async function rememberSuppressed(emails){
  const known=new Set(store.read().contacts.filter(c=>c.unsubscribed).map(c=>c.email));
  const blocked=new Set(emails.map(normalizeEmail).filter(email=>!known.has(email)));
  if(!blocked.size)return;
  await store.change(s=>{for(const email of blocked){if(!validEmail(email))continue;let c=s.contacts.find(x=>x.email===email);if(!c){c={id:randomUUID(),email,name:'',source:'Baja pública',createdAt:now()};s.contacts.push(c);}c.unsubscribed=true;c.unsubscribedAt=c.unsubscribedAt||now();}});
 }
 async function syncSuppressions(){if(remote)await rememberSuppressed(await remote.list());}
 const readToken=t=>{const [encoded,signature]=String(t||'').split('.');const email=Buffer.from(encoded||'','base64url').toString();if(!validEmail(email)||!safeCompare(token(email),encoded+'.'+signature))fail(400,'Enlace de baja inválido.');return email;};
 const budget=state=>{
  const recent=state.deliveries.filter(d=>Date.parse(d.startedAt||d.createdAt)>Date.now()-3600000);
  return {remaining:Math.max(0,cap-recent.length),limit:cap,nextAt:recent.length?new Date(Math.min(...recent.map(d=>Date.parse(d.startedAt||d.createdAt)))+3600000).toISOString():null};
 };
 const active=state=>state.jobs.some(j=>j.status==='running');
 function smtpError(e){return e.code==='EAUTH'?'El proveedor rechazó las credenciales SMTP.':e.responseCode>=500?'El proveedor rechazó el mensaje o destinatario.':e.responseCode>=400?'El proveedor devolvió un rechazo temporal.':'No se pudo confirmar el envío. Revisar en el proveedor antes de reintentar.';}
 async function runJob(jobId){
  const ids=store.read().deliveries.filter(d=>d.jobId===jobId).map(d=>d.id);
  for(const id of ids){
   if(closing)break;
   if(remote){
    const pending=store.read().deliveries.find(d=>d.id===id);
    try{if(pending?.status==='queued'&&await remote.check(pending.email))await rememberSuppressed([pending.email]);}
    catch{
     await store.change(s=>{for(const d of s.deliveries)if(d.jobId===jobId&&d.status==='queued')Object.assign(d,{status:'cancelled',error:'Tanda detenida: no se pudieron verificar las bajas públicas. No se envió este correo.',finishedAt:now()});const j=s.jobs.find(x=>x.id===jobId);j.status='interrupted';j.finishedAt=now();});
     return;
    }
   }
   const item=await store.change(s=>{
    const d=s.deliveries.find(x=>x.id===id);if(d.status!=='queued')return null;
    if(s.contacts.find(c=>c.email===d.email)?.unsubscribed){d.status='cancelled';return null;}
    d.status='sending';d.startedAt=now();return structuredClone(d);
   });
   if(!item)continue;
   let outcome;
   try{
    const info=await transport.sendMail(buildMail(env,item.snapshot,item.email,unsub(item.email),item.kind==='test'));
    if(!info.accepted?.some(x=>normalizeEmail(typeof x==='string'?x:x.address)===item.email))throw Object.assign(new Error('Rejected'),{responseCode:550});
    outcome={status:'accepted',messageId:String(info.messageId||''),finishedAt:now()};
   }catch(e){outcome={status:e.responseCode||e.code==='EAUTH'||e.code==='EDNS'?'error':'unknown',error:smtpError(e),finishedAt:now()};}
   await store.change(s=>{
    Object.assign(s.deliveries.find(x=>x.id===id),outcome);
    if(item.kind==='test'&&outcome.status==='accepted'){
     const c=s.campaigns.find(x=>x.id===item.campaignId);
     if(c&&['name','subject','body','link'].every(key=>c[key]===item.snapshot[key]))c.testedAt=now();
    }
   });
   if(ids.indexOf(id)<ids.length-1)await delay(Math.max(0,Number(env.SEND_INTERVAL_MS)||1500));
  }
  await store.change(s=>{const j=s.jobs.find(x=>x.id===jobId);j.status=closing?'interrupted':'done';j.finishedAt=now();});
 }
 const sendJSON=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 const server=createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  const origin=req.headers.origin;
  try{
   const url=new URL(req.url,'http://localhost');
   // Baja pública: GET sólo muestra confirmación, POST ejecuta la baja. Acepta One-Click.
   if(url.pathname==='/unsubscribe'){
    const email=readToken(url.searchParams.get('token'));
    if(!['GET','POST'].includes(req.method))fail(405,'Método no permitido.');
    if(req.method==='POST'){if(remote)await remote.suppress(email);await rememberSuppressed([email]);}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'"});
    res.end(`<!doctype html><html lang="es"><meta name="viewport" content="width=device-width"><title>DINTEGI · Baja</title><body style="font-family:Arial;max-width:540px;margin:80px auto;padding:24px"><h1>DINTEGI</h1>${req.method==='POST'?'<p>Tu dirección fue retirada de las próximas campañas.</p>':`<p>¿Querés dejar de recibir nuestras comunicaciones?</p><form method="post" action="${escapeHtml(url.pathname+url.search)}"><button style="padding:12px 20px">Confirmar baja</button></form>`}</body></html>`);return;
   }
   if(origin&&!origins.has(origin))fail(403,'Origen no permitido.');
   if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,OPTIONS');}
   if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
   if(url.pathname==='/api/health'){sendJSON(res,200,{ok:true});return;}
   if(url.pathname==='/api/login'&&req.method==='POST'){
    const ip=req.socket.remoteAddress;
    for(const [k,v] of attempts)if(v.until<Date.now())attempts.delete(k);
    if(attempts.size>10000)fail(429,'Demasiados intentos. Probá más tarde.');
    const attempt=attempts.get(ip)||{count:0,until:Date.now()+900000};
    if(attempt.count>=5)fail(429,'Demasiados intentos. Esperá 15 minutos.');
    attempt.count++;attempts.set(ip,attempt);
    const b=await body(req);const [salt,hash]=env.ADMIN_PASSWORD_HASH.split(':');
    const check=(await scrypt(String(b.password||'').slice(0,1024),salt,64)).toString('hex');
    if(normalizeEmail(b.email)!==normalizeEmail(env.ADMIN_EMAIL)||!safeCompare(check,hash))fail(401,'Correo o contraseña incorrectos.');
    attempts.delete(ip);for(const [k,v] of sessions)if(v<Date.now())sessions.delete(k);
    if(sessions.size>100)sessions.delete(sessions.keys().next().value);
    const session=randomBytes(32).toString('hex');sessions.set(session,Date.now()+8*3600000);sendJSON(res,200,{token:session});return;
   }
   const session=(req.headers.authorization||'').replace(/^Bearer /,'');
   if(!sessions.has(session)||sessions.get(session)<Date.now())fail(401,'Iniciá sesión para continuar.');
   if(url.pathname==='/api/logout'&&req.method==='POST'){sessions.delete(session);sendJSON(res,200,{ok:true});return;}
   if(url.pathname==='/api/state'&&req.method==='GET'){
    await syncSuppressions();
    const s=store.read();sendJSON(res,200,{...campaignView(s),config:{mailReady:!!transport,from:env.MAIL_FROM||'fabricio@dintegi.com.ar',testEmail:env.TEST_EMAIL||env.ADMIN_EMAIL,...budget(s)}});return;
   }
   if(url.pathname==='/api/contacts/import'&&req.method==='POST'){
    const b=await body(req);if(!Array.isArray(b.contacts)||b.contacts.length>10000)fail(400,'Importá hasta 10.000 contactos por archivo.');
    const result=await store.change(s=>{
     const report={added:0,duplicates:0,invalid:0};const seen=new Set(s.contacts.map(c=>c.email));
     for(const row of b.contacts){const email=normalizeEmail(row.email);if(!validEmail(email)){report.invalid++;continue;}if(seen.has(email)){report.duplicates++;continue;}seen.add(email);s.contacts.push({id:randomUUID(),email,name:text(row.name,140),source:text(row.source,100)||'EXPOCON',unsubscribed:false,createdAt:now()});report.added++;}return report;
    });sendJSON(res,200,result);return;
   }
   const contactMatch=url.pathname.match(/^\/api\/contacts\/([^/]+)\/suppress$/);
   if(contactMatch&&req.method==='POST'){
    if(remote){const c=store.read().contacts.find(x=>x.id===contactMatch[1]);if(!c)fail(404,'Contacto no encontrado.');await remote.suppress(c.email);}
    await store.change(s=>{const c=s.contacts.find(x=>x.id===contactMatch[1]);if(!c)fail(404,'Contacto no encontrado.');c.unsubscribed=true;c.unsubscribedAt=now();});sendJSON(res,200,{ok:true});return;
   }
   if(url.pathname==='/api/campaigns'&&req.method==='POST'){
    const c=cleanCampaign(await body(req));const result=await store.change(s=>{const existing=campaignView(s).campaigns.find(x=>campaignName(x)===campaignName(c));if(existing){if(['subject','body','link'].every(k=>existing[k]===c[k]))return existing;fail(409,'Ya existe una campaña con ese nombre. Elegila para continuar o usá otro nombre para un mensaje diferente.');}const item={...c,id:randomUUID(),createdAt:now(),testedAt:null};s.campaigns.unshift(item);return item;});sendJSON(res,201,result);return;
   }
   const campaignMatch=url.pathname.match(/^\/api\/campaigns\/([^/]+)$/);
   if(campaignMatch&&req.method==='PUT'){
    const b=cleanCampaign(await body(req));const result=await store.change(s=>{
     const c=s.campaigns.find(x=>x.id===campaignMatch[1]);if(!c)fail(404,'Campaña no encontrada.');
     const ids=familyIds(s,c.id);
     if(s.deliveries.some(d=>ids.has(d.campaignId)&&d.kind==='campaign'&&retryable.has(d.status)))fail(409,'La campaña ya tiene envíos. Creá una nueva con otro nombre para cambiar el contenido.');
     if(s.campaigns.some(x=>!ids.has(x.id)&&campaignName(x)===campaignName(b)))fail(409,'Ya existe otra campaña con ese nombre.');
     Object.assign(c,b,{testedAt:null});return c;
    });sendJSON(res,200,result);return;
   }
   const sendMatch=url.pathname.match(/^\/api\/campaigns\/([^/]+)\/(send|test)$/);
   if(sendMatch&&req.method==='POST'){
    if(!transport)fail(503,'El envío está desactivado. Configurá el proveedor SMTP en el backend.');
    if(closing)fail(503,'Servidor en mantenimiento.');
    const b=await body(req),kind=sendMatch[2]==='test'?'test':'campaign';
    if(kind==='campaign'&&!remote)fail(503,'Para enviar a contactos, configurá primero el servicio público de bajas. Las pruebas a tu cuenta siguen disponibles.');
    await syncSuppressions();
    const result=await store.change(s=>{
     if(active(s))fail(409,'Ya hay una tanda en curso.');
     const c=s.campaigns.find(x=>x.id===sendMatch[1]);if(!c)fail(404,'Campaña no encontrada.');
     let emails;
     if(kind==='test'){emails=[normalizeEmail(env.TEST_EMAIL||env.ADMIN_EMAIL)];if(!validEmail(emails[0]))fail(400,'Configurá TEST_EMAIL.');}
     else{
      if(!c.testedAt)fail(409,'Enviá primero una prueba de esta versión de la campaña.');
      if(!Array.isArray(b.contactIds)||!b.contactIds.length||b.contactIds.length>50)fail(400,'Seleccioná entre 1 y 50 contactos.');
      const ids=[...new Set(b.contactIds)];if(ids.length!==b.contactIds.length)fail(400,'Selección repetida.');
      const contacts=ids.map(id=>s.contacts.find(x=>x.id===id));if(contacts.some(x=>!x))fail(400,'Hay contactos inexistentes.');
      if(contacts.some(x=>x.unsubscribed))fail(409,'La selección incluye contactos dados de baja.');
      if(contacts.some(x=>isBlocked(s,c.id,x.email)))fail(409,'La selección incluye correos ya enviados o con resultado incierto.');
      if(b.confirmCount!==ids.length)fail(400,'Confirmá la cantidad de destinatarios.');emails=contacts.map(x=>x.email);
     }
     const available=budget(s);if(emails.length>available.remaining)fail(429,`Quedan ${available.remaining} intentos disponibles en esta hora móvil.`);
     const job={id:randomUUID(),campaignId:c.id,kind,total:emails.length,status:'running',createdAt:now()};s.jobs.unshift(job);
     for(const email of emails)s.deliveries.push({id:randomUUID(),jobId:job.id,campaignId:c.id,email,kind,status:'queued',createdAt:now(),snapshot:structuredClone(c)});
     return job;
    });
    worker=runJob(result.id).catch(()=>{console.error('Se detuvo la tanda: revisar almacenamiento y reiniciar para reconciliar estados.');}).finally(()=>{worker=null;});sendJSON(res,202,result);return;
   }
   fail(404,'Ruta no encontrada.');
  }catch(e){if(!res.headersSent)sendJSON(res,e.status||500,{error:e.status?e.message:'Error interno. Revisá el servidor.'});else res.end();}
 });
 return {server,store,async close(){closing=true;if(worker)await worker;transport?.close?.();await new Promise(resolve=>server.close(resolve));await store.close();}};
}
