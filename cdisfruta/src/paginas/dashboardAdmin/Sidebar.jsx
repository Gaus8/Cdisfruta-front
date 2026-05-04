import { useState } from "react";
import { FaHome, FaStore, FaBoxes, FaUsers, FaChartLine, FaCog, FaSignOutAlt, FaExclamationTriangle, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router"; 
import axios from "axios";
import { URL_SERVER } from "../../funciones/conexion.js"; 
import '../../assets/styles/dashboardAdmin/sidebar_admin.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil

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

  return (
    <>
      {/* Botón Hamburguesa - Solo visible en móvil */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay para cerrar el menú al hacer clic fuera (solo móvil) */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar-admin ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h2>Panel Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link title="Inicio" to="/dashboard_admin/dashboard" onClick={() => setIsOpen(false)}>
            <FaHome /> <span>Inicio</span>
          </Link>
          
          <Link title="Catálogo" to="/dashboard_admin/productos" onClick={() => setIsOpen(false)}>
            <FaStore /> <span>Catálogo</span>
          </Link>
          
          <Link title="Inventario" to="/dashboard_admin/inventario" onClick={() => setIsOpen(false)}>
            <FaBoxes /> <span>Inventario</span>
          </Link>

          <Link title="Usuarios" to="/dashboard_admin/usuarios" onClick={() => setIsOpen(false)}>
            <FaUsers /> <span>Usuarios</span>
          </Link>
          <Link title="Reportes" to="/dashboard_admin/reportes" onClick={() => setIsOpen(false)}>
            <FaChartLine /> <span>Reportes</span>
          </Link>
          <Link title="Configuración" to="/dashboard_admin/config" onClick={() => setIsOpen(false)}>
            <FaCog /> <span>Configuración</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Modal de Logout se mantiene igual... */}
      {showLogoutModal && (
        <div className="modal-overlay-logout">
          <div className="logout-modal-content">
            <FaExclamationTriangle className="warning-icon" />
            <h3>¿Cerrar Sesión?</h3>
            <p>¿Estás seguro de que deseas salir del sistema SIECU?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={handleLogout}>Sí, Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}