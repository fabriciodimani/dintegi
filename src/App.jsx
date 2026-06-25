import React from 'react'
import dintegiLogo from './assets/dintegi-logo.png'
import fdLogo from './assets/fd-logo.png'

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
        <img src={dintegiLogo} alt="DINTEGI Soluciones Digitales" />
      </a>

      <nav className="navLinks" aria-label="Navegación principal">
        {navItems.map(([label, href], index) => (
          <a key={label} className={index === 0 ? 'active' : ''} href={href}>
            {label}
          </a>
        ))}
      </nav>

      <a className="headerCta" href="/demo/index.html">
        Ver demo
      </a>
    </header>
  )
}

function DashboardMockup() {
  const bars = [38, 55, 50, 72, 84, 96]
  const movements = [
    ['20/05/2026', 'Cobro', 'Factura #000125', 'Transporte Norte SRL', '$ 1.250.000', 'Pagado'],
    ['19/05/2026', 'Venta', 'Factura #000124', 'Logística del Sur SA', '$ 2.680.000', 'Pagado'],
    ['19/05/2026', 'Cobro', 'Factura #000123', 'Distribuciones Cuyo', '$ 980.000', 'Pendiente'],
    ['18/05/2026', 'Trámite', 'Expediente #000122', 'Retiro Express', 'Actualizado', 'En curso'],
  ]

  return (
    <div className="dashboardMockup">
      <aside className="mockSidebar">
        <div className="mockBrand">DINTEGI</div>
        {['Inicio', 'Dashboard', 'Ventas', 'Clientes', 'Cobros', 'Reportes', 'Trámites', 'Configuración'].map((item, idx) => (
          <div className={`mockMenuItem ${idx === 0 ? 'active' : ''}`} key={item}>
            <span className="mockMenuIcon" />
            {item}
          </div>
        ))}
      </aside>

      <main className="mockContent">
        <div className="mockTopbar">
          <strong>Resumen general</strong>
          <div className="mockUserTools">
            <span>Mayo 2026</span>
            <span>Administrador</span>
          </div>
        </div>

        <section className="mockKpis">
          <article>
            <small>Ventas del mes</small>
            <strong>$ 24.680.000</strong>
            <em>+18.5% vs mes anterior</em>
          </article>
          <article>
            <small>Cobros del mes</small>
            <strong>$ 21.450.000</strong>
            <em>+16.3% vs mes anterior</em>
          </article>
          <article>
            <small>Clientes activos</small>
            <strong>1.248</strong>
            <em>+12.7% vs mes anterior</em>
          </article>
          <article>
            <small>Trámites activos</small>
            <strong>86</strong>
            <em className="negative">-5.4% vs mes anterior</em>
          </article>
        </section>

        <section className="mockGrid">
          <article className="mockPanel">
            <div className="panelTitle">Ventas por mes</div>
            <div className="bars">
              {bars.map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="barLabels">
              <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
            </div>
          </article>

          <article className="mockPanel">
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
            <div className="movementHeader">
              <span>Fecha</span><span>Tipo</span><span>Descripción</span><span>Cliente</span><span>Importe</span><span>Estado</span>
            </div>
            {movements.map((row) => (
              <div className="mockRow" key={row.join('-')}>
                {row.map((cell, idx) => (
                  <span key={idx} className={idx === 5 ? 'statusPill' : ''}>{cell}</span>
                ))}
              </div>
            ))}
          </article>

          <article className="mockPanel alertPanel">
            <div className="panelTitle">Alertas</div>
            <p><b>3</b> facturas vencidas</p>
            <p><b>5</b> trámites próximos a vencer</p>
            <a href="#contacto">Ver todas</a>

            <div className="activityTitle">Actividad reciente</div>
            <p className="activity good">Nuevo cobro registrado</p>
            <p className="activity">Factura emitida</p>
            <p className="activity">Trámite actualizado</p>
          </article>
        </section>
      </main>
    </div>
  )
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="heroText">
        <p className="eyebrow">Software a medida para PyMEs</p>
        <h1>Sistemas que ordenan empresas</h1>
        <p className="lead">
          Desarrollamos sistemas web administrativos a medida para PyMEs que necesitan ordenar procesos,
          ventas, pagos, reportes y gestión interna.
        </p>

        <div className="heroActions">
          <a href="#contacto" className="btn primary">Solicitar diagnóstico <span>→</span></a>
          <a href="#soluciones" className="btn secondary">Ver soluciones <span>→</span></a>
        </div>

        <div className="trustRow">
          <span>🛡️ A medida de tu negocio</span>
          <span>🔒 Seguro y confiable</span>
          <span>📊 Información en tiempo real</span>
        </div>
      </div>

      <div className="heroVisual">
        <DashboardMockup />
      </div>
    </section>
  )
}

const services = [
  {
    icon: Truck,
    title: 'Transporte y logística',
    text: 'Gestión completa de viajes, flotas, cargas y entregas.',
  },
  {
    icon: Handshake,
    title: 'Ventas y gestión comercial',
    text: 'Control de ventas, clientes, presupuestos y cobranzas.',
  },
  {
    icon: BarChart3,
    title: 'Cuentas corrientes y reportes',
    text: 'Seguimiento de cuentas, pagos y reportes claros y actualizados.',
  },
  {
    icon: FileText,
    title: 'Seguimiento de trámites',
    text: 'Digitalización y control de trámites y documentación.',
  },
]

function Services() {
  return (
    <section id="servicios" className="section serviceStrip" aria-label="Servicios principales">
      {services.map((service) => (
        <article className="serviceCard" key={service.title}>
          <div className="serviceIcon">
            <service.icon size={42} strokeWidth={2.2} />
          </div>
          <h3>{service.title}</h3>
          <p>{service.text}</p>
        </article>
      ))}
    </section>
  )
}

