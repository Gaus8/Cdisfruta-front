import React from 'react';
import '../../assets/styles/usuarios/forms.css';

export default function Terminos() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Términos y Condiciones de Uso y Comercio Electrónico</h1>
        <p className="legal-updated">Última actualización: 31 de agosto de 2026</p>

        <section>
          <h2>1. Aspectos Generales y Naturaleza del Producto</h2>
          <p>
            Los presentes Términos y Condiciones regulan la compra de alimentos empacados (frutas deshidratadas y infusiones/aromáticas frutales) a través de nuestra tienda virtual. Al realizar un pedido, aceptas estas condiciones en el marco de la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia).
          </p>
        </section>

        <section>
          <h2>2. Calidad, Registro Sanitario e Inocuidad</h2>
          <p>
            Nuestros productos son procesados y empacados bajo estrictos estándares de inocuidad alimentaria y cuentan con sus correspondientes notificaciones/registros sanitarios expedidos por el <strong>INVIMA</strong> (cuando aplique por norma). El cliente es responsable de conservar el producto en un lugar fresco, seco y protegido de la luz solar una vez recibido el paquete.
          </p>
        </section>

        <section>
          <h2>3. Derecho de Retracto y Excepciones (Alimentos)</h2>
          <p>
            De conformidad con el numeral 4 del artículo 47 de la Ley 1480 de 2011, <strong>se exceptúan del derecho de retracto los bienes perceptibles de deterioro, vencimiento rápido o productos alimenticios</strong> que, por razones de higiene, sanidad e inocuidad, no pueden ser devueltos una vez destapados o manipulados.
          </p>
          <p>
            Sin embargo, el cliente podrá solicitar la devolución o cambio del producto únicamente si se reporta dentro de las primeras <strong>24 a 48 horas</strong> de recibido en los siguientes casos:
          </p>
          <ul>
            <li>Empaque primario roto, perforado o con el sello de seguridad violado al momento de la entrega.</li>
            <li>Producto que no corresponda al pedido realizado.</li>
            <li>Producto vencido o con defectos evidentes de calidad en el momento de la recepción.</li>
          </ul>
        </section>

        <section>
          <h2>4. Precios, Envíos y Tiempos de Entrega</h2>
          <p>
            Todos los precios incluyen impuestos (IVA si aplica) y están fijados en Pesos Colombianos (COP). Debido a la naturaleza de los alimentos, los envíos se programan mediante empresas de mensajería especializadas. Es responsabilidad del cliente proporcionar una dirección exacta para evitar retrasos que afecten la entrega del paquete.
          </p>
        </section>

        <section>
          <h2>5. Garantías y Reclamos de Calidad</h2>
          <p>
            En caso de recibir un producto en malas condiciones, el cliente deberá enviar un correo a <strong>servicioalcliente@tudominio.com</strong> adjuntando fotografías claras del empaque, el número de lote y la fecha de vencimiento impresa. Si la reclamación procede, realizaremos la reposición del producto o la devolución del dinero sin costo adicional.
          </p>
        </section>

        <section>
          <h2>6. Autoridad de Protección al Consumidor</h2>
          <p>
            Te informamos que la <strong>Superintendencia de Industria y Comercio (SIC)</strong> es la entidad encargada de velar por la protección de los derechos de los consumidores en Colombia (www.sic.gov.co).
          </p>
        </section>
      </div>
    </div>
  );
}