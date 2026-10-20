import { useEffect, useRef, useState } from 'react';
import './MissionVision.css';
import { ACTIVE_BLOB, ORGANIC_SHAPES } from './organicShapes.js';

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

function PurposeIcon({ type }) {
  return (
    <span className="purpose-card__icon" aria-hidden="true">
      {type === 'mision' ? (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 21v-9m0 3C7 15 5 12 5 7c5 0 8 2 8 7m-1 1c0-5 3-8 8-8 0 5-2 8-8 8Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.2 2.1" />
          <path d="m15.7 8.2-2.5 5.1-4.9 2.5 2.5-5 4.9-2.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}

export default function MissionVision() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

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
      const offset = Math.max(-10, Math.min(10, (window.innerHeight / 2 - bounds.top) * 0.018));
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
            <img className="mission-vision__decor-art" src="/img/brujula-hojas-trazos.png" alt="" aria-hidden="true" loading="lazy" />
            <svg className="mission-vision__leaf" viewBox="0 0 80 104" fill="none" aria-hidden="true">
              <path d="M8 92C19 61 37 30 70 8M25 60C9 60 4 50 5 37c14 1 22 8 20 23Zm14-20C38 25 45 15 59 10c2 14-5 24-20 30Zm-1 1C23 39 16 30 16 18c13 1 21 8 22 23Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <img className="mission-vision__fruit-art" src="/img/frutas-decorativas.png" alt="" aria-hidden="true" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          </figure>
        </div>

        <div className="mission-vision__cards">
          {PURPOSE_ITEMS.map((item, index) => (
            <article
              className="purpose-card"
              key={item.id}
              data-shape={item.shape}
              style={{ '--purpose-delay': `${index * 120}ms` }}
            >
              <div className={`purpose-card__photo purpose-card__photo--${item.id}`}>
                <img src={item.image} alt={item.alt} loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
              </div>
              <div className="purpose-card__body">
                <PurposeIcon type={item.icon} />
                <p className="purpose-card__eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p className="purpose-card__description">{item.description}</p>
                <div className="purpose-card__rule" aria-hidden="true"><span /><i /></div>
                <span className="purpose-card__arrow" aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
