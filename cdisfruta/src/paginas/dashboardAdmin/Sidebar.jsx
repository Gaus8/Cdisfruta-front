import { FaHome, FaBox, FaUsers, FaChartLine, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router";
import '../../assets/styles/dashboardAdmin/sidebar_admin.css'

export default function Sidebar() {
  return (
    <aside className="sidebar-admin">
      <div className="sidebar-logo">
        <h2>Panel Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <Link title="Inicio" to="/dashboard_admin/dashboard"><FaHome /> <span>Inicio</span></Link>
        <Link title="Inventario" to="/dashboard_admin/productos"><FaBox /> <span>Inventario</span></Link>
        <Link title="Usuarios" to="/dashboard_admin/usuarios"><FaUsers /> <span>Usuarios</span></Link>
        <Link title="Reportes" to="/dashboard_admin/reportes"><FaChartLine /> <span>Reportes</span></Link>
        <Link title="Configuración" to="/dashboard_admin/config"><FaCog /> <span>Configuración</span></Link>
      </nav>
      <div className="sidebar-footer">
        <button className="btn-logout">
          <FaSignOutAlt /> <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}