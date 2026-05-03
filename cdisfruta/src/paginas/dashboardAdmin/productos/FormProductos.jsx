import { FaPlus, FaEdit, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import '../../../assets/styles/productos/form_productos.css'

export default function FormProductos({
  editingProduct, handleDragLeave, handleDragOver,
  handleDrop, fileInputRef, handleFileSelect,
  uploadStatus, formData, handleInputChange,
  handleSaveProduct,fileName,setShowModal,
  handleDeleteProduct,
}) 
{
  return (
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
  <button 
    className="btn btn-cancel" 
    onClick={() => setShowModal(false)}
    disabled={uploadStatus === 'loading'} // Bloquea cancelar mientras sube
  >
    Cancelar
  </button>
  
  <button 
    className="btn btn-save" 
    onClick={handleSaveProduct}
    disabled={uploadStatus === 'loading'} // Bloquea el botón de guardar
  >
    {uploadStatus === 'loading' ? (
      <>
        <span className="spinner"></span> Enviando...
      </>
    ) : (
      editingProduct ? 'Actualizar' : 'Guardar'
    )}
  </button>
</div>
      </div>
    </div>
  )
}