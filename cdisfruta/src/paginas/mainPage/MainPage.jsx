import '../../assets/styles/mainPage/mainpage.css';
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
    <div className="main-page-wrapper">
      <Header />
      <CarruselProductos />
 
      {/* ── SECCIÓN SOBRE NOSOTROS ── */}
      <section className="about-section" id="sobre">
        <div className="about-visual">
          <img 
            src="public/img/cdisfruta_06.png" 
            alt="Sobre nosotros" 
            className="about-image-bg" 
          />
          <div className="about-badge">
            <span className="about-badge-num">6</span>
            <span className="about-badge-label">años en el mercado</span>
          </div>
        </div>
        <div className="about-content">
          <span className="eyebrow">Nuestra historia</span>
          <blockquote className="about-quote">
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
          <div className="about-tags">
            <span className="about-tag">🌿 100% Natural</span>
            <span className="about-tag">🏔️ Origen Ubatense</span>
            <span className="about-tag">✈️ Presencia Internacional</span>
            <span className="about-tag">🫙 Sin conservantes</span>
          </div>
        </div>
      </section>
 
      {/* ── SECCIÓN DE CARACTERÍSTICAS ── */}
      <section className="features-section" id="features">
        <div className="features-header">
          <span className="eyebrow">¿Por qué elegirnos?</span>
          <h2 className="section-title">Calidad en cada detalle</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feat-icon-wrap"><MdOutlineComputer /></div>
            <h3>Diseño Adaptable</h3>
            <p>Nuestra plataforma se adapta a cualquier dispositivo para brindarte una mayor experiencia.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon-wrap"><FiShield /></div>
            <h3>Compra fácil y segura</h3>
            <p>Disfruta de un proceso de compra rápido, intuitivo y confiable, pensado para que adquieras nuestros productos sin complicaciones.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon-wrap"><FiCheckCircle /></div>
            <h3>Compromiso con la calidad</h3>
            <p>Seleccionamos cuidadosamente cada producto para ofrecerte siempre frescura, sabor y estándares de alta calidad.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon-wrap"><FiTruck /></div>
            <h3>Entrega rápida</h3>
            <p>Llevamos nuestros productos hasta la puerta de tu casa, garantizando frescura, rapidez y calidad en cada envío.</p>
          </div>
        </div>
      </section>
 
      {/* ── GALERÍA / VIDEOS ── */}
      <section className="media-section" id="media">
        <div className="media-header">
          <span className="eyebrow eyebrow--light">Nuestra galería</span>
          <h2 className="section-title section-title--light">
            En cada imagen, <em>nuestra pasión</em>
          </h2>
        </div>
        <Videos />
      </section>
 
      {/* ── FOOTER ── */}
      <footer className="footer-main" id="contacto">
        <div className="footer-grid">
          {/* Marca */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="hdr-logo-ring">
                <img src="/img/logo_cdisfruta.jpg" alt="CDISFRUTA Logo" />
              </div>
              <span className="footer-brand-name">CDISFRUTA</span>
            </div>
            <p className="footer-tagline">
              Frutas deshidratadas y aromáticas de Ubaté, Cundinamarca.
              Sabor natural colombiano para el mundo.
            </p>
            <div className="footer-social">
              {/* Enlace a Instagram */}
              <a 
                href="https://www.instagram.com/cdisfruta_col" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-pill"
              >
                Instagram
              </a>
              
              {/* Enlace a WhatsApp */}
              <a 
                href="https://wa.me/573112865361" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-pill"
              >
                WhatsApp
              </a>
            </div>
          </div>
 
          {/* Navegación */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links">
              <li><a href="#">Inicio</a></li>
              <li><a href="#sobre">Sobre Nosotros</a></li>
              <li><a href="#features">Características</a></li>
              <li><a href="#media">Galería</a></li>
            </ul>
          </div>
 
          {/* Empresa */}
          <div className="footer-col">
            <h4 className="footer-col-title">Empresa</h4>
            <ul className="footer-links">
              <li><a href="#">Nuestra historia</a></li>
              <li><a href="#">Proceso artesanal</a></li>
              <li><a href="#">Presencia internacional</a></li>
              <li><a href="#">Distribuidores</a></li>
            </ul>
          </div>
 
          {/* Contacto */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contacto</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="footer-contact-icon"><IoLocationOutline /></span>
                <span>Ubaté, Cundinamarca - Colombia</span>
              </li>
              <li>
                <span className="footer-contact-icon"><BsTelephone /></span>
                <span>+57 321 451 2250</span>
              </li>
              <li>
                <span className="footer-contact-icon"><MdOutlineMail /></span>
                <span>cdisfruta@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
 
        <div className="footer-bottom">
          <p>© 2026 CDISFRUTA - SIECU · Todos los derechos reservados</p>
          <p className="footer-made">Hecho con ❤️ en Ubaté, Colombia</p>
        </div>
      </footer>
    </div>
  );
}
 
export default MainPage;