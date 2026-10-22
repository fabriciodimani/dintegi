export function parseContactsCSV(input){
 const source=input.replace(/^\uFEFF/,'');
 const first=source.split(/\r?\n/)[0]||'';
 const delimiter=first.includes(';')?';':first.includes('\t')?'\t':',';
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<source.length;i++){
  const c=source[i];
  if(c==='"'){if(quoted&&source[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
  else if(c===delimiter&&!quoted){row.push(field);field='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&source[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field='';}
  else field+=c;
 }
 if(quoted)throw new Error('El CSV contiene comillas sin cerrar.');
 row.push(field);if(row.some(x=>x.trim()))rows.push(row);
 if(!rows.length)throw new Error('El archivo está vacío.');
 const normalize=s=>s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const header=rows[0].map(normalize);
 let emailIndex=header.findIndex(s=>['email','correo','correo electronico','e-mail'].includes(s));
 const nameIndex=header.findIndex(s=>['nombre','name','concurrente'].includes(s));
 const hasHeader=emailIndex>=0;if(!hasHeader)emailIndex=0;
 const contacts=rows.slice(hasHeader?1:0).map(r=>({email:(r[emailIndex]||'').trim(),name:nameIndex>=0?(r[nameIndex]||'').trim():'',source:'EXPOCON'}));
 if(contacts.length>10000)throw new Error('El máximo es 10.000 filas por importación.');
 return contacts;
}
export function csvText(headers,rows){const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';return '\uFEFF'+[headers,...rows].map(r=>r.map(cell).join(',')).join('\r\n');}
