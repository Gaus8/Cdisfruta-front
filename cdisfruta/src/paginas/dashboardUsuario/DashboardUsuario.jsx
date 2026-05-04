import { useState } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import ProductosTienda from "./ProductosTienda";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';

export default function DashboardUsuario() {
  const { userData, loading } = useAuth();
  const [categoriaActiva, setCategoriaActiva] = useState("Todos los productos");

  const categorias = [
    "Todos los productos",
    "Frutas Deshidratadas",
    "Mix Energético",
    "Infusiones",
    "Promociones"
  ];

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner-auth"></div>
        <p>Cargando tu experiencia saludable...</p>
      </div>
    );
  }

  if (!userData || userData.rol !== 'user') {
    return (
      <div className="status-container">
        <div className="error-card">
          <span className="error-icon">🔒</span>
          <p>Acceso restringido. Inicia sesión como cliente para continuar.</p>
          <button onClick={() => window.location.href = '/login'} className="btn-primary">
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="userpage-container">
      <HeaderDashboard />
      
      <div className="content-wrapper">
        {/* Sidebar con scroll horizontal automático en móvil */}
        <aside className="filters-sidebar">
          <h3>Categorías</h3>
          <ul className="category-list">
            {categorias.map((cat) => (
              <li 
                key={cat}
                className={categoriaActiva === cat ? "active" : ""}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>

          <div className="sidebar-promo">
            <span className="icon">🚚</span>
            <p>Envío gratis por compras mayores a <strong>$100.000</strong></p>
          </div>
        </aside>

        <main className="main-products-content">
          <header className="products-welcome-card">
            <div className="text">
              <h2>Nuestros Productos</h2>
              <p>El sabor natural de Ubaté en cada bocado</p>
            </div>
            {/* Badge con el color ámbar de la fruta */}
            <div className="badge">✨ Proceso Artesanal</div>
          </header>

          <ProductosTienda categoria={categoriaActiva} />
        </main>
      </div>
    </div>
  );
}