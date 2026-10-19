import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { tw } from '../../funciones/tw.js';
import Registro from '../usuariosAuth/Registro';
import Login from '../usuariosAuth/Login';

const BRAND_PLACEHOLDER = '/img/logo_cdisfruta.webp';

function HeroSkeleton() {
  return <section id="inicio" aria-label="Cargando banners de portada" className={tw('scroll-mt-24 bg-[#FAEFE6] px-4 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-12')}>
    <div className={tw('mx-auto flex max-w-3xl flex-col items-center gap-4 text-center')}>
      <div className={tw('h-3 w-44 animate-pulse rounded-full bg-orange-200')} />
      <div className={tw('h-12 w-3/4 max-w-xl animate-pulse rounded-xl bg-orange-100')} />
      <div className={tw('h-10 w-full max-w-lg animate-pulse rounded-xl bg-orange-100')} />
      <div className={tw('flex gap-3')}><div className={tw('h-11 w-36 animate-pulse rounded-full bg-orange-200')} /><div className={tw('h-11 w-40 animate-pulse rounded-full bg-orange-100')} /></div>
    </div>
    <div className={tw('mx-auto mt-10 flex h-[300px] max-w-5xl items-center justify-center gap-3 overflow-hidden sm:h-[390px]')}>
      {[0, 1, 2, 3, 4].map((item) => <div key={item} className={tw('aspect-[3/4] w-[22vw] max-w-[260px] animate-pulse rounded-[28px] bg-orange-100', item !== 2 && 'opacity-60')} />)}
    </div>
  </section>;
}

