import { useState, useEffect } from 'react';
import '../../assets/styles/mainPage/header.css';
import '../../assets/styles/mainPage/headerResponsive.css';
import { IoPersonOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";

// 1. Importamos el componente de Registro
import Registro from '../usuarios/Registro';
import Login from '../usuarios/Login';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 2. Estado para controlar la visibilidad del modal
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [abrirLogin, setAbrirLogin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // Función para cerrar el registro y el menú al mismo tiempo
  const cerrarModal = () => {
    setAbrirRegistro(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`hdr${scrolled ? ' hdr--scrolled' : ''}`}>

        {/* ── Logo + Marca ── */}
        <a href="#" className="hdr-brand" onClick={closeMenu}>
          <div className="hdr-logo-ring">
            <img src="/img/logo_cdisfruta.jpg" alt="CDISFRUTA Logo" />
          </div>
          <div className="hdr-brand-text">
            <span className="hdr-brand-name">CDISFRUTA</span>
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
          <div className="hdr-actions">

            <a href="#contacto" onClick={closeMenu}>Contacto</a>
          </div>


          {/* Botones */}
          <div className="hdr-actions">
            <button
              className="hdr-btn hdr-btn--ghost"
              onClick={() => {
                setAbrirRegistro(true);
                setMenuOpen(false); // Cerramos el menú móvil al abrir el registro
              }}
            >
              Ingresar
            </button>
            <button className="hdr-btn hdr-btn--solid">Tienda →</button>
          </div>
        </nav>
      </header>

      {abrirLogin && (
        <Login
          cerrar={() => setAbrirLogin(false)}
          irRegistro={() => { setAbrirLogin(false); setAbrirRegistro(true); }}
        />
      )}

      {abrirRegistro && (
        <Registro
          cerrar={() => setAbrirRegistro(false)}
          irLogin={() => { setAbrirRegistro(false); setAbrirLogin(true); }}
        />
      )}
    </>
  );
}