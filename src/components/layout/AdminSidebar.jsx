import { tw } from '../../utils/tw.js';
import { useState } from "react";
import { FaHome, FaStore, FaBoxes, FaUsers, FaChartLine, FaCog, FaBars, FaTimes, FaPaintBrush, FaChartBar, FaClipboardList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { URL_SERVER } from "../../services/api/client.js";
import ConfirmModal from '../ui/ConfirmModal';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions.js';

export default function Sidebar() {
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
  const panelTitle = role === 'admin' ? 'Panel Admin' : role === 'logistica' ? 'Panel Logística' : role === 'catalogo' ? 'Panel Catálogo' : 'Panel';

  return (
    <>
      <button className={tw("mobile-menu-btn")} onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isOpen && <div className={tw("sidebar-overlay")} onClick={toggleSidebar}></div>}

      <aside className={tw(`sidebar-admin ${isOpen ? "open" : ""}`)}>
        <div className={tw("sidebar-logo")}>
          <h2>{panelTitle}</h2>
        </div>
        <nav className={tw("sidebar-nav")}>
          {can('dashboard:read') && (
            <Link title="Inicio" to="/admin" onClick={() => setIsOpen(false)}>
              <FaHome /> <span>Inicio</span>
            </Link>
          )}

          {can('catalog:read') && (
            <Link title="Catálogo" to="/admin/productos" onClick={() => setIsOpen(false)}>
              <FaStore /> <span>Catálogo</span>
            </Link>
          )}

          {can('inventory:read') && (
            <Link title="Inventario" to="/admin/inventario" onClick={() => setIsOpen(false)}>
              <FaBoxes /> <span>Inventario</span>
            </Link>
          )}

          {can('orders:read') && (
            <Link title="Pedidos" to="/admin/pedidos" onClick={() => setIsOpen(false)}>
              <FaClipboardList /> <span>Pedidos</span>
            </Link>
          )}

          {can('users:read') && (
            <Link title="Usuarios" to="/admin/usuarios" onClick={() => setIsOpen(false)}>
              <FaUsers /> <span>Usuarios</span>
            </Link>
          )}

          {can('analytics:read') && (
            <Link title="Analítica de productos" to="/admin/analitica-productos" onClick={() => setIsOpen(false)}>
              <FaChartBar /> <span>Analítica de productos</span>
            </Link>
          )}

          {can('reports:read') && (
            <Link title="Reportes" to="/admin/reportes" onClick={() => setIsOpen(false)}>
              <FaChartLine /> <span>Reportes</span>
            </Link>
          )}

          {can('landing:write') && (
            <Link title="Diseño de portada" to="/admin/diseno-portada" onClick={() => setIsOpen(false)}>
              <FaPaintBrush /> <span>Diseño de portada</span>
            </Link>
          )}

          {can('settings:write') && (
            <Link title="Configuración" to="/admin/config" onClick={() => setIsOpen(false)}>
              <FaCog /> <span>Configuración</span>
            </Link>
          )}
        </nav>
        <div className={tw("sidebar-footer")}>
          <button className={tw("btn-logout")} onClick={() => setShowLogoutModal(true)}>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <ConfirmModal open={showLogoutModal} title="¿Cerrar sesión?" description="¿Estás seguro de que deseas salir de la administración de CDISFRUTA?" confirmLabel="Sí, cerrar sesión" onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
}
