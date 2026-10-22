import { tw } from '../../funciones/tw.js';
import Videos from './Videos';
import HeroCarousel from './Carrusel';
import ProductCarousel3D from './ProductCarousel3D';
import Header from './Header';
import HistorySection from './HistorySection';
import MissionVision from './MissionVision';
import { IoLocationOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";

// Contenido editorial de Historia. Esta sección es estática y no está conectada al panel administrativo.
// Los textos y distintivos visuales de esta configuración se pueden editar aquí sin tocar el panel.
const historyContent = {
  photo: '/img/cdisfruta_06.webp',
  photoAlt: 'Productos CDISFRUTA de fruta deshidratada sobre una mesa de madera',
  years: 6,
  eyebrow: 'Nuestra historia',
  quote: '"Del campo de Ubaté al mundo"',
  paragraphs: [
    <>Somos una empresa fundada en el año 2020 por una <strong>Familia Ubatense</strong>, a partir de las oportunidades y necesidades generadas por la pandemia. Dedicada a la producción de <strong>snacks de fruta deshidratada y aromáticas frutales</strong>, promoviendo una alimentación saludable y completamente natural.</>,
    <>Cada producto nace de la riqueza agrícola de nuestra región, elaborado con frutas cultivadas por manos campesinas, garantizando calidad, frescura y el auténtico sabor natural.</>,
  ],
  photoTagline: 'El sabor natural de nuestra tierra',
  photoBadges: [
    { id: 'natural', icon: 'leaf', label: '100% NATURAL' },
    { id: 'sin-conservantes', icon: 'heart', label: 'SIN CONSERVANTES' },
    { id: 'nutrientes', icon: 'sprout', label: 'RICO EN NUTRIENTES' },
  ],
  values: [
    { id: 'fruta-natural', icon: 'leaf', label: <>Frutas 100%<br />naturales</> },
    { id: 'apoyo-campesino', icon: 'support', label: <>Apoyo al<br />campesino local</> },
    { id: 'calidad', icon: 'shield', label: <>Calidad y<br />seguridad</> },
    { id: 'sabor', icon: 'heart', label: <>Sabor<br />auténtico</> },
  ],
  closingNote: 'Más que un snack... es naturaleza en cada bocado',
};

function MainPage() {
  return (
    <div className={tw("main-page-wrapper", "theme-v2")}>
      <Header themeV2 />
      <HeroCarousel />
      <ProductCarousel3D />
 
      <HistorySection content={historyContent} />
 
      <MissionVision />
 
      {/* ── GALERÍA / VIDEOS ── */}
      <section className={tw("media-section", "scroll-mt-24")} id="videos">
        <Videos />
      </section>
 
      {/* ── FOOTER ── */}
      <footer className={tw("footer-main")}>
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
              <li><a href="/#inicio">Inicio</a></li>
              <li><a href="/#historia">Sobre Nosotros</a></li>
              <li><a href="/#features">Características</a></li>
              <li><a href="/#videos">Galería</a></li>
            </ul>
          </div>
 
          {/* Empresa */}
          <div className={tw("footer-col")}>
            <h4 className={tw("footer-col-title")}>Empresa</h4>
            <ul className={tw("footer-links")}>
              <li><a href="/#historia">Nuestra historia</a></li>
              <li><a href="/#historia">Proceso artesanal</a></li>
              <li><a href="/#inicio">Presencia internacional</a></li>
              <li><a href="/#contacto">Distribuidores</a></li>
            </ul>
          </div>
 
          {/* Contacto */}
          <section className={tw("footer-col", "scroll-mt-24")} id="contacto" aria-labelledby="footer-contact-title">
            <h4 className={tw("footer-col-title")} id="footer-contact-title">Contacto</h4>
            <ul className={tw("footer-contact-list")}>
              <li>
                <span className={tw("footer-contact-icon")}><IoLocationOutline /></span>
                <a href="https://www.google.com/maps/search/?api=1&query=Ubat%C3%A9%2C%20Cundinamarca%2C%20Colombia" target="_blank" rel="noopener noreferrer">Ubaté, Cundinamarca - Colombia</a>
              </li>
              <li>
                <span className={tw("footer-contact-icon")}><BsTelephone /></span>
                <a href="tel:+573229683625">+57 322 968 3625</a>
              </li>
              <li>
                <span className={tw("footer-contact-icon")}><MdOutlineMail /></span>
                <a href="mailto:cdisfruta@gmail.com">cdisfruta@gmail.com</a>
              </li>
            </ul>
          </section>
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
