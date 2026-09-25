import { createElement, useEffect, useMemo, useState } from 'react';
import { FaChartLine, FaShoppingBag, FaDollarSign, FaBoxOpen, FaCalendarAlt, FaArrowUp, FaArrowDown, FaExclamationCircle } from 'react-icons/fa';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const paidStates = new Set(['Comprobado', 'Enviado', 'Entregado']);
const statusOrder = ['Pendiente', 'Comprobado', 'Enviado', 'Entregado', 'Cancelado'];
const statusColors = { Pendiente: '#f59e0b', Comprobado: '#3b82f6', Enviado: '#0ea5e9', Entregado: '#10b981', Cancelado: '#f43f5e' };
const money = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
const orderDate = (order) => new Date(order.fechaCreacion || order.createdAt || 0);
function getRange(period, customStart, customEnd) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  if (period === '7') start.setDate(start.getDate() - 6);
  else if (period === '30') start.setDate(start.getDate() - 29);
  else if (period === '90') start.setDate(start.getDate() - 89);
  else if (period === 'month') start.setDate(1);
  else if (period === 'custom' && customStart && customEnd) {
    return { start: new Date(`${customStart}T00:00:00`), end: new Date(`${customEnd}T23:59:59.999`) };
  }
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function MetricCard({ title, value, hint, icon: Icon, tone = 'orange', trend }) {
  const tones = {
    orange: 'border-l-[#ff7e5f] bg-orange-50 text-[#e06d43]',
    blue: 'border-l-sky-500 bg-sky-50 text-sky-700',
    green: 'border-l-emerald-500 bg-emerald-50 text-emerald-700',
    navy: 'border-l-slate-500 bg-slate-100 text-slate-700',
  };
  return <article className={tw('flex min-h-32 items-center gap-4 rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm')}>
    <span className={tw('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg', tones[tone])}>{createElement(Icon)}</span>
    <div className={tw('min-w-0 flex-1')}><p className={tw('text-sm font-medium text-slate-500')}>{title}</p><p className={tw('mt-1 break-words text-2xl font-bold tracking-tight text-slate-800')}>{value}</p><p className={tw('mt-1 flex items-center gap-1 text-xs text-slate-400')}>{trend === 'up' ? <FaArrowUp className={tw('text-emerald-600')} /> : trend === 'down' ? <FaArrowDown className={tw('text-rose-500')} /> : null}{hint}</p></div>
  </article>;
}

function SalesChart({ buckets }) {
  const max = Math.max(1, ...buckets.map((bucket) => bucket.revenue));
  return <div className={tw('mt-5')}>
    <div className={tw('mb-2 flex justify-between text-[10px] text-slate-400 sm:text-xs')}><span>{money(max)} máximo</span><span>Ingresos</span></div>
    <div className={tw('flex h-56 items-end gap-1 border-b border-l border-slate-200 px-2 sm:gap-2')}>
      {buckets.map((bucket, index) => <div key={`${bucket.label}-${index}`} className={tw('group relative flex h-full min-w-0 flex-1 items-end justify-center')}>
        <div title={`${bucket.label}: ${money(bucket.revenue)} · ${bucket.orders} pedidos`} className={tw('w-full max-w-10 rounded-t-md bg-gradient-to-t from-[#e06d43] to-[#ff9b80] transition hover:brightness-95')} style={{ height: `${Math.max(bucket.revenue ? 6 : 1, (bucket.revenue / max) * 100)}%` }} />
        <span className={tw('pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg group-hover:block')}>{bucket.label}: {money(bucket.revenue)} · {bucket.orders} pedidos</span>
      </div>)}
    </div>
    <div className={tw('mt-2 flex justify-between gap-1 text-[10px] text-slate-400 sm:text-xs')}><span>{buckets[0]?.label}</span><span>{buckets[Math.floor(buckets.length / 2)]?.label}</span><span>{buckets.at(-1)?.label}</span></div>
  </div>;
}

