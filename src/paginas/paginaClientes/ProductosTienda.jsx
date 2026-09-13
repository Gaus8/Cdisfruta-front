import { useState, useEffect, useMemo } from 'react';
import { FaShoppingCart, FaPlus, FaMinus, FaFilter, FaSortAmountDown, FaTimes, FaCheck, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { URL_SERVER } from "../../funciones/conexion";
import '../../assets/styles/dashboardUsuario/productos_usuario.css';
import '../../assets/styles/dashboardUsuario/modal_producto.css';

export default function ProductosTienda({ categoria, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // Estado para la búsqueda global (sincronizado con la barra del header)
  const [searchTerm, setSearchTerm] = useState("");

  // Estados temporales para los filtros de la barra superior
  const [tempCategoria, setTempCategoria] = useState(categoria || "Todos los productos");
  const [tempPrecioMin, setTempPrecioMin] = useState("");
  const [tempPrecioMax, setTempPrecioMax] = useState("");
  const [tempOrden, setTempOrden] = useState("recientes");

  // Estados aplicados reales que controlan el filtrado
  const [selectedCategoria, setSelectedCategoria] = useState(categoria || "Todos los productos");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [orden, setOrden] = useState("recientes");
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Estados para la Paginación (6 productos por página)
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Estado para el Modal de Detalle de Producto y su galería de imágenes
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [imagenActiva, setImagenActiva] = useState("");

  const abrirModalDetalle = (product) => {
    setProductoSeleccionado(product);
    // Extrae tanto el array de 'imagenes' como la 'imagen' principal por compatibilidad
    const listaImagenes = product.imagenes && product.imagenes.length > 0 
      ? product.imagenes 
      : [product.imagen].filter(Boolean);
    setImagenActiva(listaImagenes[0] || "");
  };

  // Funciones para navegar entre imágenes con flechas
  const handleNextImage = () => {
    if (!productoSeleccionado) return;
    const listaImagenes = productoSeleccionado.imagenes && productoSeleccionado.imagenes.length > 0 
      ? productoSeleccionado.imagenes 
      : [productoSeleccionado.imagen].filter(Boolean);
    
    const currentIndex = listaImagenes.indexOf(imagenActiva);
    const nextIndex = (currentIndex + 1) % listaImagenes.length;
    setImagenActiva(listaImagenes[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!productoSeleccionado) return;
    const listaImagenes = productoSeleccionado.imagenes && productoSeleccionado.imagenes.length > 0 
      ? productoSeleccionado.imagenes 
      : [productoSeleccionado.imagen].filter(Boolean);
    
    const currentIndex = listaImagenes.indexOf(imagenActiva);
    const prevIndex = (currentIndex - 1 + listaImagenes.length) % listaImagenes.length;
    setImagenActiva(listaImagenes[prevIndex]);
  };

  // Escuchar eventos globales de búsqueda desde la barra superior de la app
  useEffect(() => {
    const handleSearchEvent = (e) => {
      setSearchTerm(e.detail || "");
      setCurrentPage(1);
    };

    window.addEventListener('productSearch', handleSearchEvent);

    const storedSearch = sessionStorage.getItem('search_cdisfruta') || "";
    if (storedSearch) {
      setSearchTerm(storedSearch);
    }

    const handleStorageChange = () => {
      const currentSearch = sessionStorage.getItem('search_cdisfruta') || "";
      setSearchTerm(currentSearch);
      setCurrentPage(1);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('productSearch', handleSearchEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sincronizar categoría si cambia por props externas
  useEffect(() => {
    if (categoria) {
      setTempCategoria(categoria);
      setSelectedCategoria(categoria);
      setCurrentPage(1);
    }
  }, [categoria]);

  // Estado inicial del carrito desde localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart_cdisfruta');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Escuchar cambios externos en el carrito
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

  // Extraer categorías únicas para el select dinámico
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

  // Formatear números a formato de moneda colombiana en los inputs (ej: 50.000)
  const formatInputCurrency = (value) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return Number(numericValue).toLocaleString("es-CO");
  };

  const handlePrecioChange = (e, setter) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setter(rawValue);
  };

  // Aplicar filtros al hacer clic y regresar a la página 1
  const aplicarFiltros = () => {
    setSelectedCategoria(tempCategoria);
    setPrecioMin(tempPrecioMin);
    setPrecioMax(tempPrecioMax);
    setOrden(tempOrden);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setTempCategoria("Todos los productos");
    setTempPrecioMin("");
    setTempPrecioMax("");
    setTempOrden("recientes");

    setSelectedCategoria("Todos los productos");
    setPrecioMin("");
    setPrecioMax("");
    setOrden("recientes");
    setSearchTerm("");
    sessionStorage.removeItem('search_cdisfruta');
    setCurrentPage(1);
  };

  // Función de agregar al carrito (valida sesión si es invitado)
  const addToCart = (product, customQty = null) => {
    if (!user) {
      alert("Para añadir productos al carrito e iniciar tu compra, por favor inicia sesión o regístrate.");
      navigate('/login');
      return;
    }

    const quantityToAdd = customQty !== null ? customQty : (quantities[product._id] || 1);
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

  // Lógica combinada de Búsqueda, Filtrado y Ordenamiento
  const productosFiltradosYOrdenados = useMemo(() => {
    let resultado = [...products];

    if (searchTerm.trim() !== "") {
      const termino = searchTerm.toLowerCase();
      resultado = resultado.filter(p => 
        (p.nombre && p.nombre.toLowerCase().includes(termino)) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(termino)) ||
        (p.categoria && p.categoria.toLowerCase().includes(termino))
      );
    }

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
  }, [products, searchTerm, selectedCategoria, precioMin, precioMax, orden]);

  // Cálculos de Paginación (6 por página)
  const totalPages = Math.ceil(productosFiltradosYOrdenados.length / productsPerPage);
  
  const productosPaginados = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return productosFiltradosYOrdenados.slice(start, start + productsPerPage);
  }, [productosFiltradosYOrdenados, currentPage]);

  if (loading) return <div className="loading-state">Cargando delicias...</div>;

  return (
    <div className="tienda-container-wrapper" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
      
      {/* Botón flotante para móviles */}
      <button 
        className="mobile-filter-toggle-btn"
        onClick={() => setShowMobileFilters(true)}
      >
        <FaFilter /> Filtrar y Ordenar
      </button>

      {/* Overlay para cerrar al hacer clic fuera en móviles */}
      {showMobileFilters && (
        <div 
          className="filters-backdrop-overlay" 
          onClick={() => setShowMobileFilters(false)} 
        />
      )}

      {/* Barra de Filtros Superior */}
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

          {(selectedCategoria !== "Todos los productos" || precioMin !== "" || precioMax !== "" || orden !== "recientes" || searchTerm !== "") && (
            <button className="clear-filters-btn" onClick={limpiarFiltros}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Listado de Productos y Paginación */}
      <div className="products-grid-section">
        {searchTerm && (
          <div className="search-active-indicator" style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#64748b' }}>
            Resultados de búsqueda para: <strong>"{searchTerm}"</strong>
          </div>
        )}

        {productosFiltradosYOrdenados.length === 0 ? (
          <div className="no-products">
            No se encontraron productos con los filtros o búsqueda seleccionados.
          </div>
        ) : (
          <>
            <div className="products-grid">
              {productosPaginados.map(product => (
                <div key={product._id} className="product-card">
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="product-tag alert">¡Últimas unidades!</span>
                  )}
                  {product.stock === 0 && (
                    <span className="product-tag out">Agotado</span>
                  )}

                  <div className="product-image" onClick={() => abrirModalDetalle(product)} style={{ cursor: 'pointer' }} title="Ver detalle">
                    {product.imagen ? (
                      <img src={product.imagen} alt={product.nombre} />
                    ) : (
                      <div className="placeholder-img" />
                    )}
                    <div className="quick-view-overlay">
                      <FaEye /> Ver Detalle
                    </div>
                  </div>

                  <div className="product-info">
                    <span className="product-category-label">{product.categoria}</span>
                    <h3 onClick={() => abrirModalDetalle(product)} style={{ cursor: 'pointer' }}>{product.nombre}</h3>
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

            {/* Controles de Paginación */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft size={12} /> Anterior
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`page-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL DE DETALLE DE PRODUCTO CON GALERÍA Y FLECHAS */}
      {productoSeleccionado && (
        <div className="product-modal-overlay" onClick={() => setProductoSeleccionado(null)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setProductoSeleccionado(null)}>
              <FaTimes size={18} />
            </button>

            <div className="modal-body-grid">
              
              {/* CONTENEDOR DE MULTIPLES IMÁGENES, FLECHAS Y MINIATURAS */}
              <div className="modal-image-gallery-container">
                <div className="modal-main-image-wrapper" style={{ position: 'relative' }}>
                  {imagenActiva ? (
                    <>
                      <img src={imagenActiva} alt={productoSeleccionado.nombre} />
                      
                      {/* Flechas de navegación si hay más de una imagen */}
                      {((productoSeleccionado.imagenes && productoSeleccionado.imagenes.length > 1) || 
                        (!productoSeleccionado.imagenes && productoSeleccionado.imagen)) && (
                        <>
                          <button 
                            type="button" 
                            className="modal-slider-arrow modal-prev" 
                            onClick={handlePrevImage}
                          >
                            <FaChevronLeft size={14} />
                          </button>
                          <button 
                            type="button" 
                            className="modal-slider-arrow modal-next" 
                            onClick={handleNextImage}
                          >
                            <FaChevronRight size={14} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="placeholder-img" />
                  )}
                </div>

                {/* Miniaturas de diferentes ángulos */}
                {productoSeleccionado.imagenes && productoSeleccionado.imagenes.length > 1 && (
                  <div className="modal-thumbnails-grid">
                    {productoSeleccionado.imagenes.map((imgUrl, index) => (
                      <button 
                        key={index} 
                        type="button"
                        className={`thumbnail-btn ${imagenActiva === imgUrl ? 'active' : ''}`}
                        onClick={() => setImagenActiva(imgUrl)}
                      >
                        <img src={imgUrl} alt={`${productoSeleccionado.nombre} vista ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-details-container">
                <span className="product-category-label">{productoSeleccionado.categoria}</span>
                <h2>{productoSeleccionado.nombre}</h2>
                
                <div className="modal-price-box">
                  <span className="price-label">PRECIO UNITARIO</span>
                  <span className="product-price">
                    ${productoSeleccionado.precio ? productoSeleccionado.precio.toLocaleString("es-CO") : "0"}
                  </span>
                  <span className="product-stock-text">
                    {productoSeleccionado.stock > 0 ? `${productoSeleccionado.stock} unidades disponibles` : 'Sin existencias'}
                  </span>
                </div>

                <div className="modal-description-box">
                  <h4>Descripción detallada</h4>
                  <p>{productoSeleccionado.descripcion || "Este producto artesanal de CDISFRUTA no cuenta con una descripción detallada adicional, pero garantiza el mejor estándar de calidad natural."}</p>
                </div>

                {productoSeleccionado.stock > 0 && (
                  <div className="product-detail-actions">
                    <div className="product-detail-qty-box">
                      <button 
                        type="button" 
                        onClick={() => handleDecrease(productoSeleccionado._id)} 
                        className="product-detail-qty-btn"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="product-detail-qty-number">{quantities[productoSeleccionado._id] || 1}</span>
                      <button 
                        type="button" 
                        onClick={() => handleIncrease(productoSeleccionado._id, productoSeleccionado.stock)} 
                        className="product-detail-qty-btn"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <button 
                      className="product-detail-submit-btn"
                      onClick={() => {
                        addToCart(productoSeleccionado);
                        setProductoSeleccionado(null);
                      }}
                    >
                      <FaShoppingCart size={18} /> Agregar al Carrito
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}