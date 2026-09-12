import { useState, useEffect } from 'react';
import { FaTimes, FaCloudUploadAlt, FaExclamationTriangle } from 'react-icons/fa';
import '../../../assets/styles/productos/form_productos.css';

export default function FormProductos({
  editingProduct, handleDragLeave, handleDragOver,
  handleDrop, fileInputRef, handleFileSelect,
  uploadStatus, formData, handleInputChange,
  handleSaveProduct, setShowModal,
}) {
  const [previews, setPreviews] = useState([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false); // Estado para el sub-modal de confirmación

  useEffect(() => {
    const newPreviews = [];

    if (editingProduct && editingProduct.imagenes && Array.isArray(editingProduct.imagenes)) {
      editingProduct.imagenes.forEach((imgUrl, idx) => {
        newPreviews.push({ type: 'existing', url: imgUrl, index: idx });
      });
    } else if (editingProduct && editingProduct.imagen && !editingProduct.imagenes) {
      newPreviews.push({ type: 'existing', url: editingProduct.imagen, index: 0 });
    }

    if (formData.imagenes && formData.imagenes.length > 0) {
      for (let i = 0; i < formData.imagenes.length; i++) {
        const file = formData.imagenes[i];
        newPreviews.push({ type: 'new', url: URL.createObjectURL(file), file: file });
      }
    }

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(item => {
        if (item.type === 'new' && item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [formData.imagenes, editingProduct]);

  const handleRemoveImage = (itemToRemove) => {
    if (itemToRemove.type === 'new') {
      const updatedFiles = formData.imagenes.filter(file => 
        !(file.name === itemToRemove.file.name && file.size === itemToRemove.file.size)
      );
      handleInputChange({
        target: { name: 'imagenes', value: updatedFiles }
      });
    } else if (itemToRemove.type === 'existing') {
      if (editingProduct && editingProduct.imagenes) {
        const updatedExisting = editingProduct.imagenes.filter((_, idx) => idx !== itemToRemove.index);
        editingProduct.imagenes = updatedExisting;
        setPreviews(prev => prev.filter(p => !(p.type === 'existing' && p.index === itemToRemove.index)));
      } else if (editingProduct && editingProduct.imagen) {
        editingProduct.imagen = null;
        setPreviews(prev => prev.filter(p => p.type !== 'existing'));
      }
    }
  };

  const hasImagesClass = previews.length > 0 ? 'has-images' : '';

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
        
        {/* Botón X superior */}
        <button 
          type="button" 
          className="close-modal-btn" 
          onClick={() => setShowConfirmClose(true)}
          title="Cerrar"
        >
          <FaTimes size={16} />
        </button>

        <div className="modal-content scrollable-content">

          {/* Sección de Imágenes */}
          <div className="form-group">
            <label>Imágenes del Producto (Máx. 5)</label>

            <div className={`upload-section-wrapper ${hasImagesClass}`}>
              <div className="images-preview-container">
                {previews.map((item, index) => (
                  <div key={index} className="preview-thumbnail">
                    <img src={item.url} alt={`Vista previa ${index + 1}`} />
                    <button 
                      type="button" 
                      className="delete-img-btn" 
                      onClick={() => handleRemoveImage(item)}
                      title="Eliminar imagen"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>

              {previews.length < 5 && (
                <div
                  className="image-upload-dropzone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt className="upload-icon" />
                  <div className="upload-text">
                    {previews.length === 0 ? 'Haz click o arrastra imágenes aquí' : 'Agregar'}
                  </div>
                  <div className="upload-hint">PNG, JPG (Máx. 5MB)</div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileSelect}
              accept="image/png, image/jpeg, image/webp"
              name="imagenes"
              style={{ display: 'none' }}
            />

            {uploadStatus === 'loading' && <div className="upload-loading">📤 Subiendo imágenes...</div>}
            {uploadStatus === 'error' && <div className="upload-error">❌ Error al subir imágenes</div>}
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Nombre del Producto *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleInputChange}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>Categoría *</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria || ''}
                onChange={handleInputChange}
                placeholder="Categoría"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Precio ($) *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio || ''}
                onChange={handleInputChange}
                placeholder="Precio"
                required
                min="0"
              />
            </div>
            <div className="form-group col-md-6">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock || ''}
                onChange={handleInputChange}
                placeholder="Stock"
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleInputChange}
              placeholder="Descripción detallada"
              required
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn btn-cancel" 
            onClick={() => setShowConfirmClose(true)}
            disabled={uploadStatus === 'loading'}
          >
            Cancelar
          </button>
          
          <button 
            className="btn btn-save" 
            onClick={handleSaveProduct}
            disabled={uploadStatus === 'loading' || !formData.nombre} 
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

        {/* Sub-modal interno de confirmación para descartar cambios */}
        {showConfirmClose && (
          <div className="submodal-confirm-overlay">
            <div className="submodal-confirm-content">
              <FaExclamationTriangle className="submodal-warning-icon" />
              <h3>¿Descartar cambios?</h3>
              <p>Si sales ahora, los cambios no guardados se perderán.</p>
              <div className="submodal-actions">
                <button 
                  type="button" 
                  className="btn-submodal-cancel" 
                  onClick={() => setShowConfirmClose(false)}
                >
                  Continuar editando
                </button>
                <button 
                  type="button" 
                  className="btn-submodal-confirm" 
                  onClick={() => setShowModal(false)}
                >
                  Sí, descartar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}