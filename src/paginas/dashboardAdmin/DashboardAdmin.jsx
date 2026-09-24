import { tw } from '../../funciones/tw.js';
import { Outlet } from "react-router"; // <--- IMPORTANTE
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../funciones/useAuth';


export default function DashboardAdmin() {
  const { userData, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return (
    <div className={tw("dashboard-container")}>
      <Sidebar />
      <div className={tw("dashboard-main-content")}>
        <Header userName={userData.nombre} />
        <main className={tw("dashboard-view-port")}>
          {/* Aquí es donde se renderizará Productos, Home, etc. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}