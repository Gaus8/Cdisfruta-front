import { useState, useEffect, useRef } from "react";
import { 
  FaShoppingCart, FaSearch, FaUserCircle, FaCog, 
  FaSignOutAlt, FaBox, FaExclamationTriangle, FaCheck, FaShoppingBag 
} from "react-icons/fa";
import '../../assets/styles/dashboardUsuario/header_usuario.css';

export default function HeaderDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    // Tu lógica de logout aquí: clearToken(), navigate('/login'), etc.
    console.log("Sesión cerrada");
  };

  const handleCancelLogout = () => setLogoutModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = logoutModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [logoutModalOpen]);

  return (
    <>
      {/* BARRA DE ANUNCIO SUPERIOR */}
      {/* BARRA DE ANUNCIO SUPERIOR */}
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

          <h1 className="logo">CDISFRUTA<span className="dot-shop">.shop</span></h1>

          <div className="search-bar">
            <input type="text" placeholder="Buscar snacks saludables..." />
            <button className="search-btn"><FaSearch /></button>
          </div>

          <div className="header-actions">

            {/* Carrito */}
            <div className="icon-wrapper">
              <FaShoppingCart className="icon-btn-large" />
              <span className="notification-badge">0</span>
            </div>

            {/* Perfil */}
            <div className="dropdown-container" ref={containerRef}>
              <div className="user-profile" onClick={toggleDropdown}>
                <FaUserCircle size={30} />
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu profile-menu">
                  <div className="dropdown-header">Mi Cuenta</div>
                  <ul className="dropdown-list">
                    <li onClick={() => setDropdownOpen(false)}>
                      <FaCog /> Configuración
                    </li>
                    <li onClick={() => setDropdownOpen(false)}>
                      <FaShoppingBag /> Mis Pedidos
                    </li>
                    <hr />
                    <li className="logout-opt" onClick={handleLogoutClick}>
                      <FaSignOutAlt /> Cerrar Sesión
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Modal de confirmación */}
      {logoutModalOpen && (
        <div className="modal-overlay-logout" onClick={handleCancelLogout}>
          <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
            <FaExclamationTriangle className="warning-icon" />
            <h3>¿Cerrar Sesión?</h3>
            <p>¿Estás seguro de que deseas salir de tu cuenta en CDISFRUTA?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelLogout}>Cancelar</button>
              <button className="btn-confirm" onClick={handleConfirmLogout}>Sí, Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}