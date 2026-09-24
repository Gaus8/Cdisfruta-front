import { tw } from '../../funciones/tw.js';
import { useState, useRef } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import ProductosTienda from "./ProductosTienda";
import { FaChevronUp } from "react-icons/fa";

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
      <div className={tw("status-container")}>
        <div className={tw("spinner-auth")}></div>
        <p>Cargando tu experiencia saludable...</p>
      </div>
    );
  }

  return (
    <div className={tw("userpage-container")}>
      <HeaderDashboard />

      <div className={tw(tw("content-wrapper"), "![display:block]")} >
        <main className={tw(tw("main-products-content"), "![width:100%]")} >
          <header className={tw("products-hero-section")}>
            <div className={tw("hero-content")}>
              <div className={tw("hero-text")}>
                <span className={tw("hero-subtitle")}>100% Natural • Artesanal</span>
                <h1>Sabor real, Energía de nuestra tierra</h1>
                <p>
                  Disfruta del auténtico sabor de <strong>Ubaté</strong>. Frutas seleccionadas
                  y deshidratadas con amor para acompañar tu estilo de vida saludable.
                </p>
                
                <button className={tw("hero-explore-btn")} onClick={scrollToProducts}>
                  Ver Productos
                </button>
              </div>

              <div className={tw("hero-visual")}>
                <img 
                  src="/img/productos_destacados.webp" 
                  alt="Frutas deshidratadas Cdisfruta" 
                  className={tw("hero-product-img")}
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
        <button className={tw("scroll-to-top-btn")} onClick={scrollToTop} title="Volver arriba">
          <FaChevronUp />
        </button>
      )}
    </div>
  );
}