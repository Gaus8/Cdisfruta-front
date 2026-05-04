import { useState, useEffect } from 'react';
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { URL_SERVER } from "../../funciones/conexion";
import '../../assets/styles/dashboardUsuario/productos_usuario.css'

// Se agrega la prop 'categoria' que viene desde DashboardUsuario
export default function ProductosTienda ({ categoria }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL_SERVER}/get-productos`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // LÓGICA DE FILTRADO:
  // Si la categoría es "Todos los productos", mostramos todo.
  // De lo contrario, filtramos los productos que coincidan exactamente con la categoría seleccionada.
  const productosFiltrados = categoria === "Todos los productos" 
    ? products 
    : products.filter(product => product.categoria === categoria);

  if (loading) return <div className="loading-state">Cargando delicias...</div>;

  return (
    <div className="products-grid">
      {/* Usamos productosFiltrados en lugar de products para el renderizado */}
      {productosFiltrados.length === 0 ? (
        <div className="no-products">
          No hay productos disponibles en la categoría "{categoria}".
        </div>
      ) : (
        productosFiltrados.map(product => (
          <div key={product._id} className="product-card">
            {/* Tag Dinámico */}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="product-tag alert">¡Últimas unidades!</span>
            )}
            {product.stock === 0 && (
              <span className="product-tag out">Agotado</span>
            )}

            <div className="product-image">
              {product.imagen ? (
                <img src={product.imagen} alt={product.nombre} />
              ) : (
                <div className="placeholder-img" />
              )}
            </div>

            <div className="product-info">
              <span className="product-category-label">{product.categoria}</span>
              <h3>{product.nombre}</h3>
              <p className="product-description-short">
                {product.descripcion ? product.descripcion.substring(0, 60) : "Sin descripción"}...
              </p>
              
              <div className="product-footer">
                <div className="price-container">
                  <span className="price-label">Precio</span>
                  <span className="product-price">
                    ${product.precio ? product.precio.toLocaleString("es-CO") : "0"}
                  </span>
                </div>

                <button 
                  className="add-to-cart-btn"
                  onClick={() => console.log("Agregar:", product._id)}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart /> {product.stock === 0 ? 'Agotado' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}