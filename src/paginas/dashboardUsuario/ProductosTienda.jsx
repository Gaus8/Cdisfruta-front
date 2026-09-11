import { useState, useEffect, useMemo } from 'react';
import { FaShoppingCart, FaPlus, FaMinus, FaFilter, FaSortAmountDown, FaTimes, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { URL_SERVER } from "../../funciones/conexion";
import '../../assets/styles/dashboardUsuario/productos_usuario.css';

export default function ProductosTienda({ categoria, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // Estados temporales para los filtros
  const [tempCategoria, setTempCategoria] = useState(categoria || "Todos los productos");
  const [tempPrecioMin, setTempPrecioMin] = useState("");
  const [tempPrecioMax, setTempPrecioMax] = useState("");
  const [tempOrden, setTempOrden] = useState("recientes");

  // Estados aplicados reales
  const [selectedCategoria, setSelectedCategoria] = useState(categoria || "Todos los productos");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [orden, setOrden] = useState("recientes");
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (categoria) {
      setTempCategoria(categoria);
      setSelectedCategoria(categoria);
    }
  }, [categoria]);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart_cdisfruta');
    return savedCart ? JSON.parse(savedCart) : [];
  });

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

  const categoriasDisponibles = useMemo(() => {
    const cats = products.map(p => p.categoria).filter(Boolean);
    return ["Todos los productos", ...new Set(cats)];
  }, [products]);

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

  const formatInputCurrency = (value) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return Number(numericValue).toLocaleString("es-CO");
  };

  const handlePrecioChange = (e, setter) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setter(rawValue);
  };

  const aplicarFiltros = () => {
    setSelectedCategoria(tempCategoria);
    setPrecioMin(tempPrecioMin);
    setPrecioMax(tempPrecioMax);
    setOrden(tempOrden);
    setShowMobileFilters(false);
  };

  const limpiarFiltros = () => {
    setTempCategoria("Todos los productos");
    setTempPrecioMin("");
    setTempPrecioMax("");
    setTempOrden("recientes");

    setSelectedCategoria("Todos los productos");
    setPrecioMin("");
    setPrecioMax("");
    setOrden("recientes");
  };

  const addToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const quantityToAdd = quantities[product._id] || 1;
    const currentStorageCart = JSON.parse(localStorage.getItem('cart_cdisfruta') || "[]");
    const existingItemIndex = currentStorageCart.findIndex(item => item._id === product._id);
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = [...currentStorageCart];
      updatedCart[existingItemIndex].quantity += quantityToAdd;
    } else {
      updatedCart = [...currentStorageCart, { ...product, quantity: quantityToAdd }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart_cdisfruta', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdate'));
    
    setQuantities(prev => ({ ...prev, [product._id]: 1 }));
  };

  const productosProcesados = useMemo(() => {
    let resultado = [...products];

    if (selectedCategoria && selectedCategoria !== "Todos los productos") {
      resultado = resultado.filter(p => p.categoria === selectedCategoria);
    }

    if (precioMin !== "" && !isNaN(precioMin)) {
      resultado = resultado.filter(p => p.precio >= Number(precioMin));
    }
    if (precioMax !== "" && !isNaN(precioMax)) {
      resultado = resultado.filter(p => p.precio <= Number(precioMax));
    }

    resultado.sort((a, b) => {
      if (orden === 'asc') {
        return (a.precio || 0) - (b.precio || 0);
      } else if (orden === 'desc') {
        return (b.precio || 0) - (a.precio || 0);
      } else if (orden === 'recientes') {
        const fechaA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const fechaB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        if (fechaA.getTime() === fechaB.getTime()) {
          return b._id.localeCompare(a._id);
        }
        return fechaB - fechaA;
      }
      return 0;
    });

    return resultado;
  }, [products, selectedCategoria, precioMin, precioMax, orden]);

  if (loading) return <div className="loading-state">Cargando delicias...</div>;

  return (
    <div className="tienda-container-wrapper">
      
      {/* Botón flotante para móviles */}
      <button 
        className="mobile-filter-toggle-btn"
        onClick={() => setShowMobileFilters(true)}
      >
        <FaFilter /> Filtrar y Ordenar
      </button>

      {/* Backdrop para cerrar en móvil */}
      {showMobileFilters && (
        <div 
          className="filters-backdrop-overlay" 
          onClick={() => setShowMobileFilters(false)} 
        />
      )}

      {/* Barra de Filtros Superior Horizontal (Diseño PC) / Drawer (Móvil) */}
      <div className={`filters-advanced-container ${showMobileFilters ? 'show-mobile' : ''}`}>
        <div className="filters-header-mobile">
          <h3>Filtrar Catálogo</h3>
          <button className="close-filter-btn" onClick={() => setShowMobileFilters(false)}>
            <FaTimes size={18} />
          </button>
        </div>

        <div className="filter-group">
          <label>Categoría</label>
          <select 
            value={tempCategoria} 
            onChange={(e) => setTempCategoria(e.target.value)}
            className="filter-select"
          >
            {categoriasDisponibles.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Rango de Precios</label>
          <div className="price-inputs-wrapper">
            <div className="price-input-container">
              <span className="currency-symbol">$</span>
              <input 
                type="text" 
                placeholder="Mínimo" 
                value={formatInputCurrency(tempPrecioMin)} 
                onChange={(e) => handlePrecioChange(e, setTempPrecioMin)}
                className="price-input-colombia"
              />
            </div>
            <span className="price-dash">-</span>
            <div className="price-input-container">
              <span className="currency-symbol">$</span>
              <input 
                type="text" 
                placeholder="Máximo" 
                value={formatInputCurrency(tempPrecioMax)} 
                onChange={(e) => handlePrecioChange(e, setTempPrecioMax)}
                className="price-input-colombia"
              />
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label><FaSortAmountDown /> Ordenar por</label>
          <select 
            value={tempOrden} 
            onChange={(e) => setTempOrden(e.target.value)}
            className="filter-select"
          >
            <option value="recientes">Más recientes</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>
        </div>

        <div className="filter-actions-group">
          <button className="apply-filters-btn" onClick={aplicarFiltros}>
            <FaCheck /> Aplicar
          </button>

          {(selectedCategoria !== "Todos los productos" || precioMin !== "" || precioMax !== "" || orden !== "recientes") && (
            <button className="clear-filters-btn" onClick={limpiarFiltros}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Listado de Productos (Ocupa todo el ancho en PC) */}
      <div className="products-grid-section">
        {productosProcesados.length === 0 ? (
          <div className="no-products">
            No se encontraron productos con los filtros seleccionados.
          </div>
        ) : (
          <div className="products-grid">
            {productosProcesados.map(product => (
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
            ))}
          </div>
        )}
      </div>

    </div>
  );
}