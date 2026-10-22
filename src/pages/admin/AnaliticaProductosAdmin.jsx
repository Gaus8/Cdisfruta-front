import { createElement, useEffect, useMemo, useState } from 'react';
import { FaBoxOpen, FaChartBar, FaEye, FaHeart, FaRedoAlt, FaShoppingBag } from 'react-icons/fa';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const money = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(value || 0));

function Metric({ icon: Icon, title, value, note, tone }) {
  const styles = { orange: 'bg-orange-50 text-[#e06d43]', blue: 'bg-sky-50 text-sky-700', green: 'bg-emerald-50 text-emerald-700', navy: 'bg-slate-100 text-slate-700' };
  return <article className={tw('flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5')}><span className={tw(`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${styles[tone]}`)}>{createElement(Icon)}</span><div className={tw('min-w-0')}><p className={tw('text-sm text-slate-500')}>{title}</p><p className={tw('mt-0.5 text-2xl font-bold tracking-tight text-slate-800')}>{value}</p><p className={tw('mt-0.5 text-xs text-slate-400')}>{note}</p></div></article>;
}

export default function AnaliticaProductosAdmin() {
  const [data, setData] = useState({ productos: [], resumen: {} });
  const [sortBy, setSortBy] = useState('pedidos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const response = await apiAxios.get('/auth/admin/analitica-productos');
      setData({ productos: response.data.productos || [], resumen: response.data.resumen || {} });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo cargar la analítica de productos.');
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, []);

  const products = useMemo(() => [...data.productos].sort((a, b) => Number(b[sortBy] || 0) - Number(a[sortBy] || 0) || a.nombre.localeCompare(b.nombre)), [data.productos, sortBy]);
  const maxValue = Math.max(1, ...products.map((product) => Number(product[sortBy] || 0)));

  return <section className={tw('mx-auto w-full max-w-7xl space-y-6 pb-10')}>
    <header className={tw('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between')}><div><p className={tw('text-xs font-bold uppercase tracking-[.14em] text-[#e06d43]')}>Rendimiento de la tienda</p><h1 className={tw('mt-1 text-3xl font-bold tracking-tight text-slate-800')}>Analítica de productos</h1><p className={tw('mt-1 text-sm text-slate-500')}>Descubre qué productos se piden, se visitan y despiertan más interés.</p></div><button type="button" disabled={refreshing || loading} onClick={() => load(true)} className={tw('inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:self-auto')}><FaRedoAlt className={tw(refreshing ? 'animate-spin' : '')} />Actualizar datos</button></header>
    <div className={tw('grid gap-3 sm:grid-cols-2 xl:grid-cols-4')}>
      <Metric icon={FaShoppingBag} title="Unidades pedidas" value={data.resumen.unidadesVendidas || 0} note="Pedidos no cancelados" tone="orange" />
      <Metric icon={FaEye} title="Visitas a productos" value={data.resumen.visitasRegistradas || 0} note="Eventos registrados" tone="blue" />
      <Metric icon={FaHeart} title="Intentos de formulario" value={data.resumen.intentosFormulario || 0} note={`${data.resumen.intentosInteres || 0} de interés en producto`} tone="green" />
      <Metric icon={FaBoxOpen} title="Productos analizados" value={data.resumen.productosAnalizados || 0} note="Catálogo y actividad histórica" tone="navy" />
    </div>
    {error && <div role="alert" className={tw('rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700')}>{error}<button type="button" onClick={() => load()} className={tw('ml-2 font-semibold underline')}>Reintentar</button></div>}
    <section className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <header className={tw('flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5')}><div><h2 className={tw('flex items-center gap-2 text-lg font-bold text-slate-800')}><FaChartBar className={tw('text-[#e06d43]')} />Desempeño por producto</h2><p className={tw('text-sm text-slate-500')}>Compara pedidos, visitas e intención de compra.</p></div><label className={tw('flex items-center gap-2 text-sm text-slate-500')}>Ordenar por<select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={tw('min-h-10 rounded-xl border border-slate-200 bg-white px-3 font-medium text-slate-700 outline-none focus:border-[#ff7e5f]')}><option value="pedidos">Más pedidos</option><option value="visitas">Más visitas</option><option value="intentosFormulario">Más formularios</option><option value="intentosInteres">Más interés</option><option value="ingresos">Más ingresos</option></select></label></header>
      {loading ? <div className={tw('p-12 text-center text-sm text-slate-500')}>Cargando estadísticas…</div> : products.length === 0 ? <div className={tw('p-10 text-center')}><span className={tw('mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-xl text-[#e06d43]')}><FaChartBar /></span><h3 className={tw('mt-3 font-semibold text-slate-800')}>Aún no hay productos para analizar</h3><p className={tw('mx-auto mt-1 max-w-lg text-sm leading-6 text-slate-500')}>Los artículos publicados y las ventas aparecerán aquí. Las visitas e intenciones se contabilizan cuando la tienda envía esos eventos con el identificador del producto.</p></div> : <>
        <div className={tw('hidden overflow-x-auto md:block')}><table className={tw('w-full min-w-[950px] text-left')}><thead className={tw('bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500')}><tr><th className={tw('px-5 py-3')}>Producto</th><th className={tw('px-4 py-3')}>Pedidos / unidades</th><th className={tw('px-4 py-3')}>Visitas</th><th className={tw('px-4 py-3')}>Formularios</th><th className={tw('px-4 py-3')}>Interés en producto</th><th className={tw('px-5 py-3 text-right')}>Ingresos confirmados</th></tr></thead><tbody className={tw('divide-y divide-slate-100')}>{products.map((product) => <tr key={product.productoId || product.nombre} className={tw('hover:bg-slate-50')}><td className={tw('px-5 py-4')}><div className={tw('flex min-w-52 items-center gap-3')}>{product.imagen ? <img src={product.imagen} alt="" className={tw('h-11 w-11 rounded-xl object-cover')} /> : <span className={tw('flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#e06d43]')}><FaBoxOpen /></span>}<div className={tw('min-w-0')}><p className={tw('truncate font-semibold text-slate-800')}>{product.nombre}</p><p className={tw('text-xs text-slate-400')}>{product.categoria || 'Producto'}</p></div></div></td><td className={tw('px-4 py-4')}><strong className={tw('text-slate-800')}>{product.pedidos}</strong><span className={tw('ml-1 text-xs text-slate-500')}>pedidos · {product.unidades} uds.</span></td><td className={tw('px-4 py-4')}><strong className={tw('text-slate-800')}>{product.visitas}</strong><p className={tw('text-xs text-slate-400')}>{product.visitantes} visitantes</p></td><td className={tw('px-4 py-4 font-semibold text-slate-800')}>{product.intentosFormulario || 0}</td><td className={tw('px-4 py-4')}><strong className={tw('text-slate-800')}>{product.intentosInteres}</strong><p className={tw('text-xs text-slate-400')}>{product.usuariosInteres} usuarios</p></td><td className={tw('px-5 py-4 text-right font-semibold text-slate-800')}>{money(product.ingresos)}</td></tr>)}</tbody></table></div>
        <div className={tw('space-y-3 p-3 md:hidden')}>{products.map((product) => <article key={product.productoId || product.nombre} className={tw('rounded-xl border border-slate-200 p-4')}><div className={tw('flex items-center gap-3')}>{product.imagen ? <img src={product.imagen} alt="" className={tw('h-12 w-12 rounded-xl object-cover')} /> : <span className={tw('flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e06d43]')}><FaBoxOpen /></span>}<div className={tw('min-w-0 flex-1')}><h3 className={tw('truncate font-semibold text-slate-800')}>{product.nombre}</h3><p className={tw('text-xs text-slate-400')}>{product.categoria || 'Producto'}</p></div></div><div className={tw('mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-sm')}><p className={tw('text-slate-500')}>Pedidos <strong className={tw('block text-slate-800')}>{product.pedidos} · {product.unidades} uds.</strong></p><p className={tw('text-slate-500')}>Visitas <strong className={tw('block text-slate-800')}>{product.visitas} · {product.visitantes} personas</strong></p><p className={tw('text-slate-500')}>Formularios <strong className={tw('block text-slate-800')}>{product.intentosFormulario || 0}</strong></p><p className={tw('text-slate-500')}>Interés <strong className={tw('block text-slate-800')}>{product.intentosInteres} intentos</strong></p><p className={tw('text-slate-500')}>Ingresos <strong className={tw('block text-slate-800')}>{money(product.ingresos)}</strong></p></div><div className={tw('mt-4')}><div className={tw('mb-1 flex justify-between text-xs text-slate-500')}><span>{sortBy === 'pedidos' ? 'Pedidos' : sortBy === 'visitas' ? 'Visitas' : sortBy === 'ingresos' ? 'Ingresos' : sortBy === 'intentosInteres' ? 'Interés' : 'Formularios'}</span><span>{product[sortBy] || 0}</span></div><div className={tw('h-2 overflow-hidden rounded-full bg-slate-100')}><div className={tw('h-full rounded-full bg-[#ff7e5f]')} style={{ width: `${Math.max(0, Math.min(100, Number(product[sortBy] || 0) / maxValue * 100))}%` }} /></div></div></article>)}</div>
        <footer className={tw('border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:px-5')}>Los ingresos incluyen pedidos comprobados, enviados y entregados. Los intentos solo guardan el tipo de evento y el producto, nunca datos escritos por el cliente.</footer>
      </>}
    </section>
  </section>;
}
