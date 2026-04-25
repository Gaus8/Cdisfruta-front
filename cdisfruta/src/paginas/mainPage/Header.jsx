import { useState } from 'react';
import '../../assets/styles/mainPage/header.css';
import '../../assets/styles/mainPage/headerResponsive.css';
import { IoPersonOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header-container">
      <div className="logo-img">
        <img src="/img/logo_siecu.png" alt="Logo" />
      </div>

      <div>
        <h1 className="titulo">Cdisfruta</h1>
      </div>

      {/* Icono de hamburguesa solo visible en móvil */}
      <div className="mobile-menu-icon" onClick={toggleMenu}>
        {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </div>

      {/* Navegación con clase dinámica */}
      <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
        <a href="#" onClick={() => setMenuOpen(false)}>
          <IoPersonOutline className="user-icon" />
        </a>
        <a href="#section-products" onClick={() => setMenuOpen(false)}>Sobre Nosotros</a>
        <a href="#section-icons" onClick={() => setMenuOpen(false)}>Info</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Contacto</a>
      </nav>
    </header>
  );
}