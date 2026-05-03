import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import { URL_SERVER } from '../../../funciones/conexion';
import ListarProductos from './ListarProductos';
import FormProductos from './FormProductos';

function Productos() {
  const [fileName, setFileName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false)
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
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [URL_SERVER]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      precio: '',
      stock: '',
      descripcion: '',
      categoria: '',
      imagen: ''
    });
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
    setUploadStatus('');
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      const response = await fetch(`${URL_SERVER}/productos/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar producto');
      const result = await response.json();
      setProducts(products.filter(product => product._id !== productId));
      alert(result.message);
    } catch (error) {
      alert('Error al eliminar el producto: ' + error.message);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    setFormData(prev => ({ ...prev, imagen: file }));
    setFileName(file.name);
    setUploadStatus('success');
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    const files = event.dataTransfer.files;
    if (files.length > 0) await handleFileSelect({ target: { files } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = async () => {
    try {
      setEnviando(true);
      setUploadStatus('loading');
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('categoria', formData.categoria || 'General');
      if (formData.imagen) formDataToSend.append('img', formData.imagen);

      const url = editingProduct
        ? `${URL_SERVER}/productos/${editingProduct._id}`
        : `${URL_SERVER}/registro-productos`;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, { method, body: formDataToSend });
      if (!response.ok) throw new Error('Error al guardar producto');
      const result = await response.json();

      if (editingProduct) {
        setProducts(products.map(p => p._id === editingProduct._id ? result.product : p));
      } else {
        setProducts([...products, result.product]);
      }

      setUploadStatus('success');
      setFileName('');
      setEnviando(false)
      setShowModal(false);
      alert(result.message);
    } catch (error) {
      setUploadStatus('error');
      alert('Error al guardar el producto: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="products-container">
          <div className="loading">Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="products-container">
        <div className="table-header">
          <h2 className="title">Lista de Productos</h2>
          <button className="add-btn" onClick={handleAddProduct}>
            <FaPlus style={{ marginRight: '8px' }} />
            Agregar Producto
          </button>
        </div>

        <ListarProductos
          products={products}
          handleDeleteProduct={handleDeleteProduct}
          handleEditProduct={handleEditProduct} />

        {showModal && (
          <FormProductos
            editingProduct={editingProduct}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSaveProduct={handleSaveProduct}
            uploadStatus={uploadStatus}
            setShowModal={setShowModal}
            fileName={fileName}
            handleDeleteProduct={handleDeleteProduct}
            enviando={enviando}
          />
        )}
      </div>
    </div>
  );
}

export default Productos;
