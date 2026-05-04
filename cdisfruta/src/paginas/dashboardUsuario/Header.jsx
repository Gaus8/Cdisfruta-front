import { useState, useEffect, useRef } from "react";
import { 
  FaShoppingCart, FaSearch, FaUserCircle, FaCog, 
  FaSignOutAlt, FaExclamationTriangle, FaShoppingBag 
} from "react-icons/fa";
import CartModal from "./CartModal"; // Asegúrate de crear este componente en la misma carpeta
import '../../assets/styles/dashboardUsuario/header_usuario.css';

export default function HeaderDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false); // Estado para abrir/cerrar el carrito
  const [cartCount, setCartCount] = useState(0);
  const containerRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    // Lógica de logout (limpiar tokens, etc.)
    console.log("Sesión cerrada");
  };

  const handleCancelLogout = () => setLogoutModalOpen(false);

  // Lógica para actualizar el badge del carrito
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

  // Bloquear scroll cuando hay modales abiertos
  useEffect(() => {
    if (logoutModalOpen || cartModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [logoutModalOpen, cartModalOpen]);

  return (
    <>
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

            {/* Icono del Carrito con Trigger para abrir el Modal */}
            <div 
              className="icon-wrapper" 
              onClick={() => setCartModalOpen(true)} 
              style={{ cursor: 'pointer' }}
            >
              <FaShoppingCart className="icon-btn-large" />
              <span className="notification-badge">{cartCount}</span>
            </div>

            {/* Perfil y Dropdown */}
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

      {/* MODAL DEL CARRITO (Lógica y Formulario de pedido) */}
      <CartModal 
        isOpen={cartModalOpen} 
        onClose={() => setCartModalOpen(false)} 
      />

      {/* MODAL DE CONFIRMACIÓN DE LOGOUT */}
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