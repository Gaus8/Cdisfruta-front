import React, { useState } from 'react';
import '../../assets/styles/mainPage/carrusel.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const CarruselProductos = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const productos = [

    {
      img: "/img/cdisfruta_01.jpg",
      titulo: "CDISFRUTA EN AUSTRALIA",
      desc: "Nuestras aromáticas cruzando fronteras. Sabor colombiano en Melbourne."
    },

    {
      img: "/img/cdisfruta_02.jpg",
      titulo: "FRUTAS DESHIDRATADAS",
      desc: "Un snack saludable y práctico, 100% natural de Ubaté."
    },

    {
      img: "/img/cdisfruta_03.jpg",
      titulo: "TRADICIÓN DE UBATÉ",
      desc: "Llevamos el alma de nuestra tierra en cada mezcla de hierbas y frutas."
    }
  ];

  return (
    <section id="seccion-productos-contenedor">
      {/* Columna Izquierda: Texto Fijo que se actualiza con el index */}
      <div className="slide-content-text">
        <div className="text-wrapper">
          <span className="badge">Selección Especial</span>
          <h4>{productos[activeIndex].titulo}</h4>
          <p>{productos[activeIndex].desc}</p>
          <div className="slide-actions">
            <button className="btn-primary">COMPRAR</button>
            <button className="btn-secondary">INFO</button>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Carrusel de Imágenes */}
      <div className="slide-content-image">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect={'fade'}
          speed={1000}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          pagination={{ clickable: true }}
          navigation={true}
          className="mySwiper"
        >
          {productos.map((prod, index) => (
            <SwiperSlide key={index}>
              <img src={prod.img} alt={prod.titulo} className="img-full-slide" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CarruselProductos;