function StatusChart({ counts, total }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return <div className={tw('flex flex-col items-center gap-5 sm:flex-row sm:justify-center')}>
    <div className={tw('relative h-40 w-40 shrink-0')}><svg viewBox="0 0 100 100" className={tw('h-full w-full -rotate-90')} role="img" aria-label="Distribución de pedidos por estado"><circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />{statusOrder.map((status, index) => {
      const portion = total ? (counts[status] || 0) / total : 0;
      const segmentOffset = total ? statusOrder.slice(0, index).reduce((sum, previousStatus) => sum + (counts[previousStatus] || 0) / total, 0) * circumference : 0;
      return portion ? <circle key={status} cx="50" cy="50" r={radius} fill="none" stroke={statusColors[status]} strokeWidth="12" strokeDasharray={`${portion * circumference} ${circumference}`} strokeDashoffset={-segmentOffset}><title>{status}: {counts[status] || 0}</title></circle> : null;
    })}</svg><div className={tw('absolute inset-0 flex flex-col items-center justify-center')}><strong className={tw('text-2xl text-slate-800')}>{total}</strong><span className={tw('text-xs text-slate-500')}>pedidos</span></div></div>
    <ul className={tw('grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:max-w-56 sm:grid-cols-1')}>{statusOrder.map((status) => <li key={status} className={tw('flex items-center justify-between gap-3 text-xs')}><span className={tw('flex items-center gap-2 text-slate-600')}><i className={tw('h-2.5 w-2.5 rounded-full')} style={{ backgroundColor: statusColors[status] }} />{status}</span><strong className={tw('text-slate-800')}>{counts[status] || 0}</strong></li>)}</ul>
  </div>;
}

