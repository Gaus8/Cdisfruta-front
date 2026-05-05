import { useState, useEffect } from 'react';
import '../../assets/styles/mainPage/header.css';
import '../../assets/styles/mainPage/headerResponsive.css';
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
// 1. Importar useNavigate para la navegación
import { useNavigate } from "react-router-dom";

import Registro from '../usuarios/Registro';
import Login from '../usuarios/Login';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [abrirLogin, setAbrirLogin] = useState(false);

  // 2. Inicializar el navegador
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`hdr${scrolled ? ' hdr--scrolled' : ''}`}>

        {/* ── Logo + Marca ── */}
        <a href="#" className="hdr-brand" onClick={(e) => { e.preventDefault(); navigate('/'); closeMenu(); }}>
          <div className="hdr-logo-ring">
            <img src="/img/logo_cdisfruta.webp" alt="CDISFRUTA Logo" />
          </div>
          <div className="hdr-brand-text">
            <span className="hdr-brand-name">CDISFRUTA</span>
            <span className="hdr-brand-sub">Frutas Deshidratadas · Ubaté</span>
          </div>
        </a>

        <button
          className="hdr-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>

        <nav className={`hdr-nav${menuOpen ? ' hdr-nav--open' : ''}`}>
          <div className="hdr-actions">
            <a href="#contacto" onClick={closeMenu}>Contacto</a>
          </div>

          <div className="hdr-actions">
            <button
              className="hdr-btn hdr-btn--ghost"
              onClick={() => {
                setAbrirLogin(true);
                setMenuOpen(false);
              }}
            >
              Ingresar
            </button>
            
            {/* 3. Acción del botón Tienda corregida */}
            <button 
              className="hdr-btn hdr-btn--solid"
              onClick={() => {
                navigate('/dashboard_main'); // Redirige a la vitrina
                closeMenu(); // Cierra el menú en móvil
              }}
            >
              Tienda
            </button>
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