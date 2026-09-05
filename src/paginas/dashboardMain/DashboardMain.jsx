import { useState, useRef } from "react";
import HeaderDashboard from "./Header";
import ProductosTienda from "./ProductosTienda";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';
import { FaArrowDown, FaChevronUp } from "react-icons/fa";

export default function DashboardMain() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos los productos");
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);
  const productosRef = useRef(null);

  const categorias = [
    "Todos los productos",
    "Infusiones y Aromáticas",
    "Snacks Saludables",
    "Promociones"
  ];

  const scrollToProducts = () => {
    productosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      setMostrarBotonSubir(true);
    } else {
      setMostrarBotonSubir(false);
    }
  });

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
                <button className="hero-explore-btn" onClick={scrollToProducts}>
                  Ver Productos <FaArrowDown className="bounce-arrow" />
                </button>
              </div>
              <div className="hero-visual">
                <img 
                  src="/img/productos_destacados.webp" 
                  alt="Frutas deshidratadas Cdisfruta" 
                  className="hero-product-img"
                />
              </div>
            </div>
          </header>

          <div ref={productosRef}>
            <ProductosTienda categoria={categoriaActiva} />
          </div>
        </main>
      </div>

      {mostrarBotonSubir && (
        <button className="scroll-to-top-btn" onClick={scrollToTop} title="Volver arriba">
          <FaChevronUp />
        </button>
      )}
    </div>
  );
}