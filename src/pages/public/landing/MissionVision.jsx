import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './MissionVision.css';
import {
  ACTIVE_BLOB,
  ACTIVE_MISION_SHAPE,
  ACTIVE_VISION_SHAPE_MOBILE,
  ACTIVE_VISION_SHAPE_TABLET,
  ACTIVE_VISION_SHAPE_DESKTOP,
  ORGANIC_SHAPES,
} from './organicShapes.js';
import PurposeScrapCard from './PurposeScrapCard.jsx';
import { PURPOSE_ITEMS } from './purposeItems.js';

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
  const { t } = useTranslation('landing');
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
            <p className="mission-vision__eyebrow">{t('missionVision.eyebrow')}</p>
            <h2 id="purpose-heading">{t('missionVision.title')}</h2>
            <p className="mission-vision__subtitle">{t('missionVision.subtitle')}</p>
            <span className="mission-vision__underline" aria-hidden="true"><i /><i /><i /></span>
          </header>

          <figure className="mission-vision__place" aria-label={t('missionVision.place')}>
            <img
              className="mission-vision__place-photo"
              style={{ '--active-place-blob': `url(#mission-vision-${ACTIVE_BLOB})` }}
              src="/img/ubate-iglesia.webp"
              alt={t('missionVision.churchAlt')}
              width="800"
              height="600"
              loading="lazy"
              onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
            />
            <img className="mission-vision__fruit-art" src="/img/frutas-decorativas.webp" alt="" aria-hidden="true" width="700" height="563" decoding="async" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
            <button
              className="mission-vision__fact-trigger"
              type="button"
              aria-haspopup="dialog"
              onClick={() => fruitFactDialogRef.current?.showModal()}
            >
              <span className="mission-vision__fact-spark" aria-hidden="true">✳</span>
              <span>{t('missionVision.fact')}</span>
            </button>
          </figure>
        </div>

        <div
          className="mission-vision__cards mission-vision__cards--scrapbook"
          style={{
            '--active-mision-shape': `url(#mission-vision-${ACTIVE_MISION_SHAPE})`,
            '--active-vision-shape-mobile': `url(#mission-vision-${ACTIVE_VISION_SHAPE_MOBILE})`,
            '--active-vision-shape-tablet': `url(#mission-vision-${ACTIVE_VISION_SHAPE_TABLET})`,
            '--active-vision-shape-desktop': `url(#mission-vision-${ACTIVE_VISION_SHAPE_DESKTOP})`,
          }}
        >
          {PURPOSE_ITEMS.map((item, index) => {
            const prefix = item.id === 'mision' ? 'purpose.mission' : 'purpose.vision';
            const localizedItem = { ...item, eyebrow: t(`${prefix}Eyebrow`), title: t(`${prefix}Title`), description: t(`${prefix}Description`), alt: t(`${prefix}Alt`), caption: item.id === 'vision' ? t('purpose.caption') : item.caption };
            return <PurposeScrapCard key={item.id} item={localizedItem} index={index} visible={visible} />;
          })}
        </div>
      </div>

      <dialog
        className="fruit-fact-dialog"
        ref={fruitFactDialogRef}
        aria-labelledby="fruit-fact-title"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      >
        <div className="fruit-fact-dialog__card">
          <button className="fruit-fact-dialog__close" type="button" aria-label={t('missionVision.closeFact')} onClick={() => fruitFactDialogRef.current?.close()}>×</button>
          <span className="fruit-fact-dialog__eyebrow">{t('missionVision.factEyebrow')}</span>
          <h2 id="fruit-fact-title">{t('missionVision.factTitle')}</h2>
          <p>{t('missionVision.factBody', { months: t('missionVision.months') })}</p>
        </div>
      </dialog>
    </section>
  );
}
