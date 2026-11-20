// Acceso público de la demo. Se puede sobrescribir en Vercel:
// VITE_DISTRI360_URL=https://distri360.dintegi.com.ar/login
const currentLogin = 'https://distri360.dintegi.com.ar/login'
function loginUrl(value) {
  try {
    const url = new URL(String(value || currentLogin).trim())
    if (url.protocol !== 'https:' || url.username || url.password) return currentLogin
    return url.href
  } catch { return currentLogin }
}
export const DISTRI360_LOGIN_URL = loginUrl(import.meta.env.VITE_DISTRI360_URL)
export const DISTRI360_PAGE = '/distri360'
export const DISTRI360_CONTACT = 'https://wa.me/5493815176145?text=' + encodeURIComponent('Hola Fabricio, vi DISTRI360 en la web de DINTEGI y quiero coordinar una demostración para mi empresa.\n\nEmpresa o negocio:\nRubro:\nDías y horarios disponibles:\n\nOrigen de la consulta: DISTRI360 · Web DINTEGI')
