import { useEffect, useState } from 'react';
import { URL_SERVER } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const fallbackImages = ['/img/cdisfruta_01.webp', '/img/cdisfruta_02.webp', '/img/cdisfruta_07.webp'];

export default function AuthBackground() {
  const [images, setImages] = useState(fallbackImages);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetch(`${URL_SERVER}/portada`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Portada no disponible')))
      .then((slides) => {
        if (!mounted || !Array.isArray(slides)) return;
        const available = slides.map((slide) => slide.img).filter(Boolean);
        if (available.length) setImages(available);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % images.length), 5000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return <div aria-hidden="true" className={tw('pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950')}>
    {images.map((image, index) => <img key={image} src={image} alt="" className={tw('absolute inset-0 h-full w-full scale-105 object-cover blur-[3px] transition-opacity duration-1000', index === active ? 'opacity-100' : 'opacity-0')} />)}
    <div className={tw('absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-950/60 to-orange-950/65')} />
    <div className={tw('absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,126,95,0.18),transparent_45%)]')} />
  </div>;
}
