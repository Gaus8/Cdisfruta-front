import { useState, useEffect } from 'react';
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importamos para la redirección
import { URL_SERVER } from "../../funciones/conexion";
import '../../assets/styles/dashboardUsuario/productos_usuario.css';

export default function ProductosTienda({ categoria, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate(); // Hook para navegar

  // Estado inicial del carrito desde localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart_cdisfruta');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Escuchar cambios externos (desde el Modal o Header)
  useEffect(() => {
    const syncCart = () => {
      const savedCart = localStorage.getItem('cart_cdisfruta');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      setCart(parsedCart);
    };

    window.addEventListener('cartUpdate', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('cartUpdate', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  // Carga de productos desde el servidor
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL_SERVER}/get-productos`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setProducts(data);
        
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

  // Función de agregar mejorada con validación de Usuario
  const addToCart = (product) => {
    // 1. VERIFICACIÓN DE SESIÓN
    if (!user) {
      return;
    }

    // 2. LÓGICA NORMAL DE CARRITO (Si el usuario existe)
    const quantityToAdd = quantities[product._id] || 1;
    
    // Leemos el storage actual para evitar "fantasmas" de items borrados
    const currentStorageCart = JSON.parse(localStorage.getItem('cart_cdisfruta') || "[]");
    const existingItemIndex = currentStorageCart.findIndex(item => item._id === product._id);
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = [...currentStorageCart];
      updatedCart[existingItemIndex].quantity += quantityToAdd;
    } else {
      updatedCart = [...currentStorageCart, { ...product, quantity: quantityToAdd }];
    }

    // Actualizamos estado, storage y disparamos evento
    setCart(updatedCart);
    localStorage.setItem('cart_cdisfruta', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdate'));
    
    // Resetear cantidad visual a 1
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
                  <span className="price-label">PRECIO</span>
                  <span className="product-price">
                    ${product.precio ? product.precio.toLocaleString("es-CO") : "0"}
                  </span>
                  <span className="product-stock-text">
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Sin existencias'}
                  </span>
                </div>

                <div className="product-actions-vertical">
                  {product.stock > 0 && (
                    <div className="quantity-selector-full">
                      <button type="button" onClick={() => handleDecrease(product._id)} className="qty-btn-v">
                        <FaMinus size={12} />
                      </button>
                      <span className="qty-number-v">{quantities[product._id] || 1}</span>
                      <button type="button" onClick={() => handleIncrease(product._id, product.stock)} className="qty-btn-v">
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