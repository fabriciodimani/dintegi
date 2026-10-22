import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
const Admin = React.lazy(() => import('./admin/Admin.jsx'))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/^\/admin(?:\/|$)/.test(window.location.pathname)
      ? <React.Suspense fallback={<p style={{padding:32}}>Cargando administrador…</p>}><Admin /></React.Suspense>
      : <App />}
  </React.StrictMode>,
)
