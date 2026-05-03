import { useState, useEffect } from 'react';
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { URL_SERVER } from "../../funciones/conexion";
import '../../assets/styles/dashboardUsuario/productos_usuario.css'

export default function ProductosTienda () {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Llamada a tu API real
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

  if (loading) return <div className="loading-state">Cargando delicias...</div>;

  return (
    <div className="products-grid">
      {products.length === 0 ? (
        <div className="no-products">No hay productos disponibles en este momento.</div>
      ) : (
        products.map(product => (
          <div key={product._id} className="product-card">
            {/* Tag Dinámico: Si el stock es bajo, mostrar "Últimas unidades" */}
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
                {product.descripcion.substring(0, 60)}...
              </p>
              
              <div className="product-footer">
                <div className="price-container">
                  <span className="price-label">Precio</span>
                  <span className="product-price">
                    ${product.precio.toLocaleString("es-CO")}
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