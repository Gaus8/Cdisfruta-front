import { tw } from '../../../utils/tw.js';
import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaImage,
  FaBoxOpen,
  FaTags,
  FaDollarSign,
  FaBoxes,
  FaAlignLeft,
  FaSave,
  FaBan,
} from 'react-icons/fa';
import { IMAGE_ACCEPT, IMAGE_FORMATS_LABEL } from '../../../utils/imageUpload.js';

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className={tw("![position:relative]", "![width:100%]")}>
      <span className={tw("![pointer-events:none]", "![position:absolute]", "![left:12px]", "![top:50%]", "![transform:translateY(-50%)]", "![color:#94a3b8]", "![display:inline-flex]")}>
        <Icon size={14} />
      </span>
      <input
        {...props}
        className={tw("![padding-left:40px]", "![width:100%]", "![box-sizing:border-box]")}
      />
    </div>
  );
}

export default function FormProductos({
  editingProduct, handleDragLeave, handleDragOver,
  handleDrop, fileInputRef, handleFileSelect,
  uploadStatus, formData, handleInputChange,
  handleSaveProduct, setShowModal,
}) {
  const [previews, setPreviews] = useState([]);
  const [activePreview, setActivePreview] = useState(0);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
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

    existingImages.forEach((imgUrl, idx) => {
      newPreviews.push({ type: 'existing', url: imgUrl, index: idx });
    });

    if (formData.imagenes && formData.imagenes.length > 0) {
      for (let i = 0; i < formData.imagenes.length; i++) {
        const file = formData.imagenes[i];
        newPreviews.push({ type: 'new', url: URL.createObjectURL(file), file });
      }
    }

    setPreviews(newPreviews);
    setActivePreview((current) => {
      if (!newPreviews.length) return 0;
      return Math.min(current, newPreviews.length - 1);
    });

    return () => {
      newPreviews.forEach((item) => {
        if (item.type === 'new' && item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [existingImages, formData.imagenes]);

  const handleRemoveImage = (itemToRemove) => {
    if (itemToRemove.type === 'new') {
      const updatedFiles = formData.imagenes.filter((file) =>
        !(file.name === itemToRemove.file.name && file.size === itemToRemove.file.size)
      );
      handleInputChange({
        target: { name: 'imagenes', value: updatedFiles }
      });
    } else if (itemToRemove.type === 'existing') {
      const updatedExisting = existingImages.filter((_, idx) => idx !== itemToRemove.index);
      setExistingImages(updatedExisting);
      if (editingProduct) {
        editingProduct.imagenes = updatedExisting;
      }
    }
  };

  const currentPreview = previews[activePreview];

  return (
    <div className={tw("modal-overlay")}>
      <div className={tw("modal modal-product")}>
        <h2 className={tw("![display:flex]", "![align-items:center]", "![justify-content:center]", "![gap:10px]")}>
          <span className={tw("![display:inline-flex]", "![align-items:center]", "![justify-content:center]", "![width:34px]", "![height:34px]", "![border-radius:10px]", "![background:#fff5f1]", "![color:#e06d43]")}>
            <FaBoxOpen size={16} />
          </span>
          {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
        {editingProduct?.publicarEnTienda === false && (
          <p className={tw('mb-0 border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm leading-5 text-amber-900')}>
            Borrador exportado desde inventario. Completa el precio y la descripción; al guardar se publicará en la tienda.
          </p>
        )}

        <button
          type="button"
          className={tw("close-modal-btn")}
          onClick={() => setShowConfirmClose(true)}
          title="Cerrar"
        >
          <FaTimes size={16} />
        </button>

        <div className={tw("product-form-layout")}>
          <div className={tw("product-form-column")}>
            <div className={tw("form-group")}>
              <label>Nombre del Producto *</label>
              <IconInput
                icon={FaBoxOpen}
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleInputChange}
                placeholder="Nombre"
                required
              />
            </div>

            <div className={tw("form-group")}>
              <label>Categoría *</label>
              <IconInput
                icon={FaTags}
                type="text"
                name="categoria"
                value={formData.categoria || ''}
                onChange={handleInputChange}
                placeholder="Categoría"
                required
              />
            </div>

            <div className={tw("form-group")}>
              <label>Precio ($) *</label>
              <IconInput
                icon={FaDollarSign}
                type="number"
                name="precio"
                value={formData.precio || ''}
                onChange={handleInputChange}
                placeholder="Precio"
                required
                min="0"
              />
            </div>

            <div className={tw("form-group")}>
              <label>Stock *</label>
              <IconInput
                icon={FaBoxes}
                type="number"
                name="stock"
                value={formData.stock || ''}
                onChange={handleInputChange}
                placeholder="Stock"
                required
                min="0"
              />
            </div>

            <div className={tw("form-group")}>
              <label>Descripción *</label>
              <div className={tw("![position:relative]", "![width:100%]")}>
                <span className={tw("![pointer-events:none]", "![position:absolute]", "![left:12px]", "![top:14px]", "![color:#94a3b8]", "![display:inline-flex]")}>
                  <FaAlignLeft size={14} />
                </span>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleInputChange}
                  placeholder="Descripción detallada"
                  required
                  rows="5"
                  className={tw("![padding-left:40px]", "![width:100%]", "![box-sizing:border-box]")}
                />
              </div>
            </div>
          </div>

          <div className={tw("product-form-column", "![gap:12px]", "max-[768px]:![order:-1]")}>
            <div className={tw("form-group")}>
              <label>Imágenes del Producto (Máx. 5)</label>
              <p className={tw("![margin:0_0_8px_0]", "![font-size:0.75rem]", "![color:#94a3b8]", "![font-weight:500]")}>
                Formatos: {IMAGE_FORMATS_LABEL} · Máx. 5 MB c/u
              </p>

              <div className={tw("product-preview-stage")}>
                {currentPreview ? (
                  <>
                    <img src={currentPreview.url} alt={`Vista previa ${activePreview + 1}`} />
                    <button
                      type="button"
                      className={tw("delete-img-btn", "![top:10px]", "![right:10px]", "![width:28px]", "![height:28px]")}
                      onClick={() => handleRemoveImage(currentPreview)}
                      title="Eliminar imagen"
                    >
                      <FaTimes size={12} />
                    </button>
                    <span className={tw("product-preview-badge")}>
                      {activePreview + 1} / {previews.length}
                    </span>
                  </>
                ) : (
                  <div
                    className={tw("product-preview-empty")}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className={tw("![display:inline-flex]", "![align-items:center]", "![justify-content:center]", "![width:56px]", "![height:56px]", "![border-radius:16px]", "![background:#fff5f1]", "![color:#e06d43]", "![margin-bottom:4px]")}>
                      <FaImage size={24} />
                    </span>
                    <p className={tw("![margin:0]", "![font-size:0.9rem]", "![font-weight:600]", "![color:#64748b]")}>
                      Vista previa
                    </p>
                    <p className={tw("![margin:0]", "![font-size:0.75rem]")}>
                      Las imágenes seleccionadas aparecerán aquí
                    </p>
                  </div>
                )}
              </div>

              {previews.length > 0 && (
                <div className={tw("product-preview-thumbs")}>
                  {previews.map((item, index) => (
                    <button
                      key={`${item.type}-${index}`}
                      type="button"
                      onClick={() => setActivePreview(index)}
                      className={tw("product-preview-thumb", index === activePreview && "is-active")}
                      title={`Ver imagen ${index + 1}`}
                    >
                      <img src={item.url} alt={`Miniatura ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {previews.length < 5 && (
                <div
                  className={tw("image-upload-dropzone", "![margin-top:10px]", "![width:100%]", "![min-height:72px]", "![padding:14px]", "![box-sizing:border-box]")}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt className={tw("upload-icon", "![font-size:1.5rem]", "![margin-bottom:4px]")} />
                  <div className={tw("upload-text", "![font-size:0.85rem]")}>
                    {previews.length === 0 ? 'Haz click o arrastra imágenes aquí' : 'Agregar otra imagen'}
                  </div>
                  <div className={tw("upload-hint")}>{IMAGE_FORMATS_LABEL} · Máx. 5 MB</div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileSelect}
                accept={IMAGE_ACCEPT}
                name="imagenes"
                className={tw("![display:none]")}
              />

              {uploadStatus === 'loading' && <div className={tw("upload-loading")}>Subiendo imágenes...</div>}
              {uploadStatus === 'error' && <div className={tw("upload-error")}>Error al subir imágenes</div>}
            </div>
          </div>
        </div>

        <div className={tw("form-actions")}>
          <button
            className={tw("btn btn-cancel", "![display:inline-flex]", "![align-items:center]", "![gap:8px]")}
            onClick={() => setShowConfirmClose(true)}
            disabled={uploadStatus === 'loading'}
          >
            <FaBan size={13} />
            Cancelar
          </button>

          <button
            className={tw("btn btn-save", "![display:inline-flex]", "![align-items:center]", "![gap:8px]")}
            onClick={handleSaveProduct}
            disabled={uploadStatus === 'loading' || !formData.nombre}
          >
            {uploadStatus === 'loading' ? (
              <>
                <span className={tw("spinner")}></span> Enviando...
              </>
            ) : (
              <>
                <FaSave size={13} />
                {editingProduct ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </button>
        </div>

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
