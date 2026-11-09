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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx';

export default function HeaderDashboard() {
  const { t } = useTranslation(['common', 'shop']);
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
            CDISFRUTA<span className={tw("dot-shop")}> · {t('account', { ns: 'user' })}</span>
          </h1>

          <form className={tw("search-bar")} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder={t('search', { ns: 'user' })}
              aria-label={t('search', { ns: 'user' })}
              value={searchText}
              onChange={handleSearchChange}
            />
            <button type="submit" className={tw("search-btn")}><FaSearch /></button>
          </form>

          <div className={tw("header-actions")}>
            <LanguageSwitcher />
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('navigation.whatsapp', { ns: 'common' })}
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
              aria-label={cartCount ? `${t('cart.aria', { ns: 'shop' })}, ${t('cart.products', { ns: 'shop', count: cartCount })}` : t('cart.aria', { ns: 'shop' })}
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
                aria-label={t('account.menu', { ns: 'shop' })}
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
                            {userData.nombre || t('customer', { ns: 'user' })}
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
                          <FaCog /> {t('account', { ns: 'user' })}
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className={tw("client-account-menu__logout")}
                          onClick={handleLogoutClick}
                        >
                          <FaSignOutAlt /> {t('logout', { ns: 'common' })}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={tw("client-account-menu__body")}>
                      <p className={tw("client-account-menu__guest")}>{t('guestPrompt', { ns: 'user' })}</p>
                      <button type="button" role="menuitem" className={tw("client-account-menu__primary")} onClick={() => { setDropdownOpen(false); navigate('/login'); }}>
                        <FaSignInAlt /> {t('signIn', { ns: 'user' })}
                      </button>
                      <button type="button" role="menuitem" className={tw("client-account-menu__logout")} onClick={() => { setDropdownOpen(false); navigate('/registro'); }}>
                        <FaUserPlus /> {t('register', { ns: 'user' })}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className={tw("client-nav")} aria-label={t('accountNavigation', { ns: 'user' })}>
          <NavLink to="/cliente/tienda" end className={navClass}>
            <FaStore /> {t('catalog', { ns: 'user' })}
          </NavLink>
          <NavLink to="/cliente/pedidos" className={navClass}>
            <FaShoppingBag /> {t('orders', { ns: 'user' })}
          </NavLink>
          <button
            type="button"
            className={tw('client-nav__link', onDirecciones ? 'client-nav__link--active' : '')}
            onClick={goDirecciones}
          >
            <FaMapMarkerAlt /> {t('addresses', { ns: 'user' })}
          </button>
          <NavLink
            to="/cliente/configuracion"
            className={() => tw('client-nav__link', onCuenta ? 'client-nav__link--active' : '')}
            onClick={() => {
              sessionStorage.setItem('config_tab_cdisfruta', 'perfil');
            }}
          >
            <FaCog /> {t('account', { ns: 'user' })}
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
            <h3>{t('logoutTitle', { ns: 'user' })}</h3>
            <p>{t('logoutDescription', { ns: 'user' })}</p>
            <div className={tw("modal-actions")}>
              <button className={tw("btn-cancel")} onClick={handleCancelLogout}>{t('cancel', { ns: 'common' })}</button>
              <button className={tw("btn-confirm")} onClick={handleConfirmLogout}>{t('confirmLogout', { ns: 'user' })}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