export default function ReportesAdmin() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [criticalThreshold, setCriticalThreshold] = useState(5);
  const [period, setPeriod] = useState('30');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([apiAxios.get('/admin/pedidos'), apiAxios.get('/admin/inventario'), apiAxios.get('/auth/admin/configuracion')])
      .then(([ordersResponse, inventoryResponse, settingsResponse]) => {
        if (!active) return;
        setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
        setInventory(Array.isArray(inventoryResponse.data) ? inventoryResponse.data : []);
        setCriticalThreshold(Number(settingsResponse.data.umbralStockCritico ?? 5));
      })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'No se pudieron cargar los datos de reportes.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const { start, end } = getRange(period, customStart, customEnd);
  const rangeValid = period !== 'custom' || (customStart && customEnd && start <= end);
  const startTime = start.getTime();
  const endTime = end.getTime();
  const filteredOrders = useMemo(() => rangeValid ? orders.filter((order) => {
    const date = orderDate(order);
    return !Number.isNaN(date.getTime()) && date >= new Date(startTime) && date <= new Date(endTime);
  }) : [], [orders, startTime, endTime, rangeValid]);
  const salesOrders = filteredOrders.filter((order) => paidStates.has(order.estado));
  const revenue = salesOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const averageOrder = salesOrders.length ? revenue / salesOrders.length : 0;
  const delivered = filteredOrders.filter((order) => order.estado === 'Entregado').length;
  const canceled = filteredOrders.filter((order) => order.estado === 'Cancelado').length;
  const statusCounts = statusOrder.reduce((counts, status) => ({ ...counts, [status]: filteredOrders.filter((order) => order.estado === status).length }), {});
  const productSales = new Map();
  salesOrders.forEach((order) => order.productos?.forEach((product) => {
    const key = product.nombre || 'Producto';
    const entry = productSales.get(key) || { name: key, quantity: 0, revenue: 0 };
    const quantity = Number(product.quantity || product.cantidad || 0);
    entry.quantity += quantity;
    entry.revenue += Number(product.precio || 0) * quantity;
    productSales.set(key, entry);
  }));
  const topProducts = [...productSales.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const recentSales = [...salesOrders].sort((a, b) => orderDate(b) - orderDate(a)).slice(0, 5);
  const buckets = Array.from({ length: 12 }, (_, index) => {
    const bucketStart = new Date(start.getTime() + ((end.getTime() - start.getTime() + 1) * index / 12));
    const bucketEnd = new Date(start.getTime() + ((end.getTime() - start.getTime() + 1) * (index + 1) / 12));
    const bucketOrders = salesOrders.filter((order) => { const date = orderDate(order); return date >= bucketStart && date < bucketEnd; });
    return { label: bucketStart.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }), revenue: bucketOrders.reduce((sum, order) => sum + Number(order.total || 0), 0), orders: bucketOrders.length };
  });
  const criticalStock = inventory.filter((item) => Number(item.stock) <= criticalThreshold).length;
  const comparisonStart = new Date(start);
  comparisonStart.setDate(comparisonStart.getDate() - Math.max(1, Math.ceil((end - start) / 86400000)));
  const previousRevenue = orders.filter((order) => { const date = orderDate(order); return paidStates.has(order.estado) && date >= comparisonStart && date < start; }).reduce((sum, order) => sum + Number(order.total || 0), 0);
  const revenueDelta = previousRevenue ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100) : null;

  return <section className={tw('mx-auto w-full max-w-7xl space-y-6 pb-10')}>
    <header className={tw('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between')}>
      <div><p className={tw('text-xs font-bold uppercase tracking-[.14em] text-[#e06d43]')}>Rendimiento de la tienda</p><h1 className={tw('mt-1 text-3xl font-bold tracking-tight text-slate-800')}>Reportes</h1><p className={tw('mt-2 text-sm text-slate-500')}>Entiende tus ventas, pedidos y productos de un vistazo.</p></div>
      <label className={tw('flex min-h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm sm:w-auto')}><FaCalendarAlt className={tw('shrink-0 text-[#e06d43]')} /><select aria-label="Periodo del reporte" value={period} onChange={(event) => setPeriod(event.target.value)} className={tw('min-w-0 flex-1 bg-transparent py-2 outline-none sm:flex-none')}><option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option><option value="90">Últimos 90 días</option><option value="month">Este mes</option><option value="custom">Rango personalizado</option></select></label>
    </header>
    {period === 'custom' && <div className={tw('grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end')}><label className={tw('grid gap-1 text-xs font-semibold text-slate-600')}>Desde<input type="date" max={customEnd || undefined} value={customStart} onChange={(event) => setCustomStart(event.target.value)} className={tw('min-h-11 rounded-xl border border-slate-200 px-3 text-sm')} /></label><label className={tw('grid gap-1 text-xs font-semibold text-slate-600')}>Hasta<input type="date" min={customStart || undefined} value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className={tw('min-h-11 rounded-xl border border-slate-200 px-3 text-sm')} /></label>{!rangeValid && <p role="alert" className={tw('text-xs text-rose-600 sm:col-span-2')}>La fecha inicial debe ser anterior a la final.</p>}</div>}
    {error && <div role="alert" className={tw('rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800')}>{error}</div>}
    <div className={tw('grid gap-4 sm:grid-cols-2 xl:grid-cols-4')}>
      <MetricCard title="Ingresos confirmados" value={loading ? '—' : money(revenue)} hint={revenueDelta === null ? 'En el periodo seleccionado' : `${revenueDelta >= 0 ? '+' : ''}${revenueDelta}% frente al periodo anterior`} icon={FaDollarSign} tone="orange" trend={revenueDelta === null ? null : revenueDelta >= 0 ? 'up' : 'down'} />
      <MetricCard title="Pedidos recibidos" value={loading ? '—' : filteredOrders.length.toLocaleString('es-CO')} hint={`${statusCounts.Pendiente} pendientes de gestión`} icon={FaShoppingBag} tone="blue" />
      <MetricCard title="Venta promedio" value={loading ? '—' : money(averageOrder)} hint="Por pedido confirmado" icon={FaChartLine} tone="green" />
      <MetricCard title="Unidades vendidas" value={loading ? '—' : salesOrders.reduce((sum, order) => sum + (order.productos || []).reduce((units, item) => units + Number(item.quantity || item.cantidad || 0), 0), 0).toLocaleString('es-CO')} hint={`${criticalStock} artículos con stock crítico`} icon={FaBoxOpen} tone="navy" />
    </div>
    <div className={tw('grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.85fr)]')}>
      <article className={tw('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6')}><div className={tw('flex flex-wrap items-start justify-between gap-3')}><div><h2 className={tw('text-lg font-bold text-slate-800')}>Ingresos en el tiempo</h2><p className={tw('mt-1 text-sm text-slate-500')}>Ventas confirmadas dentro del periodo.</p></div><span className={tw('rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#e06d43]')}>{salesOrders.length} pedidos confirmados</span></div>{loading ? <p className={tw('py-16 text-center text-sm text-slate-400')}>Cargando gráfico…</p> : salesOrders.length ? <SalesChart buckets={buckets} /> : <p className={tw('py-16 text-center text-sm text-slate-400')}>No hay ventas confirmadas en este periodo.</p>}</article>
      <article className={tw('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6')}><div className={tw('mb-5')}><h2 className={tw('text-lg font-bold text-slate-800')}>Estado de pedidos</h2><p className={tw('mt-1 text-sm text-slate-500')}>Distribución de todos los pedidos del periodo.</p></div>{loading ? <p className={tw('py-16 text-center text-sm text-slate-400')}>Cargando…</p> : <StatusChart counts={statusCounts} total={filteredOrders.length} />}</article>
    </div>
    <div className={tw('grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]')}>
      <article className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}><div className={tw('border-b border-slate-100 p-4 sm:px-6')}><h2 className={tw('text-lg font-bold text-slate-800')}>Productos más vendidos</h2><p className={tw('mt-1 text-sm text-slate-500')}>Unidades en pedidos confirmados.</p></div>{topProducts.length ? <div className={tw('divide-y divide-slate-100')}>{topProducts.map((product, index) => { const max = topProducts[0].quantity || 1; return <div key={product.name} className={tw('grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6')}><span className={tw('flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-xs font-bold text-[#e06d43]')}>{index + 1}</span><div className={tw('min-w-0')}><div className={tw('flex items-center justify-between gap-2')}><strong className={tw('truncate text-sm font-semibold text-slate-700')}>{product.name}</strong><span className={tw('shrink-0 text-xs text-slate-500')}>{product.quantity} uds.</span></div><div className={tw('mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100')}><div className={tw('h-full rounded-full bg-[#ff7e5f]')} style={{ width: `${(product.quantity / max) * 100}%` }} /></div></div><span className={tw('hidden whitespace-nowrap text-xs font-medium text-slate-500 sm:block')}>{money(product.revenue)}</span></div>; })}</div> : <p className={tw('p-8 text-center text-sm text-slate-500')}>Aún no hay productos vendidos en este periodo.</p>}</article>
      <article className={tw('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6')}><h2 className={tw('text-lg font-bold text-slate-800')}>Resumen del periodo</h2><p className={tw('mt-1 text-sm text-slate-500')}>{start.toLocaleDateString('es-CO')} — {end.toLocaleDateString('es-CO')}</p><div className={tw('mt-5 divide-y divide-slate-100')}><div className={tw('flex justify-between gap-3 py-3 text-sm')}><span className={tw('text-slate-500')}>Entregados</span><strong className={tw('text-slate-800')}>{delivered}</strong></div><div className={tw('flex justify-between gap-3 py-3 text-sm')}><span className={tw('text-slate-500')}>Cancelados</span><strong className={tw('text-slate-800')}>{canceled}</strong></div><div className={tw('flex justify-between gap-3 py-3 text-sm')}><span className={tw('flex items-center gap-2 text-slate-500')}><FaExclamationCircle className={tw('text-amber-500')} />Artículos con stock crítico</span><strong className={tw('text-slate-800')}>{criticalStock}</strong></div><div className={tw('flex justify-between gap-3 py-3 text-sm')}><span className={tw('text-slate-500')}>Ingreso confirmado</span><strong className={tw('text-[#e06d43]')}>{money(revenue)}</strong></div></div></article>
    </div>
    <article className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <div className={tw('border-b border-slate-100 p-4 sm:px-6')}><h2 className={tw('text-lg font-bold text-slate-800')}>Ventas recientes</h2><p className={tw('mt-1 text-sm text-slate-500')}>Últimos pedidos con ingreso confirmado en el periodo.</p></div>
      {recentSales.length ? <>
        <div className={tw('hidden overflow-x-auto md:block')}><table className={tw('w-full min-w-[650px] text-left')}><thead className={tw('bg-slate-50 text-xs uppercase tracking-wide text-slate-500')}><tr><th className={tw('px-5 py-3')}>Fecha</th><th className={tw('px-5 py-3')}>Pedido</th><th className={tw('px-5 py-3')}>Cliente</th><th className={tw('px-5 py-3')}>Estado</th><th className={tw('px-5 py-3 text-right')}>Total</th></tr></thead><tbody className={tw('divide-y divide-slate-100')}>{recentSales.map((order) => <tr key={order._id}><td className={tw('whitespace-nowrap px-5 py-4 text-sm text-slate-500')}>{orderDate(order).toLocaleDateString('es-CO')}</td><td className={tw('px-5 py-4 text-sm font-medium text-slate-700')}>#{String(order._id).slice(-7).toUpperCase()}</td><td className={tw('px-5 py-4 text-sm text-slate-700')}>{order.datosEnvio?.nombres} {order.datosEnvio?.apellidos}</td><td className={tw('px-5 py-4')}><span className={tw('rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700')}>{order.estado}</span></td><td className={tw('whitespace-nowrap px-5 py-4 text-right text-sm font-bold text-slate-800')}>{money(order.total)}</td></tr>)}</tbody></table></div>
        <div className={tw('divide-y divide-slate-100 md:hidden')}>{recentSales.map((order) => <article key={order._id} className={tw('space-y-2 p-4')}><div className={tw('flex items-start justify-between gap-3')}><div className={tw('min-w-0')}><p className={tw('truncate text-sm font-semibold text-slate-800')}>{order.datosEnvio?.nombres} {order.datosEnvio?.apellidos}</p><p className={tw('text-xs text-slate-400')}>#{String(order._id).slice(-7).toUpperCase()} · {orderDate(order).toLocaleDateString('es-CO')}</p></div><strong className={tw('shrink-0 text-sm text-slate-800')}>{money(order.total)}</strong></div><span className={tw('inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700')}>{order.estado}</span></article>)}</div>
      </> : <p className={tw('p-8 text-center text-sm text-slate-500')}>No hay ventas confirmadas para mostrar.</p>}
    </article>
  </section>;
}
