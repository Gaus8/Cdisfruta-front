import React from 'react';
import '../../assets/styles/usuarios/forms.css';

export default function PoliticaDatos() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Política de Tratamiento de Datos Personales</h1>
        <p className="legal-updated">Última actualización: 31 de agosto de 2026</p>

        <section>
          <h2>1. Identificación del Responsable del Tratamiento</h2>
          <p>
            En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013, el responsable del tratamiento de sus datos personales es <strong>[Nombre de tu Marca / Empresa S.A.S.]</strong>, con NIT <strong>[000.000.000-0]</strong>, ubicado en <strong>[Ciudad, Colombia]</strong>, con correo electrónico de contacto <strong>servicioalcliente@tudominio.com</strong>.
          </p>
        </section>

        <section>
          <h2>2. Datos Recolectados</h2>
          <p>Para la comercialización y despacho de nuestras frutas deshidratadas y aromáticas, recolectamos:</p>
          <ul>
            <li>Datos de identificación y contacto: Nombres, apellidos, cédula, teléfono, dirección de envío y correo electrónico.</li>
            <li>Información de facturación electrónica requerida por la DIAN.</li>
            <li>Datos transaccionales procesados mediante pasarelas de pago seguras (no almacenamos claves ni datos financieros).</li>
            <li>Preferencias de consumo y datos de navegación (Cookies / Google OAuth).</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalidad del Tratamiento de Datos</h2>
          <p>Los datos suministrados serán tratados para:</p>
          <ul>
            <li>Procesar, preparar, despachar y dar seguimiento logístico a los pedidos de alimentos.</li>
            <li>Garantizar la trazabilidad de los lotes de productos en caso de requerimientos de inocuidad o calidad alimentaria.</li>
            <li>Emitir la factura de venta correspondiente.</li>
            <li>Atender solicitudes, peticiones, quejas o reclamos (PQR) sobre la calidad de las frutas o aromáticas.</li>
            <li>Enviar promociones y novedades sobre nuestros productos comestibles (previa autorización del titular).</li>
          </ul>
        </section>

        <section>
          <h2>4. Derechos de los Titularesssss (Habeas Data)</h2>
          <p>
            Como titular de los datos, tienes derecho a conocer, actualizar, rectificar y solicitar la supresión de tus datos personales, así como revocar la autorización otorgada escribiendo a <strong>servicioalcliente@tudominio.com</strong>. Tu solicitud será atendida en un plazo máximo de quince (15) días hábiles.
          </p>
        </section>
      </div>
    </div>
  );
}