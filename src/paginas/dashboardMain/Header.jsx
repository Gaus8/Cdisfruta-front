import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart, FaSearch, FaUserCircle,
  FaSignInAlt, FaUserPlus
} from "react-icons/fa";
import '../../assets/styles/dashboardUsuario/header_usuario.css';
import CartModal from "./CartModal";
import Login from "../usuarios/Login";
import Registro from "../usuarios/Registro";

export default function HeaderDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const containerRef = useRef(null);
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [abrirLogin, setAbrirLogin] = useState(false);

  // Estado para el texto de búsqueda sincronizado
  const [searchText, setSearchText] = useState(() => {
    return sessionStorage.getItem('search_cdisfruta') || "";
  });

  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Funciones para la barra de búsqueda en tiempo real
  const executeSearch = (term) => {
    sessionStorage.setItem('search_cdisfruta', term);
    window.dispatchEvent(new CustomEvent('productSearch', { detail: term }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    executeSearch(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchText);
  };

  // Efecto para el badge del carrito
  useEffect(() => {
    const updateBadge = () => {
      const cart = JSON.parse(localStorage.getItem('cart_cdisfruta') || "[]");
      const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems);
    };
    updateBadge();
    window.addEventListener('cartUpdate', updateBadge);
    window.addEventListener('storage', updateBadge);
    return () => {
      window.removeEventListener('cartUpdate', updateBadge);
      window.removeEventListener('storage', updateBadge);
    };
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="user-header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/dashboard_main')} style={{ cursor: 'pointer' }}>
            CDISFRUTA<span className="dot-shop"> SHOP</span>
          </h1>

          {/* Barra de búsqueda conectada */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Buscar snacks saludables..." 
              value={searchText}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-btn"><FaSearch /></button>
          </form>

          <div className="header-actions">
            <div
              className="icon-wrapper"
              onClick={() => setCartModalOpen(true)}
              style={{ cursor: 'pointer' }}
            >
              <FaShoppingCart className="icon-btn-large" />
              <span className="notification-badge">{cartCount}</span>
            </div>

            <div className="dropdown-container" ref={containerRef}>
              <div className="user-profile" onClick={toggleDropdown}>
                <FaUserCircle size={30} />
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu profile-menu">
                  <div className="dropdown-header">Bienvenido</div>
                  <ul className="dropdown-list">
                    <li onClick={() => { setDropdownOpen(false); setAbrirLogin(true); }}>
                      <FaSignInAlt /> Iniciar Sesión
                    </li>
                    <li onClick={() => { setDropdownOpen(false); setAbrirRegistro(true); }}>
                      <FaUserPlus /> Crear Cuenta
                    </li>
                  </ul>
                </div>
              )}

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
            </div>
          </div>
        </div>
      </header>

      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
      />
    </>
  );
}