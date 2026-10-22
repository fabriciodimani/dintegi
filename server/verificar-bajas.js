import fs from 'node:fs';
import {createSuppressionClient} from './suppressions.js';
if(fs.existsSync('.env'))process.loadEnvFile('.env');
try{
 const client=createSuppressionClient(process.env);
 if(!client)throw new Error('Faltan UNSUBSCRIBE_SERVICE_URL y SUPPRESSIONS_API_KEY en server/.env.');
 const email=String(process.env.TEST_EMAIL||process.env.ADMIN_EMAIL||'').trim().toLowerCase();
 if(!email)throw new Error('Falta TEST_EMAIL.');
 const emails=await client.list();
 const suppressed=await client.check(email);
 console.log('Conexión con las bajas públicas: OK');
 console.log('Firma compartida del enlace: OK');
 console.log('Bajas registradas: '+emails.length);
 console.log('Destino de prueba dado de baja: '+(suppressed?'SÍ (usá otra cuenta para probar)':'NO'));
 console.log('No se enviaron correos ni se dio de baja ninguna dirección.');
}catch(error){console.error(error.message);process.exitCode=1;}
