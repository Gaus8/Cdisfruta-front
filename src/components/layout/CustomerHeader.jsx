import { tw } from '../../utils/tw.js';
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  FaShoppingCart, FaSearch, FaUserCircle, FaCog,
  FaSignOutAlt, FaExclamationTriangle, FaShoppingBag,
  FaSignInAlt, FaUserPlus, FaWhatsapp, FaMapMarkerAlt, FaStore
} from "react-icons/fa";
import CartModal from "../../pages/user/CartModal";
import { apiAxios } from "../../services/api/client"; // Usar instancia configurada con withCredentials
import { useAuth } from "../../hooks/useAuth";
import { whatsappUrl } from "../../utils/whatsapp.js";

export default function HeaderDashboard() {
  const { userData, verifyToken } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [avatarOverride, setAvatarOverride] = useState(null);
  const location = useLocation();

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
    const openCart = () => setCartModalOpen(true);
    updateBadge();
    window.addEventListener('cartUpdate', updateBadge);
    window.addEventListener('storage', updateBadge);
    window.addEventListener('openCart', openCart);
    return () => {
      window.removeEventListener('cartUpdate', updateBadge);
      window.removeEventListener('storage', updateBadge);
      window.removeEventListener('openCart', openCart);
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

  const goDirecciones = () => {
    sessionStorage.setItem('config_tab_cdisfruta', 'direcciones');
    navigate('/cliente/configuracion?tab=direcciones');
  };

  const configTab = new URLSearchParams(location.search).get('tab');
  const onCuenta = location.pathname === '/cliente/configuracion' && configTab !== 'direcciones';
  const onDirecciones = location.pathname === '/cliente/configuracion' && configTab === 'direcciones';

  const navClass = ({ isActive }) => tw(
    'client-nav__link',
    isActive ? 'client-nav__link--active' : ''
  );

  return (
    <>
      <header className={tw("user-header client-header")}>
        <div className={tw("header-content")}>
          <h1 className={tw(tw("logo"), "![cursor:pointer]")} onClick={() => navigate('/cliente/tienda')} >
            CDISFRUTA<span className={tw("dot-shop")}> · Mi cuenta</span>
          </h1>

          <form className={tw("search-bar")} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Buscar en tu catálogo..." 
              value={searchText}
              onChange={handleSearchChange}
            />
            <button type="submit" className={tw("search-btn")}><FaSearch /></button>
          </form>

          <div className={tw("header-actions")}>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir por WhatsApp"
              className={tw('client-header__icon', '![color:#25D366]', '![text-decoration:none]')}
              title="WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>

            <button
              type="button"
              className={tw('client-header__icon')}
              data-cart-animation-target="true"
              onClick={() => setCartModalOpen(true)}
              aria-label={`Carrito${cartCount ? `, ${cartCount} productos` : ''}`}
            >
              <FaShoppingCart size={18} />
              <span className={tw("notification-badge")}>{cartCount}</span>
            </button>

            <div className={tw("dropdown-container")} ref={containerRef}>
              <button
                type="button"
                className={tw("user-profile")}
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                aria-label="Menú de cuenta"
              >
                {avatarOverride ?? userData?.avatar
                  ? <img src={avatarOverride ?? userData.avatar} alt="" className={tw('h-[30px] w-[30px] rounded-full object-cover')} />
                  : <FaUserCircle size={30} color={userData ? "#ff7a5c" : "#ccc"} />}
              </button>

              {dropdownOpen && (
                <div className={tw("client-account-menu")} role="menu">
                  {userData ? (
                    <>
                      <div className={tw("client-account-menu__hero")}>
                        <div className={tw("client-account-menu__avatar")}>
                          {avatarOverride ?? userData?.avatar
                            ? <img src={avatarOverride ?? userData.avatar} alt="" />
                            : <FaUserCircle size={44} color="#ff7a5c" />}
                        </div>
                        <div className={tw("client-account-menu__identity")}>
                          <p className={tw("client-account-menu__name")}>
                            {userData.nombre || 'Cliente'}
                          </p>
                          <p className={tw("client-account-menu__email")}>{userData.email}</p>
                        </div>
                      </div>
                      <div className={tw("client-account-menu__body")}>
                        <button
                          type="button"
                          role="menuitem"
                          className={tw("client-account-menu__primary")}
                          onClick={() => {
                            setDropdownOpen(false);
                            sessionStorage.setItem('config_tab_cdisfruta', 'perfil');
                            navigate('/cliente/configuracion');
                          }}
                        >
                          <FaCog /> Ir a mi cuenta
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className={tw("client-account-menu__logout")}
                          onClick={handleLogoutClick}
                        >
                          <FaSignOutAlt /> Cerrar sesión
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={tw("client-account-menu__body")}>
                      <p className={tw("client-account-menu__guest")}>Accede para comprar más rápido</p>
                      <button type="button" role="menuitem" className={tw("client-account-menu__primary")} onClick={() => { setDropdownOpen(false); navigate('/login'); }}>
                        <FaSignInAlt /> Iniciar sesión
                      </button>
                      <button type="button" role="menuitem" className={tw("client-account-menu__logout")} onClick={() => { setDropdownOpen(false); navigate('/registro'); }}>
                        <FaUserPlus /> Crear cuenta
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className={tw("client-nav")} aria-label="Navegación de tu cuenta">
          <NavLink to="/cliente/tienda" end className={navClass}>
            <FaStore /> Catálogo
          </NavLink>
          <NavLink to="/cliente/pedidos" className={navClass}>
            <FaShoppingBag /> Pedidos
          </NavLink>
          <button
            type="button"
            className={tw('client-nav__link', onDirecciones ? 'client-nav__link--active' : '')}
            onClick={goDirecciones}
          >
            <FaMapMarkerAlt /> Direcciones
          </button>
          <NavLink
            to="/cliente/configuracion"
            className={() => tw('client-nav__link', onCuenta ? 'client-nav__link--active' : '')}
            onClick={() => {
              sessionStorage.setItem('config_tab_cdisfruta', 'perfil');
            }}
          >
            <FaCog /> Cuenta
          </NavLink>
        </nav>
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
