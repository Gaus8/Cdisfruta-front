import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { createPortal } from 'react-dom';
import { conoceConfig } from './conoce.config.js';
import './KnowSection.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const focusWithoutScroll = (element) => {
  if (!element) return;
  try { element.focus({ preventScroll: true }); }
  catch { element.focus(); }
};
const iconPaths = {
  fresa: <><path d="M12 21s-7-5.2-7-11a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.8-7 11-7 11Z" /><path d="M12 4c-.4-1.4.2-2.5 1.8-3M8.5 10h.01M12 12h.01M15.5 10h.01M10 15h.01M14 16h.01" /></>,
  pina: <><path d="M12 7c-3 0-5 2-5 5.5S9.3 21 12 21s5-5 5-8.5S15 7 12 7Z" /><path d="M12 7c-2-2-2-4 0-6 2 2 2 4 0 6ZM10 7C7 5 7 3 8 1m6 6c3-2 3-4 2-6M9 11l6 2m-6 2 6-2" /></>,
  manzana: <><path d="M12 7c-2-2-5-1-6 1-2 5 1 12 6 12s8-7 6-12c-1-2-4-3-6-1Z" /><path d="M12 7c0-3 2-5 5-5-1 3-2 5-5 5Z" /></>,
  cidron: <><path d="M4 19C4 9 10 4 20 4c0 10-5 16-16 15Z" /><path d="M4 20 17 7m-8 8-1-5m5 1 4 1" /></>,
  azucar: <path d="M12 3v18M12 7 8 4m4 8-4-3m4 8-4-3m4-7 4-3m-4 8 4-3m-4 8 4-3" />,
  panela: <><path d="M5 10h14l-1 10H6L5 10Zm0 0 2-4h10l2 4" /><path d="M12 6c0-3 2-4 4-5M12 6c-2-2-4-2-5-4" /></>,
};
function IngredientIcon({ id, className = '' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[id] || iconPaths.cidron}</svg>;
}

