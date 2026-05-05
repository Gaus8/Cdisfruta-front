import { useState } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import ProductosTienda from "./ProductosTienda";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';
import AccesoDenegado from "../usuarios/AccesoDenegado";

export default function DashboardUsuario() {

  const { userData, loading } = useAuth();


  // 1. Estado inicial en "Todos los productos"
  const [categoriaActiva, setCategoriaActiva] = useState("Todos los productos");

  // 2. Definimos las nuevas categorías solicitadas
  const categorias = [
    "Todos los productos",
    "Infusiones y Aromáticas",
    "Snacks Saludables",
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
  if (!userData || userData.rol !== 'user') return <AccesoDenegado/>;
  return (
    <div className="userpage-container">
      <HeaderDashboard />

      <div className="content-wrapper">
        <aside className="filters-sidebar">
          <h3>Categorías</h3>
          <ul className="category-list">
            {categorias.map((cat) => (
              <li
                key={cat}
                className={categoriaActiva === cat ? "active" : ""}
                /* 3. Al hacer click, enviamos el nombre exacto de la categoría */
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-products-content">
          <header className="products-hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <span className="hero-subtitle">100% Natural • Artesanal</span>
                <h1>Sabor Real, Energía de nuestra Tierra</h1>
                <p>
                  Disfruta del auténtico sabor de <strong>Ubaté</strong>. Frutas seleccionadas
                  y deshidratadas con amor para acompañar tu estilo de vida saludable.
                </p>
                <div className="hero-features">
                  <span>🍃 Sin Conservantes</span>
                  <span>☀️ Cosecha de Origen</span>
                  <span>📍 Origen Local</span>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-badge-premium">
                  <span className="star">★</span>
                  <span>Calidad Premium</span>
                </div>
              </div>
            </div>
          </header>

          {/* 4. Pasamos la categoría activa al componente que renderiza los productos */}
          <ProductosTienda categoria={categoriaActiva} />
        </main>
      </div>
    </div>
  );
}