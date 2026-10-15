import React, { useState } from 'react'
import dintegiLogo from './assets/dintegi-logo.png'

import {
  Truck,
  Handshake,
  BarChart3,
  FileText,
  FileX,
  ShieldCheck,
  PieChart,
  Cloud,
  Search,
  ClipboardList,
  Code2,
  Rocket,
} from 'lucide-react'

const phone = '5493815176145'
const whatsappText = encodeURIComponent('Hola Fabricio, quiero consultar por un sistema administrativo para mi empresa.')
const whatsappUrl = `https://wa.me/${phone}?text=${whatsappText}`
const demoUrl = '/demo/index.html'

const navItems = [
  ['Inicio', '#inicio'],
  ['Servicios', '#servicios'],
  ['Soluciones', '#soluciones'],
  ['Casos', '#casos'],
  ['Metodología', '#metodologia'],
  ['Contacto', '#contacto'],
]

function Header() {
  return (
    <header className="siteHeader">
      <a className="brand" href="#inicio" aria-label="DINTEGI inicio">
        <img
          src={dintegiLogo}
          alt="DINTEGI Soluciones Digitales"
          className="headerLogoDintegi"
        />
      </a>

      <nav className="navLinks" aria-label="Navegación principal">
        {navItems.map(([label, href], index) => (
          <a key={label} className={index === 0 ? 'active' : ''} href={href}>
            {label}
          </a>
        ))}
      </nav>

      <a className="headerCta" href={demoUrl} target="_blank" rel="noreferrer">
        Ver demo <span>→</span>
      </a>
    </header>
  )
}

