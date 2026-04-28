import React, { useState } from 'react';
import '../../assets/styles/mainPage/carrusel.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const productos = [
  {
    img: '/img/cdisfruta_01.jpg',
    eyebrow: 'Presencia internacional',
    titulo: 'CDISFRUTA en Australia',
    desc: 'Nuestras aromáticas llegando a nuevos destinos. Sabor colombiano presente en Melbourne.',
    tag: 'Australia · Melbourne',
  },
  {
    img: '/img/cdisfruta_02.jpg',
    eyebrow: 'Producto destacado',
    titulo: 'Aromaticas frutales',
    desc: 'Infusiones naturales elaboradas con frutas seleccionadas, que brindan sabor, frescura y bienestar en cada taza.',
    tag: '100% Natural',
  },
  {
    img: '/img/cdisfruta_03.jpg',
    eyebrow: 'Nuestra tierra',
    titulo: 'Tradición de Ubaté',
    desc: 'Reflejamos la riqueza de nuestra tierra en cada mezcla, con frutas y hierbas cuidadosamente seleccionadas.',
    tag: 'Ubaté · Cundinamarca',
  },
];
 
const CarruselProductos = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = productos[activeIndex];
 
  return (
    <section className="carrusel-section" id="carrusel">
 
      {/* ── Columna de texto (40%) ── */}
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
            <button className="car-btn car-btn--fill">Comprar ahora</button>
            <button className="car-btn car-btn--line">Más información →</button>
          </div>
 
          {/* Indicadores de slide */}
          <div className="carrusel-indicators">
            {productos.map((p, i) => (
              <button
                key={i}
                className={`car-dot${i === activeIndex ? ' car-dot--active' : ''}`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Columna de imagen (60%) ── */}
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
              <img
                src={prod.img}
                alt={prod.titulo}
                className="carrusel-img"
              />
              {/* Etiqueta flotante sobre la imagen */}
              <div className="carrusel-img-label">
                <span className="cil-tag">{prod.eyebrow}</span>
                <span className="cil-name">{prod.tag}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
 
export default CarruselProductos;