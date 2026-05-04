import { useState } from "react";
// Importamos FaStore para la tienda y FaBoxes para el inventario físico
import { FaHome, FaStore, FaBoxes, FaUsers, FaChartLine, FaCog, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";
import { Link, useNavigate } from "react-router"; 
import axios from "axios";
import { URL_SERVER } from "../../funciones/conexion.js"; 
import '../../assets/styles/dashboardAdmin/sidebar_admin.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  return (
    <>
      <aside className="sidebar-admin">
        <div className="sidebar-logo">
          <h2>Panel Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link title="Inicio" to="/dashboard_admin/dashboard">
            <FaHome /> <span>Inicio</span>
          </Link>
          
          {/* CAMBIO: Ahora es Productos Tienda */}
          <Link title="Catálogo" to="/dashboard_admin/productos">
            <FaStore /> <span>Catálogo</span>
          </Link>
          
          {/* CAMBIO: Inventario para insumos físicos */}
          <Link title="Inventario" to="/dashboard_admin/inventario">
            <FaBoxes /> <span>Inventario</span>
          </Link>

          <Link title="Usuarios" to="/dashboard_admin/usuarios">
            <FaUsers /> <span>Usuarios</span>
          </Link>
          <Link title="Reportes" to="/dashboard_admin/reportes">
            <FaChartLine /> <span>Reportes</span>
          </Link>
          <Link title="Configuración" to="/dashboard_admin/config">
            <FaCog /> <span>Configuración</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MODAL DE LOGOUT (Se mantiene igual) */}
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