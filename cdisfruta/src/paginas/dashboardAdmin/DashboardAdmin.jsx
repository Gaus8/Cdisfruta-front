import { Outlet } from "react-router"; // <--- IMPORTANTE
import Sidebar from './Sidebar';
import Header from './Header';
import '../../assets/styles/dashboardAdmin/dashboard_admin.css'
import { useAuth } from '../../funciones/useAuth';
import AccesoDenegado from "../usuarios/AccesoDenegado";

export default function DashboardAdmin() {
  const { userData, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!userData || userData.rol !== 'admin') return <AccesoDenegado/>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <Header userName={userData.nombre} />
        <main className="dashboard-view-port">
          {/* Aquí es donde se renderizará Productos, Home, etc. */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}