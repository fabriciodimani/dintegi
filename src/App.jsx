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
        <h1>Sistemas que <mark>ordenan</mark> empresas</h1>
        <p className="lead">
          Desarrollamos sistemas web administrativos a medida para empresas que necesitan ordenar procesos,
          ventas, pagos, reportes, clientes y gestión interna en una sola plataforma.
        </p>

        <div className="heroActions">
          <a href={demoUrl} target="_blank" rel="noreferrer" className="btn primary">Ver demo <span>→</span></a>
          <a href="#contacto" className="btn secondary">Solicitar diagnóstico</a>
        </div>

        <div className="trustRow">
          <span>● A medida de tu negocio</span>
          <span>● Seguro y confiable</span>
          <span>● Información en tiempo real</span>
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
    text: 'Control total de viajes, flotas, entregas, gastos y trazabilidad.',
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
  { icon: FileX, title: 'Menos papeles', text: 'Digitalizamos procesos y eliminamos tareas manuales.' },
  { icon: ShieldCheck, title: 'Más control', text: 'Datos actualizados para decidir con confianza.' },
  { icon: PieChart, title: 'Reportes claros', text: 'Información visual para impulsar tu negocio.' },
  { icon: Cloud, title: 'Procesos digitales', text: 'Sistemas ágiles, escalables y personalizados.' },
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
    text: 'Gestión de ventas, pagos, financieras, pedidos, logística internacional, OCR/IA y auditoría de cambios del sistema.',
    className: 'caseRiders',
    visual: '🏍️',
  },
  {
    name: 'Q2 Digital',
    type: 'Acreditaciones para eventos',
    text: 'Registro previo, invitaciones, QR, check-in, reimpresión de credenciales, presentes/ausentes y reportes finales.',
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
            <div className="caseOverlay">
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <a href="#contacto">Ver caso →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const steps = [
  { number: '1', icon: Search, title: 'Diagnosticamos', text: 'Escuchamos el proceso real y definimos objetivos claros.' },
  { number: '2', icon: ClipboardList, title: 'Proponemos', text: 'Alcance, tiempos y presupuesto sin vueltas.' },
  { number: '3', icon: Code2, title: 'Desarrollamos', text: 'Sistema a medida con pruebas y entregas parciales.' },
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
      <div className="founderCard founderCardPro">
        <div className="founderMedia founderMediaPro">
          <div className="founderIdentity">
            <div className="founderNameBlock">
              <strong>Ing. Fabricio Dimani</strong>
              <span>Fundador / CEO</span>
            </div>

            <div className="founderBadgeList">
              <div className="founderBadge">+15 años de experiencia</div>
              <div className="founderBadge">Más de 100 proyectos</div>
            </div>
          </div>
        </div>

        <div className="founderContent founderContentPro">
          <div className="quoteMark">“</div>

          <p className="eyebrow">EXPERIENCIA QUE GENERA CONFIANZA</p>

          <h2>Más de 15 años impulsando la transformación digital de empresas</h2>

          <p>
            En DINTEGI combinamos experiencia real en gestión y tecnología para crear sistemas
            que realmente funcionan en el día a día. No vendemos software genérico:
            desarrollamos soluciones a medida que simplifican, ordenan y hacen crecer tu negocio.
            Nuestro compromiso es estar cerca, entender tu realidad y entregar resultados.
          </p>
        </div>

        <div className="founderImageSide founderImageSideClean">
          <div className="founderStatBox">
            <strong>+15</strong>
            <span>Años de experiencia</span>
          </div>

          <div className="founderStatBox">
            <strong>+100</strong>
            <span>Proyectos y módulos</span>
          </div>

          <div className="founderStatBox">
            <strong>99.9%</strong>
            <span>Foco en continuidad</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="ctaBand">
      <div className="ctaIcon"><BarChart3 size={34} strokeWidth={2.1} /></div>
      <div>
        <h2>¿Listo para digitalizar tu empresa?</h2>
        <p>Hablemos por WhatsApp y veamos cómo adaptar la demo a tu proceso real.</p>
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
          <p>Desarrollamos sistemas web a medida para PyMEs que quieren trabajar mejor, vender más y controlar su negocio.</p>
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
          <a href="mailto:contacto@dintegi.com.ar">contacto@dintegi.com.ar</a>
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
        <CTA />
      </main>
      <Footer />
      <Header />
    </>
  )
}
