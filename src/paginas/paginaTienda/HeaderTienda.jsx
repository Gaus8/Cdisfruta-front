import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUserCircle, FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt } from "react-icons/fa";
import '../../assets/styles/dashboardUsuario/header_usuario.css';
import CartModal from "./CartModal";
import { useAuth } from "../../funciones/useAuth";

export default function HeaderTienda() {
  const { authenticated, logout, userData } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const containerRef = useRef(null);

  const [searchText, setSearchText] = useState(() => sessionStorage.getItem('search_cdisfruta') || "");

  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Navegación limpia a páginas completas de auth
  const handleAbrirLogin = () => {
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleAbrirRegistro = () => {
    setDropdownOpen(false);
    navigate('/registro');
  };

  const handleCerrarSesion = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const executeSearch = (term) => {
    sessionStorage.setItem('search_cdisfruta', term);
    window.dispatchEvent(new CustomEvent('productSearch', { detail: term }));
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    executeSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchText);
  };

  // Manejo de expiración de sesión (redirección directa)
  useEffect(() => {
    const handleSessionExpired = () => {
      if (authenticated) {
        navigate('/login');
      }
    };
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [authenticated, navigate]);

  // Badge del carrito
  useEffect(() => {
    const updateBadge = () => {
      const cart = JSON.parse(localStorage.getItem('cart_cdisfruta') || "[]");
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    };
    updateBadge();
    window.addEventListener('cartUpdate', updateBadge);
    window.addEventListener('storage', updateBadge);
    return () => {
      window.removeEventListener('cartUpdate', updateBadge);
      window.removeEventListener('storage', updateBadge);
    };
  }, []);

  // Cerrar menú desplegable al hacer clic afuera
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
          <h1 
            className="logo" 
            onClick={() => navigate(authenticated ? '/cliente/tienda' : '/tienda')} 
            style={{ cursor: 'pointer' }}
          >
            CDISFRUTA<span className="dot-shop"> SHOP</span>
          </h1>

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
            <div className="icon-wrapper" onClick={() => setCartModalOpen(true)} style={{ cursor: 'pointer' }}>
              <FaShoppingCart className="icon-btn-large" />
              <span className="notification-badge">{cartCount}</span>
            </div>

            <div className="dropdown-container" ref={containerRef}>
              <div className="user-profile" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                <FaUserCircle size={30} />
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu profile-menu">
                  <div className="dropdown-header">
                    {authenticated ? `Hola, ${userData?.nombre || 'Usuario'}` : 'Bienvenido'}
                  </div>
                  <ul className="dropdown-list">
                    {authenticated ? (
                      <>
                        <li onClick={() => { setDropdownOpen(false); navigate('/cliente/perfil'); }}>
                          <FaUser /> Mi Perfil
                        </li>
                        <li onClick={handleCerrarSesion}>
                          <FaSignOutAlt /> Cerrar Sesión
                        </li>
                      </>
                    ) : (
                      <>
                        <li onClick={handleAbrirLogin}><FaSignInAlt /> Iniciar Sesión</li>
                        <li onClick={handleAbrirRegistro}><FaUserPlus /> Crear Cuenta</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <CartModal isOpen={cartModalOpen} onClose={() => setCartModalOpen(false)} />
    </>
  );
}