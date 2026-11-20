import React, { useEffect } from 'react'
import { Truck, ClipboardList, BarChart3, FileText, ShieldCheck, Cloud } from 'lucide-react'
import { DISTRI360_LOGIN_URL, DISTRI360_CONTACT } from './distri360Config'

const features = [
  [ClipboardList, 'Ventas y pedidos', 'Mostrador para la venta inmediata y comandas para preparar y entregar. Listas de precios por costo o precio fijo.'],
  [Truck, 'Stock y distribución', 'Control de depósito y camiones, entregas parciales y trazabilidad de piezas con kilos reales.'],
  [BarChart3, 'Cobros y caja', 'Cuenta corriente de clientes, cobros por distintos medios, rendiciones del chofer y cierre diario.'],
  [FileText, 'Facturación electrónica', 'Circuito de comprobantes integrado a las ventas. En esta demo, las pruebas ARCA se realizan en homologación.'],
]

export default function Distri360() {
  useEffect(() => {
    document.title = 'DISTRI360 | Ventas, stock y distribución · DINTEGI'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Conocé DISTRI360 de DINTEGI: mostrador, pedidos, stock, entregas, cuentas corrientes y caja. Solicitá una demostración privada para tu empresa.')
  }, [])
  return <main className="d360-page">
    <section className="d360-hero" aria-labelledby="d360-title">
      <div className="d360-hero-copy">
        <p className="d360-eyebrow">UN PRODUCTO DE DINTEGI</p>
        <div className="d360-wordmark">DISTRI<span>360</span></div>
        <h1 id="d360-title">De la venta a la entrega.<br/><em>Todo conectado.</em></h1>
        <p className="d360-lead">Una misma plataforma para vender, preparar pedidos, controlar el stock y seguir las entregas y los cobros de tu negocio.</p>
        <div className="d360-actions">
          <a className="btn primary" href={DISTRI360_LOGIN_URL} target="_blank" rel="noopener noreferrer">Ingresar a la demo</a>
          <a className="btn secondary" href={DISTRI360_CONTACT} target="_blank" rel="noopener noreferrer">Coordinar una demostración</a>
        </div>
        <p className="d360-access-note"><ShieldCheck size={18} aria-hidden="true"/> Demo privada con usuario y contraseña. Datos de prueba.</p>
      </div>
      <figure className="d360-preview">
        <div className="d360-window"><span/><span/><span/><b>DISTRI360 · Inicio</b></div>
        <img src="/images/distri360-demo.jpg" width="1363" height="936" alt="Pantalla de Inicio de DISTRI360: ventas por canal, gráfico e información de distribución con datos ficticios."/>
        <figcaption>Captura de una copia de demostración. Los datos son ficticios.</figcaption>
      </figure>
    </section>

    <section className="d360-video-section" id="video-distri360" aria-labelledby="d360-video-title">
      <div className="d360-video-layout">
        <div className="d360-video-copy">
          <p className="d360-eyebrow">MIRÁ CÓMO SE CONECTA TU OPERACIÓN</p>
          <h2 id="d360-video-title">Lo que entregás, lo que cobrás<br/>y lo que te deben.</h2>
          <p>En 34 segundos, conocé cómo DISTRI360 conecta las entregas por peso real con la cuenta corriente del cliente y el registro de los cobros.</p>
          <ul>
            <li>Entregas con los kilos efectivamente recibidos.</li>
            <li>Deuda del cliente según lo entregado.</li>
            <li>Cobros en efectivo y por transferencia registrados.</li>
          </ul>
          <div className="d360-video-cta">
            <a className="btn primary" href={DISTRI360_CONTACT} target="_blank" rel="noopener noreferrer">Coordinar una demostración</a>
            <p>Contanos a qué se dedica tu empresa y coordinamos un horario por WhatsApp.</p>
          </div>
          <details className="d360-video-summary"><summary>Leer el resumen del video</summary><p>DISTRI360 permite registrar el peso real de una entrega, calcular el importe que corresponde al cliente y registrar sus cobros. El ejemplo muestra entregas por kilos y pagos en efectivo y por transferencia. Los importes y las empresas del video son ilustrativos.</p></details>
        </div>
        <figure className="d360-video-card">
          <video controls playsInline preload="none" poster="/images/distri360-video-poster.jpg" width="1080" height="1920" aria-label="Presentación de DISTRI360: entregas, cuenta corriente y cobros" aria-describedby="d360-video-caption">
            <source src="/videos/distri360-presentacion.mp4" type="video/mp4"/>
            Tu navegador no permite reproducir este video. <a href="/videos/distri360-presentacion.mp4">Abrir el video de DISTRI360</a>.
          </video>
          <figcaption id="d360-video-caption">Presentación de 34 segundos · Datos ilustrativos.</figcaption>
        </figure>
      </div>
    </section>

    <section className="d360-section" aria-labelledby="d360-features">
      <p className="d360-eyebrow">LA OPERACIÓN, EN UN SOLO LUGAR</p>
      <h2 id="d360-features">Cada paso tiene su registro.</h2>
      <div className="d360-feature-grid">{features.map(([Icon, title, text]) => <article key={title}>
        <Icon size={28} aria-hidden="true"/><h3>{title}</h3><p>{text}</p>
      </article>)}</div>
    </section>

    <section className="d360-section d360-workflow" aria-labelledby="d360-flow-title">
      <div><p className="d360-eyebrow">DOS RECORRIDOS, UN MISMO NEGOCIO</p><h2 id="d360-flow-title">Mostrador y reparto,<br/>con información compartida.</h2>
        <p>El producto, sus precios y el stock acompañan cada operación. Una factura vinculada a una venta no debe contarse como una segunda venta.</p></div>
      <div className="d360-flows">
        <article><h3>Venta de mostrador</h3><p>Seleccionar productos, confirmar el cobro y consultar el ticket. La facturación se revisa en su propio paso.</p></article>
        <article><h3>Pedido con distribución</h3><p>Registrar la comanda, asignar camión y chofer, confirmar lo entregado y registrar los cobros y su rendición.</p></article>
      </div>
    </section>

    <section className="d360-section d360-demo-access" id="acceso-distri360" aria-labelledby="d360-access-title">
      <Cloud size={32} aria-hidden="true"/>
      <div><p className="d360-eyebrow">CONOCÉ EL SISTEMA EN FUNCIONAMIENTO</p><h2 id="d360-access-title">¿Ya tenés tu acceso de prueba?</h2>
        <p>Ingresá con el usuario que te entregó DINTEGI. Si todavía no tenés uno, solicitá una demostración para revisar el circuito de tu empresa.</p>
        <p className="d360-demo-limit">Este acceso corresponde a la demo de DISTRI360. La emisión fiscal de prueba se realiza en homologación y no genera facturas reales. La puesta en marcha de cada empresa se configura por separado.</p>
      </div>
      <div className="d360-access-buttons"><a className="btn primary" href={DISTRI360_LOGIN_URL} target="_blank" rel="noopener noreferrer">Acceder a DISTRI360</a><a className="d360-text-link" href={DISTRI360_CONTACT} target="_blank" rel="noopener noreferrer">Coordinar una demostración</a></div>
    </section>
    <div className="d360-back"><a href="/#inicio">Volver a DINTEGI</a></div>
  </main>
}
