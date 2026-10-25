import { useCallback, useEffect, useRef, useState } from 'react';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { tw } from '../../../utils/tw.js';
import { whatsappUrl } from '../../../utils/whatsapp.js';

const SECTION_LINKS = [
  { id: 'inicio', label: 'Inicio', always: true },
  { id: 'historia', label: 'Historia', always: true },
  { id: 'videos', label: 'Videos', always: true },
  { id: 'contacto', label: 'Contacto', always: true },
];

export default function Header({ themeV2 = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [availableSections, setAvailableSections] = useState(() => new Set(SECTION_LINKS.filter((item) => item.always).map((item) => item.id)));
  const navigate = useNavigate();
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const reducedMotionRef = useRef(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleAbrirLogin = () => {
    navigate('/login', { state: { backgroundLocation: location } });
    closeMenu();
  };

  const handleSectionClick = (event, id) => {
    event.preventDefault();
    closeMenu();
    const hash = `#${id}`;
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      return;
    }
    navigate({ pathname: '/', search: location.search, hash });
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotionRef.current ? 'auto' : 'smooth', block: 'start' });
    });
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const reachedPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 48;
      if (reachedPageEnd && document.getElementById('contacto')) {
        setActiveSection((current) => current === 'contacto' ? current : 'contacto');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = () => { reducedMotionRef.current = mediaQuery.matches; };
    syncMotionPreference();
    mediaQuery.addEventListener?.('change', syncMotionPreference);
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = mediaQuery.matches ? 'auto' : 'smooth';
    return () => {
      mediaQuery.removeEventListener?.('change', syncMotionPreference);
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  // Keep hash links useful when Home is opened from another route or directly via URL.
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return undefined;
    const id = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotionRef.current ? 'auto' : 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    const root = document.querySelector('.main-page-wrapper');
    if (!root) return undefined;
    let observer;
    const observed = new Set();
    const observeSections = () => {
      const currentAvailable = new Set(SECTION_LINKS.filter((item) => item.always || root.querySelector(`#${item.id}`)).map((item) => item.id));
      setAvailableSections(currentAvailable);
      currentAvailable.forEach((id) => {
        const element = root.querySelector(`#${id}`);
        if (element && !observed.has(element)) {
          observer?.observe(element);
          observed.add(element);
        }
      });
    };
    observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-90px 0px -65% 0px', threshold: 0 });
    observeSections();
    const mutations = new MutationObserver(observeSections);
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [location.pathname]);

  const linkClass = (mobile = false) => tw(
    'relative inline-flex min-h-11 items-center justify-center px-2 text-[15px] font-semibold leading-none text-[#5C4033] transition-colors duration-200 hover:text-[#E8603C] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C]',
    'after:absolute after:bottom-1 after:left-2 after:h-0.5 after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:bg-[#E8603C] after:transition-transform after:duration-200 hover:after:scale-x-100 aria-[current=true]:text-[#E8603C] aria-[current=true]:after:scale-x-100',
    mobile && 'w-full justify-start border-b border-[#EAE0D5]/70 px-5 py-3 after:bottom-2 after:left-5 after:w-[calc(100%-2.5rem)]'
  );

  const renderSectionLinks = (mobile = false) => SECTION_LINKS.filter(({ id }) => availableSections.has(id)).map(({ id, label }) => (
    <a key={id} href={`/#${id}`} onClick={(event) => handleSectionClick(event, id)} className={linkClass(mobile)} aria-current={activeSection === id ? 'true' : undefined}>{label}</a>
  ));

  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[15px] font-semibold leading-none transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C]';

  return (
    <header className={tw('sticky top-0 z-[100] flex h-[76px] items-center justify-between bg-white px-4 transition-shadow duration-300 sm:px-6 lg:px-10', scrolled && 'shadow-[0_4px_24px_rgba(28,18,9,.08)]', themeV2 && '[font-family:var(--font-display)]')}>
      <a href="/#inicio" className={tw('flex shrink-0 items-center gap-3 sm:gap-5')} onClick={(event) => handleSectionClick(event, 'inicio')} aria-label="CDISFRUTA, ir al inicio">
        <span className={tw('grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-sm transition-transform duration-300 hover:rotate-[-5deg] hover:scale-105 sm:size-[54px]')}>
          <img src="/img/logo_cdisfruta.webp" alt="" className={tw('h-full w-full object-cover')} />
        </span>
        <span className={tw('flex flex-col justify-center gap-0.5')}>
          <span className={tw('text-base font-semibold uppercase tracking-[.11em] text-[#ff7961] sm:text-lg')}>CDISFRUTA</span>
          <span className={tw('hidden text-[10px] uppercase leading-none tracking-[.14em] text-[#5C4033] min-[900px]:block')} style={{ fontFamily: 'var(--font-mono)' }}>Frutas Deshidratadas · Ubaté</span>
        </span>
      </a>

      <button ref={menuButtonRef} type="button" className={tw('grid size-11 place-items-center rounded-xl text-3xl text-[#ff7961] transition hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8603C] min-[1200px]:hidden')} onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="home-primary-navigation">
        {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </button>

      <nav id="home-primary-navigation" aria-label="Navegación principal" className={tw('absolute left-0 right-0 top-full flex max-h-[calc(100dvh-76px)] flex-col items-stretch overflow-y-auto border-b border-[#EAE0D5] bg-[rgba(254,250,246,.98)] px-0 py-2 shadow-[0_12px_32px_rgba(28,18,9,.1)] backdrop-blur-xl transition duration-200 min-[1200px]:static min-[1200px]:max-h-none min-[1200px]:flex min-[1200px]:flex-row min-[1200px]:items-center min-[1200px]:gap-4 min-[1200px]:overflow-visible min-[1200px]:border-0 min-[1200px]:bg-transparent min-[1200px]:p-0 min-[1200px]:opacity-100 min-[1200px]:shadow-none min-[1200px]:backdrop-blur-none min-[1200px]:transition-none min-[1200px]:xl:gap-7', menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0 min-[1200px]:pointer-events-auto min-[1200px]:translate-y-0')}>
        {renderSectionLinks(menuOpen)}
        <a href="/login" onClick={(event) => { event.preventDefault(); handleAbrirLogin(); }} className={tw(linkClass(menuOpen), 'min-[1200px]:border-0 min-[1200px]:px-2 min-[1200px]:py-0 min-[1200px]:after:left-2 min-[1200px]:after:w-[calc(100%-1rem)]')}>Ingresar</a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          aria-label="Escribir por WhatsApp"
          className={tw(
            buttonClass,
            'mx-5 mt-2 gap-2 border border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 min-[1200px]:mx-0 min-[1200px]:mt-0 min-[1200px]:size-11 min-[1200px]:rounded-full min-[1200px]:border-0 min-[1200px]:bg-[#25D366] min-[1200px]:p-0 min-[1200px]:text-white min-[1200px]:shadow-[0_4px_14px_rgba(37,211,102,.35)] min-[1200px]:hover:bg-[#1ebe57]'
          )}
        >
          <FaWhatsapp size={20} aria-hidden="true" />
          <span className={tw('min-[1200px]:hidden')}>WhatsApp</span>
        </a>
        <button type="button" onClick={() => { navigate('/tienda'); closeMenu(); }} className={tw(buttonClass, 'mx-5 mt-3 bg-[#E8583A] text-white shadow-[0_4px_14px_rgba(232,88,58,.3)] hover:-translate-y-0.5 hover:bg-[#C4431F] min-[1200px]:mx-0 min-[1200px]:mt-0')}>Tienda</button>
      </nav>
    </header>
  );
}