const benefits = [
  {
    icon: FileX,
    title: 'Menos planillas',
    text: 'Eliminamos tareas manuales y errores en Excel.',
  },
  {
    icon: ShieldCheck,
    title: 'Más control',
    text: 'Tenés visibilidad total de tu operación en tiempo real.',
  },
  {
    icon: PieChart,
    title: 'Reportes claros',
    text: 'Información clave para tomar mejores decisiones.',
  },
  {
    icon: Cloud,
    title: 'Procesos digitales',
    text: 'Automatizamos y ordenamos tus procesos de punta a punta.',
  },
]

function Benefits() {
  return (
    <section id="soluciones" className="section benefitsSection">
      <h2>Qué resolvemos</h2>
      <div className="benefitGrid">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article className="benefitItem" key={title}>
            <span className="benefitIcon">
              <Icon size={34} strokeWidth={2.1} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const cases = [
  {
    name: 'Danlu',
    type: 'Transporte y logística',
    text: 'Sistema integral para gestión de transporte y logística. Control de viajes, cargas, flotas y documentación.',
    className: 'caseTruck',
    visual: '🚚',
  },
  {
    name: 'San Pancracio',
    type: 'Remitos y cuentas corrientes',
    text: 'Plataforma administrativa para operaciones logísticas de produccion en campo, control de clientes, proveedores y facturación.',
    className: 'casePort',
    visual: '🌾',
  },
  {
    name: 'Riders',
    type: 'Ventas y seguimiento',
    text: 'Gestión de ventas, pagos, pedidos y logística. Asignación, seguimiento y control de entregas. Logistica Internacional con IA.',
    className: 'caseRiders',
    visual: '🏍️',
  },
  {
    name: 'Retiro 360',
    type: 'Trámites y expedientes',
    text: 'Digitalización y seguimiento de trámites. Trazabilidad, alertas y reportes automáticos. Art, jubilaciones y pensiones.',
    className: 'caseDocs',
    visual: '📄',
  },
]

function Cases() {
  return (
    <section id="casos" className="section casesSection">
      <h2>Casos de aplicación</h2>
      <div className="caseGrid">
        {cases.map((item) => (
          <article className="caseCard" key={item.name}>
            <div className={`caseImage ${item.className}`}>
              <div className="caseVisualIcon">{item.visual}</div>
              <span>{item.type}</span>
            </div>
            <div className="caseBody">
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <a href="#contacto">Ver solución →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const steps = [
  {
    number: '1',
    icon: Search,
    title: 'Diagnóstico',
    text: 'Conocemos tu negocio y detectamos oportunidades de mejora.',
  },
  {
    number: '2',
    icon: ClipboardList,
    title: 'Propuesta',
    text: 'Diseñamos una solución a medida con alcance, plazos y costos claros.',
  },
  {
    number: '3',
    icon: Code2,
    title: 'Desarrollo',
    text: 'Desarrollamos tu sistema con tecnología moderna, segura y escalable.',
  },
  {
    number: '4',
    icon: Rocket,
    title: 'Implementación',
    text: 'Capacitamos a tu equipo y acompañamos en la puesta en marcha.',
  },
]

function Process() {
  return (
    <section id="metodologia" className="section processSection">
      <h2>Cómo trabajamos</h2>

      <div className="processLine">
        {steps.map(({ number, icon: Icon, title, text }) => (
          <article className="processStep" key={number}>
            <span className="stepNumber">{number}</span>

            <div className="stepIcon">
              <Icon size={34} strokeWidth={2.1} />
            </div>

            <div className="stepContent">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Founder() {
  return (
    <section className="section founderSection">
      <div className="founderCard">
        <div>
          <p className="eyebrow">Dirección técnica</p>
          <h2>Experiencia real implementando sistemas en producción</h2>
          <p>
            DINTEGI nace de años de trabajo desarrollando soluciones administrativas para empresas y organismos.
            La propuesta combina análisis funcional, desarrollo full stack e implementación real, con foco en
            resolver problemas concretos: procesos manuales, reportes dispersos, saldos poco claros, seguimiento
            operativo y falta de información para decidir.
          </p>
        </div>

        <aside className="founderBadge">
          <img src={fdLogo} alt="FD - Fabricio Dimani" />
          <strong>Fabricio Dimani</strong>
          <span>Fundador / Consultor Full Stack</span>
        </aside>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="ctaBand">
      <div className="ctaIcon">
        <BarChart3 size={40} strokeWidth={2.1} />
      </div>
      <div>
        <h2>¿Listo para digitalizar tu empresa?</h2>
        <p>Hablemos sobre tu negocio y descubrí cómo podemos ayudarte a crecer con un sistema a medida.</p>
      </div>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn light">Hablemos por WhatsApp</a>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footerGrid footerGridClean">
        <div className="footerBrand">
          <div className="footerLogoText">
            <strong>DINTEGI</strong>
            <span>Soluciones Digitales</span>
          </div>

          <p>
            Desarrollamos sistemas web a medida para empresas que quieren crecer
            con orden y tecnología.
          </p>
        </div>

        <div>
          <h3>Navegación</h3>
          {navItems.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>

        <div>
          <h3>Contacto</h3>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp: +54 381 5176145
          </a>
          <a href="mailto:contacto@dintegi.com.ar">
            contacto@dintegi.com.ar
          </a>
          <span>Tucumán, Argentina</span>

          <a className="footerButton" href="#inicio">
            Solicitar diagnóstico
          </a>
        </div>
      </div>

      <div className="footerBottom">
        © 2026 DINTEGI Soluciones Digitales. Todos los derechos reservados.
        <span className="footerCredit">Desarrollado por FD</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <Cases />
        <Process />
        <Founder />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
