import { useEffect, useRef, useState } from 'react';
import CountUpNumber from './CountUpNumber';
import './HistorySection.css';

function ValueIcon({ name }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };

  return (
    <svg className="history-editorial__value-icon" viewBox="0 0 40 40" aria-hidden="true" {...common}>
      {name === 'leaf' && <><path d="M8 30C9 16 19 8 33 7c0 14-8 24-22 25" /><path d="M8 34c4-8 10-14 18-19" /><path d="M22 27c1-5 5-8 10-9" /></>}
      {name === 'support' && <><path d="M20 5 25 8l6-1 1 7 4 5-4 5-1 7-7-1-4 4-5-4-6 1-1-7-4-5 4-5 1-7 7 1Z" /><path d="M14 20c2-4 5-4 7-1l1 1c2-3 5-3 7 0-1 5-5 8-8 10-3-2-6-5-7-10Z" /></>}
      {name === 'shield' && <><path d="M20 4 32 9v9c0 8-5 14-12 18C13 32 8 26 8 18V9l12-5Z" /><path d="m14 20 4 4 8-9" /></>}
      {name === 'heart' && <path d="M20 33 7 21C-1 12 11 3 20 12 29 3 41 12 33 21L20 33Z" />}
    </svg>
  );
}

function LeafSprig({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 180 150" fill="none" aria-hidden="true">
      <path d="M13 136C54 95 90 55 160 12M47 104C24 103 13 90 15 69c22 3 34 16 32 35Zm33-32C72 52 82 34 106 26c4 23-7 39-26 46Zm-1 2C56 75 42 61 43 39c22 4 35 18 36 35Zm34-31c5 18 20 25 39 19-5-20-20-27-39-19Z" />
    </svg>
  );
}

function TaglineLeaf() {
  return (
    <svg viewBox="0 0 42 50" fill="none" aria-hidden="true">
      <path d="M20 45C22 29 27 16 37 5M23 31C11 31 6 24 7 14c11 1 17 7 16 17Zm3-10C25 10 30 5 39 3c1 10-4 16-13 18Z" />
    </svg>
  );
}

function SmallGlints({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="m9 10 17 15M5 33l18-2M31 5l1 17m13 13 7 2m-8 7 3 6" />
    </svg>
  );
}

