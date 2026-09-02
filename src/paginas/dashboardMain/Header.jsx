import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart, FaSearch, FaUserCircle, FaCog,
  FaSignOutAlt, FaExclamationTriangle, FaShoppingBag,
  FaSignInAlt, FaUserPlus // Nuevos iconos para invitados
} from "react-icons/fa";
import '../../assets/styles/dashboardUsuario/header_usuario.css';
import Login from "../usuarios/Login";
import Registro from "../usuarios/Registro";

export default function HeaderDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const containerRef = useRef(null);
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [abrirLogin, setAbrirLogin] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setLogoutModalOpen(true);
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
      <div className="top-announcement-bar">
        <div className="announcement-track">
          <p>
            🚚 <strong>¡Envío Gratis!</strong> por compras mayores a <strong>$100.000</strong> -
            ✨ <strong>Calidad Premium</strong> Garantizada
            🚚 <strong>¡Envío Gratis!</strong> por compras mayores a <strong>$100.000</strong> -
            ✨ <strong>Calidad Premium</strong> Garantizada
            🚚 <strong>¡Envío Gratis!</strong> por compras mayores a <strong>$100.000</strong>
          </p>
        </div>
      </div>

      <header className="user-header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            CDISFRUTA<span className="dot-shop">.shop</span>
          </h1>

          <div className="search-bar">
            <input type="text" placeholder="Buscar snacks saludables..." />
            <button className="search-btn"><FaSearch /></button>
          </div>

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
                {/* Si hay usuario, podrías poner su inicial o foto, por ahora el icono */}
                <FaUserCircle size={30} />
              </div>

              {dropdownOpen && (

                // VISTA PARA VISITANTES / INVITADOS
                <>
                  <div className="dropdown-header">Bienvenido</div>
                  <ul className="dropdown-list">
                    <li onClick={() => setAbrirLogin(true)}>
                      <FaSignInAlt /> Iniciar Sesión
                    </li>
                    <li onClick={() => setAbrirRegistro(true)}>
                      <FaUserPlus /> Crear Cuenta
                    </li>
                  </ul>

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
              )}



            </div>
          </div>
        </div>
      </header>

    </>
  );
}