export default function KnowSection() {
  const activeIngredients = useMemo(
    () => conoceConfig.ingredientes.filter((item) => item.activo && item.descripcion).sort((a, b) => a.orden - b.orden),
    [],
  );
  const [ingredients, setIngredients] = useState(activeIngredients);
  const [imageReady, setImageReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [devId, setDevId] = useState(activeIngredients[0]?.id || '');
  const [dragId, setDragId] = useState(null);
  const [isMobileModal, setIsMobileModal] = useState(() => window.matchMedia('(max-width: 699px), (hover: none) and (pointer: coarse) and (max-height: 500px)').matches);
  const [closing, setClosing] = useState(false);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardTitleRef = useRef(null);
  const sheetStartYRef = useRef(null);
  const hotspotRefs = useRef(new Map());
  const lastHotspotRef = useRef(null);
  const closeTimerRef = useRef(null);
  const pageScrollRef = useRef(0);
  const devMode = new URLSearchParams(window.location.search).get('devConoce') === '1';
  const selected = ingredients.find((item) => item.id === selectedId) || null;

  const closeIngredient = useCallback(() => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    if (!isMobileModal) { setSelectedId(null); return; }
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedId(null);
      setClosing(false);
      closeTimerRef.current = null;
    }, isMobileModal && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 80);
  }, [isMobileModal]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const reveal = () => requestAnimationFrame(() => setVisible(true));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      reveal();
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { reveal(); observer.unobserve(node); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 699px), (hover: none) and (pointer: coarse) and (max-height: 500px)');
    const syncViewport = (event) => setIsMobileModal(event.matches);
    if (media.addEventListener) media.addEventListener('change', syncViewport);
    else media.addListener?.(syncViewport);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', syncViewport);
      else media.removeListener?.(syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!visible || !conoceConfig.seccion.activa || !activeIngredients.length) return undefined;
    const timer = window.setTimeout(() => setReminderVisible(true), 900);
    const dismiss = window.setTimeout(() => setReminderVisible(false), 6900);
    return () => { window.clearTimeout(timer); window.clearTimeout(dismiss); };
  }, [visible, activeIngredients.length]);

  useEffect(() => {
    if (selectedId) focusWithoutScroll(cardTitleRef.current);
    else if (lastHotspotRef.current?.isConnected) focusWithoutScroll(lastHotspotRef.current);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return undefined;
    const closeOnOutside = (event) => {
      if (!sectionRef.current?.contains(event.target) && !event.target.closest?.('.know-mobile-modal')) closeIngredient();
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); closeIngredient(); return; }
      if (event.key === 'Tab') {
        const dialog = document.getElementById('know-ingredient-card');
        const focusables = [...(dialog?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])];
        if (!focusables.length) { event.preventDefault(); focusWithoutScroll(cardTitleRef.current); return; }
        const first = focusables[0]; const last = focusables[focusables.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === cardTitleRef.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === cardTitleRef.current)) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedId, isMobileModal, closeIngredient]);

  useLayoutEffect(() => {
    if (!selectedId || !imageReady || !isMobileModal) return undefined;
    const body = document.body;
    const root = document.documentElement;
    const scrollY = pageScrollRef.current;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const previousBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      overscrollBehavior: body.style.overscrollBehavior,
    };
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousScrollBehavior = root.style.scrollBehavior;
    const inerted = [];

    for (const element of [...body.children]) {
      if (element.classList.contains('know-mobile-modal')) continue;
      const previous = {
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute('aria-hidden'),
        tabIndexes: [],
      };
      if (!('inert' in element)) {
        previous.tabIndexes = [...element.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
          .map((node) => [node, node.getAttribute('tabindex')]);
        previous.tabIndexes.forEach(([node]) => node.setAttribute('tabindex', '-1'));
      }
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
      inerted.push(previous);
    }

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    root.style.scrollBehavior = 'auto';
    if (scrollbarWidth) {
      const existingPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${existingPadding + scrollbarWidth}px`;
    }
    root.style.overscrollBehavior = 'none';

    return () => {
      Object.assign(body.style, previousBody);
      root.style.overscrollBehavior = previousRootOverscroll;
      inerted.forEach(({ element, inert, ariaHidden, tabIndexes }) => {
        element.inert = inert;
        if (ariaHidden == null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
        tabIndexes.forEach(([node, tabIndex]) => {
          if (tabIndex == null) node.removeAttribute('tabindex');
          else node.setAttribute('tabindex', tabIndex);
        });
      });
      root.style.scrollBehavior = 'auto';
      try { window.scrollTo(0, scrollY); } catch { /* Algunos navegadores bloquean scrollTo durante el desmontaje. */ }
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [selectedId, imageReady, isMobileModal]);

  useEffect(() => {
    if (!selectedId || !sectionRef.current || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { setSelectedId(null); setClosing(false); }
    }, { threshold: 0 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [selectedId]);

  if (!conoceConfig.seccion.activa || !activeIngredients.length) return null;

  const openIngredient = (item) => {
    setReminderVisible(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    setClosing(false);
    if (selectedId === item.id) { closeIngredient(); return; }
    if (!selectedId) pageScrollRef.current = window.scrollY;
    lastHotspotRef.current = hotspotRefs.current.get(item.id);
    setSelectedId(item.id);
  };

  const setCoordinateFromPointer = (event, id) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round(clamp(((event.clientX - rect.left) / rect.width) * 100, 2, 98) * 10) / 10;
    const y = Math.round(clamp(((event.clientY - rect.top) / rect.height) * 100, 2, 98) * 10) / 10;
    setIngredients((current) => current.map((item) => item.id === id ? { ...item, x, y } : item));
  };

  const devJson = JSON.stringify(ingredients.map(({ id, nombre, x, y, lado, orden, activo }) => ({ id, nombre, x, y, lado, orden, activo })), null, 2);
  const ingredientCard = selected && imageReady && (
    <article
      key={selected.id}
      id="know-ingredient-card"
      className={`know-card know-card--${selected.lado}${isMobileModal && closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal={isMobileModal ? 'true' : 'false'}
      aria-labelledby="know-card-title"
      aria-describedby="know-card-description"
      style={{ '--category-color': selected.colorCategoria || (selected.categoria === 'FRUTA' ? '#2F6B4F' : selected.categoria === 'HIERBA AROMÁTICA' ? '#6F8F4E' : '#E8603C') }}
      onClick={(event) => event.stopPropagation()}
    >
      <span
        className="know-card__handle"
        aria-hidden="true"
        onPointerDown={(event) => {
          if (!isMobileModal) return;
          sheetStartYRef.current = event.clientY;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (sheetStartYRef.current != null && event.clientY - sheetStartYRef.current > 80) closeIngredient();
          sheetStartYRef.current = null;
        }}
        onPointerCancel={() => { sheetStartYRef.current = null; }}
      />
      <span className="know-card__stack" aria-hidden="true" />
      <span className="know-card__surface" aria-hidden="true" />
      <button type="button" className="know-card__close" aria-label="Cerrar información" onClick={closeIngredient}><IoCloseOutline /></button>
      <div className="know-card__header">
        <p className="know-card__category">{selected.categoria}</p>
        <h3 id="know-card-title" ref={cardTitleRef} tabIndex="-1">{selected.nombre}</h3>
      </div>
      <div className="know-card__body">
        <p className="know-card__description" id="know-card-description">{selected.descripcion}</p>
        {selected.beneficio && <div className="know-card__divider" aria-hidden="true" />}
        {selected.beneficio && <p className="know-card__benefit"><span><strong>Beneficio</strong><span>{selected.beneficio}</span></span></p>}
      </div>
    </article>
  );
  const dismissLayer = selected && imageReady && <button type="button" className={`know-sheet-scrim${isMobileModal && closing ? ' is-closing' : ''}`} aria-label="Cerrar información del ingrediente" onClick={closeIngredient} />;
  return (
    <>
    <section ref={sectionRef} id="conoce" className={`know-section${visible ? ' is-visible' : ''}`} aria-labelledby="know-title">
      <div className="know-stage__foliage" aria-hidden="true">
        <img className="know-stage__foliage-image know-stage__foliage-image--back" src="/img/conoce-marco-hojas.png" alt="" width="1792" height="878" loading="lazy" decoding="async" />
        <img className="know-stage__foliage-image know-stage__foliage-image--front" src="/img/conoce-marco-hojas.png" alt="" width="1792" height="878" loading="lazy" decoding="async" />
      </div>
      <div className="know-section__inner">
        <header className="know-section__heading">
          <p className="know-section__eyebrow">{conoceConfig.seccion.eyebrow}</p>
          <h2 id="know-title"><span>{conoceConfig.seccion.tituloManuscrito}</span><strong>{conoceConfig.seccion.titulo}</strong><i aria-hidden="true" /></h2>
          <p className="know-section__subtitle">{conoceConfig.seccion.subtitulo}</p>
        </header>

        {devMode && (
          <div className="know-calibration" aria-label="Herramienta de calibración de ingredientes">
            <label htmlFor="know-calibration-select">Mover ingrediente</label>
            <select id="know-calibration-select" value={devId} onChange={(event) => setDevId(event.target.value)}>
              {ingredients.map((item) => <option value={item.id} key={item.id}>{item.nombre}</option>)}
            </select>
            <p>Haz clic en la imagen o arrastra un punto para calibrar.</p>
            <pre>{devJson}</pre>
          </div>
        )}

        <div className="know-stage-wrap">
          <div
            ref={stageRef}
            className={`know-stage${imageReady ? ' has-image' : ' is-placeholder'}${selected ? ' has-selection' : ''}`}
            onPointerMove={(event) => { if (devMode && dragId) setCoordinateFromPointer(event, dragId); }}
            onPointerUp={() => setDragId(null)}
            onPointerCancel={() => setDragId(null)}
            onClick={(event) => {
              if (devMode && !event.target.closest('.know-hotspot') && !event.target.closest('.know-mobile-modal')) setCoordinateFromPointer(event, devId);
              if (event.target === event.currentTarget) setSelectedId(null);
            }}
          >
            <span className="know-stage__glow" aria-hidden="true" />
            {imageReady && <span className="know-stage__platform" aria-hidden="true" />}
            <img
              className="know-stage__image"
              src={conoceConfig.seccion.imagenEscenario}
              srcSet={conoceConfig.seccion.imagenEscenarioSrcSet}
              sizes="(max-width: 699px) 92vw, (max-width: 1100px) 92vw, 1100px"
              alt={conoceConfig.seccion.altImagen}
              width="1600"
              height="784"
              loading="lazy"
              decoding="async"
              onLoad={() => setImageReady(true)}
              onError={() => setImageReady(false)}
            />
            {!imageReady && <div className="know-stage__placeholder" role="status"><span className="know-stage__placeholder-icon" aria-hidden="true">✦</span><strong>Tu producto, ingrediente por ingrediente</strong><span>El escenario transparente se añadirá aquí.</span></div>}
            {imageReady && (
              <>
                <svg className="know-stage__connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {ingredients.map((item) => {
                    const direction = item.lado === 'izquierda' ? -1 : 1;
                    const endpoint = clamp(item.x + direction * 12, 3, 97);
                    return <g key={item.id} className={`${selected && selected.id !== item.id ? 'is-dimmed' : ''}${selected?.id === item.id ? ' is-active' : ''}`}><line pathLength="1" x1={item.x} y1={item.y} x2={endpoint} y2={item.y} /><circle cx={item.x} cy={item.y} r=".45" /></g>;
                  })}
                </svg>
                {ingredients.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(node) => { if (node) hotspotRefs.current.set(item.id, node); else hotspotRefs.current.delete(item.id); }}
                    type="button"
                    className={`know-hotspot know-hotspot--${item.lado}${selected && selected.id !== item.id ? ' is-dimmed' : ''}${selected?.id === item.id ? ' is-active' : ''}`}
                    style={{ '--hotspot-x': `${item.x}%`, '--hotspot-y': `${item.y}%`, '--hotspot-delay': `${index * 90}ms` }}
                    aria-label={`Ver información de ${item.nombre}`}
                    aria-expanded={selectedId === item.id}
                    aria-controls="know-ingredient-card"
                    onPointerDown={(event) => { if (devMode) { event.stopPropagation(); setDevId(item.id); setDragId(item.id); event.currentTarget.setPointerCapture(event.pointerId); } }}
                    onClick={() => { if (devMode) { setDevId(item.id); return; } openIngredient(item); }}
                  >
                    <span className="know-hotspot__button" aria-hidden="true">{selected?.id === item.id ? <IoCloseOutline /> : item.icono ? <IngredientIcon id={item.icono} /> : '+'}</span>
                    <span className="know-hotspot__label">{item.nombre}</span>
                  </button>
                ))}
              </>
            )}

            {selected && imageReady && !isMobileModal && <>{dismissLayer}{ingredientCard}</>}
            {reminderVisible && imageReady && !selected && <p className="know-stage__reminder">Toca un + para explorar</p>}
          </div>

          <ul className="know-sr-list">{ingredients.map((item) => <li key={item.id}>{item.nombre}: {item.descripcion}</li>)}</ul>
        </div>
      </div>
    </section>
    {isMobileModal && selected && imageReady && createPortal(
      <div className="know-mobile-modal">
        {dismissLayer}
        {ingredientCard}
      </div>,
      document.body,
    )}
    </>
  );
}
