import { tw } from '../../../funciones/tw.js';
import { useState, useEffect } from 'react';
import { FaTimes, FaCloudUploadAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function FormProductos({
  editingProduct, handleDragLeave, handleDragOver,
  handleDrop, fileInputRef, handleFileSelect,
  uploadStatus, formData, handleInputChange,
  handleSaveProduct, setShowModal,
}) {
  const [previews, setPreviews] = useState([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  
  // Estado local para manejar las imágenes existentes y permitir su actualización inmediata al eliminarlas
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      const imgs = editingProduct.imagenes && Array.isArray(editingProduct.imagenes)
        ? [...editingProduct.imagenes]
        : (editingProduct.imagen ? [editingProduct.imagen] : []);
      setExistingImages(imgs);
    } else {
      setExistingImages([]);
    }
  }, [editingProduct]);

  useEffect(() => {
    const newPreviews = [];

    // 1. Imágenes existentes desde el estado local
    existingImages.forEach((imgUrl, idx) => {
      newPreviews.push({ type: 'existing', url: imgUrl, index: idx });
    });

    // 2. Archivos nuevos seleccionados
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
  }, [existingImages, formData.imagenes]);

  const handleRemoveImage = (itemToRemove) => {
    if (itemToRemove.type === 'new') {
      const updatedFiles = formData.imagenes.filter(file => 
        !(file.name === itemToRemove.file.name && file.size === itemToRemove.file.size)
      );
      handleInputChange({
        target: { name: 'imagenes', value: updatedFiles }
      });
    } else if (itemToRemove.type === 'existing') {
      const updatedExisting = existingImages.filter((_, idx) => idx !== itemToRemove.index);
      setExistingImages(updatedExisting);
      
      // Sincronizamos con el objeto editingProduct para que el backend reciba la lista actualizada
      if (editingProduct) {
        editingProduct.imagenes = updatedExisting;
      }
    }
  };

  const hasImagesClass = previews.length > 0 ? 'has-images' : '';

  return (
    <div className={tw("modal-overlay")}>
      <div className={tw("modal modal-lg")}>
        <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
        {editingProduct?.publicarEnTienda === false && <p className={tw('mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900')}>Borrador exportado desde inventario. Completa el precio y la descripción; al guardar se publicará en la tienda.</p>}
        
        {/* Botón X superior */}
        <button 
          type="button" 
          className={tw("close-modal-btn")} 
          onClick={() => setShowConfirmClose(true)}
          title="Cerrar"
        >
          <FaTimes size={16} />
        </button>

        <div className={tw("modal-content scrollable-content")}>

          {/* Sección de Imágenes */}
          <div className={tw("form-group")}>
            <label>Imágenes del Producto (Máx. 5)</label>

            <div className={tw(`upload-section-wrapper ${hasImagesClass}`)}>
              <div className={tw("images-preview-container")}>
                {previews.map((item, index) => (
                  <div key={index} className={tw("preview-thumbnail")}>
                    <img src={item.url} alt={`Vista previa ${index + 1}`} />
                    <button 
                      type="button" 
                      className={tw("delete-img-btn")} 
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
                  className={tw("image-upload-dropzone")}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt className={tw("upload-icon")} />
                  <div className={tw("upload-text")}>
                    {previews.length === 0 ? 'Haz click o arrastra imágenes aquí' : 'Agregar'}
                  </div>
                  <div className={tw("upload-hint")}>PNG, JPG (Máx. 5MB)</div>
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
              className={tw("![display:none]")}
            />

            {uploadStatus === 'loading' && <div className={tw("upload-loading")}>📤 Subiendo imágenes...</div>}
            {uploadStatus === 'error' && <div className={tw("upload-error")}>❌ Error al subir imágenes</div>}
          </div>

          <div className={tw("form-row")}>
            <div className={tw("form-group col-md-6")}>
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
            <div className={tw("form-group col-md-6")}>
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

          <div className={tw("form-row")}>
            <div className={tw("form-group col-md-6")}>
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
            <div className={tw("form-group col-md-6")}>
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

          <div className={tw("form-group")}>
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

        <div className={tw("form-actions")}>
          <button 
            className={tw("btn btn-cancel")} 
            onClick={() => setShowConfirmClose(true)}
            disabled={uploadStatus === 'loading'}
          >
            Cancelar
          </button>
          
          <button 
            className={tw("btn btn-save")} 
            onClick={handleSaveProduct}
            disabled={uploadStatus === 'loading' || !formData.nombre} 
          >
            {uploadStatus === 'loading' ? (
              <>
                <span className={tw("spinner")}></span> Enviando...
              </>
            ) : (
              editingProduct ? 'Actualizar' : 'Guardar'
            )}
          </button>
        </div>

        {/* Sub-modal interno de confirmación para descartar cambios */}
        {showConfirmClose && (
          <div className={tw("submodal-confirm-overlay")}>
            <div className={tw("submodal-confirm-content")}>
              <FaExclamationTriangle className={tw("submodal-warning-icon")} />
              <h3>¿Descartar cambios?</h3>
              <p>Si sales ahora, los cambios no guardados se perderán.</p>
              <div className={tw("submodal-actions")}>
                <button 
                  type="button" 
                  className={tw("btn-submodal-cancel")} 
                  onClick={() => setShowConfirmClose(false)}
                >
                  Continuar editando
                </button>
                <button 
                  type="button" 
                  className={tw("btn-submodal-confirm")} 
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
