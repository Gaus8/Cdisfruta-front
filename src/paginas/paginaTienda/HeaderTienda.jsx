import { tw } from '../../funciones/tw.js';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUserCircle, FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt } from "react-icons/fa";
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
      <header className={tw("user-header")}>
        <div className={tw("header-content")}>
          <h1 
            className={tw(tw("logo"), "![cursor:pointer]")} 
            onClick={() => navigate(authenticated ? '/cliente/tienda' : '/tienda')} 
            
          >
            CDISFRUTA<span className={tw("dot-shop")}> SHOP</span>
          </h1>

          <form className={tw("search-bar")} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar snacks saludables..."
              value={searchText}
              onChange={handleSearchChange}
            />
            <button type="submit" className={tw("search-btn")}><FaSearch /></button>
          </form>

          <div className={tw("header-actions")}>
            <div className={tw(tw("icon-wrapper"), "![cursor:pointer]")} onClick={() => setCartModalOpen(true)} >
              <FaShoppingCart className={tw("icon-btn-large")} />
              <span className={tw("notification-badge")}>{cartCount}</span>
            </div>

            <div className={tw("dropdown-container")} ref={containerRef}>
              <div className={tw(tw("user-profile"), "![cursor:pointer]")} onClick={toggleDropdown} >
                <FaUserCircle size={30} />
              </div>

              {dropdownOpen && (
                <div className={tw("dropdown-menu profile-menu")}>
                  <div className={tw("dropdown-header")}>
                    {authenticated ? `Hola, ${userData?.nombre || 'Usuario'}` : 'Bienvenido'}
                  </div>
                  <ul className={tw("dropdown-list")}>
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