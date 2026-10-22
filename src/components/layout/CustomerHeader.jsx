import { tw } from '../../funciones/tw.js';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart, FaSearch, FaUserCircle, FaCog,
  FaSignOutAlt, FaExclamationTriangle, FaShoppingBag,
  FaSignInAlt, FaUserPlus
} from "react-icons/fa";
import CartModal from "./CartModal";
import { apiAxios } from "../../funciones/conexion"; // Usar instancia configurada con withCredentials
import { useAuth } from "../../funciones/useAuth";

export default function HeaderDashboard() {
  const { userData, verifyToken } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [avatarOverride, setAvatarOverride] = useState(null);

  const [searchText, setSearchText] = useState(() => {
    return sessionStorage.getItem('search_cdisfruta') || "";
  });

  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAvatar = (event) => setAvatarOverride(event.detail?.avatar || '');
    window.addEventListener('account-profile-updated', updateAvatar);
    return () => window.removeEventListener('account-profile-updated', updateAvatar);
  }, []);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutModalOpen(false);
    try {
      // Petición al endpoint /logout (la cookie access_token se elimina automáticamente)
      await apiAxios.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Re-verificar estado de autenticación en el Context/Hook global
      if (typeof verifyToken === 'function') {
        await verifyToken();
      }
      // Redirección SPA suave
      navigate('/');
    }
  };

  const handleCancelLogout = () => setLogoutModalOpen(false);

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
    if (logoutModalOpen || cartModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [logoutModalOpen, cartModalOpen]);

  return (
    <>
      <header className={tw("user-header")}>
        <div className={tw("header-content")}>
          <h1 className={tw(tw("logo"), "![cursor:pointer]")} onClick={() => navigate('/cliente/tienda')} >
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
            <div
              className={tw(tw("icon-wrapper"), "![cursor:pointer]")}
              onClick={() => setCartModalOpen(true)}
              
            >
              <FaShoppingCart className={tw("icon-btn-large")} />
              <span className={tw("notification-badge")}>{cartCount}</span>
            </div>

            <div className={tw("dropdown-container")} ref={containerRef}>
              <div className={tw("user-profile")} onClick={toggleDropdown}>
                {avatarOverride ?? userData?.avatar ? <img src={avatarOverride ?? userData.avatar} alt="Foto de perfil" className={tw('h-[30px] w-[30px] rounded-full object-cover')} /> : <FaUserCircle size={30} color={userData ? "#ff7a5c" : "#ccc"} />}
              </div>

              {dropdownOpen && (
                <div className={tw("dropdown-menu profile-menu")}>
                  {userData ? (
                    <>
                      <div className={tw("dropdown-header")}>Hola, {userData.nombre ? userData.nombre.split(' ')[0] : 'Usuario'}</div>
                      <ul className={tw("dropdown-list")}>
                        <li onClick={() => { setDropdownOpen(false); navigate('/cliente/configuracion'); }}>
                          <FaCog /> Configuración
                        </li>
                        <li onClick={() => { setDropdownOpen(false); navigate('/cliente/pedidos'); }}>
                          <FaShoppingBag /> Mis Pedidos
                        </li>
                        <hr />
                        <li className={tw("logout-opt")} onClick={handleLogoutClick}>
                          <FaSignOutAlt /> Cerrar Sesión
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <div className={tw("dropdown-header")}>Bienvenido</div>
                      <ul className={tw("dropdown-list")}>
                        <li onClick={() => { setDropdownOpen(false); navigate('/login'); }}>
                          <FaSignInAlt /> Iniciar Sesión
                        </li>
                        <li onClick={() => { setDropdownOpen(false); navigate('/registro'); }}>
                          <FaUserPlus /> Crear Cuenta
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
      />

      {logoutModalOpen && (
        <div className={tw("modal-overlay-logout")} onClick={handleCancelLogout}>
          <div className={tw("logout-modal-content")} onClick={(e) => e.stopPropagation()}>
            <FaExclamationTriangle className={tw("warning-icon")} />
            <h3>¿Cerrar Sesión?</h3>
            <p>¿Estás seguro de que deseas salir de tu cuenta en CDISFRUTA?</p>
            <div className={tw("modal-actions")}>
              <button className={tw("btn-cancel")} onClick={handleCancelLogout}>Cancelar</button>
              <button className={tw("btn-confirm")} onClick={handleConfirmLogout}>Sí, Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
