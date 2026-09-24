import { tw } from '../../funciones/tw.js';
import { useState, useEffect } from 'react';
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleAbrirLogin = () => {
    navigate('/login', { state: { backgroundLocation: location } });
    closeMenu();
  };

  return (
    <header className={tw(`hdr${scrolled ? ' hdr--scrolled' : ''}`)}>
      <a href="#" className={tw("hdr-brand")} onClick={(e) => { e.preventDefault(); navigate('/'); closeMenu(); }}>
        <div className={tw("hdr-logo-ring")}>
          <img src="/img/logo_cdisfruta.webp" alt="CDISFRUTA Logo" />
        </div>
        <div className={tw("hdr-brand-text")}>
          <span className={tw("hdr-brand-name")}>CDISFRUTA</span>
          <span className={tw("hdr-brand-sub")}>Frutas Deshidratadas · Ubaté</span>
        </div>
      </a>

      <button className={tw("hdr-hamburger")} onClick={() => setMenuOpen(v => !v)} aria-label="Abrir menú">
        {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </button>

      <nav className={tw(`hdr-nav${menuOpen ? ' hdr-nav--open' : ''}`)}>
        <div className={tw("hdr-actions")}>
          <a href="#contacto" onClick={closeMenu}>Contacto</a>
        </div>

        <div className={tw("hdr-actions")}>
          <button className={tw("hdr-btn hdr-btn--ghost")} onClick={handleAbrirLogin}>
            Ingresar
          </button>

          <button className={tw("hdr-btn hdr-btn--solid")} onClick={() => { navigate('/tienda'); closeMenu(); }}>
            Tienda
          </button>
        </div>
      </nav>
    </header>
  );
}