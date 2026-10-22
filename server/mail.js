import nodemailer from 'nodemailer';
export const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mailConfigured(env){return env.MAIL_ENABLED==='true'&&!!(env.SMTP_HOST&&env.SMTP_USER&&env.SMTP_PASS&&env.MAIL_FROM);}
export function makeTransport(env){
 if(!mailConfigured(env))return null;
 return nodemailer.createTransport({host:env.SMTP_HOST,port:Number(env.SMTP_PORT||587),secure:env.SMTP_SECURE==='true',requireTLS:env.SMTP_SECURE!=='true',auth:{user:env.SMTP_USER,pass:env.SMTP_PASS},connectionTimeout:20000,greetingTimeout:15000,socketTimeout:30000,disableFileAccess:true,disableUrlAccess:true});
}
export function buildMail(env,campaign,email,unsubscribe,test=false){
 const url=new URL(campaign.link);if(!['https:','http:'].includes(url.protocol))throw new Error('Enlace inválido');
 const paragraphs=String(campaign.body).replace(/\r\n?/g,'\n').split(/\n\s*\n/).map(p=>`<p style="font-size:16px;line-height:1.7;margin:0 0 18px">${escapeHtml(p).replace(/\n/g,'<br>')}</p>`).join('');
 const text=`${campaign.body}\n\nConocé mi trabajo: ${campaign.link}\n\nIng. Fabricio Dimani\nDINTEGI · Soluciones Digitales\n${env.MAIL_REPLY_TO||env.MAIL_FROM}\nWhatsApp: +54 9 381 5176145\n\nPara dejar de recibir estas comunicaciones: ${unsubscribe}`;
 const html=`<!doctype html><html lang="es"><body style="margin:0;background:#f3f6fa;font-family:Arial,sans-serif;color:#19324b"><div style="max-width:600px;margin:28px auto;background:white;padding:32px;border-top:5px solid #087bdb"><p style="font-size:22px;font-weight:bold;color:#075cb2">DINTEGI</p>${paragraphs}<p style="margin:30px 0"><a href="${escapeHtml(campaign.link)}" style="background:#087bdb;color:white;padding:14px 22px;text-decoration:none;border-radius:6px;display:inline-block">Conocé mi trabajo</a></p><p style="line-height:1.6">Ing. Fabricio Dimani<br>DINTEGI · Soluciones Digitales<br>${escapeHtml(env.MAIL_REPLY_TO||env.MAIL_FROM)}<br>WhatsApp: +54 9 381 5176145</p><p style="font-size:12px;color:#64748b;margin-top:28px"><a href="${escapeHtml(unsubscribe)}" style="color:#64748b">Dejar de recibir estas comunicaciones</a></p></div></body></html>`;
 return {from:{name:env.MAIL_FROM_NAME||'Fabricio Dimani | DINTEGI',address:env.MAIL_FROM},replyTo:env.MAIL_REPLY_TO||env.MAIL_FROM,to:email,subject:(test?'[PRUEBA] ':'')+campaign.subject,text,html,headers:{'List-Unsubscribe':`<${unsubscribe}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'},disableFileAccess:true,disableUrlAccess:true};
}
