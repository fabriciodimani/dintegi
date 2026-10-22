import fs from 'node:fs/promises';
import path from 'node:path';
export async function openStore(dir){
 await fs.mkdir(dir,{recursive:true,mode:0o700});
 const lock=path.join(dir,'instance.lock');
 try{await fs.writeFile(lock,String(process.pid),{flag:'wx',mode:0o600});}
 catch(e){
  if(e.code!=='EEXIST')throw e;
  const pid=Number(await fs.readFile(lock,'utf8'));
  let alive=true;try{process.kill(pid,0);}catch(err){if(err.code==='ESRCH')alive=false;}
  if(alive)throw new Error('Ya hay una instancia usando DATA_DIR. Usar un solo proceso.');
  await fs.unlink(lock);await fs.writeFile(lock,String(process.pid),{flag:'wx',mode:0o600});
 }
 const filename=path.join(dir,'campaigns.json');let state;
 try{state=JSON.parse(await fs.readFile(filename,'utf8'));}
 catch(e){if(e.code!=='ENOENT'){await fs.unlink(lock);throw new Error('No se pudo leer la base. Restaurar backup; no se reinicia vacía.');}state={contacts:[],campaigns:[],deliveries:[],jobs:[]};}
 // Tras un reinicio nunca se reenvía un mensaje de resultado incierto.
 for(const d of state.deliveries)if(d.status==='sending')d.status='unknown';else if(d.status==='queued')d.status='cancelled';
 for(const j of state.jobs)if(j.status==='running')j.status='interrupted';
 let tail=Promise.resolve();
 const save=async()=>{const temp=filename+'.tmp';const h=await fs.open(temp,'w',0o600);try{await h.writeFile(JSON.stringify(state));await h.sync();}finally{await h.close();}await fs.rename(temp,filename);};
 await save();
 return {read:()=>structuredClone(state),change(fn){const run=tail.then(async()=>{const next=structuredClone(state);const result=await fn(next);const prev=state;state=next;try{await save();}catch(e){state=prev;throw e;}return result;});tail=run.catch(()=>{});return run;},async close(){await tail;await fs.unlink(lock);}};
}
