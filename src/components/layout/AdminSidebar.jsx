import { tw } from '../../utils/tw.js';
import { useState } from "react";
import { FaHome, FaStore, FaBoxes, FaUsers, FaChartLine, FaCog, FaBars, FaTimes, FaPaintBrush, FaChartBar, FaClipboardList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { URL_SERVER } from "../../services/api/client.js";
import ConfirmModal from '../ui/ConfirmModal';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions.js';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  const { userData } = useAuth();
  const role = userData?.rol;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${URL_SERVER}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user"); 
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      navigate("/");
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const can = (permission) => hasPermission(userData, permission);
  const panelTitle = role === 'admin' ? t('panel.admin', { ns: 'admin' }) : role === 'logistica' ? t('panel.logistics', { ns: 'admin' }) : role === 'catalogo' ? t('panel.catalog', { ns: 'admin' }) : t('panel.default', { ns: 'admin' });

  return (
    <>
      <button className={tw("mobile-menu-btn")} onClick={toggleSidebar} aria-label={isOpen ? t('menu.close', { ns: 'admin' }) : t('menu.open', { ns: 'admin' })} aria-expanded={isOpen}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isOpen && <div className={tw("sidebar-overlay")} onClick={toggleSidebar}></div>}

      <aside className={tw(`sidebar-admin ${isOpen ? "open" : ""}`)}>
        <div className={tw("sidebar-logo")}>
          <h2>{panelTitle}</h2>
        </div>
        <nav className={tw("sidebar-nav")}>
          {can('dashboard:read') && (
            <Link title={t('navigation.home', { ns: 'admin' })} to="/admin" onClick={() => setIsOpen(false)}>
              <FaHome /> <span>{t('navigation.home', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('catalog:read') && (
            <Link title={t('navigation.catalog', { ns: 'admin' })} to="/admin/productos" onClick={() => setIsOpen(false)}>
              <FaStore /> <span>{t('navigation.catalog', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('inventory:read') && (
            <Link title={t('navigation.inventory', { ns: 'admin' })} to="/admin/inventario" onClick={() => setIsOpen(false)}>
              <FaBoxes /> <span>{t('navigation.inventory', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('orders:read') && (
            <Link title={t('navigation.orders', { ns: 'admin' })} to="/admin/pedidos" onClick={() => setIsOpen(false)}>
              <FaClipboardList /> <span>{t('navigation.orders', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('users:read') && (
            <Link title={t('navigation.users', { ns: 'admin' })} to="/admin/usuarios" onClick={() => setIsOpen(false)}>
              <FaUsers /> <span>{t('navigation.users', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('analytics:read') && (
            <Link title={t('navigation.analytics', { ns: 'admin' })} to="/admin/analitica-productos" onClick={() => setIsOpen(false)}>
              <FaChartBar /> <span>{t('navigation.analytics', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('reports:read') && (
            <Link title={t('navigation.reports', { ns: 'admin' })} to="/admin/reportes" onClick={() => setIsOpen(false)}>
              <FaChartLine /> <span>{t('navigation.reports', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('landing:write') && (
            <Link title={t('navigation.landingDesign', { ns: 'admin' })} to="/admin/diseno-portada" onClick={() => setIsOpen(false)}>
              <FaPaintBrush /> <span>{t('navigation.landingDesign', { ns: 'admin' })}</span>
            </Link>
          )}

          {can('settings:write') && (
            <Link title={t('navigation.settings', { ns: 'admin' })} to="/admin/config" onClick={() => setIsOpen(false)}>
              <FaCog /> <span>{t('navigation.settings', { ns: 'admin' })}</span>
            </Link>
          )}
        </nav>
        <div className={tw("sidebar-footer")}>
          <button className={tw("btn-logout")} onClick={() => setShowLogoutModal(true)}>
            <span>{t('actions.logout', { ns: 'common' })}</span>
          </button>
        </div>
      </aside>

      <ConfirmModal open={showLogoutModal} title={t('logoutTitle', { ns: 'admin' })} description={t('logoutDescription', { ns: 'admin' })} confirmLabel={t('confirmLogout', { ns: 'admin' })} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
}