function PhotoBadges({ items = [] }) {
  if (!items.length) return null;
  return (
    <ul className="history-editorial__photo-badges" aria-label="Características de nuestros productos">
      {items.map((item) => (
        <li className="history-editorial__photo-badge" key={item.id}>
          <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
            {item.icon === 'leaf' && <><circle cx="20" cy="20" r="18" /><path d="M12 28c1-9 7-15 16-16-1 9-6 15-15 16m-1 3c3-6 7-10 12-14" /></>}
            {item.icon === 'heart' && <><circle cx="20" cy="20" r="18" /><path d="m20 29-9-8c-5-6 3-12 9-6 6-6 14 0 9 6l-9 8Z" /></>}
            {item.icon === 'sprout' && <><circle cx="20" cy="20" r="18" /><path d="M20 29V18m0 4c-6 0-9-4-9-10 6 0 10 4 10 9m-1 2c0-6 4-10 10-10 0 6-4 10-10 10Z" /></>}
          </svg>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function HistoryValue({ item, index }) {
  return (
    <li className="history-editorial__value" style={{ '--value-delay': `${index * 85}ms` }}>
      <ValueIcon name={item.icon} />
      <span>{item.label}</span>
    </li>
  );
}

export default function HistorySection({ content }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const values = (content.values || []).filter((item) => item?.label);
  const photoBadges = (content.photoBadges || []).filter((item) => item?.label);

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

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = node.getBoundingClientRect();
        const offset = Math.max(-12, Math.min(12, (window.innerHeight * 0.55 - bounds.top) * 0.012));
        node.style.setProperty('--history-parallax', `${offset}px`);
      });
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateParallax);
    };
  }, []);

  return (
    <section ref={sectionRef} className="history-editorial" id="historia" data-visible={visible}>
      <svg className="history-editorial__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="history-photo-organic-clip" clipPathUnits="objectBoundingBox">
            <path d="M0 0H1V.87C.88.875.75.9.63.925.48.96.3.98.16.945.09.928.04.902 0 .88Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="history-editorial__visual">
        <div className="history-editorial__photo-frame">
          {content.photo ? (
            <img
              className="history-editorial__photo"
              src={content.photo}
              alt={content.photoAlt || ''}
              width="1200"
              height="900"
              loading="lazy"
              onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
            />
          ) : <span className="history-editorial__photo-placeholder" aria-hidden="true" />}
          <span className="history-editorial__photo-gradient" aria-hidden="true" />
        </div>

        {content.photoTagline && (
          <div className="history-editorial__tagline" aria-label={content.photoTagline}>
            <span>{content.photoTagline}</span>
            <TaglineLeaf />
            <SmallGlints className="history-editorial__tagline-glints" />
          </div>
        )}

        <div className="history-editorial__years" aria-label={`${content.years} años en el mercado`}>
          <SmallGlints className="history-editorial__years-glints history-editorial__years-glints--left" />
          <div className="history-editorial__years-number">
            <strong><CountUpNumber value={content.years} /></strong>
          </div>
          <span className="history-editorial__years-label">años en el mercado</span>
          <SmallGlints className="history-editorial__years-glints history-editorial__years-glints--right" />
        </div>

        <PhotoBadges items={photoBadges} />

        <svg className="history-editorial__base-brush" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="history-brush-gradient" x1="0" x2="1"><stop stopColor="#F28C1B" /><stop offset="1" stopColor="#E8603C" /></linearGradient></defs>
          <path d="M0 18C96 55 173 76 298 74c156-2 276-25 414-32 109-6 209-6 288 3l-3 13c-91-2-169 10-269 23-163 21-297 25-442 13C170 85 77 61 0 35Z" fill="url(#history-brush-gradient)" />
          <path d="M0 44c168 49 312 55 476 39 197-20 354-47 524-34" fill="none" stroke="#F28C1B" strokeWidth="4" strokeLinecap="round" strokeDasharray="1100" strokeDashoffset="1100" />
        </svg>

        <svg className="history-editorial__edge-leaves history-editorial__edge-leaves--top" viewBox="0 0 180 130" fill="none" aria-hidden="true"><path d="M12 101C59 69 103 43 168 15M59 70C41 66 32 53 35 37c17 4 25 14 24 31Zm35-19c-4-18 3-32 21-41 5 17-1 31-21 41Zm-1 2C74 48 68 37 70 21c16 3 24 13 24 32Zm34-20c5 14 17 19 32 13-4-15-17-20-32-13Z" /></svg>
        <svg className="history-editorial__edge-leaves history-editorial__edge-leaves--bottom" viewBox="0 0 180 130" fill="none" aria-hidden="true"><path d="M12 101C59 69 103 43 168 15M59 70C41 66 32 53 35 37c17 4 25 14 24 31Zm35-19c-4-18 3-32 21-41 5 17-1 31-21 41Zm-1 2C74 48 68 37 70 21c16 3 24 13 24 32Zm34-20c5 14 17 19 32 13-4-15-17-20-32-13Z" /></svg>
      </div>

      <div className="history-editorial__content">
        <span className="history-editorial__eyebrow">{content.eyebrow}</span>
        <h2 className="history-editorial__quote">{content.quote}</h2>
        <div className="history-editorial__paragraphs">
          {content.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>

        {values.length > 0 && (
          <ul className={`history-editorial__values${values.length > 4 ? ' history-editorial__values--many' : ''}`} aria-label="Lo que nos representa">
            {values.map((item, index) => <HistoryValue item={item} index={index} key={item.id || `${item.icon}-${index}`} />)}
          </ul>
        )}

        {content.closingNote && (
          <div className="history-editorial__closing">
            <LeafSprig className="history-editorial__closing-leaf" />
            <p>{content.closingNote}</p>
            <svg className="history-editorial__closing-brush" viewBox="0 0 420 44" fill="none" aria-hidden="true"><path d="M8 31C105 7 203 24 315 13c39-4 69-7 97-4M54 37c104-17 189-13 273-21" /></svg>
            <SmallGlints className="history-editorial__closing-glints" />
          </div>
        )}
      </div>
    </section>
  );
}
