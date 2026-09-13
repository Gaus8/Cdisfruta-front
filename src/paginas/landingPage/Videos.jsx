import '../../assets/styles/mainPage/videos.css';
import { useState, useRef } from 'react';

const PlayIcon = () => (
  <svg className="play-icon" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="play-icon" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

function Videos() {
  const sectionRef = useRef(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  const videoData = [
    { src: "/videos/CDISFRUTA1.mp4", img: "/img/cdisfruta_03.webp", alt: "Sabor de Ubaté", title: "Auténtico sabor de Ubaté" },
    { src: "/videos/CDISFRUTA2.mp4", img: "/img/cdisfruta_01.webp", alt: "De Ubaté", title: "De Ubaté para el mundo" },
    { src: "/videos/CDISFRUTA4.mp4", img: "/img/cdisfruta_05.webp", alt: "Ideal", title: "Ideal para cualquier momento" },
  ];

  const handleCardClick = (index) => {
    const cards = sectionRef.current.querySelectorAll('.card');

    cards.forEach((card, i) => {
      const video = card.querySelector('video');
      const img = card.querySelector('img');

      if (i === index) {
        if (playingIndex === index) {
          // Pausar
          video.pause();
          video.currentTime = 0;
          video.style.opacity = 0;
          img.style.opacity = 1;
          video.muted = true;
          setPlayingIndex(null);
        } else {
          // Reproducir
          img.style.opacity = 0;
          video.style.opacity = 1;
          video.muted = false;

          video.play().catch(() => {
            video.muted = true;
            video.play();
          });
          setPlayingIndex(index);
        }
      } else {
        // Detener los demás
        video.pause();
        video.currentTime = 0;
        video.style.opacity = 0;
        img.style.opacity = 1;
        video.muted = true;
      }
    });
  };

  return (
    <section className="section-videos" ref={sectionRef}>
      {videoData.map((data, index) => {
        const isPlaying = playingIndex === index;

        return (
          <article 
            className="card" 
            key={index} 
            onClick={() => handleCardClick(index)}
          >
            <div className="card-img-box">
              <img src={data.img} alt={data.alt} />
              <video src={data.src} loop playsInline muted></video>

              {/* Capa superpuesta con clase dinámica según reproducción */}
              <div className={`play-overlay ${isPlaying ? 'is-playing' : ''}`}>
                <div className="icon-wrapper">
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </div>
              </div>
            </div>

            <div className="card-text-box">
              <h3>{data.title}</h3>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default Videos;