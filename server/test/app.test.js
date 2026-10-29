import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {scryptSync} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {createApplication,validEmail} from '../app.js';
import {openStore} from '../store.js';
import {buildMail} from '../mail.js';
import {parseContactsCSV,csvText} from '../../src/admin/csv.js';
const password='solo-para-pruebas-locales';
const salt='a'.repeat(32);
const baseEnv={ADMIN_EMAIL:'admin@example.com',ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex'),UNSUBSCRIBE_SECRET:'b'.repeat(64),PUBLIC_API_URL:'http://localhost:3001',FRONTEND_ORIGINS:'http://localhost:5173',MAIL_FROM:'admin@example.com',TEST_EMAIL:'test@example.com',SEND_INTERVAL_MS:'1'};
const campaign={name:'Presentación',subject:'Una consulta',body:'Hola, este es un mensaje de prueba de DINTEGI.',link:'https://www.dintegi.com.ar'};
async function setup(t,transport=null,overrides={}){
 const dir=await mkdtemp(path.join(tmpdir(),'dintegi-test-'));
 const app=await createApplication({...baseEnv,DATA_DIR:dir,...overrides},{transport});
 await new Promise(r=>app.server.listen(0,'127.0.0.1',r));
 t.after(async()=>{await app.close();await rm(dir,{recursive:true,force:true});});
 const url='http://127.0.0.1:'+app.server.address().port;let token='';
 const req=async(route,method='GET',data,headers={})=>{const r=await fetch(url+'/api'+route,{method,headers:{Authorization:'Bearer '+token,...(data?{'Content-Type':'application/json'}:{}),...headers},body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json()};};
 const login=await req('/login','POST',{email:baseEnv.ADMIN_EMAIL,password});assert.equal(login.status,200);token=login.data.token;
 return {app,req,url};
}
async function waitJob(app){for(let i=0;i<300;i++){if(!app.store.read().jobs.some(j=>j.status==='running'))return;await delay(10);}assert.fail('La tanda no terminó');}
const accepting=calls=>({async sendMail(mail){calls.push(mail);return {accepted:[mail.to],messageId:'test-only'};}});

test('sesión, origen, importación, bajas persistentes y SMTP apagado',async t=>{
 const {req,url}=await setup(t);
 assert.equal((await req('/state','GET',null,{Authorization:''})).status,401);
 assert.equal((await req('/state','GET',null,{Origin:'https://otro.example'})).status,403);
 const imported=await req('/contacts/import','POST',{contacts:[{email:' UNO@Example.com '},{email:'uno@example.com'},{email:'sin-correo'},{email:'dos@example.com'}]});
 assert.deepEqual(imported.data,{added:2,duplicates:1,invalid:1});
 const state=(await req('/state')).data;
 await req('/contacts/'+state.contacts[0].id+'/suppress','POST',{});
 await req('/contacts/import','POST',{contacts:[{email:'uno@example.com'}]});
 assert.equal((await req('/state')).data.contacts[0].unsubscribed,true);
 const c=(await req('/campaigns','POST',campaign)).data;
 assert.equal((await req('/campaigns/'+c.id+'/test','POST',{})).status,503);
 assert.equal((await fetch(url+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'admin@example.com',password:'incorrecta'})})).status,401);
});

test('prueba obligatoria, tanda individual, dobles clics y cupo por hora',async t=>{
 const calls=[];const {app,req}=await setup(t,accepting(calls),{HOURLY_LIMIT:'3'});
 await req('/contacts/import','POST',{contacts:[{email:'uno@example.com'},{email:'dos@example.com'},{email:'tres@example.com'}]});
 const contacts=(await req('/state')).data.contacts;
 const c=(await req('/campaigns','POST',campaign)).data;
 const payload={contactIds:contacts.slice(0,2).map(c=>c.id),confirmCount:2};
 assert.equal((await req('/campaigns/'+c.id+'/send','POST',payload)).status,409);
 assert.equal((await req('/campaigns/'+c.id+'/test','POST',{})).status,202);await waitJob(app);
 assert.equal(calls[0].to,'test@example.com');
 const results=await Promise.all([req('/campaigns/'+c.id+'/send','POST',payload),req('/campaigns/'+c.id+'/send','POST',payload)]);
 assert.deepEqual(results.map(r=>r.status).sort(),[202,409]);await waitJob(app);
 assert.equal(calls.length,3);assert.equal(calls.filter(m=>m.to==='uno@example.com').length,1);
 const state=(await req('/state')).data;assert.equal(state.config.remaining,0);
 assert.equal(state.deliveries.some(d=>'snapshot' in d),false);
 assert.equal((await req('/campaigns/'+c.id+'/send','POST',{contactIds:[contacts[2].id],confirmCount:1})).status,429);
 assert.equal((await req('/campaigns/'+c.id,'PUT',{...campaign,subject:'Otro asunto'})).status,409);
});

