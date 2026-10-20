import { useEffect, useRef, useState } from 'react';
import './MissionVision.css';
import { ACTIVE_BLOB, ACTIVE_MISION_SHAPE, ACTIVE_VISION_SHAPE, ORGANIC_SHAPES } from './organicShapes.js';
import PurposeScrapCard from './PurposeScrapCard.jsx';

const PURPOSE_ITEMS = [
  {
    id: 'mision',
    eyebrow: 'Nuestra misión',
    title: 'Bienestar que nace de la tierra',
    description: 'Transformamos frutas de nuestra región en snacks y aromáticas naturales, elaborados con cuidado junto a familias campesinas, para compartir bienestar y sabor auténtico.',
    image: '/img/cdisfruta_06.webp',
    alt: 'Productos CDISFRUTA y frutas deshidratadas sobre una mesa de madera',
    icon: 'mision',
    shape: 'fotoMision',
  },
  {
    id: 'vision',
    eyebrow: 'Nuestra visión',
    title: 'El sabor de Ubaté llega más lejos',
    description: 'Queremos ser una marca colombiana reconocida por innovar con productos naturales, fortalecer el origen campesino y llevar el sabor de Ubaté a nuevos mercados.',
    image: '/img/cdisfruta_07.webp',
    alt: 'Bolsa de aromáticas CDISFRUTA rodeada de fruta fresca y deshidratada',
    icon: 'vision',
    caption: 'Sabor de nuestra tierra',
    shape: 'fotoVision',
  },
];

function OrganicClipPaths() {
  return (
    <svg className="mission-vision__clip-defs" aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(ORGANIC_SHAPES).map(([name, path]) => (
          <clipPath id={`mission-vision-${name}`} clipPathUnits="objectBoundingBox" key={name}>
            <path d={path} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}

export default function MissionVision() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const fruitFactDialogRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const updateParallax = () => {
      const bounds = node.getBoundingClientRect();
      const offset = Math.max(-2, Math.min(2, (window.innerHeight / 2 - bounds.top) * 0.004));
      node.style.setProperty('--fruit-parallax', `${offset}px`);
      node.style.setProperty('--leaf-parallax', `${-offset * 0.45}px`);
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    return () => window.removeEventListener('scroll', updateParallax);
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      aria-labelledby="purpose-heading"
      className="mission-vision"
      data-visible={visible ? 'true' : 'false'}
    >
      <OrganicClipPaths />
      <span className="mission-vision__shape mission-vision__shape--left" aria-hidden="true" />
      <span className="mission-vision__shape mission-vision__shape--left-orbit" aria-hidden="true" />
      <span className="mission-vision__shape mission-vision__shape--right-petal" aria-hidden="true" />
      <svg className="mission-vision__botanical" viewBox="0 0 120 220" fill="none" aria-hidden="true">
        <path d="M18 211C35 154 48 92 104 10M35 154c-20-2-29-13-31-31 18 2 29 12 31 31Zm21-48c-2-20 7-32 24-40 2 19-7 32-24 40Zm-1 1c-19-3-29-14-31-32 18 3 29 14 31 32Zm28-49c0-18 9-29 26-35 0 18-9 29-26 35Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="mission-vision__inner">
        <div className="mission-vision__intro">
          <header className="mission-vision__heading">
            <p className="mission-vision__eyebrow">Nuestra brújula</p>
            <h2 id="purpose-heading">Un propósito que crece con la tierra</h2>
            <p className="mission-vision__subtitle">Tradición campesina, ideas frescas y una mirada puesta en el futuro.</p>
            <span className="mission-vision__underline" aria-hidden="true"><i /><i /><i /></span>
          </header>

          <figure className="mission-vision__place" aria-label="Paisaje e iglesia de Ubaté">
            <img
              className="mission-vision__place-photo"
              style={{ '--active-place-blob': `url(#mission-vision-${ACTIVE_BLOB})` }}
              src="/img/ubate-iglesia.png"
              alt="Iglesia y paisaje de Ubaté, Cundinamarca"
              width="1024"
              height="768"
              loading="lazy"
              onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
            />
            <img className="mission-vision__fruit-art" src="/img/frutas-decorativas.png" alt="" aria-hidden="true" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
            <button
              className="mission-vision__fact-trigger"
              type="button"
              aria-haspopup="dialog"
              onClick={() => fruitFactDialogRef.current?.showModal()}
            >
              <span className="mission-vision__fact-spark" aria-hidden="true">✳</span>
              <span>¿Sabías que?</span>
            </button>
          </figure>
        </div>

        <div
          className="mission-vision__cards mission-vision__cards--scrapbook"
          style={{
            '--active-mision-shape': `url(#mission-vision-${ACTIVE_MISION_SHAPE})`,
            '--active-vision-shape': `url(#mission-vision-${ACTIVE_VISION_SHAPE})`,
          }}
        >
          {PURPOSE_ITEMS.map((item, index) => <PurposeScrapCard key={item.id} item={item} index={index} visible={visible} />)}
        </div>
      </div>

      <dialog
        className="fruit-fact-dialog"
        ref={fruitFactDialogRef}
        aria-labelledby="fruit-fact-title"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      >
        <div className="fruit-fact-dialog__card">
          <button className="fruit-fact-dialog__close" type="button" aria-label="Cerrar dato curioso" onClick={() => fruitFactDialogRef.current?.close()}>×</button>
          <span className="fruit-fact-dialog__eyebrow">Aprovechamiento y Calidad CDISFRUTA</span>
          <h2 id="fruit-fact-title">Fruta deshidratada: sabor y duración óptima</h2>
         <p>Nuestra inspiración es sacarle el mayor aprovechamiento a esta fruta; por ello, conservan su máxima calidad entre <span style={{ color: '#d9381e', backgroundColor: '#fde8e5', padding: '2px 6px', borderRadius: '4px' }}>6 y 12 meses</span> mediante un óptimo almacenamiento.</p>
        </div>
      </dialog>
    </section>
  );
}
