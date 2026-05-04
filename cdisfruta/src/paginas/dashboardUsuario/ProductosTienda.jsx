import { useState, useEffect } from 'react';
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { URL_SERVER } from "../../funciones/conexion";
import '../../assets/styles/dashboardUsuario/productos_usuario.css'

export default function ProductosTienda ({ categoria }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar las cantidades locales de cada card (por ID de producto)
  const [quantities, setQuantities] = useState({});

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart_cdisfruta');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL_SERVER}/get-productos`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setProducts(data);
        
        // Inicializamos las cantidades de todos los productos en 1
        const initialQtys = {};
        data.forEach(p => initialQtys[p._id] = 1);
        setQuantities(initialQtys);

      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart_cdisfruta', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdate'));
  }, [cart]);

  // Funciones para el contador visual
  const handleIncrease = (id, stock) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] < stock ? prev[id] + 1 : prev[id]
    }));
  };

  const handleDecrease = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1
    }));
  };

  const addToCart = (product) => {
    const quantityToAdd = quantities[product._id] || 1;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
    
    // Opcional: Reiniciar el contador de la card a 1 después de agregar
    setQuantities(prev => ({ ...prev, [product._id]: 1 }));
  };

  const productosFiltrados = categoria === "Todos los productos" 
    ? products 
    : products.filter(product => product.categoria === categoria);

  if (loading) return <div className="loading-state">Cargando delicias...</div>;

  return (
    <div className="products-grid">
      {productosFiltrados.length === 0 ? (
        <div className="no-products">
          No hay productos disponibles en la categoría "{categoria}".
        </div>
      ) : (
        productosFiltrados.map(product => (
          <div key={product._id} className="product-card">
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

                {/* CONTENEDOR DE ACCIONES (CONTADOR + BOTÓN) */}
                <div className="product-actions-vertical">
  {product.stock > 0 && (
    <div className="quantity-selector-full">
      <button 
        type="button" 
        onClick={() => handleDecrease(product._id)}
        className="qty-btn-v"
      >
        <FaMinus size={12} />
      </button>

      <span className="qty-number-v">
        {quantities[product._id] || 1}
      </span>

      <button 
        type="button" 
        onClick={() => handleIncrease(product._id, product.stock)}
        className="qty-btn-v"
      >
        <FaPlus size={12} />
      </button>
    </div>
  )}

  <button 
    className="add-to-cart-btn-full"
    onClick={() => addToCart(product)}
    disabled={product.stock === 0}
  >
    <FaShoppingCart />
    {product.stock === 0 ? 'Agotado' : 'Agregar'}
  </button>
</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}