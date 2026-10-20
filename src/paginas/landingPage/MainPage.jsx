import { tw } from '../../funciones/tw.js';
import Videos from './Videos';
import HeroCarousel from './Carrusel';
import ProductCarousel3D from './ProductCarousel3D';
import Header from './Header';
import CountUpNumber from './CountUpNumber';
import MissionVision from './MissionVision';
import { IoLocationOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";

function MainPage() {
  return (
    <div className={tw("main-page-wrapper", "theme-v2")}>
      <Header themeV2 />
      <HeroCarousel />
      <ProductCarousel3D />
 
      {/* ── SECCIÓN SOBRE NOSOTROS ── */}
      <section className={tw("about-section", "scroll-mt-24")} id="historia">
        <div className={tw("about-visual")}>
          <img 
            src="/img/cdisfruta_06.webp" 
            alt="Sobre nosotros" 
            className={tw("about-image-bg")} 
          />
          <div className={tw("about-badge")}>
            <span className={tw("about-badge-num")}><CountUpNumber value={6} /></span>
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
        </div>
      </section>
 
      <MissionVision />
 
      {/* ── GALERÍA / VIDEOS ── */}
      <section className={tw("media-section", "scroll-mt-24")} id="videos">
        <div className={tw("media-header")}>
          <span className={tw("eyebrow eyebrow--light")}>Nuestra galería</span>
          <h2 className={tw("section-title section-title--light")}>
            En cada imagen, <em>nuestra pasión</em>
          </h2>
        </div>
        <Videos />
      </section>
 
      {/* ── FOOTER ── */}
      <footer className={tw("footer-main", "scroll-mt-24")} id="contacto">
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
