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
    imagen: null // Aquí guardaremos el archivo real
  });
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  // 1. CARGA DE PRODUCTOS
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

  // 2. MANEJO DE INPUTS (Corregido para que no se repita)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. SELECCIÓN DE IMAGEN
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0] || event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    
    setFormData(prev => ({ ...prev, imagen: file }));
    setFileName(file.name);
    setUploadStatus('success');
  };

  // 4. FUNCIONES DE DRAG & DROP
  const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) handleFileSelect({ target: { files } });
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = (e) => e.preventDefault();

  // 5. ACCIONES DE MODAL
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', precio: '', stock: '', descripcion: '', categoria: '', imagen: null });
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
      imagen: null // No cargamos la imagen vieja en el input de archivo
    });
    setFileName(product.imagen ? 'Imagen actual conservada' : '');
    setUploadStatus('');
    setShowModal(true);
  };

  // 6. GUARDAR PRODUCTO (Rutas corregidas: /registro-productos y /productos/:id)
  const handleSaveProduct = async () => {
    try {
      setUploadStatus('loading');
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('categoria', formData.categoria || 'General');
      
      // Enviamos el archivo con el nombre 'img' como espera tu backend
      if (formData.imagen) {
        formDataToSend.append('img', formData.imagen);
      }

      // LA CLAVE DEL 404 ESTABA AQUÍ:
      const url = editingProduct
        ? `${URL_SERVER}/productos/${editingProduct._id}`
        : `${URL_SERVER}/registro-productos`; 
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, { method, body: formDataToSend });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${errorText}`);
      }

      const result = await response.json();

      // Actualizar lista local sin recargar toda la página
      if (editingProduct) {
        setProducts(products.map(p => p._id === editingProduct._id ? result.product : p));
      } else {
        setProducts([...products, result.product]);
      }

      setUploadStatus('success');
      setShowModal(false);
      alert(result.message || 'Operación exitosa');
    } catch (error) {
      setUploadStatus('error');
      console.error(error);
      alert('Error al guardar: ' + error.message);
    }
  };

  // 7. ELIMINAR
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const response = await fetch(`${URL_SERVER}/productos/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
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
          <p className="subtitle">Aquí puedes agregar, editar y organizar todos los articulos disponibles para la venta en línea.</p>
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