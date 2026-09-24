import { tw } from '../../funciones/tw.js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaGlobeAmericas, FaLeaf, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { URL_SERVER } from '../../funciones/conexion';
import Registro from '../usuariosAuth/Registro';
import Login from '../usuariosAuth/Login';

const contenidoPredeterminado = [
  {
    img: '/img/cdisfruta_01.webp',
    iconKey: 'globe',
    eyebrow: 'Presencia internacional',
    titulo: 'CDISFRUTA en Australia',
    desc: 'Nuestras aromáticas llegando a nuevos destinos. Sabor colombiano presente en Melbourne.',
    tag: 'Australia · Melbourne',
    detalle: 'Nuestra expansión internacional comenzó con el sueño de llevar el sabor de Ubaté al mundo. Hoy, nuestras infusiones se disfrutan en Melbourne por diversas familias, destacando por su origen natural y procesos artesanales.',
    icon: <FaGlobeAmericas />
  },
  {
    img: '/img/cdisfruta_02.webp',
    iconKey: 'leaf',
    eyebrow: 'Producto destacado',
    titulo: 'Aromáticas frutales',
    desc: 'Infusiones naturales elaboradas con frutas seleccionadas, que brindan sabor, frescura y bienestar en cada taza.',
    tag: '100% Natural',
    detalle: 'Seleccionamos cada fruta en su punto exacto de maduración. Nuestro proceso de deshidratado lento conserva todas las propiedades vitamínicas y el aroma intenso que nos caracteriza.',
    icon: <FaLeaf />
  },
  {
    img: '/img/cdisfruta_07.webp',
    iconKey: 'location',
    eyebrow: 'Nuestra tierra',
    titulo: 'Tradición de Ubaté',
    desc: 'Reflejamos la riqueza de nuestra tierra en cada mezcla, con frutas y hierbas cuidadosamente seleccionadas.',
    tag: 'Ubaté · Cundinamarca',
    detalle: 'CDISFRUTA nace en el corazón de la provincia de Ubaté. Trabajamos de la mano con productores locales, asegurando frescura y apoyando el crecimiento de nuestra comunidad campesina.',
    icon: <FaMapMarkerAlt />
  },
];

const iconos = { globe: <FaGlobeAmericas />, leaf: <FaLeaf />, location: <FaMapMarkerAlt /> };

const CarruselProductos = () => {
  const [productos, setProductos] = useState(contenidoPredeterminado);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [abrirRegistro, setAbrirRegistro] = useState(false)
  const [abrirLogin, setAbrirLogin] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex(index => (index + 1) % productos.length), 4500);
    return () => window.clearInterval(timer);
  }, [productos.length]);
  useEffect(() => {
    fetch(`${URL_SERVER}/portada`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error('No se pudo cargar la portada')))
      .then(slides => { if (Array.isArray(slides) && slides.length) setProductos(slides); })
      .catch(error => console.error('Se conservará el contenido local de portada:', error));
  }, []);

  const current = productos[activeIndex] || productos[0];

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Bloquea el scroll
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = ''; // Libera el scroll
  };




  return (
    <section className={tw("carrusel-section")} id="carrusel">

      {/* ── Columna de texto ── */}
      <div className={tw("carrusel-text")}>
        <div className={tw("carrusel-text-inner")}>
          <span className={tw("carrusel-eyebrow")}>{current.eyebrow}</span>
          <h2 className={tw("carrusel-title")} key={activeIndex}>
            {current.titulo}
          </h2>
          <p className={tw("carrusel-desc")} key={`d-${activeIndex}`}>
            {current.desc}
          </p>
          <div className={tw("carrusel-actions")}>
            <button
              className={tw("car-btn car-btn--fill")}
              onClick={() => setAbrirRegistro(true)}
            >
              Comprar ahora
            </button>
            {
              abrirRegistro && (
                <Registro
                  cerrar={() => setAbrirRegistro(false)}
                  irLogin={() => { setAbrirRegistro(false); setAbrirLogin(true); }}
                />
              )
            }
            {abrirLogin && (
              <Login
                cerrar={() => setAbrirLogin(false)}
                irRegistro={() => { setAbrirLogin(false); setAbrirRegistro(true); }}
              />
            )}
            <button
              className={tw("car-btn car-btn--line")}
              onClick={openModal} // Abre el modal
            >
              Más información →
            </button>
          </div>

          <div className={tw("carrusel-indicators")}>
            {productos.map((p, i) => (
              <button
                key={i}
                className={tw(`car-dot${i === activeIndex ? ' car-dot--active' : ''}`)}
                onClick={() => setActiveIndex(i)} // Opcional: permite saltar de slide
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Columna de imagen ── */}
      <div className={tw("carrusel-image")}>
        <img key={current.img} src={current.img} alt={current.titulo} className="absolute inset-0 block h-full w-full object-cover animate-[fadeIn_1s_ease]" />
        <div className={tw("carrusel-img-label")}>
          <span className={tw("cil-tag")}>{current.etiqueta || current.eyebrow}</span>
          <span className={tw("cil-name")}>{current.tag}</span>
        </div>
        <button type="button" aria-label="Diapositiva anterior" onClick={() => setActiveIndex(index => (index - 1 + productos.length) % productos.length)} className="absolute left-5 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#E8583A]/75"><FaChevronLeft /></button>
        <button type="button" aria-label="Diapositiva siguiente" onClick={() => setActiveIndex(index => (index + 1) % productos.length)} className="absolute right-5 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#E8583A]/75"><FaChevronRight /></button>
      </div>

      {/* ── MODAL DE INFORMACIÓN ── */}
      {showModal && (
        <div className={tw("car-modal-overlay")} onClick={closeModal}>
          <div className={tw("car-modal-content")} onClick={e => e.stopPropagation()}>
            <button className={tw("car-modal-close")} onClick={closeModal}><FaTimes /></button>

            <div className={tw("car-modal-body")}>
              <div className={tw("car-modal-icon")}>{iconos[current.iconKey] || <FaLeaf />}</div>
              <span className={tw("car-modal-eyebrow")}>{current.eyebrow}</span>
              <h3>{current.titulo}</h3>
              <p className={tw("car-modal-detail")}>{current.detalle}</p>
              <div className={tw("car-modal-footer")}>
                <span className={tw("car-modal-tag")}>{current.tag}</span>
                <button
                  className={tw("car-btn car-btn--fill")}
                  onClick={() => { closeModal(); navigate('/dashboard_usuario'); }}
                >
                  Ver en la tienda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CarruselProductos;
