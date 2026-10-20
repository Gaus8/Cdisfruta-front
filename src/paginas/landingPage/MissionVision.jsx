import { useEffect, useRef, useState } from 'react';
import './MissionVision.css';

const PURPOSE_ITEMS = [
  {
    id: 'mision',
    number: '01',
    eyebrow: 'Nuestra misión',
    title: 'Bienestar que nace de la tierra',
    description: 'Transformamos frutas de nuestra región en snacks y aromáticas naturales, elaborados con cuidado junto a familias campesinas, para compartir bienestar y sabor auténtico.',
    image: '/img/cdisfruta_06.webp',
    alt: 'Productos CDISFRUTA y frutas deshidratadas sobre una mesa de madera',
  },
  {
    id: 'vision',
    number: '02',
    eyebrow: 'Nuestra visión',
    title: 'El sabor de Ubaté llega más lejos',
    description: 'Queremos ser una marca colombiana reconocida por innovar con productos naturales, fortalecer el origen campesino y llevar el sabor de Ubaté a nuevos mercados.',
    image: '/img/cdisfruta_07.webp',
    alt: 'Bolsa de aromáticas CDISFRUTA rodeada de fruta fresca y deshidratada',
  },
];

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

  return (
    <section
      id="features"
      ref={sectionRef}
      aria-labelledby="purpose-heading"
      className="mission-vision"
      data-visible={visible ? 'true' : 'false'}
    >
      <span className="mission-vision__shape mission-vision__shape--left" aria-hidden="true" />
      <span className="mission-vision__shape mission-vision__shape--left-orbit" aria-hidden="true" />
      <span className="mission-vision__shape mission-vision__shape--right" aria-hidden="true" />
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
              src="/img/ubate-iglesia.png"
              alt="Iglesia y paisaje de Ubaté, Cundinamarca"
              width="1024"
              height="768"
              loading="lazy"
            />
            <span className="mission-vision__leaf" aria-hidden="true" />
            <img className="mission-vision__fruit-art" src="/img/frutas-decorativas.png" alt="" aria-hidden="true" loading="lazy" />
          </figure>
        </div>

        <div className="mission-vision__cards">
          {PURPOSE_ITEMS.map((item, index) => (
            <article
              className="purpose-card"
              key={item.id}
              style={{ '--purpose-delay': `${index * 100}ms` }}
            >
              <div className="purpose-card__photo">
                <img src={item.image} alt={item.alt} loading="lazy" />
              </div>
              <div className="purpose-card__body">
                <span className="purpose-card__number" aria-hidden="true">{item.number}</span>
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
