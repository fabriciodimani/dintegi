import {createHmac} from 'node:crypto';
// Sólo se usa desde Node; nunca exponer esta clave al frontend.
export function createSuppressionClient(env) {
  if (!env.UNSUBSCRIBE_SERVICE_URL) {
    if (env.SUPPRESSIONS_API_KEY) throw new Error('Falta UNSUBSCRIBE_SERVICE_URL.');
    return null;
  }
  const base = new URL(env.UNSUBSCRIBE_SERVICE_URL.replace(/\/+$/, '') + '/');
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) throw new Error('UNSUBSCRIBE_SERVICE_URL debe ser una dirección HTTPS pública, sin credenciales.');
  if ((env.SUPPRESSIONS_API_KEY || '').length < 32) throw new Error('SUPPRESSIONS_API_KEY debe tener al menos 32 caracteres.');
  async function request(route, data) {
    try {
      const response = await fetch(new URL(route, base), {
        method: data ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: { Authorization: 'Bearer ' + env.SUPPRESSIONS_API_KEY, ...(data ? { 'Content-Type': 'application/json' } : {}) },
        body: data ? JSON.stringify(data) : undefined
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    } catch {
      throw Object.assign(new Error('No se pudieron verificar las bajas públicas. No se enviaron los correos pendientes. Revisá el servicio de DINTEGI en ADELINE y las claves de conexión.'), { status: 503 });
    }
  }
  return {
    unsubscribeUrl(token) { const url = new URL('unsubscribe', base); url.searchParams.set('token', token); return url.href; },
    async list() {
      const result = await request('suppressions');
      if (!Array.isArray(result.emails) || result.emails.some(e => typeof e !== 'string' || e.length > 254 || !e.includes('@'))) throw Object.assign(new Error('Respuesta de bajas inválida. Envío detenido.'), { status: 503 });
      return result.emails;
    },
    async check(email) {
      const token=Buffer.from(email).toString('base64url')+'.'+createHmac('sha256',env.UNSUBSCRIBE_SECRET).update(email).digest('hex');
      const result = await request('check', { email, token });
      if (typeof result.suppressed !== 'boolean') throw Object.assign(new Error('Respuesta de bajas inválida. Envío detenido.'), { status: 503 });
      return result.suppressed;
    },
    async suppress(email) { const result = await request('suppressions', { email }); if (result.ok !== true) throw Object.assign(new Error('No se confirmó la baja pública.'), { status: 503 }); }
  };
}
