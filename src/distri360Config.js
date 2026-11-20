// Después de verificar DNS y HTTPS, se puede establecer en Vercel:
// VITE_DISTRI360_URL=https://distri360.dintegi.com.ar/login
// Mientras tanto el acceso conserva el enlace operativo actual.
const currentLogin = 'https://backdistri360.us-3.evennode.com/login'
function loginUrl(value) {
  try {
    const url = new URL(String(value || currentLogin).trim())
    if (url.protocol !== 'https:' || url.username || url.password) return currentLogin
    return url.href
  } catch { return currentLogin }
}
export const DISTRI360_LOGIN_URL = loginUrl(import.meta.env.VITE_DISTRI360_URL)
export const DISTRI360_PAGE = '/distri360'
export const DISTRI360_CONTACT = 'https://wa.me/5493815176145?text=' + encodeURIComponent('Hola Fabricio, quiero conocer DISTRI360 y solicitar un acceso de prueba para mi empresa.')
