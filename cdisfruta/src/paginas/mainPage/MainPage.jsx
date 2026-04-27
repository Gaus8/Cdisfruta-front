import '../../assets/Styles/mainPage/mainpage.css';
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
 
function MainPage() {
  return (
    <div className="main-page-wrapper">
      <Header />
      <CarruselProductos />
 
      {/* ── SECCIÓN SOBRE NOSOTROS ── */}
      <section className="about-section" id="sobre">
        <div className="about-visual">
          <div className="about-visual-glow" />
          <div className="about-emoji-bg">🍊</div>
          <div className="about-badge">
            <span className="about-badge-num">4</span>
            <span className="about-badge-label">años en el mercado</span>
          </div>
        </div>
        <div className="about-content">
          <span className="eyebrow">Nuestra historia</span>
          <blockquote className="about-quote">
            "Del campo de Ubaté al mundo"
          </blockquote>
          <p>
            Somos una empresa de <strong>Ubaté, Cundinamarca</strong>, dedicada a la{' '}
            <strong>producción de frutas deshidratadas</strong> y aromáticas, promoviendo
            una alimentación saludable y completamente natural.
          </p>
          <p>
            Cada producto nace de la riqueza agrícola de nuestra región, procesado con
            cuidado artesanal y tecnología moderna para preservar sabor, nutrientes y la
            esencia de la fruta fresca.
          </p>
          <div className="about-tags">
            <span className="about-tag">🌿 100% Natural</span>
            <span className="about-tag">🏔️ Origen Cundinamarca</span>
            <span className="about-tag">✈️ Exportación</span>
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
            <p>Nuestra plataforma funciona perfectamente en cualquier dispositivo, brindando la mejor experiencia.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon-wrap"><IoIosTimer /></div>
            <h3>Procesos Eficientes</h3>
            <p>Optimización constante en cada etapa de la producción de nuestras frutas deshidratadas.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon-wrap"><AiOutlineGlobal /></div>
            <h3>Modernización</h3>
            <p>Tecnología de punta aplicada al proceso artesanal de deshidratación de frutas naturales.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon-wrap"><FaArrowTrendUp /></div>
            <h3>Alto Rendimiento</h3>
            <p>Resultados garantizados con estándares de calidad superiores en cada lote de producción.</p>
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
              <div className="footer-logo-ring">🍊</div>
              <span className="footer-brand-name">Cdisfruta</span>
            </div>
            <p className="footer-tagline">
              Frutas deshidratadas y aromáticas de Ubaté, Cundinamarca.
              Sabor natural colombiano para el mundo.
            </p>
            <div className="footer-social">
              <a href="#" className="social-pill">Instagram</a>
              <a href="#" className="social-pill">Facebook</a>
              <a href="#" className="social-pill">WhatsApp</a>
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
              <li><a href="#">Exportaciones</a></li>
              <li><a href="#">Distribuidores</a></li>
            </ul>
          </div>
 
          {/* Contacto */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contacto</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="footer-contact-icon"><IoLocationOutline /></span>
                <span>Ubaté, Cundinamarca, Colombia</span>
              </li>
              <li>
                <span className="footer-contact-icon"><BsTelephone /></span>
                <span>+57 300 710 8920</span>
              </li>
              <li>
                <span className="footer-contact-icon"><MdOutlineMail /></span>
                <span>cdifruta@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
 
        <div className="footer-bottom">
          <p>© 2026 CDISFRUTA · Todos los derechos reservados</p>
          <p className="footer-made">Hecho con ❤️ en Ubaté, Colombia</p>
        </div>
      </footer>
    </div>
  );
}
 
export default MainPage;