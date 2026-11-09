import { tw } from '../../../utils/tw.js';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUserCircle, FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaWhatsapp, FaThLarge } from "react-icons/fa";
import CartModal from "../../../components/ui/CartModal.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { whatsappUrl } from "../../../utils/whatsapp.js";
import { homePathForRole, isStaffRole } from "../../../utils/roleHome.js";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/ui/LanguageSwitcher.jsx';

export default function HeaderTienda() {
  const { t } = useTranslation(['shop', 'common']);
  const { authenticated, logout, userData } = useAuth();
  const staff = isStaffRole(userData?.rol);
  const signedInHome = staff ? homePathForRole(userData.rol) : '/cliente/tienda';
  const profilePath = staff ? '/admin/perfil' : '/cliente/configuracion';
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
            onClick={() => navigate(authenticated ? signedInHome : '/tienda')}
          >
            CDISFRUTA<span className={tw("dot-shop")}> SHOP</span>
          </h1>

          <form className={tw("search-bar")} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder={t('search.placeholder', { ns: 'shop' })}
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
              className={tw('shop-header__icon', '![color:#25D366]', '![text-decoration:none]')}
              title={t('navigation.whatsapp', { ns: 'common' })}
            >
              <FaWhatsapp size={18} />
            </a>

            <button
              type="button"
              className={tw('shop-header__icon')}
              data-cart-animation-target="true"
              onClick={() => setCartModalOpen(true)}
              aria-label={cartCount ? `${t('cart.aria', { ns: 'shop' })}, ${t('cart.products', { ns: 'shop', count: cartCount })}` : t('cart.aria', { ns: 'shop' })}
            >
              <FaShoppingCart size={18} />
              <span className={tw("notification-badge")}>{cartCount}</span>
            </button>

            <div className={tw("dropdown-container")} ref={containerRef}>
              <button type="button" className={tw('shop-header__icon')} onClick={toggleDropdown} aria-label={t('account.menu', { ns: 'shop' })} aria-expanded={dropdownOpen}>
                <FaUserCircle size={20} />
              </button>

              {dropdownOpen && (
                <div className={tw("dropdown-menu profile-menu")}>
                  <div className={tw("dropdown-header")}>
                    {authenticated ? t('account.hello', { ns: 'shop', name: userData?.nombre || t('account.user', { ns: 'shop' }) }) : t('account.welcome', { ns: 'shop' })}
                  </div>
                  <ul className={tw("dropdown-list")}>
                    {authenticated ? (
                      <>
                        <li onClick={() => { setDropdownOpen(false); navigate(profilePath); }}>
                          <FaUser /> {t('account.profile', { ns: 'shop' })}
                        </li>
                        {staff && (
                          <li onClick={() => { setDropdownOpen(false); navigate(signedInHome); }}>
                            <FaThLarge /> {t('account.panel', { ns: 'shop' })}
                          </li>
                        )}
                        <li onClick={handleCerrarSesion}>
                          <FaSignOutAlt /> {t('actions.logout', { ns: 'common' })}
                        </li>
                      </>
                    ) : (
                      <>
                        <li onClick={handleAbrirLogin}><FaSignInAlt /> {t('account.signIn', { ns: 'shop' })}</li>
                        <li onClick={handleAbrirRegistro}><FaUserPlus /> {t('account.register', { ns: 'shop' })}</li>
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
