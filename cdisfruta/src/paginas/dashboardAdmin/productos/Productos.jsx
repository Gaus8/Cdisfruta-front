// Productos.jsx
import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { URL_SERVER } from '../../../funciones/conexion';
import ListarProductos from './ListarProductos';
import FormProductos from './FormProductos';
import "../../../assets/styles/dashboardAdmin/productos_admin.css";

function Productos() {
  const [fileName, setFileName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: '',
    categoria: '',
    imagen: ''
  });
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL_SERVER}/get-productos`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', precio: '', stock: '', descripcion: '', categoria: '', imagen: '' });
    setFileName('');
    setUploadStatus('');
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      descripcion: product.descripcion,
      categoria: product.categoria,
      imagen: product.imagen || ''
    });
    setFileName(product.imagen ? 'Imagen existente' : '');
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      const response = await fetch(`${URL_SERVER}/productos/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // ... (tus funciones handleFileSelect, handleDrop, etc., se mantienen igual)

  if (loading) return <div className="loading-state">Cargando catálogo...</div>;

  return (
    <div className="admin-products-page">
      <header className="products-header">
        <div className="header-info">
          <h2 className="main-title">Catálogo de Productos</h2>
          <p className="subtitle">Aquí puedes agregar, editar y organizar todos los artículos disponibles para la venta en línea.</p>
        </div>
        <button className="btn-add-product" onClick={handleAddProduct}>
          <FaPlus /> <span>Registrar Nuevo Producto</span>
        </button>
      </header>

      <main className="products-grid-container">
        <ListarProductos
          products={products}
          handleDeleteProduct={handleDeleteProduct}
          handleEditProduct={handleEditProduct} 
        />
      </main>

      {showModal && (
        <FormProductos
          editingProduct={editingProduct}
          formData={formData}
          setFormData={setFormData}
          setShowModal={setShowModal}
          
        />
      )}
    </div>
  );
}

export default Productos;