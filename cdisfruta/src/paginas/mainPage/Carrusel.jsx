import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/mainPage/carrusel.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FaTimes, FaGlobeAmericas, FaLeaf, FaMapMarkerAlt } from 'react-icons/fa'; // Iconos decorativos

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const productos = [
  {
    img: '/img/cdisfruta_01.webp',
    eyebrow: 'Presencia internacional',
    titulo: 'CDISFRUTA en Australia',
    desc: 'Nuestras aromáticas llegando a nuevos destinos. Sabor colombiano presente en Melbourne.',
    tag: 'Australia · Melbourne',
    detalle: 'Nuestra expansión internacional comenzó con el sueño de llevar el sabor de Ubaté al mundo. Hoy, nuestras infusiones se disfrutan en Melbourne por diversas familias, destacando por su origen natural y procesos artesanales.',
    icon: <FaGlobeAmericas />
  },
  {
    img: '/img/cdisfruta_02.webp',
    eyebrow: 'Producto destacado',
    titulo: 'Aromáticas frutales',
    desc: 'Infusiones naturales elaboradas con frutas seleccionadas, que brindan sabor, frescura y bienestar en cada taza.',
    tag: '100% Natural',
    detalle: 'Seleccionamos cada fruta en su punto exacto de maduración. Nuestro proceso de deshidratado lento conserva todas las propiedades vitamínicas y el aroma intenso que nos caracteriza.',
    icon: <FaLeaf />
  },
  {
    img: '/img/cdisfruta_07.webp',
    eyebrow: 'Nuestra tierra',
    titulo: 'Tradición de Ubaté',
    desc: 'Reflejamos la riqueza de nuestra tierra en cada mezcla, con frutas y hierbas cuidadosamente seleccionadas.',
    tag: 'Ubaté · Cundinamarca',
    detalle: 'CDISFRUTA nace en el corazón de la provincia de Ubaté. Trabajamos de la mano con productores locales, asegurando frescura y apoyando el crecimiento de nuestra comunidad campesina.',
    icon: <FaMapMarkerAlt />
  },
];

const CarruselProductos = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const current = productos[activeIndex];

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Bloquea el scroll
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = ''; // Libera el scroll
  };

  return (
    <section className="carrusel-section" id="carrusel">
      
      {/* ── Columna de texto ── */}
      <div className="carrusel-text">
        <div className="carrusel-text-inner">
          <span className="carrusel-eyebrow">{current.eyebrow}</span>
          <h2 className="carrusel-title" key={activeIndex}>
            {current.titulo}
          </h2>
          <p className="carrusel-desc" key={`d-${activeIndex}`}>
            {current.desc}
          </p>
          <div className="carrusel-actions">
            <button 
              className="car-btn car-btn--fill" 
              onClick={() => navigate('/dashboard_usuario')} 
            >
              Comprar ahora
            </button>
            
            <button 
              className="car-btn car-btn--line" 
              onClick={openModal} // Abre el modal
            >
              Más información →
            </button>
          </div>

          <div className="carrusel-indicators">
            {productos.map((p, i) => (
              <button
                key={i}
                className={`car-dot${i === activeIndex ? ' car-dot--active' : ''}`}
                onClick={() => setActiveIndex(i)} // Opcional: permite saltar de slide
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Columna de imagen ── */}
      <div className="carrusel-image">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1000}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          navigation={true}
          className="carrusel-swiper"
        >
          {productos.map((prod, index) => (
            <SwiperSlide key={index}>
              <img src={prod.img} alt={prod.titulo} className="carrusel-img" />
              <div className="carrusel-img-label">
                <span className="cil-tag">{prod.eyebrow}</span>
                <span className="cil-name">{prod.tag}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── MODAL DE INFORMACIÓN ── */}
      {showModal && (
        <div className="car-modal-overlay" onClick={closeModal}>
          <div className="car-modal-content" onClick={e => e.stopPropagation()}>
            <button className="car-modal-close" onClick={closeModal}><FaTimes /></button>
            
            <div className="car-modal-body">
              <div className="car-modal-icon">{current.icon}</div>
              <span className="car-modal-eyebrow">{current.eyebrow}</span>
              <h3>{current.titulo}</h3>
              <p className="car-modal-detail">{current.detalle}</p>
              <div className="car-modal-footer">
                <span className="car-modal-tag">{current.tag}</span>
                <button 
                  className="car-btn car-btn--fill" 
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