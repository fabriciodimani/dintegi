import {randomBytes,scryptSync} from 'node:crypto';
import readline from 'node:readline';
// Entrada oculta en terminal; no deja la contraseña en argumentos ni historial.
process.stdout.write('Nueva contraseña (mínimo 12 caracteres): ');
if (!process.stdin.isTTY) { console.error('\nEjecutar desde una terminal interactiva.'); process.exit(1); }
readline.emitKeypressEvents(process.stdin); process.stdin.setRawMode(true);
let password='';
process.stdin.on('keypress',(str,key)=>{
 if(key?.ctrl&&key.name==='c')process.exit(1);
 if(key?.name==='return'){
  process.stdin.setRawMode(false);process.stdin.pause();
  if(password.length<12){console.error('\nUsá al menos 12 caracteres.');process.exit(1);}
  const salt=randomBytes(16).toString('hex');
  console.log('\nADMIN_PASSWORD_HASH='+salt+':'+scryptSync(password,salt,64).toString('hex'));process.exit(0);
 }
 if(key?.name==='backspace')password=password.slice(0,-1);
 else if(str&&!key?.ctrl&&!key?.meta)password+=str;
});
