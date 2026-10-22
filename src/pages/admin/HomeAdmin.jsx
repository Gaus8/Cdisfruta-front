import { createElement, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxes, FaClipboardList, FaStore, FaMoneyBillWave, FaTruckLoading, FaExclamationTriangle, FaPlus, FaArrowRight } from 'react-icons/fa';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const money = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
const orderDate = (order) => new Date(order.fechaCreacion || order.createdAt || 0);
const confirmedStates = new Set(['Comprobado', 'Enviado', 'Entregado']);
const dispatchStates = new Set(['Pendiente', 'Comprobado']);

function statusClass(status) {
  if (status === 'Entregado') return 'bg-emerald-100 text-emerald-800';
  if (status === 'Enviado') return 'bg-sky-100 text-sky-800';
  if (status === 'Cancelado') return 'bg-rose-100 text-rose-800';
  if (status === 'Comprobado') return 'bg-blue-100 text-blue-800';
  return 'bg-amber-100 text-amber-800';
}

export default function HomeAdmin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [criticalThreshold, setCriticalThreshold] = useState(5);

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        const [ordersResponse, inventoryResponse, settingsResponse] = await Promise.all([
          apiAxios.get('/admin/pedidos'),
          apiAxios.get('/admin/inventario'),
          apiAxios.get('/auth/admin/configuracion'),
        ]);
        if (!active) return;
        setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
        setInventory(Array.isArray(inventoryResponse.data) ? inventoryResponse.data : []);
        setCriticalThreshold(Number(settingsResponse.data.umbralStockCritico ?? 5));
        setLoadError('');
      } catch (error) {
        if (active) setLoadError(error.response?.data?.message || 'No se pudieron actualizar las métricas. Intenta recargar el panel.');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDashboard();
    const timer = window.setInterval(loadDashboard, 30000);
    const updateSettings = (event) => setCriticalThreshold(Number(event.detail?.umbralStockCritico ?? 5));
    window.addEventListener('admin-settings-updated', updateSettings);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('admin-settings-updated', updateSettings); };
  }, []);

  const currentMonth = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const date = orderDate(order);
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && confirmedStates.has(order.estado);
    });
  }, [orders]);
  const salesTotal = currentMonth.reduce((total, order) => total + Number(order.total || 0), 0);
  const dispatchCount = orders.filter((order) => dispatchStates.has(order.estado)).length;
  const criticalItems = inventory.filter((item) => Number(item.stock) <= criticalThreshold).length;
  const recentOrders = [...orders].sort((a, b) => orderDate(b) - orderDate(a)).slice(0, 5);

  const stats = [
    { title: 'Ventas confirmadas del mes', value: loading ? '—' : money(salesTotal), icon: FaMoneyBillWave, color: 'border-emerald-500 text-emerald-700', hint: 'Pedidos comprobados, enviados o entregados' },
    { title: 'Pedidos por despachar', value: loading ? '—' : dispatchCount.toLocaleString('es-CO'), icon: FaTruckLoading, color: 'border-sky-500 text-sky-700', hint: 'Pendientes de confirmación o despacho' },
    { title: 'Stock crítico', value: loading ? '—' : `${criticalItems} ${criticalItems === 1 ? 'artículo' : 'artículos'}`, icon: FaExclamationTriangle, color: 'border-rose-500 text-rose-700', hint: `Existencias de ${criticalThreshold} unidades o menos` },
  ];

  return (
    <div className={tw('mx-auto w-full max-w-7xl space-y-7 pb-10')}>
      <header className={tw('flex flex-col gap-1')}>
        <p className={tw('text-sm font-semibold uppercase tracking-[.14em] text-[#e06d43]')}>Resumen operativo</p>
        <h1 className={tw('text-3xl font-bold tracking-tight text-slate-800')}>Panel de control</h1>
        <p className={tw('text-sm text-slate-500')}>Indicadores actualizados desde los pedidos y el inventario de CDISFRUTA.</p>
      </header>

      {loadError && <div role="alert" className={tw('rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800')}>{loadError}</div>}

      <section aria-label="Indicadores del negocio" className={tw('grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3')}>
        {stats.map(({ title, value, icon, color, hint }) => <article key={title} className={tw('flex min-h-32 items-center gap-4 rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm', color.split(' ')[0])}>
          <span className={tw('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl', color.split(' ')[1])}>{createElement(icon)}</span>
          <div className={tw('min-w-0')}><p className={tw('text-sm text-slate-500')}>{title}</p><p className={tw('mt-1 break-words text-2xl font-bold text-slate-800')}>{value}</p><p className={tw('mt-1 text-xs text-slate-400')}>{hint}</p></div>
        </article>)}
      </section>

      <div className={tw('grid gap-6 xl:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.8fr)]')}>
        <section className={tw('space-y-3')}>
          <div><h2 className={tw('text-lg font-bold text-slate-800')}>Acciones rápidas</h2><p className={tw('text-sm text-slate-500')}>Accede a las tareas frecuentes.</p></div>
          <div className={tw('grid gap-2 sm:grid-cols-2 xl:grid-cols-1')}>
            <button type="button" onClick={() => navigate('/admin/inventario')} className={tw('flex min-h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-700 shadow-sm transition hover:border-[#ff7e5f] hover:text-[#e06d43]')}><span className={tw('flex items-center gap-3')}><FaPlus className={tw('text-[#e06d43]')} />Registrar inventario</span><FaArrowRight className={tw('text-xs text-slate-400')} /></button>
            <button type="button" onClick={() => navigate('/admin/pedidos')} className={tw('flex min-h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-700 shadow-sm transition hover:border-[#ff7e5f] hover:text-[#e06d43]')}><span className={tw('flex items-center gap-3')}><FaClipboardList className={tw('text-[#e06d43]')} />Gestionar pedidos</span><FaArrowRight className={tw('text-xs text-slate-400')} /></button>
            <button type="button" onClick={() => navigate('/admin/productos')} className={tw('flex min-h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-700 shadow-sm transition hover:border-[#ff7e5f] hover:text-[#e06d43]')}><span className={tw('flex items-center gap-3')}><FaStore className={tw('text-[#e06d43]')} />Administrar catálogo</span><FaArrowRight className={tw('text-xs text-slate-400')} /></button>
            <button type="button" onClick={() => navigate('/admin/inventario')} className={tw('flex min-h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-700 shadow-sm transition hover:border-[#ff7e5f] hover:text-[#e06d43]')}><span className={tw('flex items-center gap-3')}><FaBoxes className={tw('text-[#e06d43]')} />Revisar existencias</span><FaArrowRight className={tw('text-xs text-slate-400')} /></button>
          </div>
        </section>

        <section className={tw('min-w-0 space-y-3')}>
          <div className={tw('flex items-end justify-between gap-3')}><div><h2 className={tw('text-lg font-bold text-slate-800')}>Pedidos recientes</h2><p className={tw('text-sm text-slate-500')}>Actividad real registrada en el sistema.</p></div><button type="button" onClick={() => navigate('/admin/pedidos')} className={tw('shrink-0 text-sm font-semibold text-[#e06d43] hover:underline')}>Ver todos</button></div>
          <div className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
            {loading ? <p className={tw('p-6 text-sm text-slate-500')}>Cargando información…</p> : recentOrders.length === 0 ? <div className={tw('p-8 text-center')}><FaClipboardList className={tw('mx-auto mb-2 text-2xl text-slate-300')} /><p className={tw('font-semibold text-slate-700')}>Aún no hay pedidos</p><p className={tw('mt-1 text-sm text-slate-500')}>Los pedidos aparecerán aquí cuando se registren.</p></div> : <>
              <div className={tw('hidden overflow-x-auto md:block')}><table className={tw('w-full min-w-[620px] text-left')}><thead className={tw('bg-slate-50 text-xs uppercase tracking-wide text-slate-500')}><tr><th className={tw('px-5 py-3')}>Cliente</th><th className={tw('px-5 py-3')}>Pedido</th><th className={tw('px-5 py-3')}>Total</th><th className={tw('px-5 py-3')}>Estado</th></tr></thead><tbody className={tw('divide-y divide-slate-100')}>{recentOrders.map((order) => <tr key={order._id}><td className={tw('px-5 py-4 text-sm font-medium text-slate-800')}>{order.datosEnvio?.nombres} {order.datosEnvio?.apellidos}</td><td className={tw('max-w-56 px-5 py-4')}><p className={tw('truncate text-sm text-slate-700')}>{order.productos?.map((product) => product.nombre).join(', ') || 'Sin detalle'}</p><p className={tw('mt-1 text-xs text-slate-400')}>{orderDate(order).toLocaleDateString('es-CO')}</p></td><td className={tw('whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-800')}>{money(order.total)}</td><td className={tw('px-5 py-4')}><span className={tw('rounded-full px-2.5 py-1 text-xs font-semibold', statusClass(order.estado))}>{order.estado}</span></td></tr>)}</tbody></table></div>
              <div className={tw('divide-y divide-slate-100 md:hidden')}>{recentOrders.map((order) => <article key={order._id} className={tw('space-y-2 p-4')}><div className={tw('flex items-start justify-between gap-3')}><div className={tw('min-w-0')}><h3 className={tw('truncate font-semibold text-slate-800')}>{order.datosEnvio?.nombres} {order.datosEnvio?.apellidos}</h3><p className={tw('text-xs text-slate-400')}>{orderDate(order).toLocaleDateString('es-CO')}</p></div><span className={tw('shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', statusClass(order.estado))}>{order.estado}</span></div><p className={tw('line-clamp-2 text-sm text-slate-600')}>{order.productos?.map((product) => product.nombre).join(', ') || 'Sin detalle'}</p><p className={tw('text-sm font-bold text-slate-800')}>{money(order.total)}</p></article>)}</div>
            </>}
          </div>
        </section>
      </div>
    </div>
  );
}