export default function HeroCarousel3D({ banners = [], loading = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sideCount, setSideCount] = useState(3);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const pointerStart = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveIndex((current) => Math.max(0, Math.min(current, banners.length - 1)));
  }, [banners]);

  useEffect(() => {
    const updateSlots = () => setSideCount(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    updateSlots();
    window.addEventListener('resize', updateSlots, { passive: true });
    return () => window.removeEventListener('resize', updateSlots);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  const current = banners[activeIndex] || null;

  const move = useCallback((direction) => {
    if (banners.length < 2) return;
    setActiveIndex((index) => (index + direction + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length < 2 || paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [move, paused, banners.length, reducedMotion]);

  useEffect(() => {
    if (!showDetails) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => { if (event.key === 'Escape') setShowDetails(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [showDetails]);

  const virtualCards = useMemo(() => {
    if (banners.length <= 1) return banners.map((banner, index) => ({ banner, index, offset: 0 }));
    return Array.from({ length: sideCount * 2 + 1 }, (_, slot) => {
      const offset = slot - sideCount;
      const index = (activeIndex + offset + banners.length * 10) % banners.length;
      return { banner: banners[index], index, offset };
    });
  }, [activeIndex, banners, sideCount]);

  if (loading) return <HeroSkeleton />;
  if (!banners.length || !current) return null;

  const screenWidth = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const spacing = screenWidth < 640 ? Math.min(126, screenWidth * 0.35) : screenWidth < 1024 ? 155 : Math.min(190, screenWidth / 6);
  const cardWidth = screenWidth < 640 ? 'min(66vw, 232px)' : 'clamp(210px, 24vw, 292px)';
  const transitionTime = reducedMotion ? '0ms' : '500ms';
  const getImage = (banner) => banner.img || BRAND_PLACEHOLDER;

  return <section
    id="inicio"
    role="region"
    aria-roledescription="carrusel de portada"
    aria-label="Historias y productos de CDISFRUTA"
    tabIndex={0}
    className={tw('scroll-mt-24 overflow-hidden bg-[#FAEFE6] px-4 pb-10 pt-9 outline-none sm:px-8 sm:pb-12 sm:pt-12 lg:px-10', '[font-family:var(--font-display)]', 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E8603C]')}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onFocus={() => setPaused(true)}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    onKeyDown={(event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    }}
    onPointerDown={(event) => { pointerStart.current = event.clientX; }}
    onPointerUp={(event) => {
      if (pointerStart.current === null) return;
      const delta = event.clientX - pointerStart.current;
      if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
      pointerStart.current = null;
    }}
    onPointerCancel={() => { pointerStart.current = null; }}
  >
    <div key={current._id || activeIndex} className={tw('mx-auto flex min-h-[240px] max-w-4xl flex-col items-center justify-center text-center animate-[fadeSlideUp_.35s_ease_both] motion-reduce:animate-none sm:min-h-[260px]')}>
      <p className={tw('mb-5 line-clamp-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#E8603C] sm:mb-6 sm:text-xs')}>{current.eyebrow}</p>
      <h1 className={tw('line-clamp-2 max-w-4xl text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-.03em] text-[#2D1B0A]')}>{current.titulo}</h1>
      <p className={tw('mt-5 max-w-[650px] whitespace-pre-line break-words text-[13px] leading-[1.8] text-[#8B6652] sm:mt-6 sm:text-sm')} style={{ fontFamily: 'var(--font-mono)' }}>{current.desc}</p>
      <div className={tw('mt-6 flex flex-wrap justify-center gap-3 sm:mt-8')}>
        <button type="button" onClick={() => setShowRegister(true)} className={tw('inline-flex min-h-11 items-center justify-center rounded-full bg-[#E8603C] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(232,96,60,.25)] transition hover:-translate-y-0.5 hover:bg-[#C4431F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D1B0A]')}>{current.textoBotonPrincipal || 'Comprar ahora'}</button>
        <button type="button" onClick={() => setShowDetails(true)} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#E4D4C7] bg-white/60 px-6 text-sm font-bold text-[#2D1B0A] transition hover:border-[#E8603C] hover:text-[#C4431F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C]')}>{current.textoBotonSecundario || 'Más información'} <span aria-hidden="true">→</span></button>
      </div>
    </div>

    <div className={tw('relative mx-auto mt-7 h-[310px] max-w-[1400px] touch-pan-y sm:mt-9 sm:h-[390px] lg:mt-10 lg:h-[430px]')}>
      {banners.length > 1 && <button type="button" aria-label="Banner anterior" onClick={() => move(-1)} className={tw('absolute left-0 top-1/2 z-40 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#ead9cb] bg-white/90 text-[#6d4c37] shadow-md transition hover:border-[#E8603C] hover:text-[#E8603C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C] sm:left-2 sm:size-12')}><FaChevronLeft /></button>}
      <div className={tw('absolute inset-0 [perspective:1200px] [transform-style:preserve-3d]')} aria-live="off">
        {virtualCards.map(({ banner, index, offset }, virtualIndex) => {
          const isCenter = offset === 0;
          const scale = isCenter ? 1 : Math.max(0.82, 0.88 - Math.abs(offset) * 0.025);
          const imageLabel = banner.tag || banner.etiqueta || banner.eyebrow;
          return <article key={`${banner._id || index}-${offset}-${virtualIndex}`} className={tw('group absolute left-1/2 top-1/2 select-none transition-[transform,opacity,filter] ease-out', !isCenter && 'cursor-pointer')} style={{
            width: cardWidth,
            transform: `translate(calc(-50% + ${offset * spacing}px), -50%) rotateY(${offset === 0 ? 0 : offset < 0 ? 18 : -18}deg) scale(${scale})`,
            opacity: isCenter ? 1 : Math.max(0.55, 0.86 - Math.abs(offset) * 0.075),
            filter: isCenter ? 'brightness(1)' : `brightness(${Math.max(0.72, 0.93 - Math.abs(offset) * 0.055)})`,
            zIndex: 30 - Math.abs(offset),
            transitionDuration: transitionTime
          }} onClick={() => { if (!isCenter) setActiveIndex(index); }}>
            <div className={tw('relative aspect-[3/4] overflow-hidden rounded-[28px] border border-white/70 bg-[#f2dfd1] shadow-[0_18px_48px_rgba(84,48,25,.2)] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_28px_60px_rgba(195,67,31,.3)] motion-reduce:transition-none', isCenter && 'shadow-[0_24px_58px_rgba(195,67,31,.28)]')}>
              <button type="button" tabIndex={isCenter ? 0 : -1} onClick={() => setActiveIndex(index)} aria-label={`Mostrar banner: ${banner.titulo}`} className={tw('absolute inset-0 h-full w-full cursor-pointer focus-visible:z-20 focus-visible:outline-4 focus-visible:outline-[#E8603C]')}>
                <img src={getImage(banner)} alt={banner.titulo || 'Banner CDISFRUTA'} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = BRAND_PLACEHOLDER; }} draggable="false" className={tw('h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none')} />
              </button>
              <div className={tw('pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d120b]/90 via-[#1d120b]/35 to-transparent px-4 pb-2 pt-16 text-white sm:px-5 sm:pb-3 sm:pt-16')}>
                {isCenter && <>
                  <span className={tw('mb-2 inline-flex max-w-full truncate rounded-full bg-[#E8603C] px-3 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-white shadow-md')}>{banner.etiqueta || banner.eyebrow}</span>
                  <p className={tw('line-clamp-2 text-base font-extrabold leading-tight sm:text-lg')}>{imageLabel}</p>
                </>}
              </div>
            </div>
          </article>;
        })}
      </div>
      {banners.length > 1 && <button type="button" aria-label="Banner siguiente" onClick={() => move(1)} className={tw('absolute right-0 top-1/2 z-40 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#ead9cb] bg-white/90 text-[#6d4c37] shadow-md transition hover:border-[#E8603C] hover:text-[#E8603C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C] sm:right-2 sm:size-12')}><FaChevronRight /></button>}
    </div>

    {banners.length > 1 && <nav aria-label="Paginación de banners" className={tw('mt-3 flex min-h-8 items-center justify-center gap-2')}>
      {banners.map((banner, index) => <button key={banner._id || index} type="button" onClick={() => setActiveIndex(index)} aria-label={`Ir al banner ${index + 1}: ${banner.titulo}`} aria-current={index === activeIndex ? 'true' : undefined} className={tw('h-2.5 rounded-full bg-[#d8c8bc] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C]', index === activeIndex ? 'w-9 bg-[#E8603C]' : 'w-2.5 hover:bg-[#E8603C]')} />)}
    </nav>}

    {showDetails && createPortal(<div className={tw('fixed inset-0 z-[2500] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4')} onMouseDown={(event) => { if (event.target === event.currentTarget) setShowDetails(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="hero-banner-details-title" className={tw('relative w-full max-w-xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl')}>
        <button type="button" aria-label="Cerrar información" onClick={() => setShowDetails(false)} className={tw('absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm hover:text-[#E8603C] focus-visible:outline-2 focus-visible:outline-[#E8603C]')}><FaTimes /></button>
        <img src={getImage(current)} alt={current.titulo || 'CDISFRUTA'} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = BRAND_PLACEHOLDER; }} className={tw('h-52 w-full object-cover sm:h-64')} />
        <div className={tw('space-y-3 p-5 sm:p-7')}><p className={tw('text-xs font-bold uppercase tracking-[.14em] text-[#E8603C]')}>{current.etiqueta || current.eyebrow}</p><h2 id="hero-banner-details-title" className={tw('text-2xl font-extrabold tracking-[-.02em] text-[#2D1B0A]')}>{current.titulo}</h2><p className={tw('max-h-48 overflow-y-auto whitespace-pre-line text-sm leading-6 text-[#8B6652]')} style={{ fontFamily: 'var(--font-mono)' }}>{current.detalle || current.desc}</p><p className={tw('inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-[#8B6652]')}>{current.tag || current.etiqueta}</p><div><button type="button" onClick={() => { setShowDetails(false); navigate('/dashboard_usuario'); }} className={tw('min-h-11 rounded-full bg-[#E8603C] px-5 text-sm font-bold text-white transition hover:bg-[#C4431F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C]')}>Ver en la tienda</button></div></div>
      </section>
    </div>, document.body)}

    {showRegister && <Registro cerrar={() => setShowRegister(false)} irLogin={() => { setShowRegister(false); setShowLogin(true); }} />}
    {showLogin && <Login cerrar={() => setShowLogin(false)} irRegistro={() => { setShowLogin(false); setShowRegister(true); }} />}
  </section>;
}
