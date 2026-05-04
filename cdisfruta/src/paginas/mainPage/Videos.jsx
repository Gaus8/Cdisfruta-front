import '../../assets/styles/mainPage/videos.css'
import { useEffect, useRef } from 'react';

function Videos() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll('.card');

    const observerOptions = {
      threshold: 0.6 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        const img = entry.target.querySelector('img');

        if (entry.isIntersecting) {
          img.style.opacity = 0;
          video.style.opacity = 1;
          
          // CAMBIO CLAVE: Quitamos el mute antes de reproducir
          video.muted = false; 
          
          video.play().catch(error => {
            // Si el navegador bloquea el audio, lo reproduce silenciado como "plan B"
            console.warn("El navegador bloqueó el audio automático. Reproduciendo en silencio.");
            video.muted = true;
            video.play();
          });
        } else {
          video.pause();
          video.currentTime = 0;
          video.style.opacity = 0;
          img.style.opacity = 1;
          video.muted = true; // Reseteamos a mute por seguridad
        }
      });
    }, observerOptions);

    cards.forEach(card => {
      const video = card.querySelector('video');
      const img = card.querySelector('img');

      img.style.opacity = 1;
      video.style.opacity = 0;

      // Eventos para PC (Hover)
      card.addEventListener('mouseenter', () => {
        img.style.opacity = 0;
        video.style.opacity = 1;
        video.muted = false; // Sonido activo al pasar el mouse
        video.play();
      });

      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
        video.style.opacity = 0;
        img.style.opacity = 1;
      });

      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-videos" ref={sectionRef}>
      <article className="card">
        <div className="card-img-box">
          <img src="/img/cdisfruta_03.webp" alt="Sabor de Ubaté" />
          {/* Quitamos el atributo 'muted' de la etiqueta para que sea opcional */}
          <video src="/videos/CDISFRUTA1.mp4" loop playsInline></video>
        </div>
        <div className="card-text-box">
          <h3>Auténtico sabor de Ubaté</h3>
        </div>
      </article>

      <article className="card">
        <div className="card-img-box">
          <img src="/img/cdisfruta_01.webp" alt="De Ubaté" />
          <video src="/videos/CDISFRUTA2.mp4" loop playsInline></video>
        </div>
        <div className="card-text-box">
          <h3>De Ubaté para el mundo</h3>
        </div>
      </article>

      <article className="card">
        <div className="card-img-box">
          <img src="/img/cdisfruta_05.webp" alt="Ideal" />
          <video src="/videos/CDISFRUTA4.mp4" loop playsInline></video>
        </div>
        <div className="card-text-box">
          <h3>Ideal para cualquier momento</h3>
        </div>
      </article>
    </section>
  );
}

export default Videos;