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
      <span className="mission-vision__shape mission-vision__shape--right" aria-hidden="true" />

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
            <span className="mission-vision__fruit" aria-hidden="true">
              <img src="/img/cdisfruta_06.webp" alt="" loading="lazy" />
            </span>
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
