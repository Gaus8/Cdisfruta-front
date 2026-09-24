import { tw } from '../../funciones/tw.js';
import { useState, useEffect, useMemo } from 'react';
import { FaShoppingCart, FaPlus, FaMinus, FaFilter, FaSortAmountDown, FaTimes, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { URL_SERVER } from "../../funciones/conexion";

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

  // Escuchar eventos globales de búsqueda desde la barra superior de la app
  useEffect(() => {
    const handleSearchEvent = (e) => {
      setSearchTerm(e.detail || "");
      setCurrentPage(1);
    };

    // Si guardas la búsqueda en un evento personalizado o localStorage
    window.addEventListener('productSearch', handleSearchEvent);

    // Opcional: leer si ya hay un valor previo en sessionStorage/localStorage al cargar
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
  const addToCart = (product) => {
    if (!user) {
      alert("Para añadir productos al carrito e iniciar tu compra, por favor inicia sesión o regístrate.");
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

  // Lógica combinada de Búsqueda, Filtrado y Ordenamiento
  const productosFiltradosYOrdenados = useMemo(() => {
    let resultado = [...products];

    // 1. Filtrar por Barra de Búsqueda (nombre o descripción)
    if (searchTerm.trim() !== "") {
      const termino = searchTerm.toLowerCase();
      resultado = resultado.filter(p => 
        (p.nombre && p.nombre.toLowerCase().includes(termino)) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(termino)) ||
        (p.categoria && p.categoria.toLowerCase().includes(termino))
      );
    }

    // 2. Filtrar por Categoría
    if (selectedCategoria && selectedCategoria !== "Todos los productos") {
      resultado = resultado.filter(p => p.categoria === selectedCategoria);
    }

    // 3. Filtrar por Rango de Precios
    if (precioMin !== "" && !isNaN(precioMin)) {
      resultado = resultado.filter(p => p.precio >= Number(precioMin));
    }
    if (precioMax !== "" && !isNaN(precioMax)) {
      resultado = resultado.filter(p => p.precio <= Number(precioMax));
    }

    // 4. Ordenamiento
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

  if (loading) return <div className={tw("loading-state")}>Cargando delicias...</div>;

  return (
    <div className={tw("tienda-container-wrapper")}>
      
      {/* Botón flotante para móviles */}
      <button 
        className={tw("mobile-filter-toggle-btn")}
        onClick={() => setShowMobileFilters(true)}
      >
        <FaFilter /> Filtrar y Ordenar
      </button>

      {/* Overlay para cerrar al hacer clic fuera en móviles */}
      {showMobileFilters && (
        <div 
          className={tw("filters-backdrop-overlay")} 
          onClick={() => setShowMobileFilters(false)} 
        />
      )}

      {/* Barra de Filtros Superior */}
      <div className={tw(`filters-advanced-container ${showMobileFilters ? 'show-mobile' : ''}`)}>
        <div className={tw("filters-header-mobile")}>
          <h3>Filtrar Catálogo</h3>
          <button className={tw("close-filter-btn")} onClick={() => setShowMobileFilters(false)}>
            <FaTimes size={18} />
          </button>
        </div>

        <div className={tw("filter-group")}>
          <label>Categoría</label>
          <select 
            value={tempCategoria} 
            onChange={(e) => setTempCategoria(e.target.value)}
            className={tw("filter-select")}
          >
            {categoriasDisponibles.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={tw("filter-group")}>
          <label>Rango de Precios</label>
          <div className={tw("price-inputs-wrapper")}>
            <div className={tw("price-input-container")}>
              <span className={tw("currency-symbol")}>$</span>
              <input 
                type="text" 
                placeholder="Mínimo" 
                value={formatInputCurrency(tempPrecioMin)} 
                onChange={(e) => handlePrecioChange(e, setTempPrecioMin)}
                className={tw("price-input-colombia")}
              />
            </div>
            <span className={tw("price-dash")}>-</span>
            <div className={tw("price-input-container")}>
              <span className={tw("currency-symbol")}>$</span>
              <input 
                type="text" 
                placeholder="Máximo" 
                value={formatInputCurrency(tempPrecioMax)} 
                onChange={(e) => handlePrecioChange(e, setTempPrecioMax)}
                className={tw("price-input-colombia")}
              />
            </div>
          </div>
        </div>

        <div className={tw("filter-group")}>
          <label><FaSortAmountDown /> Ordenar por</label>
          <select 
            value={tempOrden} 
            onChange={(e) => setTempOrden(e.target.value)}
            className={tw("filter-select")}
          >
            <option value="recientes">Más recientes</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>
        </div>

        <div className={tw("filter-actions-group")}>
          <button className={tw("apply-filters-btn")} onClick={aplicarFiltros}>
            <FaCheck /> Aplicar
          </button>

          {(selectedCategoria !== "Todos los productos" || precioMin !== "" || precioMax !== "" || orden !== "recientes" || searchTerm !== "") && (
            <button className={tw("clear-filters-btn")} onClick={limpiarFiltros}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Listado de Productos y Paginación */}
      <div className={tw("products-grid-section")}>
        {searchTerm && (
          <div className={tw(tw("search-active-indicator"), "![margin-bottom:15px]", "![font-size:0.9rem]", "![color:#64748b]")} >
            Resultados de búsqueda para: <strong>"{searchTerm}"</strong>
          </div>
        )}

        {productosFiltradosYOrdenados.length === 0 ? (
          <div className={tw("no-products")}>
            No se encontraron productos con los filtros o búsqueda seleccionados.
          </div>
        ) : (
          <>
            <div className={tw("products-grid")}>
              {productosPaginados.map(product => (
                <div key={product._id} className={tw("product-card")}>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className={tw("product-tag alert")}>¡Últimas unidades!</span>
                  )}
                  {product.stock === 0 && (
                    <span className={tw("product-tag out")}>Agotado</span>
                  )}

                  <div className={tw("product-image")}>
                    {product.imagen ? (
                      <img src={product.imagen} alt={product.nombre} />
                    ) : (
                      <div className={tw("placeholder-img")} />
                    )}
                  </div>

                  <div className={tw("product-info")}>
                    <span className={tw("product-category-label")}>{product.categoria}</span>
                    <h3>{product.nombre}</h3>
                    <p className={tw("product-description-short")}>
                      {product.descripcion ? product.descripcion.substring(0, 60) : "Sin descripción"}...
                    </p>
                    
                    <div className={tw("product-footer")}>
                      <div className={tw("price-container")}>
                        <span className={tw("price-label")}>PRECIO</span>
                        <span className={tw("product-price")}>
                          ${product.precio ? product.precio.toLocaleString("es-CO") : "0"}
                        </span>
                        <span className={tw("product-stock-text")}>
                          {product.stock > 0 ? `${product.stock} disponibles` : 'Sin existencias'}
                        </span>
                      </div>

                      <div className={tw("product-actions-vertical")}>
                        {product.stock > 0 && (
                          <div className={tw("quantity-selector-full")}>
                            <button type="button" onClick={() => handleDecrease(product._id)} className={tw("qty-btn-v")}>
                              <FaMinus size={12} />
                            </button>
                            <span className={tw("qty-number-v")}>{quantities[product._id] || 1}</span>
                            <button type="button" onClick={() => handleIncrease(product._id, product.stock)} className={tw("qty-btn-v")}>
                              <FaPlus size={12} />
                            </button>
                          </div>
                        )}

                        <button 
                          className={tw("add-to-cart-btn-full")}
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
              <div className={tw("pagination-container")}>
                <button 
                  className={tw("pagination-btn")}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft size={12} /> Anterior
                </button>

                <div className={tw("pagination-numbers")}>
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={tw(`page-number-btn ${currentPage === pageNum ? 'active' : ''}`)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  className={tw("pagination-btn")}
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

    </div>
  );
}