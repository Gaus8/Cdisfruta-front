// Productos.jsx
import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { URL_SERVER } from '../../../funciones/conexion';
import ListarProductos from './ListarProductos';
import FormProductos from './FormProductos';
import "../../../assets/styles/dashboardAdmin/productos_admin.css";

function Productos() {
  // --- ESTADOS ---
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

  // --- CARGA DE DATOS ---
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

  // --- MANEJO DE FORMULARIO (INPUTS) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // --- FUNCIONES DE BOTONES PRINCIPALES ---
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
    setUploadStatus(''); // Reset status al abrir
    setShowModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      setUploadStatus('loading');
      
      const metodo = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `${URL_SERVER}/productos/${editingProduct._id}` 
        : `${URL_SERVER}/productos`;

      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar el producto');

      // Refrescar lista (puedes volver a llamar a fetchProducts o actualizar el estado local)
      window.location.reload(); 
      
      setUploadStatus('success');
      setShowModal(false);
    } catch (error) {
      setUploadStatus('error');
      alert("Error: " + error.message);
    }
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

  // --- MANEJO DE ARCHIVOS E IMÁGENES ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploadStatus('success');
      // Aquí podrías implementar la subida real a Cloudinary/S3
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setUploadStatus('success');
    }
  };

  // --- RENDER ---
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
          setShowModal={setShowModal}
          handleInputChange={handleInputChange}
          handleSaveProduct={handleSaveProduct}
          fileInputRef={fileInputRef}
          fileName={fileName}
          uploadStatus={uploadStatus}
          handleFileSelect={handleFileSelect}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDeleteProduct={handleDeleteProduct}
        />
      )}
    </div>
  );
}

export default Productos;