import { tw } from '../../../funciones/tw.js';
// Productos.jsx
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from "react-router"; 
import { FaPlus, FaTrash, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { URL_SERVER, apiAxios } from '../../../funciones/conexion';
import ListarProductos from './ListarProductos';
import FormProductos from './FormProductos';

function Productos() {
  const [fileName, setFileName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(null);
  
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
        const { data } = await apiAxios.get('/admin/catalogo');
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 3. MANEJO DE INPUTS Y ARCHIVOS MÚLTIPLES ACUMULATIVOS
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
        setDialogMessage({ title: 'Imagen demasiado grande', message: `La imagen "${file.name}" supera el límite permitido de 5 MB.` });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // ACUMULAMOS los archivos nuevos con los que ya estaban en formData.imagenes (máximo 5)
    setFormData(prev => {
      const currentImages = prev.imagenes || [];
      const combined = [...currentImages, ...validFiles].slice(0, 5);
      return { ...prev, imagenes: combined };
    });

    setFileName(`Imágenes seleccionadas correctamente`);
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
  function handleAddProduct() {
    setEditingProduct(null);
    setFormData({ nombre: '', precio: '', stock: '', descripcion: '', categoria: '', imagenes: [] });
    setFileName('');
    setUploadStatus('');
    setShowModal(true);
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      descripcion: product.descripcion,
      categoria: product.categoria,
      imagenes: [] 
    });
    setFileName(product.imagenes?.length ? `${product.imagenes.length} imagen(es) actual(es) conservada(s)` : (product.imagen ? 'Imagen actual conservada' : ''));
    setUploadStatus('');
    setShowModal(true);
  };

  // 5. GUARDAR PRODUCTO (POST / PUT)
  const handleSaveProduct = async () => {
    if (!formData.nombre || !formData.precio || !formData.stock) {
      setDialogMessage({ title: 'Faltan datos', message: 'Completa los campos obligatorios antes de guardar el producto.' });
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
      
      // Adjuntamos cada archivo seleccionado al FormData
      if (formData.imagenes && formData.imagenes.length > 0) {
        formData.imagenes.forEach((file) => {
          formDataToSend.append('imagenes', file); 
        });
      }

      // Si se eliminaron imágenes existentes en el modo edición, enviamos las restantes
      if (editingProduct && editingProduct.imagenes) {
        editingProduct.imagenes.forEach((imgUrl) => {
          formDataToSend.append('imagenesExistentes', imgUrl);
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
      setSuccessMessage('¡Producto guardado exitosamente!');
    } catch (error) {
      setUploadStatus('error');
      console.error(error);
      setDialogMessage({ title: 'No se pudo guardar', message: error.message || 'Ocurrió un error al guardar el producto.' });
    }
  };

  // 6. ELIMINAR PRODUCTO
  const handleDeleteProduct = (productId) => {
    const product = products.find((item) => item._id === productId);
    if (product) setDeleteTarget(product);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const response = await fetch(`${URL_SERVER}/productos/${deleteTarget._id}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('No se pudo eliminar el producto del servidor.');
      setProducts((current) => current.filter((product) => product._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      setDeleteTarget(null);
      setDialogMessage({ title: 'No se pudo eliminar', message: error.message || 'Ocurrió un error al eliminar el producto.' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className={tw("loading-state")}>Cargando catálogo de CDISFRUTA...</div>;

  return (
    <div className={tw("admin-products-page")}>
      <header className={tw("products-header")}>
        <div className={tw("header-info")}>
          <h2 className={tw("main-title")}>Catálogo de Productos</h2>
          <p className={tw("subtitle")}>Gestiona los artículos de la tienda desde aquí.</p>
        </div>
        <button className={tw("btn-add-product")} onClick={handleAddProduct}>
          <FaPlus /> <span>Registrar Nuevo Producto</span>
        </button>
      </header>

      {products.some((product) => product.publicarEnTienda === false) && <div className={tw('mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900')}>
        Hay artículos exportados desde inventario pendientes de completar. Al editar y guardar sus datos comerciales, quedarán publicados en la tienda.
      </div>}

      <main className={tw("products-grid-container")}>
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

      {/* Modal interno de éxito */}
      {successMessage && (
        <div className={tw("submodal-confirm-overlay")}>
          <div className={tw("submodal-confirm-content")}>
            <h3 className={tw("![color:#10b981]", "![margin-bottom:10px]")}>¡Éxito!</h3>
            <p>{successMessage}</p>
            <button 
              type="button" 
              className={tw(tw("btn-submodal-confirm"), "![background-color:#10b981]", "![width:100%]", "![margin-top:10px]")} 
              
              onClick={() => setSuccessMessage('')}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {(deleteTarget || dialogMessage) && createPortal(
        <div className={tw('fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm')} onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) { setDeleteTarget(null); setDialogMessage(null); } }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="catalog-dialog-title" className={tw('w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-2xl sm:p-6')}>
            <div className={tw('flex items-start gap-3')}>
              <span className={tw('flex h-11 w-11 shrink-0 items-center justify-center rounded-full', deleteTarget ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600')}>{deleteTarget ? <FaTrash /> : <FaExclamationTriangle />}</span>
              <div className={tw('min-w-0 flex-1')}><h2 id="catalog-dialog-title" className={tw('text-lg font-bold text-slate-800')}>{deleteTarget ? 'Eliminar producto' : dialogMessage?.title}</h2><p className={tw('mt-1 text-sm leading-6 text-slate-600')}>{deleteTarget ? <>¿Confirmas que deseas eliminar <strong>{deleteTarget.nombre}</strong> del catálogo?</> : dialogMessage?.message}</p></div>
              {!deleteTarget && <button type="button" aria-label="Cerrar mensaje" onClick={() => setDialogMessage(null)} className={tw('rounded-lg p-2 text-slate-400 hover:bg-slate-100')}><FaTimes /></button>}
            </div>
            <div className={tw('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end')}>
              {deleteTarget ? <><button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className={tw('min-h-11 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50')}>Cancelar</button><button type="button" disabled={deleting} onClick={confirmDeleteProduct} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60')}><FaTrash />{deleting ? 'Eliminando…' : 'Eliminar producto'}</button></> : <button type="button" onClick={() => setDialogMessage(null)} className={tw('min-h-11 rounded-xl bg-[#ff7e5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e06d43]')}>Entendido</button>}
            </div>
          </section>
        </div>, document.body
      )}
    </div>
  );
}

export default Productos;
