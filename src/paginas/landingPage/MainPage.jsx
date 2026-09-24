import { tw } from '../../funciones/tw.js';
import Videos from './Videos';
import CarruselProductos from './Carrusel';
import Header from './Header';
import { MdOutlineComputer } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { FiShield } from "react-icons/fi";
import { AiOutlineStar } from "react-icons/ai";
import { FiCheckCircle } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";

function MainPage() {
  return (
    <div className={tw("main-page-wrapper")}>
      <Header />
      <CarruselProductos />
 
      {/* ── SECCIÓN SOBRE NOSOTROS ── */}
      <section className={tw("about-section")} id="sobre">
        <div className={tw("about-visual")}>
          <img 
            src="/img/cdisfruta_06.webp" 
            alt="Sobre nosotros" 
            className={tw("about-image-bg")} 
          />
          <div className={tw("about-badge")}>
            <span className={tw("about-badge-num")}>6</span>
            <span className={tw("about-badge-label")}>años en el mercado</span>
          </div>
        </div>
        <div className={tw("about-content")}>
          <span className={tw("eyebrow")}>Nuestra historia</span>
          <blockquote className={tw("about-quote")}>
            "Del campo de Ubaté al mundo"
          </blockquote>
          <p>
            Somos una empresa fundada en el año 2020 por una <strong> Familia Ubatense, </strong> a partir de las oportunidades y necesidades generadas por la pandemia. Dedicada a la{' '}
            producción de <strong> snacks de fruta deshidratada y aromáticas frutales</strong>, promoviendo
            una alimentación saludable y completamente natural.
          </p>
          <p>
            Cada producto nace de la riqueza agrícola de nuestra región,
            elaborado con frutas cultivadas por manos campesinas,
            garantizando calidad, frescura y el auténtico sabor natural.
          </p>
          <div className={tw("about-tags")}>
            <span className={tw("about-tag")}>🌿 100% Natural</span>
            <span className={tw("about-tag")}>🏔️ Origen Ubatense</span>
            <span className={tw("about-tag")}>✈️ Presencia Internacional</span>
            <span className={tw("about-tag")}>🫙 Sin conservantes</span>
          </div>
        </div>
      </section>
 
      {/* ── SECCIÓN DE CARACTERÍSTICAS ── */}
      <section className={tw("features-section")} id="features">
        <div className={tw("features-header")}>
          <span className={tw("eyebrow")}>¿Por qué elegirnos?</span>
          <h2 className={tw("section-title")}>Calidad en cada detalle</h2>
        </div>
        <div className={tw("features-grid")}>
          <div className={tw("feature-card")}>
            <div className={tw("feat-icon-wrap")}><MdOutlineComputer /></div>
            <h3>Diseño Adaptable</h3>
            <p>Nuestra plataforma se adapta a cualquier dispositivo para brindarte una mayor experiencia.</p>
          </div>
          <div className={tw("feature-card")}>
            <div className={tw("feat-icon-wrap")}><FiShield /></div>
            <h3>Compra fácil y segura</h3>
            <p>Disfruta de un proceso de compra rápido, intuitivo y confiable, pensado para que adquieras nuestros productos sin complicaciones.</p>
          </div>
          <div className={tw("feature-card")}>
            <div className={tw("feat-icon-wrap")}><FiCheckCircle /></div>
            <h3>Compromiso con la calidad</h3>
            <p>Seleccionamos cuidadosamente cada producto para ofrecerte siempre frescura, sabor y estándares de alta calidad.</p>
          </div>
          <div className={tw("feature-card")}>
            <div className={tw("feat-icon-wrap")}><FiTruck /></div>
            <h3>Entrega rápida</h3>
            <p>Llevamos nuestros productos hasta la puerta de tu casa, garantizando frescura, rapidez y calidad en cada envío.</p>
          </div>
        </div>
      </section>
 
      {/* ── GALERÍA / VIDEOS ── */}
      <section className={tw("media-section")} id="media">
        <div className={tw("media-header")}>
          <span className={tw("eyebrow eyebrow--light")}>Nuestra galería</span>
          <h2 className={tw("section-title section-title--light")}>
            En cada imagen, <em>nuestra pasión</em>
          </h2>
        </div>
        <Videos />
      </section>
 
      {/* ── FOOTER ── */}
      <footer className={tw("footer-main")} id="contacto">
        <div className={tw("footer-grid")}>
          {/* Marca */}
          <div className={tw("footer-brand-col")}>
            <div className={tw("footer-logo")}>
              <div className={tw("hdr-logo-ring")}>
                <img src="/img/logo_cdisfruta.webp" alt="CDISFRUTA Logo" />
              </div>
              <span className={tw("footer-brand-name")}>CDISFRUTA</span>
            </div>
            <p className={tw("footer-tagline")}>
              Frutas deshidratadas y aromáticas de Ubaté, Cundinamarca.
              Sabor natural colombiano para el mundo.
            </p>
            <div className={tw("footer-social")}>
              {/* Enlace a Instagram */}
              <a 
                href="https://www.instagram.com/cdisfruta_col" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={tw("social-pill")}
              >
                Instagram
              </a>
              
              {/* Enlace a WhatsApp */}
              <a 
                href="https://wa.me/573229683625" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={tw("social-pill")}
              >
                WhatsApp
              </a>
            </div>
          </div>
 
          {/* Navegación */}
          <div className={tw("footer-col")}>
            <h4 className={tw("footer-col-title")}>Navegación</h4>
            <ul className={tw("footer-links")}>
              <li><a href="#">Inicio</a></li>
              <li><a href="#sobre">Sobre Nosotros</a></li>
              <li><a href="#features">Características</a></li>
              <li><a href="#media">Galería</a></li>
            </ul>
          </div>
 
          {/* Empresa */}
          <div className={tw("footer-col")}>
            <h4 className={tw("footer-col-title")}>Empresa</h4>
            <ul className={tw("footer-links")}>
              <li><a href="#">Nuestra historia</a></li>
              <li><a href="#">Proceso artesanal</a></li>
              <li><a href="#">Presencia internacional</a></li>
              <li><a href="#">Distribuidores</a></li>
            </ul>
          </div>
 
          {/* Contacto */}
          <div className={tw("footer-col")}>
            <h4 className={tw("footer-col-title")}>Contacto</h4>
            <ul className={tw("footer-contact-list")}>
              <li>
                <span className={tw("footer-contact-icon")}><IoLocationOutline /></span>
                <span>Ubaté, Cundinamarca - Colombia</span>
              </li>
              <li>
                <span className={tw("footer-contact-icon")}><BsTelephone /></span>
                <span>+57 322 968 3625</span>
              </li>
              <li>
                <span className={tw("footer-contact-icon")}><MdOutlineMail /></span>
                <span>cdisfruta@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
 
        <div className={tw("footer-bottom")}>
          <p>© 2026 CDISFRUTA - SIECU · Todos los derechos reservados</p>
          <p className={tw("footer-made")}>Hecho con ❤️ en Ubaté, Colombia</p>
        </div>
      </footer>
    </div>
  );
}
 
export default MainPage;