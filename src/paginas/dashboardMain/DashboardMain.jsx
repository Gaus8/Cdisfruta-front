import { useState, useRef } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import ProductosTienda from "./ProductosTienda";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';
import { FaChevronUp } from "react-icons/fa";
import AccesoDenegado from "../usuarios/AccesoDenegado";

export default function DashboardUsuario() {
  const { userData, loading } = useAuth();

  // Mantenemos la categoría inicial por defecto para el componente de productos
  const [categoriaActiva] = useState("Todos los productos");
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);

  const productosRef = useRef(null);

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

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner-auth"></div>
        <p>Cargando tu experiencia saludable...</p>
      </div>
    );
  }

  if (!userData || userData.rol !== 'user') return <AccesoDenegado />;

  return (
    <div className="userpage-container">
      <HeaderDashboard />

      <div className="content-wrapper" style={{ display: 'block' }}>
        <main className="main-products-content" style={{ width: '100%' }}>
          <header className="products-hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <span className="hero-subtitle">100% Natural • Artesanal</span>
                <h1>Sabor real, Energía de nuestra tierra</h1>
                <p>
                  Disfruta del auténtico sabor de <strong>Ubaté</strong>. Frutas seleccionadas
                  y deshidratadas con amor para acompañar tu estilo de vida saludable.
                </p>
                
                <button className="hero-explore-btn" onClick={scrollToProducts}>
                  Ver Productos
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
            <ProductosTienda categoria={categoriaActiva} user={userData} />
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