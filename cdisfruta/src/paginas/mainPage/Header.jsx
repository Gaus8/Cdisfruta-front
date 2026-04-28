import { useState, useEffect } from 'react';
import '../../assets/styles/mainPage/header.css';
import '../../assets/styles/mainPage/headerResponsive.css';
import { IoPersonOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
 
  const close = () => setMenuOpen(false);
 
  return (
    <header className={`hdr${scrolled ? ' hdr--scrolled' : ''}`}>
 
      {/* ── Logo + Marca ── */}
      <a href="#" className="hdr-brand" onClick={close}>
        <div className="hdr-logo-ring">🍊</div>
        <div className="hdr-brand-text">
          <span className="hdr-brand-name">CDISFRUTA - SIECU</span>
          <span className="hdr-brand-sub">Frutas Deshidratadas · Ubaté</span>
        </div>
      </a>
 
      {/* ── Menú hamburguesa (solo móvil) ── */}
      <button
        className="hdr-hamburger"
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Abrir menú"
      >
        {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </button>
 
      {/* ── Nav ── */}
      <nav className={`hdr-nav${menuOpen ? ' hdr-nav--open' : ''}`}>
        <a href="#" onClick={close}>Inicio</a>
        <a href="#sobre" onClick={close}>Sobre Nosotros</a>
        <a href="#features" onClick={close}>Características</a>
        <a href="#media" onClick={close}>Galería</a>
        <a href="#contacto" onClick={close}>Contacto</a>
 
        {/* Botones (también dentro del menú móvil) */}
        <div className="hdr-actions">
          <button className="hdr-btn hdr-btn--ghost">Ingresar</button>
          <button className="hdr-btn hdr-btn--solid">Tienda →</button>
        </div>
      </nav>
    </header>
  );
}