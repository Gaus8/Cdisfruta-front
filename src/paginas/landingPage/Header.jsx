import { useState, useEffect } from 'react';
import '../../assets/styles/mainPage/header.css';
import '../../assets/styles/mainPage/headerResponsive.css';
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
    <header className={`hdr${scrolled ? ' hdr--scrolled' : ''}`}>
      <a href="#" className="hdr-brand" onClick={(e) => { e.preventDefault(); navigate('/'); closeMenu(); }}>
        <div className="hdr-logo-ring">
          <img src="/img/logo_cdisfruta.webp" alt="CDISFRUTA Logo" />
        </div>
        <div className="hdr-brand-text">
          <span className="hdr-brand-name">CDISFRUTA</span>
          <span className="hdr-brand-sub">Frutas Deshidratadas · Ubaté</span>
        </div>
      </a>

      <button className="hdr-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Abrir menú">
        {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </button>

      <nav className={`hdr-nav${menuOpen ? ' hdr-nav--open' : ''}`}>
        <div className="hdr-actions">
          <a href="#contacto" onClick={closeMenu}>Contacto</a>
        </div>

        <div className="hdr-actions">
          <button className="hdr-btn hdr-btn--ghost" onClick={handleAbrirLogin}>
            Ingresar
          </button>

          <button className="hdr-btn hdr-btn--solid" onClick={() => { navigate('/tienda'); closeMenu(); }}>
            Tienda
          </button>
        </div>
      </nav>
    </header>
  );
}