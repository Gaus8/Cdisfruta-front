import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css'
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import Productos from "./Productos";

export default function DashboardUsuario() {

   const { userData, loading, authenticated } = useAuth();
    if (loading) {
      return <div>Cargando información del usuario...</div>;
    }
    else if(!userData){
      
      return <div>Asegurese de Iniciar Sesión.</div>;
    }
    else if(userData.rol !== 'user' ){
     return <div>No tiene los roles para acceder</div>;
    }
    else{
  
  return (
    <div className="userpage-container">
      <HeaderDashboard />
      <div className="content-wrapper">
        <aside className="filters-sidebar">
          <h4>Categorías</h4>
          <ul>
            <li>Frutas Deshidratadas</li>
            <li>Mix Energético</li>
            <li>Promociones</li>
          </ul>
        </aside>
        <Productos />
      </div>
    </div>
  );
}



}