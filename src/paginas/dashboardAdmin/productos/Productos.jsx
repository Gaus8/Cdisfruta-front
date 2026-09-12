// Productos.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router"; 
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
  
  // Modificado: 'imagenes' ahora maneja múltiples archivos (array)
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: '',
    categoria: '',
    imagenes: [] 
  });
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const location = useLocation();

  // 1. LÓGICA DE ACCESO RÁPIDO (Desde HomeAdmin)
  useEffect(() => {
    if (location.state?.openModal) {
      const timer = setTimeout(() => {
        handleAddProduct(); 
      }, 100);

      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  // 2. CARGA DE PRODUCTOS INICIAL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL_SERVER}/get-productos`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 3. MANEJO DE INPUTS Y ARCHIVOS MÚLTIPLES
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const validFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`La imagen "${file.name}" es demasiado grande. Máximo 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setFormData(prev => ({ ...prev, imagenes: validFiles }));
    setFileName(`${validFiles.length} imagen(es) seleccionada(s)`);
    setUploadStatus('success');
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) handleFileSelect({ target: { files } });
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = (e) => e.preventDefault();

  // 4. CONTROL DE MODAL
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', precio: '', stock: '', descripcion: '', categoria: '', imagenes: [] });
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
      imagenes: [] // Se dejan vacías si no se quieren sobreescribir las existentes
    });
    setFileName(product.imagenes?.length ? `${product.imagenes.length} imagen(es) actual(es) conservada(s)` : (product.imagen ? 'Imagen actual conservada' : ''));
    setUploadStatus('');
    setShowModal(true);
  };

  // 5. GUARDAR PRODUCTO (POST / PUT)
  const handleSaveProduct = async () => {
    if (!formData.nombre || !formData.precio || !formData.stock) {
      alert("Por favor rellena los campos obligatorios (*)");
      return;
    }

    try {
      setUploadStatus('loading');
      const formDataToSend = new FormData();
      
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('categoria', formData.categoria || 'General');
      
      // Adjuntamos cada archivo seleccionado bajo el mismo campo (ej: 'imagenes' o 'imagen' según soporte tu backend)
      if (formData.imagenes && formData.imagenes.length > 0) {
        formData.imagenes.forEach((file) => {
          formDataToSend.append('imagenes', file); 
        });
      }

      const url = editingProduct
        ? `${URL_SERVER}/productos/${editingProduct._id}`
        : `${URL_SERVER}/registro-productos`; 
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, { 
        method, 
        body: formDataToSend 
      });
      
      if (!response.ok) {
        const errorText = await response.text(); 
        console.error("Detalle del error del servidor:", errorText);
        throw new Error(`Error del servidor (${response.status}). Revisa que todos los campos sean válidos.`);
      }

      const result = await response.json();

      if (editingProduct) {
        setProducts(products.map(p => p._id === editingProduct._id ? result.product : p));
      } else {
        setProducts([...products, result.product]);
      }

      setUploadStatus('success');
      setShowModal(false);
      alert('¡Producto guardado exitosamente!');
    } catch (error) {
      setUploadStatus('error');
      console.error(error);
      alert(error.message);
    }
  };

  // 6. ELIMINAR PRODUCTO
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const response = await fetch(`${URL_SERVER}/productos/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('No se pudo eliminar el producto del servidor.');
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) return <div className="loading-state">Cargando catálogo de CDISFRUTA...</div>;

  return (
    <div className="admin-products-page">
      <header className="products-header">
        <div className="header-info">
          <h2 className="main-title">Catálogo de Productos</h2>
          <p className="subtitle">Gestiona los artículos de la tienda desde aquí.</p>
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
        />
      )}
    </div>
  );
}

export default Productos;