  import { useAuth } from "../../funciones/useAuth";
  import HeaderDashboard from "./Header";
  import ProductosTienda from "./ProductosTienda";
  import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';

  export default function DashboardUsuario() {
    const { userData, loading } = useAuth();

    // 1. Manejo de estados de carga y permisos
    if (loading) {
      return (
        <div className="status-container">
          <div className="spinner-auth"></div>
          <p>Cargando información del usuario...</p>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="status-container">
          <p>Acceso denegado. Por favor, inicie sesión.</p>
          <button onClick={() => window.location.href = '/login'} className="btn-save">Ir al Login</button>
        </div>
      );
    }

    if (userData.rol !== 'user') {
      return (
        <div className="status-container">
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      );
    }

    // 2. Renderizado principal
    return (
      <div className="userpage-container">
        <HeaderDashboard />
        <div className="content-wrapper">
          <aside className="filters-sidebar">
            <h3>Categorías</h3>
            <ul className="category-list">
              <li className="active">Todos los productos</li>
              <li>Frutas Deshidratadas</li>
              <li>Mix Energético</li>
              <li>Promociones</li>
            </ul>

            <div className="sidebar-promo">
              <p>🚚 Envío gratis en compras mayores a $100.000</p>
            </div>
          </aside>

          <main className="main-products-content">
            <div className="products-header">
                <h2>Nuestros Productos</h2>
                <p>Calidad premium desde la Sabana</p>
            </div>
            <ProductosTienda />
          </main>
        </div>
      </div>
    );
  }