function DashboardMockup() {
  const bars = [38, 55, 50, 72, 84, 96]
  const movements = [
    ['Factura #000125', 'Transporte Norte SRL', '$ 1.250.000', 'Pagado'],
    ['Factura #000124', 'Logística del Sur SA', '$ 2.680.000', 'Pagado'],
    ['Expediente #000122', 'Retiro Express', 'Actualizado', 'En curso'],
  ]

  return (
    <div className="deviceWrap" aria-label="Vista previa del sistema DINTEGI">
      <div className="deviceGlow" />
      <div className="dashboardMockup">
        <aside className="mockSidebar">
          <div className="mockBrand">DINTEGI</div>
          {['Inicio', 'Dashboard', 'Ventas', 'Clientes', 'Cobros', 'Reportes', 'Configuración'].map((item, idx) => (
            <div className={`mockMenuItem ${idx === 1 ? 'active' : ''}`} key={item}>
              <span className="mockMenuIcon" />
              {item}
            </div>
          ))}
        </aside>

        <main className="mockContent">
          <div className="mockTopbar">
            <strong>Resumen general</strong>
            <div className="mockUserTools">
              <span>Este mes</span>
              <span>Exportar</span>
            </div>
          </div>

          <section className="mockKpis">
            <article><small>Ventas del mes</small><strong>$ 24,6M</strong><em>+18.5%</em></article>
            <article><small>Cobros del mes</small><strong>$ 21,4M</strong><em>+16.3%</em></article>
            <article><small>Clientes activos</small><strong>1.248</strong><em>+12.7%</em></article>
            <article><small>Trámites activos</small><strong>86</strong><em className="negative">-5.4%</em></article>
          </section>

          <section className="mockGrid">
            <article className="mockPanel salesPanel">
              <div className="panelTitle">Ventas por mes</div>
              <div className="bars">
                {bars.map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="barLabels"><span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span></div>
            </article>

            <article className="mockPanel donutPanel">
              <div className="panelTitle">Cobros por estado</div>
              <div className="donutWrap">
                <div className="donut" />
                <ul>
                  <li><span className="dot paid" />Pagado <b>72%</b></li>
                  <li><span className="dot pending" />Pendiente <b>21%</b></li>
                  <li><span className="dot due" />Vencido <b>7%</b></li>
                </ul>
              </div>
            </article>

            <article className="mockPanel tablePanel">
              <div className="panelTitle">Últimos movimientos</div>
              {movements.map((row) => (
                <div className="mockRow" key={row.join('-')}>
                  <span>{row[0]}</span><span>{row[1]}</span><strong>{row[2]}</strong><em>{row[3]}</em>
                </div>
              ))}
            </article>

            <article className="mockPanel alertPanel">
              <div className="panelTitle">Alertas</div>
              <p><b>3</b> facturas vencidas</p>
              <p><b>5</b> trámites próximos a vencer</p>
              <p><b>1</b> reporte pendiente</p>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="heroBackgroundImage" />
      <div className="heroText">
        <p className="eyebrow"><span />Software a medida para PyMEs</p>
        <h1>Tu problema de gestión,<br /><mark>una solución</mark> a medida</h1>
        <p className="lead">
          Soy Fabricio Dimani, ingeniero en Sistemas. Desarrollo y mejoro sistemas para ventas, cobranzas, logística y reportes. Contame qué te está complicando el trabajo y definamos una primera entrega.
        </p>

        <div className="heroActions">
          <a href="#consulta" className="btn primary">Contame tu problema <span>→</span></a>
          <a href="#casos" className="btn secondary">Conocé mi trabajo</a>
        </div>

        <div className="trustRow">
          <span>● A medida de tu negocio</span>
          <span>● Entregas por etapas</span>
          <span>● Atención directa conmigo</span>
        </div>
      </div>

      <div className="heroVisual">
        <DashboardMockup /><p className="demoNotice">Vista ilustrativa con datos ficticios. No representa resultados de clientes.</p>
      </div>
    </section>
  )
}

const services = [
  {
    icon: Truck,
    title: 'Transporte y logística',
    text: 'Viajes, unidades, gastos, rendiciones y seguimiento de operaciones.',
    accent: 'blue',
  },
  {
    icon: Handshake,
    title: 'Ventas y gestión comercial',
    text: 'Clientes, presupuestos, pedidos, cobranzas y objetivos de venta.',
    accent: 'orange',
  },
  {
    icon: BarChart3,
    title: 'Cuentas corrientes y reportes',
    text: 'Saldos, pagos, vencimientos, reportes y tableros ejecutivos.',
    accent: 'cyan',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y auditoría',
    text: 'Permisos, historial de cambios, trazabilidad y control interno.',
    accent: 'violet',
  },
]

function Services() {
  return (
    <section id="servicios" className="section serviceStrip" aria-label="Servicios principales">
      {services.map((service) => (
        <article className={`serviceCard ${service.accent}`} key={service.title}>
          <div className="serviceIcon"><service.icon size={34} strokeWidth={2.2} /></div>
          <div>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

const benefits = [
  { icon: FileX, title: 'Planillas que ya no alcanzan', text: 'Unificamos registros y definimos un flujo que tu equipo pueda seguir.' },
  { icon: ShieldCheck, title: 'Saldos que no coinciden con tu realidad', text: 'Revisamos cobros, pagos y movimientos para localizar inconsistencias.' },
  { icon: PieChart, title: 'Reportes que faltan y no reflejan tu necesidad', text: 'Convertimos los datos disponibles en consultas, totales y exportaciones útiles.' },
  { icon: Cloud, title: 'Un sistema que quedó a medias', text: 'Evaluamos el código y el proceso antes de definir cómo darle continuidad.' },
]

function Benefits() {
  return (
    <section id="soluciones" className="section benefitsSection">
      <h2>Qué resolvemos</h2>
      <div className="benefitGrid">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article className="benefitItem" key={title}>
            <span className="benefitIcon"><Icon size={30} strokeWidth={2.1} /></span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}

const cases = [
  { name: 'Ámbito Inmobiliaria', type: 'Web y catálogo de propiedades', text: 'Desarrollo de sitio inmobiliario responsive, catálogo, ficha de propiedad, filtros pro zonz, por tipo, y consulta por WhatsApp.', className: 'caseRealEstate', visual: '🏠' },
  {
    name: 'Danlu',
    type: 'Transporte y logística',
    text: 'Sistema integral para gestión de transporte. Viajes, choferes, unidades, adelantos, gastos, rendiciones y reportes.',
    className: 'caseTruck',
    visual: '🚚',
  },
  {
    name: 'San Pancracio',
    type: 'Remitos y cuentas corrientes',
    text: 'Plataforma administrativa para operaciones comerciales y agroindustriales. Remitos, pagos, cobros y cuentas corrientes.',
    className: 'casePort',
    visual: '🌾',
  },
  {
    name: 'Riders',
    type: 'Ventas, logística y auditoría',
    text: 'Gestión de ventas, pagos, financieras, pedidos, logística internacional, permisos y auditoría de cambios del sistema.',
    className: 'caseRiders',
    visual: '🏍️',
  },
  {
    name: 'Q2 Digital',
    type: 'Acreditaciones para eventos',
    text: 'Registro previo, invitaciones, QR, check-in, envio QR or correo electrónico, reimpresión de credenciales, presentes/ausentes y reportes finales.',
    className: 'caseEvents',
    visual: '🎟️',
  },
  {
    name: 'Adeline',
    type: 'Catálogo online y carrito',
    text: 'Tienda web para indumentaria. Catálogo visual, variantes, carrito de compras, pedidos y flujo comercial online.',
    className: 'caseEcommerce',
    visual: '🛒',
  },
  {
    name: 'Retiro 360',
    type: 'Trámites y expedientes',
    text: 'Seguimiento de trámites, trazabilidad, alertas y reportes automáticos para ART, jubilaciones y expedientes.',
    className: 'caseDocs',
    visual: '📄',
  },
  {
    name: 'BAPO',
    type: 'Obras públicas',
    text: 'Sistema de gestión de obras públicas: seguimiento de obras, licitaciones, distribución, certificaciones, redetrminación de precios y tableros de consulta.',
    className: 'caseBapo',
    visual: '🏗️',
  },
  {
    name: 'Retiro 360',
    type: 'Preventa, distribución y entrega',
    text: 'Sistema de gestión y trazabilidad de pedidos: preventa, preparación, asignación de camiones, entregas, regreso al depósito y cuentas corrientes.',
    className: 'caseDistribucion',
    visual: '🚚',
  },
]

function Cases() {
  return (
    <section id="casos" className="section casesSection">
      <h2>Trabajo real, procesos concretos</h2>
      <p className="sectionIntro">Desarrollos que muestran las áreas en las que puedo ayudarte. Sin datos privados ni resultados inventados.</p>
      <div className="caseGrid">
        {cases.map((item) => (
          <article className="caseCard" key={item.name}>
            <div className={`caseImage ${item.className}`}>
              <div className="caseVisualIcon" aria-hidden="true">{item.visual}</div>
              <span>{item.type}</span>
            </div>
            <div className="caseOverlay">
              <h3>{item.name}</h3><p>{item.text}</p>
              <details className="caseDetails">
                <summary>Ver qué desarrollé</summary>
                <p>{item.text}</p>
                <p>Mi trabajo: analizar el proceso, implementar las funciones y acompañar los ajustes. Las capturas y demostraciones de clientes se comparten únicamente con autorización.</p>
                <a href="#consulta">Tengo una necesidad similar →</a>
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const steps = [
  { number: '1', icon: Search, title: 'Diagnosticamos', text: 'Escuchamos el proceso real y definimos objetivos.' },
  { number: '2', icon: ClipboardList, title: 'Proponemos', text: 'Alcance, tiempos y presupuesto sin vueltas.' },
  { number: '3', icon: Code2, title: 'Desarrollamos', text: 'Sistema a medida con entregas parciales.' },
  { number: '4', icon: Rocket, title: 'Implementamos', text: 'Capacitación, puesta en marcha y acompañamiento.' },
]

function Process() {
  return (
    <section id="metodologia" className="section processSection">
      <h2>Cómo trabajamos</h2>
      <div className="processLine">
        {steps.map(({ number, icon: Icon, title, text }) => (
          <article className="processStep" key={number}>
            <span className="stepNumber">{number}</span>
            <div className="stepIcon"><Icon size={28} strokeWidth={2.1} /></div>
            <div className="stepContent"><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Founder() {
  return (
    <section className="section founderSection">
      <div className="personalFounder">
        <div><p className="eyebrow">EXPERIENCIA  DETRÁS DE DINTEGI</p>
          <h2>Ing. Fabricio Dimani</h2>
          <p className="founderSubtitle">Ingeniero en Sistemas de Información · UTN<br />Formación Full Stack · RollingCode School</p>
        </div>
        <div><h3>Más de 20 años de experiencia</h3>
          <p>Me involucro en el problema de tu empresa: cómo venden, cobran, pagan y organizan el trabajo. A partir de ese proceso, desarrollo una solución y la mejoro con vos.</p>
          <p>Trabajo con React, Node.js, Express y MongoDB. Desde Tucumán, con atención remota en español y entregas acordadas por etapas.</p>
          <a href="https://www.linkedin.com/in/fabriciodimani/" target="_blank" rel="noreferrer">Ver mi perfil profesional →</a>
        </div>
      </div>
    </section>
  )
}

function Consultation() {
  const [form, setForm] = useState({ name: '', company: '', problem: '', current: 'Planillas / registros manuales', urgency: 'Este mes', type: 'Mejorar un sistema existente' })
  const [ready, setReady] = useState(false)
  const change = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setReady(false) }
  const source = new URLSearchParams(window.location.search).get('utm_source')?.slice(0, 80) || 'web DINTEGI'
  const message = `Hola Fabricio. Soy ${form.name}, de ${form.company}.
Necesito: ${form.type}.
Problema: ${form.problem}
Actualmente usamos: ${form.current}.
Horizonte: ${form.urgency}.
Llegué desde: ${source}.
Quisiera conversar sobre una primera etapa con alcance y presupuesto definidos.`
  return <section id="consulta" className="section consultationSection">
    <div><p className="eyebrow">EMPECEMOS POR TU NECESIDAD</p><h2>Contame qué necesitás resolver</h2>
      <p>No necesitás saber de tecnología. Describí lo que pasa y lo que debería pasar.</p>
      <div className="offerBox"><h3>Una primera etapa con alcance definido</h3><p>Contame tu problema en una primera consulta sin costo. Si hace falta revisar un sistema o analizar un proceso en profundidad, te propongo un diagnóstico con alcance, precio y plazo acordados antes de comenzar.</p><p>También podemos definir un sistema nuevo o una mejora concreta por etapas.</p></div>
    </div>
    <form onSubmit={(e) => { e.preventDefault(); setReady(true) }}>
      <label>Tu nombre<input name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={change} /></label>
      <label>Empresa o actividad<input name="company" autoComplete="organization" required maxLength={140} value={form.company} onChange={change} /></label>
      <label>¿Qué necesitás?<select name="type" value={form.type} onChange={change}><option>Mejorar un sistema existente</option><option>Desarrollar un sistema nuevo</option><option>Resolver un proceso con planillas</option><option>Crear o mejorar una web comercial</option></select></label>
      <label>¿Qué problema tenés?<textarea name="problem" required minLength={15} maxLength={1500} rows={4} placeholder="Ejemplo: cargamos los cobros en dos lugares y los saldos no coinciden." value={form.problem} onChange={change} /></label>
      <div className="formPair"><label>¿Qué usan hoy?<select name="current" value={form.current} onChange={change}><option>Planillas / registros manuales</option><option>Un sistema existente</option><option>Un prototipo incompleto</option><option>Todavía no tenemos sistema</option></select></label>
      <label>¿Para cuándo?<select name="urgency" value={form.urgency} onChange={change}><option>Este mes</option><option>En 1 a 3 meses</option><option>Estoy evaluando opciones</option></select></label></div>
      <p className="formPrivacy">Estos datos no se guardan en la web. No incluyas contraseñas ni información de tus clientes. Primero revisás el mensaje y luego decidís enviarlo por WhatsApp.</p>
      <button className="btn primary" type="submit">Preparar mensaje para WhatsApp →</button>
      {ready && <div className="messagePreview" role="status"><h3>Tu consulta está lista para revisar</h3><p className="messageText">{message}</p><a className="btn primary" href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Abrir WhatsApp con este mensaje</a><p>La consulta se envía cuando confirmás el envío en WhatsApp. Todavía no hay un presupuesto ni una contratación.</p></div>}
    </form>
  </section>
}

function CTA() {
  return (
    <section className="ctaBand">
      <div className="ctaIcon"><BarChart3 size={34} strokeWidth={2.1} /></div>
      <div>
        <h2>¿Qué te está complicando el trabajo?</h2>
        <p>Conversemos sobre el problema y una primera entrega concreta.</p>
      </div>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn light">Escribinos por WhatsApp</a>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footerGrid">
        <div className="footerBrand">
          <div className="footerLogoTextPro">
            <strong>DINTEGI</strong>
            <span>Soluciones Digitales</span>
          </div>
          <p>Sistemas empresariales y webs comerciales a medida. Atención directa con Fabricio Dimani, desde Tucumán.</p>
        </div>

        <div>
          <h3>Navegación</h3>
          {navItems.map(([label, href]) => (<a key={label} href={href}>{label}</a>))}
        </div>

        <div>
          <h3>Soluciones</h3>
          <a href="#servicios">Transporte y logística</a>
          <a href="#servicios">Ventas y gestión comercial</a>
          <a href="#servicios">Cuentas corrientes y reportes</a>
          <a href="#servicios">Trámites y expedientes</a>
        </div>

        <div>
          <h3>Contacto</h3>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp: +54 381 5176145</a>
          <a href="mailto:contacto@dintegi.com.ar">fabricio@dintegi.com.ar</a>
          <span>Tucumán, Argentina</span>
          <a className="footerButton" href={demoUrl} target="_blank" rel="noreferrer">Ver demo</a>
        </div>
      </div>

      <div className="footerBottom">© 2026 DINTEGI Soluciones Digitales. Todos los derechos reservados.</div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Services />
        <Benefits />
        <Cases />
        <Process />
        <Founder />
        <Consultation />
        <CTA />
      </main>
      <Footer />
      <Header />
    </>
  )
}
