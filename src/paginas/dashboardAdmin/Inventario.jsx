import { useCallback, useEffect, useRef, useState } from 'react';
import { FaBoxes, FaCamera, FaCheck, FaEdit, FaExclamationTriangle, FaMinus, FaPlus, FaSearch, FaTimes, FaUpload, FaTrash } from 'react-icons/fa';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100';
const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';
const toError = (error) => error.response?.data?.message || 'Ocurrió un error. Intenta nuevamente.';

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [barcodeNotFound, setBarcodeNotFound] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannerCode, setScannerCode] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanQuantity, setScanQuantity] = useState(1);
  const [barcodeValues, setBarcodeValues] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [manualTarget, setManualTarget] = useState(null);
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualDirection, setManualDirection] = useState('ingreso');
  const [savingManual, setSavingManual] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: 'Materia prima', precio: '', stock: '', codigoBarras: '', foto: null, destino: 'interno' });
  const [preview, setPreview] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);
  const lastScanRef = useRef({ code: '', lastSeen: 0, detected: false });

  const loadInventory = useCallback(async (initial = false) => {
    try {
      const { data } = await apiAxios.get('/admin/inventario');
      setProducts(data);
    } catch (error) {
      if (initial) setMessage({ type: 'error', text: toError(error) });
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadInventory(true), 0);
    const timer = window.setInterval(() => loadInventory(), 5000);
    return () => { window.clearTimeout(initialLoad); window.clearInterval(timer); };
  }, [loadInventory]);

  const closeScanner = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
    setScannerOpen(false);
    setScannedProduct(null);
    setScannerCode('');
    setBarcodeInput('');
  }, []);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const saveProduct = async (event) => {
    event.preventDefault();
    if (!form.foto) { setMessage({ type: 'error', text: 'Selecciona una foto del artículo.' }); return; }
    if (form.destino === 'tienda' && (!form.descripcion.trim() || !form.precio || !form.categoria)) {
      setMessage({ type: 'error', text: 'Completa descripción, categoría y precio para publicar en tienda.' });
      return;
    }
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'foto') payload.append('imagenes', value);
        else if (key === 'destino') payload.append('publicarEnTienda', value === 'tienda');
        else payload.append(key, value);
      });
      const { data } = await apiAxios.post('/admin/inventario', payload);
      setProducts((items) => [data.product, ...items]);
      setMessage({ type: 'success', text: form.destino === 'tienda' ? `${data.product.nombre} se agregó al inventario y a la tienda.` : `${data.product.nombre} se agregó como insumo interno.` });
      setForm({ nombre: '', descripcion: '', categoria: 'Materia prima', precio: '', stock: '', codigoBarras: '', foto: null, destino: 'interno' });
      setPreview('');
      if (fileRef.current) fileRef.current.value = '';
      setModalOpen(false);
    } catch (error) { setMessage({ type: 'error', text: toError(error) }); }
    finally { setSaving(false); }
  };

  const selectPhoto = (event) => {
    const foto = event.target.files?.[0] || null;
    if (foto && !['image/jpeg', 'image/png'].includes(foto.type)) {
      setMessage({ type: 'error', text: 'La foto debe estar en formato JPG o PNG.' });
      event.target.value = '';
      return;
    }
    if (foto && foto.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La foto supera el límite de 5 MB.' });
      event.target.value = '';
      return;
    }
    setForm((old) => ({ ...old, foto }));
    setPreview(foto ? URL.createObjectURL(foto) : '');
  };

  const setStock = async (product, delta) => {
    setUpdatingId(product._id);
    try {
      const { data } = await apiAxios.patch(`/admin/inventario/${product._id}/stock`, { delta });
      setProducts((items) => items.map((item) => item._id === product._id ? data.product : item));
      setMessage({ type: 'success', text: `Stock de ${data.product.nombre}: ${data.product.stock} unidades.` });
    } catch (error) { setMessage({ type: 'error', text: toError(error) }); }
    finally { setUpdatingId(''); }
  };

  const saveBarcode = async (product) => {
    const codigoBarras = (barcodeValues[product._id] ?? product.codigoBarras ?? '').trim();
    try {
      const { data } = await apiAxios.patch(`/admin/inventario/${product._id}/codigo`, { codigoBarras });
      setProducts((items) => items.map((item) => item._id === product._id ? data.product : item));
      setMessage({ type: 'success', text: codigoBarras ? `Código asignado a ${product.nombre}. Ya puedes escanearlo.` : `Código retirado de ${product.nombre}.` });
    } catch (error) { setMessage({ type: 'error', text: toError(error) }); }
  };

  const applyBarcode = async (rawCode) => {
    const code = rawCode.trim();
    const quantity = Number(scanQuantity);
    if (!code || !Number.isInteger(quantity) || quantity < 1) return;
    setUpdatingId('scanner');
    setScannerError('');
    setBarcodeNotFound(false);
    try {
      const { data } = await apiAxios.patch(`/admin/inventario/codigo/${encodeURIComponent(code)}`, { delta: quantity });
      setProducts((items) => items.map((item) => item._id === data.product._id ? data.product : item));
      setBarcodeInput('');
      setScannedProduct(data.product);
      setMessage({ type: 'success', text: `✓ ${data.product.nombre}: ingresaron ${quantity} unidades. Stock actual ${data.product.stock}.` });
    } catch (error) {
      const text = toError(error);
      setScannerError(text);
      setMessage({ type: 'error', text });
    } finally { setUpdatingId(''); }
  };

  const lookupBarcode = async (rawCode) => {
    const code = rawCode.trim();
    if (!code) return;
    setScannerCode(code);
    setScannerError('');
    setBarcodeNotFound(false);
    try {
      const { data } = await apiAxios.get(`/admin/inventario/codigo/${encodeURIComponent(code)}`);
      setScannedProduct(data.product);
      setScanQuantity(1);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraReady(false);
    } catch (error) {
      setScannedProduct(null);
      setScannerError(toError(error));
      setBarcodeNotFound(error.response?.status === 404);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraReady(false);
    }
  };

  const registerScannedItem = () => {
    setScannerOpen(false);
    setForm({ nombre: '', descripcion: '', categoria: 'Materia prima', precio: '', stock: '', codigoBarras: scannerCode, foto: null, destino: 'interno' });
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
    setScannerCode('');
    setScannedProduct(null);
    setScannerError('');
    setModalOpen(true);
  };

  const removeItem = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiAxios.delete(`/admin/inventario/${deleteTarget._id}`);
      setProducts((items) => items.filter((item) => item._id !== deleteTarget._id));
      setMessage({ type: 'success', text: `${deleteTarget.nombre} se retiró del inventario.` });
      setDeleteTarget(null);
    } catch (error) { setMessage({ type: 'error', text: toError(error) }); }
    finally { setDeleting(false); }
  };

  const applyManualAdjustment = async (event) => {
    event.preventDefault();
    const quantity = Number(manualQuantity);
    if (!manualTarget || !Number.isInteger(quantity) || quantity < 1) return;
    setSavingManual(true);
    try {
      const delta = manualDirection === 'ingreso' ? quantity : -quantity;
      const { data } = await apiAxios.patch(`/admin/inventario/${manualTarget._id}/stock`, { delta });
      setProducts((items) => items.map((item) => item._id === data.product._id ? data.product : item));
      setMessage({ type: 'success', text: `${manualDirection === 'ingreso' ? 'Ingreso' : 'Salida'} de ${quantity} unidades para ${data.product.nombre}. Stock actual: ${data.product.stock}.` });
      setManualTarget(null);
    } catch (error) { setMessage({ type: 'error', text: toError(error) }); }
    finally { setSavingManual(false); }
  };

  const openScanner = async () => {
    setScannerError('');
    setBarcodeNotFound(false);
    setScannerCode('');
    setScannedProduct(null);
    setBarcodeInput('');
    setScanQuantity(1);
    if (!navigator.mediaDevices?.getUserMedia || !('BarcodeDetector' in window)) {
      setScannerOpen(true);
      setScannerError('El navegador no ofrece lectura por cámara. Escribe el código o usa un lector conectado por USB.');
      return;
    }
    setScannerOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      streamRef.current = stream;
      setCameraReady(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const formats = await window.BarcodeDetector.getSupportedFormats();
      const supportedFormats = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf'].filter((format) => formats.includes(format));
      if (!supportedFormats.length) throw new Error('El navegador no ofrece formatos de código compatibles.');
      const detector = new window.BarcodeDetector({ formats: supportedFormats });
      const scan = async () => {
        if (!streamRef.current || !videoRef.current) return;
        try {
          const [result] = await detector.detect(videoRef.current);
          if (result?.rawValue) {
            const now = Date.now();
            if (lastScanRef.current.code !== result.rawValue || !lastScanRef.current.detected) {
              lastScanRef.current = { code: result.rawValue, lastSeen: now, detected: true };
              await lookupBarcode(result.rawValue);
            } else lastScanRef.current.lastSeen = now;
          } else if (lastScanRef.current.detected && Date.now() - lastScanRef.current.lastSeen > 1200) {
            lastScanRef.current.detected = false;
          }
        } catch { /* El video puede tardar un frame en estar disponible. */ }
        if (streamRef.current) requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    } catch {
      setScannerError('No se pudo acceder a la cámara. Revisa los permisos del navegador y verifica que la página use HTTPS.');
    }
  };

  const filtered = products.filter((product) => `${product.nombre} ${product.categoria} ${product.codigoBarras || ''}`.toLowerCase().includes(search.toLowerCase()));
  const totalUnits = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const lowStock = products.filter((product) => product.stock <= 5).length;

  if (loading) return <div className={tw('flex min-h-72 items-center justify-center text-slate-500')}>Cargando inventario…</div>;

  return <section className={tw('mx-auto w-full max-w-7xl space-y-6 pb-12')}>
    <header className={tw('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between')}>
      <div><p className={tw('mb-1 text-sm font-semibold uppercase tracking-[.14em] text-[#e06d43]')}>Operación</p><h1 className={tw('text-3xl font-bold tracking-tight text-slate-800')}>Inventario</h1><p className={tw('mt-2 text-sm text-slate-500')}>Controla existencias y actualiza el stock disponible en la tienda.</p></div>
      <div className={tw('grid grid-cols-2 gap-2 sm:flex')}>
        <button type="button" onClick={openScanner} className={tw(buttonClass, 'border border-[#ff7e5f] bg-white text-[#e06d43] hover:bg-orange-50')}><FaCamera /> Escanear <span className={tw('hidden sm:inline')}>código</span></button>
        <button type="button" onClick={() => setModalOpen(true)} className={tw(buttonClass, 'bg-[#ff7e5f] text-white shadow-sm hover:bg-[#e06d43]')}><FaPlus /> Nuevo producto</button>
      </div>
    </header>

    {message && <div role="status" className={tw('flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm', message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800')}><span className={tw('flex items-center gap-2')}>{message.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}{message.text}</span><button type="button" aria-label="Cerrar aviso" onClick={() => setMessage(null)}><FaTimes /></button></div>}

    <div className={tw('grid grid-cols-1 gap-3 sm:grid-cols-3')}>
      <div className={tw('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm')}><p className={tw('text-sm text-slate-500')}>Artículos en inventario</p><p className={tw('mt-2 text-3xl font-bold text-slate-800')}>{products.length}</p></div>
      <div className={tw('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm')}><p className={tw('text-sm text-slate-500')}>Unidades disponibles</p><p className={tw('mt-2 text-3xl font-bold text-[#e06d43]')}>{totalUnits.toLocaleString('es-CO')}</p></div>
      <div className={tw('rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm')}><p className={tw('text-sm text-amber-800')}>Stock bajo (5 o menos)</p><p className={tw('mt-2 text-3xl font-bold text-amber-900')}>{lowStock}</p></div>
    </div>

    <div className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <div className={tw('flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6')}><div><h2 className={tw('text-lg font-bold text-slate-800')}>Existencias</h2><p className={tw('text-sm text-slate-500')}>Los ajustes se reflejan automáticamente en la tienda virtual.</p></div><label className={tw('relative block w-full sm:max-w-xs')}><FaSearch className={tw('absolute left-3 top-1/2 -translate-y-1/2 text-slate-400')} /><input className={tw(inputClass, 'pl-9')} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o código" /></label></div>
      {filtered.length === 0 ? <div className={tw('px-6 py-14 text-center')}><FaBoxes className={tw('mx-auto mb-3 text-3xl text-slate-300')} /><p className={tw('font-semibold text-slate-700')}>{products.length ? 'No hay coincidencias' : 'Aún no hay productos en inventario'}</p><p className={tw('mt-1 text-sm text-slate-500')}>{products.length ? 'Prueba otro nombre o código de barras.' : 'Registra el primer producto para comenzar.'}</p></div> : <>
        <div className={tw('hidden overflow-x-auto md:block')}><table className={tw('w-full min-w-[820px] text-left')}><thead className={tw('bg-slate-50 text-xs uppercase tracking-wide text-slate-500')}><tr><th className={tw('px-6 py-3')}>Producto</th><th className={tw('px-4 py-3')}>Código de barras</th><th className={tw('px-4 py-3')}>Creación</th><th className={tw('px-4 py-3')}>Existencias</th><th className={tw('px-5 py-3 text-right')}>Ajustar</th></tr></thead><tbody className={tw('divide-y divide-slate-100')}>{filtered.map((product) => <tr key={product._id} className={tw('hover:bg-slate-50')}><td className={tw('px-6 py-3')}><div className={tw('flex items-center gap-3')}><img src={product.imagen} alt="" className={tw('h-12 w-12 rounded-xl bg-slate-100 object-cover')} /><div><p className={tw('font-semibold text-slate-800')}>{product.nombre}</p><p className={tw('text-xs text-slate-500')}>{product.categoria}</p><span className={tw('mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', product.publicarEnTienda === false ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-800')}>{product.publicarEnTienda === false ? 'Solo inventario' : 'Tienda virtual'}</span></div></div></td><td className={tw('px-4 py-3')}><div className={tw('flex gap-1')}><input aria-label={`Código de barras de ${product.nombre}`} maxLength={64} className={tw(inputClass, 'min-w-36 px-2 py-2 text-xs')} placeholder="Asignar código" value={barcodeValues[product._id] ?? product.codigoBarras ?? ''} onChange={(e) => setBarcodeValues((old) => ({ ...old, [product._id]: e.target.value }))} /><button type="button" onClick={() => saveBarcode(product)} className={tw('rounded-lg bg-slate-100 px-2 text-xs font-semibold text-slate-700 hover:bg-emerald-100')}>Guardar</button></div></td><td className={tw('px-4 py-3 text-sm text-slate-600')}>{new Date(product.fechaCreacion || product.createdAt).toLocaleDateString('es-CO')}</td><td className={tw('px-4 py-3')}><span className={tw('rounded-full px-3 py-1 text-sm font-bold', product.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')}>{product.stock} uds.</span></td><td className={tw('px-5 py-3')}><div className={tw('flex justify-end gap-2')}><button type="button" disabled={updatingId === product._id || product.stock <= 0} onClick={() => setStock(product, -1)} aria-label={`Restar una unidad a ${product.nombre}`} className={tw('rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40')}><FaMinus /></button><button type="button" disabled={updatingId === product._id} onClick={() => setStock(product, 1)} aria-label={`Sumar una unidad a ${product.nombre}`} className={tw('rounded-lg bg-[#ff7e5f] p-2 text-white hover:bg-[#e06d43] disabled:opacity-40')}><FaPlus /></button><button type="button" onClick={() => { setManualTarget(product); setManualQuantity(1); setManualDirection('ingreso'); }} aria-label={`Ajustar cantidad de ${product.nombre}`} className={tw('rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100')}><FaEdit /></button><button type="button" onClick={() => setDeleteTarget(product)} aria-label={`Retirar ${product.nombre}`} className={tw('rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50')}><FaTrash /></button></div></td></tr>)}</tbody></table></div>
        <div className={tw('divide-y divide-slate-100 md:hidden')}>{filtered.map((product) => <article key={product._id} className={tw('flex gap-3 p-4')}><img src={product.imagen} alt="" className={tw('h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover')} /><div className={tw('min-w-0 flex-1')}><div className={tw('flex items-start justify-between gap-2')}><div className={tw('min-w-0')}><h3 className={tw('truncate font-semibold text-slate-800')}>{product.nombre}</h3><p className={tw('text-xs text-slate-500')}>{product.categoria}</p><span className={tw('text-[10px] font-semibold', product.publicarEnTienda === false ? 'text-slate-500' : 'text-orange-700')}>{product.publicarEnTienda === false ? 'Solo inventario' : 'Tienda virtual'}</span></div><span className={tw('shrink-0 rounded-full px-2.5 py-1 text-xs font-bold', product.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')}>{product.stock} uds.</span></div><div className={tw('mt-2 flex gap-1')}><input aria-label={`Código de barras de ${product.nombre}`} maxLength={64} className={tw(inputClass, 'min-w-0 px-2 py-2 text-xs')} placeholder="Asignar código" value={barcodeValues[product._id] ?? product.codigoBarras ?? ''} onChange={(e) => setBarcodeValues((old) => ({ ...old, [product._id]: e.target.value }))} /><button type="button" onClick={() => saveBarcode(product)} className={tw('shrink-0 rounded-lg bg-slate-100 px-2 text-xs font-semibold text-slate-700')}>Guardar</button></div><div className={tw('mt-3 flex items-center justify-between')}><span className={tw('text-xs text-slate-400')}>{new Date(product.fechaCreacion || product.createdAt).toLocaleDateString('es-CO')}</span><div className={tw('flex gap-2')}><button type="button" disabled={updatingId === product._id || product.stock <= 0} onClick={() => setStock(product, -1)} className={tw('h-10 w-10 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40')} aria-label="Restar unidad"><FaMinus className={tw('mx-auto')} /></button><button type="button" disabled={updatingId === product._id} onClick={() => setStock(product, 1)} className={tw('h-10 w-10 rounded-lg bg-[#ff7e5f] text-white disabled:opacity-40')} aria-label="Sumar unidad"><FaPlus className={tw('mx-auto')} /></button><button type="button" onClick={() => { setManualTarget(product); setManualQuantity(1); setManualDirection('ingreso'); }} aria-label={`Ajustar cantidad de ${product.nombre}`} className={tw('h-10 w-10 rounded-lg border border-slate-200 text-slate-600')}><FaEdit className={tw('mx-auto')} /></button><button type="button" onClick={() => setDeleteTarget(product)} aria-label={`Retirar ${product.nombre}`} className={tw('h-10 w-10 rounded-lg border border-rose-200 text-rose-600')}><FaTrash className={tw('mx-auto')} /></button></div></div></div></article>)}</div>
      </>}
    </div>

    {modalOpen && <div className={tw('fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4')} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><form onSubmit={saveProduct} className={tw('max-h-[94vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7')}><div className={tw('flex items-start justify-between')}><div><p className={tw('text-sm font-semibold text-[#e06d43]')}>Nuevo registro</p><h2 className={tw('mt-1 text-2xl font-bold text-slate-800')}>Agregar al inventario</h2><p className={tw('mt-1 text-sm text-slate-500')}>Indica si es un insumo interno o un artículo para la tienda.</p></div><button type="button" onClick={() => setModalOpen(false)} className={tw('rounded-full p-2 text-slate-500 hover:bg-slate-100')} aria-label="Cerrar"><FaTimes /></button></div>
      <div className={tw('grid gap-4 sm:grid-cols-2')}>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2')}>Nombre del artículo<input required maxLength={100} className={tw(inputClass)} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Mango deshidratado o cajas de empaque" /></label>
        <fieldset className={tw('space-y-2 sm:col-span-2')}><legend className={tw('mb-1 text-sm font-semibold text-slate-700')}>Destino del artículo</legend><div className={tw('grid gap-2 sm:grid-cols-2')}><label className={tw('flex cursor-pointer items-start gap-3 rounded-xl border p-3', form.destino === 'interno' ? 'border-[#ff7e5f] bg-orange-50' : 'border-slate-200')}><input type="radio" name="destino" value="interno" checked={form.destino === 'interno'} onChange={() => setForm({ ...form, destino: 'interno', categoria: 'Materia prima', precio: '' })} /><span><span className={tw('block text-sm font-semibold text-slate-800')}>Solo inventario interno</span><span className={tw('text-xs text-slate-500')}>Materia prima, empaques e insumos; no se muestran en la tienda.</span></span></label><label className={tw('flex cursor-pointer items-start gap-3 rounded-xl border p-3', form.destino === 'tienda' ? 'border-[#ff7e5f] bg-orange-50' : 'border-slate-200')}><input type="radio" name="destino" value="tienda" checked={form.destino === 'tienda'} onChange={() => setForm({ ...form, destino: 'tienda', categoria: 'Snacks' })} /><span><span className={tw('block text-sm font-semibold text-slate-800')}>Publicar en tienda virtual</span><span className={tw('text-xs text-slate-500')}>Artículo terminado disponible para la venta.</span></span></label></div></fieldset>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Categoría<select className={tw(inputClass)} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>{form.destino === 'tienda' ? <><option>Snacks</option><option>Aromáticas frutales</option><option>General</option></> : <><option>Materia prima</option><option>Empaque</option><option>Insumo de producción</option><option>Otro insumo</option></>}</select></label>
        {form.destino === 'tienda' && <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Precio de venta (COP)<input required min="0" type="number" step="1" className={tw(inputClass)} value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="12000" /></label>}
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Cantidad inicial<input required min="0" type="number" step="1" className={tw(inputClass)} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" /></label>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Código de barras (opcional)<input maxLength={64} className={tw(inputClass)} value={form.codigoBarras} onChange={(e) => setForm({ ...form, codigoBarras: e.target.value })} placeholder="EAN / UPC" /></label>
        {form.destino === 'tienda' && <label className={tw('space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2')}>Descripción para la tienda<textarea required maxLength={500} rows={3} className={tw(inputClass)} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Describe brevemente el producto" /></label>}
        <div className={tw('sm:col-span-2')}><p className={tw('mb-1.5 text-sm font-medium text-slate-700')}>Foto del producto <span className={tw('text-rose-600')}>*</span></p><button type="button" onClick={() => fileRef.current?.click()} className={tw('flex w-full items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-3 text-left hover:border-[#ff7e5f] hover:bg-orange-50/50')}><span className={tw('flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-[#e06d43]')}>{preview ? <img src={preview} alt="Vista previa" className={tw('h-full w-full object-cover')} /> : <FaUpload />}</span><span><span className={tw('block font-semibold text-slate-700')}>{form.foto?.name || 'Elegir imagen'}</span><span className={tw('text-xs text-slate-500')}>JPG o PNG · máximo 5 MB</span></span></button><input ref={fileRef} hidden required={!form.foto} type="file" accept="image/jpeg,image/png" onChange={selectPhoto} /></div>
      </div><div className={tw('flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end')}><button type="button" onClick={() => setModalOpen(false)} className={tw(buttonClass, 'border border-slate-200 text-slate-700 hover:bg-slate-50')}>Cancelar</button><button disabled={saving} type="submit" className={tw(buttonClass, 'bg-[#ff7e5f] text-white hover:bg-[#e06d43]')}>{saving ? 'Guardando…' : <><FaCheck /> Guardar producto</>}</button></div></form></div>}

    {scannerOpen && <div className={tw('fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4')} onMouseDown={(event) => { if (event.target === event.currentTarget) closeScanner(); }}><section className={tw('w-full max-w-lg space-y-4 rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7')}><div className={tw('flex items-start justify-between')}><div><p className={tw('text-sm font-semibold text-[#e06d43]')}>Ingreso de existencias</p><h2 className={tw('mt-1 text-xl font-bold text-slate-800')}>Identificar artículo</h2><p className={tw('mt-1 text-sm text-slate-500')}>Escanea o escribe un código y confirma cuántas unidades ingresan.</p></div><button type="button" onClick={closeScanner} className={tw('rounded-full p-2 text-slate-500 hover:bg-slate-100')} aria-label="Cerrar escáner"><FaTimes /></button></div><div className={tw('relative aspect-video overflow-hidden rounded-2xl bg-slate-950')}>{!cameraReady ? <div className={tw('flex h-full items-center justify-center px-6 text-center text-sm text-slate-200')}>{scannerError || (scannerCode ? `Código leído: ${scannerCode}` : 'Preparando cámara…')}</div> : <><video ref={videoRef} playsInline muted className={tw('h-full w-full object-cover')} /><div className={tw('pointer-events-none absolute inset-x-[14%] top-1/2 h-24 -translate-y-1/2 rounded-xl border-2 border-[#ff9b80] shadow-[0_0_0_999px_rgb(0_0_0/.22)]')} /></>}</div>{scannerError && <div className={tw('space-y-2')}><p role="alert" className={tw('text-sm text-rose-700')}>{scannerError}</p>{barcodeNotFound && scannerCode && <button type="button" onClick={registerScannedItem} className={tw(buttonClass, 'w-full bg-[#ff7e5f] text-white hover:bg-[#e06d43]')}>Registrar artículo con este código</button>}</div>}{scannedProduct && <div className={tw('flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3')}><img src={scannedProduct.imagen} alt="" className={tw('h-14 w-14 rounded-lg object-cover')} /><div><p className={tw('font-semibold text-slate-800')}>{scannedProduct.nombre}</p><p className={tw('text-sm text-slate-600')}>Stock actual: {scannedProduct.stock} · {scannedProduct.publicarEnTienda === false ? 'Insumo interno' : 'Producto de tienda'}</p></div></div>}<form className={tw('space-y-2')} onSubmit={(e) => { e.preventDefault(); lookupBarcode(barcodeInput); }}><label className={tw('text-sm font-semibold text-slate-700')} htmlFor="barcode-entry">Código de barras</label><div className={tw('flex gap-2')}><input id="barcode-entry" autoComplete="off" className={tw(inputClass)} value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} placeholder="Escribe o escanea con lector USB" /><button disabled={!barcodeInput.trim() || updatingId === 'scanner'} className={tw(buttonClass, 'shrink-0 bg-slate-100 text-slate-700 hover:bg-slate-200')}>Buscar</button></div></form>{scannedProduct && <form className={tw('space-y-3 rounded-xl border border-slate-200 p-3')} onSubmit={(e) => { e.preventDefault(); applyBarcode(scannerCode, scanQuantity); }}><label className={tw('block text-sm font-semibold text-slate-700')} htmlFor="scan-quantity">Unidades que ingresan</label><div className={tw('flex gap-2')}><input id="scan-quantity" required min="1" step="1" type="number" className={tw(inputClass)} value={scanQuantity} onChange={(e) => setScanQuantity(e.target.value)} /><button disabled={updatingId === 'scanner'} className={tw(buttonClass, 'shrink-0 bg-[#ff7e5f] text-white hover:bg-[#e06d43]')}><FaPlus /> Confirmar ingreso</button></div></form>}<p className={tw('text-xs text-slate-400')}>La cámara requiere permiso del navegador y una conexión HTTPS. Puedes ingresar el código manualmente si tu navegador no la admite.</p></section></div>}
    {manualTarget && <div className={tw('fixed inset-0 z-[115] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4')}><form onSubmit={applyManualAdjustment} className={tw('w-full max-w-md space-y-4 rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl')}><div><p className={tw('text-sm font-semibold text-[#e06d43]')}>Ajuste manual</p><h2 className={tw('mt-1 text-xl font-bold text-slate-800')}>{manualTarget.nombre}</h2><p className={tw('mt-1 text-sm text-slate-500')}>Stock actual: {manualTarget.stock} unidades</p></div><div className={tw('grid grid-cols-2 gap-2')}><button type="button" onClick={() => setManualDirection('ingreso')} className={tw('rounded-xl border p-3 text-sm font-semibold', manualDirection === 'ingreso' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600')}>Ingreso</button><button type="button" onClick={() => setManualDirection('salida')} className={tw('rounded-xl border p-3 text-sm font-semibold', manualDirection === 'salida' ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600')}>Salida / merma</button></div><label className={tw('block space-y-1.5 text-sm font-semibold text-slate-700')} htmlFor="manual-quantity">Cantidad de unidades<input id="manual-quantity" required min="1" max={manualDirection === 'salida' ? manualTarget.stock : undefined} step="1" type="number" className={tw(inputClass)} value={manualQuantity} onChange={(e) => setManualQuantity(e.target.value)} /></label><div className={tw('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end')}><button type="button" disabled={savingManual} onClick={() => setManualTarget(null)} className={tw(buttonClass, 'border border-slate-200 text-slate-700')}>Cancelar</button><button disabled={savingManual || (manualDirection === 'salida' && Number(manualQuantity) > manualTarget.stock)} className={tw(buttonClass, 'bg-[#ff7e5f] text-white hover:bg-[#e06d43]')}>{savingManual ? 'Actualizando…' : 'Confirmar ajuste'}</button></div></form></div>}    {deleteTarget && <div className={tw('fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4')}><section role="alertdialog" aria-modal="true" className={tw('w-full max-w-md space-y-4 rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl')}><div className={tw('mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600')}><FaTrash /></div><div className={tw('text-center')}><h2 className={tw('text-xl font-bold text-slate-800')}>Retirar artículo</h2><p className={tw('mt-2 text-sm leading-6 text-slate-600')}>¿Deseas retirar <strong>{deleteTarget.nombre}</strong> del inventario? Se ocultará de la tienda si estaba publicado y no se eliminará de pedidos anteriores.</p></div><div className={tw('flex flex-col-reverse gap-2 sm:flex-row sm:justify-center')}><button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className={tw(buttonClass, 'border border-slate-200 text-slate-700 hover:bg-slate-50')}>Cancelar</button><button type="button" disabled={deleting} onClick={removeItem} className={tw(buttonClass, 'bg-rose-600 text-white hover:bg-rose-700')}><FaTrash />{deleting ? 'Retirando…' : 'Sí, retirar'}</button></div></section></div>}
  </section>;
}
