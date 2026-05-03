import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import { URL_SERVER } from '../../../funciones/conexion';

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

        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">No hay productos registrados</div>
          ) : (
            products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.imagen ? (
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: '#f3f4f6',
                      borderRadius: '6px'
                    }} />
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.nombre}</h3>
                  <div className="product-price">${product.precio}</div>
                  <div className="product-stock">{product.stock} unidades en stock</div>
                  <div className="product-category">Categoría: {product.categoria}</div>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                    {product.descripcion}
                  </p>
                  <div className="product-actions">
                    <button className="btn btn-edit" onClick={() => handleEditProduct(product)}>
                      <FaEdit style={{ marginRight: '6px' }} /> Editar
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDeleteProduct(product._id)}>
                      <FaTrash style={{ marginRight: '6px' }} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <div className="modal-content">

                {/* Upload de imagen */}
                <div className="form-group">
                  <label>Imagen del Producto</label>
                  <div
                    className="image-upload"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCloudUploadAlt className="upload-icon" />
                    <div className="upload-text">
                      {fileName || 'Haz click o arrastra una imagen aquí'}
                    </div>
                    <div className="upload-hint">PNG, JPG, WEBP (Máx. 5MB)</div>

                    {uploadStatus === 'loading' && <div className="upload-loading">📤 Subiendo imagen...</div>}
                    {uploadStatus === 'success' && <div className="upload-success">✅ Imagen lista</div>}
                    {uploadStatus === 'error' && <div className="upload-error">❌ Error al subir imagen</div>}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    name='img'
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre del producto"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Ingresa la categoría del producto"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Precio ($) *</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    placeholder="Ingresa el precio"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Ingresa la cantidad en stock"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Ingresa una descripción del producto"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-save" onClick={handleSaveProduct}>
                  {editingProduct ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;