test('un test anterior no habilita una versión editada durante el envío',async t=>{
 let release;const gate=new Promise(r=>release=r);
 const {app,req}=await setup(t,{async sendMail(mail){await gate;return {accepted:[mail.to]};}});
 const c=(await req('/campaigns','POST',campaign)).data;
 await req('/campaigns/'+c.id+'/test','POST',{});
 assert.equal((await req('/campaigns/'+c.id,'PUT',{...campaign,body:campaign.body+' Cambiado.'})).status,200);
 release();await waitJob(app);
 assert.equal((await req('/state')).data.campaigns[0].testedAt,null);
});

test('la baja GET sólo confirma; POST excluye de todas las campañas',async t=>{
 const calls=[];const {app,req,url}=await setup(t,accepting(calls));
 await req('/contacts/import','POST',{contacts:[{email:'test@example.com'}]});
 const c=(await req('/campaigns','POST',campaign)).data;
 await req('/campaigns/'+c.id+'/test','POST',{});await waitJob(app);
 const unsubscribe=new URL(calls[0].headers['List-Unsubscribe'].slice(1,-1));
 const route=url+unsubscribe.pathname+unsubscribe.search;
 assert.equal((await fetch(route)).status,200);
 assert.equal((await req('/state')).data.contacts[0].unsubscribed,false);
 assert.equal((await fetch(route,{method:'POST',body:'List-Unsubscribe=One-Click'})).status,200);
 const state=(await req('/state')).data;assert.equal(state.contacts[0].unsubscribed,true);
 assert.equal((await req('/campaigns/'+c.id+'/send','POST',{contactIds:[state.contacts[0].id],confirmCount:1})).status,409);
 assert.equal((await fetch(url+'/unsubscribe?token=incorrecto')).status,400);
});

test('resultado SMTP incierto bloquea reintentos',async t=>{
 let count=0;const {app,req}=await setup(t,{async sendMail(mail){if(count++)throw Object.assign(new Error('timeout'),{code:'ETIMEDOUT'});return {accepted:[mail.to]};}});
 await req('/contacts/import','POST',{contacts:[{email:'uno@example.com'}]});
 const c=(await req('/campaigns','POST',campaign)).data;
 await req('/campaigns/'+c.id+'/test','POST',{});await waitJob(app);
 const p={contactIds:[(await req('/state')).data.contacts[0].id],confirmCount:1};
 await req('/campaigns/'+c.id+'/send','POST',p);await waitJob(app);
 assert.equal((await req('/state')).data.deliveries.at(-1).status,'unknown');
 assert.equal((await req('/campaigns/'+c.id+'/send','POST',p)).status,409);
});

test('reinicio reconcilia estados y el almacenamiento impide dos instancias',async t=>{
 const dir=await mkdtemp(path.join(tmpdir(),'dintegi-store-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 await writeFile(path.join(dir,'campaigns.json'),JSON.stringify({contacts:[],campaigns:[],deliveries:[{status:'sending'},{status:'queued'}],jobs:[{status:'running'}]}));
 const store=await openStore(dir);assert.deepEqual(store.read().deliveries.map(d=>d.status),['unknown','cancelled']);
 assert.equal(store.read().jobs[0].status,'interrupted');await assert.rejects(openStore(dir),/instancia/);
 await assert.rejects(store.change(s=>{s.contacts.push({email:'rollback@example.com'});throw Error('rollback');}));
 assert.equal(store.read().contacts.length,0);await store.close();
});

test('CSV, escape HTML y fórmulas de planilla',()=>{
 assert.equal(validEmail('.mal@example.com'),false);assert.equal(validEmail('mal.@example.com'),false);assert.equal(validEmail('bien+tag@example.com'),true);
 assert.deepEqual(parseContactsCSV('\uFEFFEmail;Nombre\r\nuno@example.com;"Uno; Dos"\r\n')[0],{email:'uno@example.com',name:'Uno; Dos',source:'EXPOCON'});
 assert.equal(parseContactsCSV('uno@example.com\ndos@example.com').length,2);
 assert.throws(()=>parseContactsCSV('Email\n"sin cerrar'),/comillas/);
 assert.ok(csvText(['Dato'],[['=SUM(A1)']]).includes("'=SUM"));
 const mail=buildMail(baseEnv,{...campaign,body:'<script>alert(1)</script>'},'uno@example.com','https://api.example/unsubscribe?token=abc');
 assert.ok(!mail.html.includes('<script>'));assert.ok(mail.html.includes('&lt;script&gt;'));assert.equal(mail.to,'uno@example.com');
});
