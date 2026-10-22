import fs from 'node:fs';
import {createApplication} from './app.js';
if(fs.existsSync('.env'))process.loadEnvFile('.env');
const app=await createApplication(process.env);
app.server.listen(Number(process.env.PORT||3001),'0.0.0.0',()=>console.log('API DINTEGI iniciada. Envíos '+(process.env.MAIL_ENABLED==='true'?'habilitados':'desactivados')+'.'));
let ending=false;
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,async()=>{if(ending)return;ending=true;await app.close();process.exit(0);});
