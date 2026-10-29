# DINTEGI · Administrador de contactos y campañas

El proyecto incorpora un panel en `/admin`, una API Node en `server/`, importación CSV, edición de campañas, vista previa, prueba a tu buzón, tandas manuales de hasta 50 destinatarios e historial exportable. Cada dirección recibe su propio correo, sin exponer la lista. Incluye un enlace de baja individual que excluye el contacto de todas las campañas.

**El envío real viene apagado.** No se configuraron credenciales ni se enviaron mensajes reales durante el desarrollo. El proveedor de campañas queda por elegir y autenticar. Zoho conserva tu buzón `fabricio@dintegi.com.ar` para recibir las respuestas; no uses su SMTP de correo personal para estas campañas.

## 1. Probar en tu computadora

Necesitás Node 22.17.1 o posterior y dos terminales. Los comandos `cp` funcionan en Git Bash/macOS/Linux; en Windows también podés copiar y renombrar los archivos con el Explorador.

### Terminal 1: preparar la API

Desde la carpeta del proyecto:

```bash
cd server
npm ci
cp .env.example .env
npm run password
```

Elegí una contraseña nueva para este administrador (mínimo 12 caracteres; no la de tu correo). El asistente no muestra lo que escribís y devuelve una línea `ADMIN_PASSWORD_HASH=...`. Copiala en `server/.env`.

Generá también el secreto de los enlaces de baja:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiá ese resultado en `UNSUBSCRIBE_SECRET` dentro de `server/.env`. Conservá ese secreto: cambiarlo invalida los enlaces enviados anteriormente.

Mantené `MAIL_ENABLED=false` y el resto de los valores de ejemplo. Iniciá la API desde `server`:

```bash
npm start
```

### Terminal 2: iniciar la web

Desde la raíz del proyecto (la carpeta que contiene `src`):

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abrí <http://localhost:5173/admin>. Entrá con `fabricio@dintegi.com.ar` y la contraseña que creaste. La contraseña del panel no inicia sesión en Zoho.

Podés importar y preparar campañas aunque los envíos estén desactivados. Si modificás `.env.local`, reiniciá Vite.

## 2. Importar la lista

En Contactos → Importar CSV, elegí `server/importar/DINTEGI_EXPOCON_emails.csv`. Contiene los **3.989 correos únicos depurados** de la lista anterior. Sólo incluye la columna Email; no se inventaron empresas o nombres.

El archivo no se importa automáticamente. La API vuelve a normalizar y validar, omite repetidos y conserva las bajas. La validación del formato no verifica que cada buzón exista. Importar dos veces no duplica los contactos.

`server/importar/` está excluido de Git. Guardá el CSV en privado, fuera de `public/`. Tampoco publiques la base de contactos ni la incluyas en los archivos estáticos de Vercel.

## 3. Preparar una campaña

1. Entrá en Campañas. La plantilla incluye presentación, firma y enlace a DINTEGI con parámetros de campaña. Revisá texto, asunto y enlace.
2. Guardá la campaña.
3. Cuando el SMTP esté configurado, enviá una prueba a `TEST_EMAIL`. Revisá tu buzón, Spam y el enlace antes de continuar.
4. En Contactos elegí esa campaña y seleccioná destinatarios. Podés buscar, filtrar o usar “Seleccionar hasta 50”.
5. Enviar selección muestra la cantidad y direcciones; Confirmar envío inicia la tanda.
6. Mirá el resultado en Historial. El sistema permite una sola tanda en curso.

El límite es **50 intentos en una hora móvil**, incluidas pruebas y reservas de tandas. Una prueba deja 49 disponibles durante esa hora. El límite no se reinicia al cambiar de campaña ni recargando la página; los registros se guardan en disco. También se aplican los límites del proveedor. El sistema no programa tandas automáticamente: vos iniciás cada una desde el panel.

Un contacto aceptado por SMTP no puede reenviarse en la misma campaña. El contenido de una campaña queda fijo al iniciar envíos; creá otra para cambiarlo. Si editás una campaña antes de enviar, necesitás una nueva prueba de esa versión.

## 4. Conectar un servicio de campañas

Elegí un servicio SMTP que admita el tipo de campaña y procedencia de tu lista. Comprobá sus condiciones y límites antes de activarlo. Configurá en el backend:

| Variable | Contenido |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT` | Host y puerto proporcionados por el servicio |
| `SMTP_SECURE` | `true` para TLS directo, habitualmente puerto 465; `false` para STARTTLS, habitualmente 587 |
| `SMTP_USER`, `SMTP_PASS` | Credenciales SMTP del servicio |
| `MAIL_FROM` | `fabricio@dintegi.com.ar`, remitente autenticado en el servicio |
| `MAIL_FROM_NAME` | `Fabricio Dimani \| DINTEGI` |
| `MAIL_REPLY_TO` | `fabricio@dintegi.com.ar`, tu buzón de Zoho |
| `TEST_EMAIL` | Tu dirección fija para las pruebas |
| `PUBLIC_API_URL` | URL pública HTTPS de la API; permite que el enlace de baja funcione |
| `MAIL_ENABLED` | `true` sólo después de completar la configuración |

Autenticá el dominio según los registros que indique ese servicio (DKIM, SPF y, si corresponde, dominio de retorno). Conservá los MX de Zoho. Si hay que ampliar SPF, integrá las autorizaciones en el registro existente; no crees un segundo registro SPF. Las claves SMTP sólo van en el backend: ninguna contraseña debe llevar prefijo `VITE_`.

## 5. Publicar

### Web en Vercel

Integrá los archivos del ZIP en tu repositorio actual. Conservá las configuraciones de tu proyecto. El build sigue siendo `npm run build` y la salida `dist`. `vercel.json` permite abrir `/admin` directamente.

Antes de subir, revisá:

```bash
git status --short
```

No debe incluir `.env`, `.env.local`, `server/data/`, `server/importar/` ni `node_modules/`. La lista CSV incluida en el ZIP está excluida de Git. Agregá sólo los archivos de código y ejemplos de configuración que revisaste, hacé commit y push como en la landing.

En las variables de entorno de Vercel agregá `VITE_ADMIN_API_URL` con la URL HTTPS de la API, por ejemplo `https://api.tu-dominio.com`, sin `/api` al final. Volvé a desplegar para que Vite incorpore el valor. La landing seguirá en `/` y el panel estará en `https://www.dintegi.com.ar/admin`.

### API en un servidor Node con disco persistente

La API de esta versión es un proceso Node permanente con una base JSON privada. Requiere **una sola instancia**, Node 22.17.1 o superior, HTTPS y almacenamiento persistente. No está preparada para ejecutarse como función efímera de Vercel ni con varias réplicas.

En el servicio del backend, usá `server/` como directorio del proyecto, `npm ci` como instalación y `npm start` como comando de arranque. Cargá las variables de `server/.env.example` en su configuración privada. En producción:

- `NODE_ENV=production`.
- `PUBLIC_API_URL=https://...` con la dirección real de esa API.
- `FRONTEND_ORIGINS=https://www.dintegi.com.ar,https://dintegi.com.ar` (sin barra final).
- `DATA_DIR` debe apuntar a un directorio privado en un volumen persistente. Confirmá que no se borre en reinicios o despliegues.
- El servicio debe pasar `PORT`; la API escucha en `0.0.0.0`.
- Conservá `ADMIN_PASSWORD_HASH` y `UNSUBSCRIBE_SECRET` en privado.

No se desplegó ni contrató un backend en este trabajo. Hasta publicarlo, el panel de producción no podrá iniciar sesión contra tu API local.

## 6. Operación y respaldos

La base se guarda en `DATA_DIR/campaigns.json`. Respaldala con frecuencia fuera del servidor; para una copia consistente, detené la API, copiá el directorio y luego reiniciala. La exportación CSV del historial no reemplaza el backup completo. Conservá por separado `UNSUBSCRIBE_SECRET` y la configuración privada. Para restaurar, detené el proceso antes de reemplazar la base. Nunca borres el archivo de bloqueo mientras otra instancia esté activa.

- “Aceptado por SMTP” confirma aceptación del servidor, **no** entrega o lectura del destinatario. Revisá rebotes y quejas en el proveedor y dales de baja en Contactos. Esta versión no sincroniza webhooks de rebotes/quejas ni mide aperturas.
- “Por revisar” indica resultado incierto. Queda bloqueado para evitar duplicar un mensaje que pudo salir. Confirmalo en el proveedor; no cambies la base manualmente para forzar otro envío.
- Si el servidor se interrumpe, los que estaban enviándose pasan a “Por revisar”; los que aún estaban en cola se cancelan y pueden seleccionarse después. No se reanuda una tanda automáticamente.
- Los enlaces de baja muestran confirmación al abrirse y ejecutan la baja con POST. Incluyen las cabeceras de baja de un clic. La API debe seguir accesible para procesarlos.
- La sesión vence a las ocho horas o al reiniciar la API. No hay contraseña por defecto ni recuperación por email: el responsable del servidor puede generar un hash nuevo.
- El almacenamiento está pensado para esta base y uso por un administrador. Antes de sumar usuarios, réplicas o grandes volúmenes, migrá la base y la cola a servicios adecuados.

## 7. Validación técnica

```bash
npm run build
npm test --prefix server
```

Las pruebas usan transporte simulado y directorios temporales; no envían correo real. Cubren autenticación, origen permitido, importación, bajas persistentes, prueba obligatoria, cambios durante la prueba, doble envío, cupo, resultados inciertos, reinicio, exclusión mutua de almacenamiento y escape de contenido.
