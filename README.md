# DINTEGI Landing v2

Landing institucional premium para **DINTEGI Soluciones Digitales**.

## Probar localmente

```bash
npm install
npm run dev
```

Abrir:

```txt
http://localhost:5173
```

## Generar producción

```bash
npm run build
```

La carpeta final para publicar queda en:

```txt
dist/
```

## Publicación en Vercel

Conectar el repositorio a Vercel. Usar `npm run build` y directorio de salida `dist`.
Los dominios de la web son `dintegi.com.ar` y `www.dintegi.com.ar`.
Para el administrador, configurar `VITE_ADMIN_API_URL` y publicar la API por separado según `LEEME_ADMIN.md`.

## Contacto configurado

- WhatsApp: +54 381 5176145
- Email: fabricio@dintegi.com.ar
- Ubicación: Tucumán, Argentina

## Administrador de campañas

El panel está en `/admin`. Antes de usarlo, seguí [LEEME_ADMIN.md](LEEME_ADMIN.md): requiere iniciar la API de `server/` y configurar una contraseña. El envío real viene desactivado.
