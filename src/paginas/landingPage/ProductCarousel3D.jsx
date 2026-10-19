import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { URL_SERVER } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const currencyCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0
});

const productImage = (product) => product?.imagen || product?.imagenes?.[0] || '/img/logo_cdisfruta.webp';

/** Reusable product showcase. Products are supplied by the public catalog API. */
export default function ProductCarousel3D({ products: productsProp }) {
  const [productsFromApi, setProductsFromApi] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleSlots, setVisibleSlots] = useState(3);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef(null);
  const navigate = useNavigate();
  const products = productsProp || productsFromApi;

  useEffect(() => {
    if (productsProp) return undefined;
    const controller = new AbortController();
    fetch(`${URL_SERVER}/get-productos`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (!controller.signal.aborted && Array.isArray(data)) setProductsFromApi(data); })
      .catch((error) => { if (error.name !== 'AbortError') console.error('No se pudieron cargar los productos destacados:', error); });
    return () => controller.abort();
  }, [productsProp]);

  useEffect(() => {
    const updateSlots = () => setVisibleSlots(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
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

  const move = useCallback((direction) => {
    setActiveIndex((index) => (index + direction + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length < 2 || paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [move, paused, products.length, reducedMotion]);

  useEffect(() => setActiveIndex((index) => products.length ? index % products.length : 0), [products.length]);

  const positionedProducts = useMemo(() => products.map((product, index) => {
    let distance = (index - activeIndex + products.length) % products.length;
    if (distance > products.length / 2) distance -= products.length;
    return { product, index, distance };
  }).filter(({ distance }) => Math.abs(distance) <= Math.min(visibleSlots, Math.floor((products.length - 1) / 2)))
    .sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance)), [activeIndex, products, visibleSlots]);

  if (!products.length) return null;
  const spacing = typeof window !== 'undefined' && window.innerWidth < 640 ? 124 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 155 : Math.min(190, window.innerWidth / 6);
  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 'min(66vw, 230px)' : 'clamp(205px, 24vw, 292px)';

  return <section
    aria-labelledby="home-products-title"
    className={tw('overflow-hidden bg-[#fffaf5] px-4 py-16 sm:px-6 sm:py-20 lg:px-10', '[font-family:var(--font-display)]')}
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
  >
    <header className={tw('mx-auto mb-9 max-w-2xl text-center sm:mb-12')}>
      <p className={tw('mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#e8603c]')}>Hecho en Ubaté</p>
      <h2 id="home-products-title" className={tw('text-3xl font-extrabold tracking-[-.02em] text-[#2d1b0a] sm:text-4xl')}>Nuestros Productos</h2>
      <p className={tw('mx-auto mt-3 max-w-[520px] text-[13px] leading-[1.6] text-[#8b6652] sm:text-sm')} style={{ fontFamily: 'var(--font-mono)' }}>Frutas deshidratadas, snacks y aromáticas hechas en Ubaté.</p>
    </header>

    <div className={tw('relative mx-auto h-[350px] max-w-[1280px] touch-pan-y sm:h-[430px] lg:h-[470px]')}>
      <button type="button" aria-label="Ver productos anteriores" onClick={() => move(-1)} className={tw('absolute left-0 top-1/2 z-30 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#ead9cb] bg-white text-[#6d4c37] shadow-md transition hover:border-[#e8603c] hover:text-[#e8603c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8603c] sm:left-2 sm:size-12')}><FaChevronLeft /></button>
      <div className={tw('absolute inset-0 [perspective:1200px] [transform-style:preserve-3d]')} aria-live="polite" aria-atomic="true">
        {positionedProducts.map(({ product, index, distance }) => {
          const isActive = distance === 0;
          const category = product.categoria || 'CDISFRUTA';
          return <article key={product._id || index} onClick={() => { if (!isActive) setActiveIndex(index); }} className={tw('absolute left-1/2 top-1/2 select-none transition-[transform,opacity,filter] duration-500 ease-out', !isActive && 'cursor-pointer', reducedMotion && 'duration-0')} style={{
            width: cardWidth,
            transform: `translate(calc(-50% + ${distance * spacing}px), -50%) rotateY(${distance === 0 ? 0 : distance < 0 ? 18 : -18}deg) scale(${isActive ? 1 : Math.max(0.76, 0.88 - Math.abs(distance) * 0.035)})`,
            opacity: isActive ? 1 : Math.max(0.55, 0.84 - Math.abs(distance) * 0.08),
            filter: isActive ? 'brightness(1)' : `brightness(${Math.max(0.74, 0.92 - Math.abs(distance) * 0.06)})`,
            zIndex: 20 - Math.abs(distance),
          }}>
            <div className={tw('relative aspect-[3/4] overflow-hidden rounded-[28px] bg-[#f4e7dc] shadow-[0_18px_48px_rgba(84,48,25,.18)]', isActive && 'shadow-[0_24px_58px_rgba(195,67,31,.25)]')}>
              <button type="button" onClick={() => setActiveIndex(index)} aria-label={`Mostrar ${product.nombre} como producto destacado`} className={tw('absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-4 focus-visible:outline-[#e8603c]')}>
                <img src={productImage(product)} alt={product.nombre || 'Producto CDISFRUTA'} onError={(event) => { event.currentTarget.src = '/img/logo_cdisfruta.webp'; }} className={tw('h-full w-full object-cover')} draggable="false" />
              </button>
              <span className={tw('absolute right-3 top-3 max-w-[70%] truncate rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#6d4c37] shadow-sm backdrop-blur', !isActive && 'opacity-90')}>{category}</span>
              {isActive && <button type="button" onClick={() => navigate('/tienda')} className={tw('absolute bottom-[5.25rem] left-1/2 inline-flex min-h-10 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#e8603c] px-5 text-xs font-bold text-white shadow-lg transition hover:bg-[#c4431f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white')}>Ver producto <FaArrowRight /></button>}
              <div className={tw('pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d120b]/95 via-[#1d120b]/65 to-transparent px-4 pb-4 pt-16 text-white sm:px-5 sm:pb-5')}>
                <h3 className={tw('truncate text-base font-extrabold tracking-[-.02em] sm:text-lg')}>{product.nombre}</h3>
                <p className={tw('mt-1 text-sm font-semibold text-white/90')}>{currencyCOP.format(Number(product.precio || 0))}</p>
              </div>
            </div>
          </article>;
        })}
      </div>
      <button type="button" aria-label="Ver productos siguientes" onClick={() => move(1)} className={tw('absolute right-0 top-1/2 z-30 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#ead9cb] bg-white text-[#6d4c37] shadow-md transition hover:border-[#e8603c] hover:text-[#e8603c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8603c] sm:right-2 sm:size-12')}><FaChevronRight /></button>
    </div>

    <nav aria-label="Paginación de productos" className={tw('mt-6 flex min-h-8 items-center justify-center gap-2')}>
      {products.map((product, index) => <button key={product._id || index} type="button" onClick={() => setActiveIndex(index)} aria-label={`Ir al producto ${index + 1}: ${product.nombre}`} aria-current={index === activeIndex ? 'true' : undefined} className={tw('h-2.5 rounded-full bg-[#d8c8bc] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8603c]', index === activeIndex ? 'w-9 bg-[#e8603c]' : 'w-2.5 hover:bg-[#e8603c]')} />)}
    </nav>
  </section>;
}
