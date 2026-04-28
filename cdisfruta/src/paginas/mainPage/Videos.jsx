import '../../assets/styles/videos.css'
import { useEffect } from 'react';

function Videos (){

   useEffect(() => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      const video = card.querySelector('video');
      const img = card.querySelector('img');
      img.style.opacity = 1;
      video.style.opacity = 0;
      card.addEventListener('mouseenter', () =>{
        img.style.opacity = 0;
        video.style.opacity = 1;
        video.play();
      })

      card.addEventListener('mouseleave', () =>{
        video.pause();
        video.currentTime = 0;
        video.style.opacity = 0;
        img.style.opacity = 1;
      })
      
 let isPlaying = false;

    card.addEventListener('touchstart', async () => {
       try {
    if (!isPlaying) {
      img.style.opacity = 0;
      video.style.opacity = 1;
      video.currentTime = 0;
      video.muted = false;

      await video.play(); // Usa await para manejar posibles errores
      isPlaying = true;
    } else {
      video.pause();
      video.currentTime = 0;
      video.style.opacity = 0;
      img.style.opacity = 1;
      isPlaying = false;
    }
  } catch (error) {
    console.warn('Error al reproducir el video:', error);
  }
})
      
    });
  }, []);
  return(
    <>
     <section className="section-videos">

          <article className="card">
            <div className="card-img-box">
              <img src="/img/cdisfruta_03.jpg" alt="imagen1" />
              <video src="/videos/CDISFRUTA1.mp4"muted loop></video>
            </div>
            <div className="card-text-box">
              <h3>Auténtico sabor de Ubaté</h3>
            </div>
          </article>
          <article className="card">
            <div className="card-img-box">
              <img src="/img/cdisfruta_01.png" alt="imagen1" />
              <video src="/videos/CDISFRUTA2.mp4" muted loop></video>
            </div>
            <div className="card-text-box">
              <h3>De Ubaté para el mundo</h3>
            </div>
          </article>
          <article className="card">
            <div className="card-img-box">
              <img src="/img/cdisfruta_05.jpg" alt="imagen1" />
              <video src="/videos/CDISFRUTA4.mp4" muted loop></video>
            </div>
            <div className="card-text-box">
              <h3>Ideal para cualquier momento</h3>
            </div>
          </article>
        </section>
    </>
  )
}

export default Videos;