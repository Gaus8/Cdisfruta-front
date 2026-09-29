import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createElement } from 'react';
import { createPortal } from 'react-dom';
import { FaSearch, FaUsers, FaUserCheck, FaUserClock, FaChevronLeft, FaChevronRight, FaTimes, FaTrash, FaEye, FaShoppingBag, FaClipboardList, FaRegClock, FaChartLine } from 'react-icons/fa';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';
import ConfirmModal from './ConfirmModal';

const PAGE_SIZE = 10;
const currency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(value || 0));
const dateTime = (value) => value ? new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Sin registro';
const dateOnly = (value) => value ? new Date(value).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No disponible';
const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';

function UserActivityModal({ userId, onClose, onRequestDelete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    apiAxios.get(`/auth/admin/usuarios/${userId}/actividad`, { signal: controller.signal })
      .then(({ data: response }) => setData(response))
      .catch((requestError) => { if (!controller.signal.aborted) setError(requestError.response?.data?.message || 'No se pudo cargar la actividad del usuario.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => { controller.abort(); window.removeEventListener('keydown', closeOnEscape); };
  }, [userId, onClose]);

  const user = data?.usuario;
  const activity = data?.analitica;
  const forms = activity?.intentosFormulario || {};
  const totalFormAttempts = Object.values(forms).reduce((sum, count) => sum + Number(count || 0), 0);

  return createPortal(<div className={tw('fixed inset-0 z-[3000] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4')} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="user-activity-title" className={tw('flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl')}>
      <header className={tw('flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6')}>
        <div className={tw('flex min-w-0 items-center gap-3')}>
          {user?.avatar ? <img src={user.avatar} alt="" className={tw('h-12 w-12 shrink-0 rounded-2xl object-cover')} /> : <span className={tw('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 font-bold text-[#e06d43]')}>{initials(user?.nombre)}</span>}
          <div className={tw('min-w-0')}><p className={tw('text-xs font-semibold uppercase tracking-[.12em] text-[#e06d43]')}>Actividad del cliente</p><h2 id="user-activity-title" className={tw('truncate text-lg font-bold text-slate-800 sm:text-xl')}>{user?.nombre || (loading ? 'Cargando usuario…' : 'Detalle del usuario')}</h2>{user?.correo && <p className={tw('truncate text-sm text-slate-500')}>{user.correo}</p>}</div>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar detalle" className={tw('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100')}><FaTimes /></button>
      </header>
      <div className={tw('min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6')}>
        {error && <div role="alert" className={tw('rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700')}>{error}</div>}
        {loading && <div className={tw('py-14 text-center text-sm text-slate-500')}>Cargando historial del usuario…</div>}
        {!loading && data && <>
          <div className={tw('grid gap-3 sm:grid-cols-3')}>
            <div className={tw('rounded-2xl border border-slate-200 bg-slate-50 p-4')}><p className={tw('text-xs text-slate-500')}>Registro</p><p className={tw('mt-1 text-sm font-semibold text-slate-800')}>{dateOnly(user.fechaRegistro)}</p><span className={tw(`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.estado === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`)}>{user.estado === 'active' ? 'Cuenta verificada' : 'Pendiente de verificación'}</span></div>
            <div className={tw('rounded-2xl border border-slate-200 bg-slate-50 p-4')}><p className={tw('text-xs text-slate-500')}>Pedidos realizados</p><p className={tw('mt-1 text-2xl font-bold text-slate-800')}>{activity.pedidos.total}</p><p className={tw('text-xs text-slate-500')}>{Object.entries(activity.pedidos.porEstado || {}).map(([status, count]) => `${status}: ${count}`).join(' · ') || 'Sin pedidos registrados'}</p></div>
            <div className={tw('rounded-2xl border border-slate-200 bg-slate-50 p-4')}><p className={tw('text-xs text-slate-500')}>Intentos de formularios</p><p className={tw('mt-1 text-2xl font-bold text-slate-800')}>{totalFormAttempts}</p><p className={tw('text-xs text-slate-500')}>Carrito, cotización e interés</p></div>
          </div>
          <section className={tw('rounded-2xl border border-slate-200')}>
            <div className={tw('flex items-center gap-3 border-b border-slate-100 p-4')}><span className={tw('flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#e06d43]')}><FaChartLine /></span><div><h3 className={tw('font-bold text-slate-800')}>Interés y conversión</h3><p className={tw('text-xs text-slate-500')}>Métricas basadas en eventos instrumentados.</p></div></div>
            <div className={tw('grid gap-4 p-4 md:grid-cols-2')}>
              <div><h4 className={tw('mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700')}><FaEye className={tw('text-slate-400')} />Productos visitados con frecuencia</h4>{activity.productosFrecuentes.length ? <ul className={tw('space-y-2')}>{activity.productosFrecuentes.map((product) => <li key={product.productoId || product.nombre} className={tw('flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm')}><span className={tw('truncate font-medium text-slate-700')}>{product.nombre}</span><span className={tw('shrink-0 text-xs text-slate-500')}>{product.visitas} visitas</span></li>)}</ul> : <p className={tw('rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500')}>Aún no hay visitas registradas. La integración ya puede recibir eventos de productos desde la tienda.</p>}</div>
              <div><h4 className={tw('mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700')}><FaClipboardList className={tw('text-slate-400')} />Intentos de formularios</h4><div className={tw('grid grid-cols-3 gap-2')}>{[['Carrito', forms.cart], ['Cotización', forms.quote], ['Interés', forms.product_interest]].map(([label, value]) => <div key={label} className={tw('rounded-xl bg-slate-50 p-3 text-center')}><p className={tw('text-lg font-bold text-slate-800')}>{value || 0}</p><p className={tw('text-[11px] text-slate-500')}>{label}</p></div>)}</div><p className={tw('mt-3 text-xs leading-5 text-slate-500')}>{activity.disponible ? `${activity.eventosRegistrados} eventos analíticos recibidos.` : 'No se almacenan datos escritos en los formularios; solo se cuentan los intentos.'}</p></div>
            </div>
          </section>
          <section className={tw('rounded-2xl border border-slate-200')}>
            <div className={tw('border-b border-slate-100 p-4')}><h3 className={tw('flex items-center gap-2 font-bold text-slate-800')}><FaRegClock className={tw('text-[#e06d43]')} />Actividad reciente</h3></div>
            {activity.actividadReciente.length ? <ol className={tw('divide-y divide-slate-100 px-4')}>{activity.actividadReciente.map((item) => <li key={item.id} className={tw('flex items-start gap-3 py-3')}><span className={tw(`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.tipo === 'order' ? 'bg-[#ff7e5f]' : 'bg-sky-400'}`)} /><div className={tw('min-w-0 flex-1')}><p className={tw('text-sm font-semibold text-slate-700')}>{item.titulo}</p><p className={tw('text-xs text-slate-500')}>{item.detalle}</p></div><time className={tw('shrink-0 text-right text-[11px] text-slate-400')}>{dateTime(item.fecha)}</time></li>)}</ol> : <p className={tw('p-5 text-sm text-slate-500')}>Todavía no hay actividad registrada.</p>}
          </section>
          <section className={tw('rounded-2xl border border-slate-200')}><div className={tw('border-b border-slate-100 p-4')}><h3 className={tw('flex items-center gap-2 font-bold text-slate-800')}><FaShoppingBag className={tw('text-[#e06d43]')} />Pedidos recientes</h3></div>{activity.pedidos.recientes.length ? <div className={tw('divide-y divide-slate-100')}>{activity.pedidos.recientes.map((order) => <div key={order.id} className={tw('flex items-center justify-between gap-3 px-4 py-3')}><div><p className={tw('text-sm font-semibold text-slate-700')}>{order.estado}</p><p className={tw('text-xs text-slate-400')}>{dateOnly(order.fecha)}</p></div><strong className={tw('text-sm text-slate-800')}>{currency(order.total)}</strong></div>)}</div> : <p className={tw('p-4 text-sm text-slate-500')}>Este usuario aún no tiene pedidos.</p>}</section>
        </>}
      </div>
      <footer className={tw('flex flex-col-reverse justify-between gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6')}><p className={tw('text-xs text-slate-400')}>El historial de pedidos se conserva aunque se elimine la cuenta.</p><button type="button" disabled={!user} onClick={() => onRequestDelete(user)} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50')}><FaTrash />Eliminar cuenta</button></footer>
    </section>
  </div>, document.body);
}

export default function UsuariosAdmin() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, activos: 0, pendientes: 0 });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteTargets, setBulkDeleteTargets] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const selectAllRef = useRef(null);

  const selectedOnPage = users.filter((user) => selectedIds.includes(user.id)).length;
  const allOnPageSelected = users.length > 0 && selectedOnPage === users.length;
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedOnPage > 0 && !allOnPageSelected;
  }, [selectedOnPage, allOnPageSelected]);

  useEffect(() => {
    const timer = window.setTimeout(() => { setPage(1); setSelectedIds([]); setSearch(searchInput.trim()); }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    const loadUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiAxios.get('/auth/admin/usuarios', { params: { page, limit: PAGE_SIZE, search, status }, signal: controller.signal });
        setUsers(data.usuarios || []);
        setSummary(data.resumen || { total: 0, activos: 0, pendientes: 0 });
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError.response?.data?.message || 'No se pudo cargar el listado de usuarios.');
      } finally { if (!controller.signal.aborted) setLoading(false); }
    };
    loadUsers();
    return () => controller.abort();
  }, [page, search, status, refreshKey]);

  const openUserDetails = useCallback((user) => setSelectedUser(user), []);
  const closeUserDetails = useCallback(() => setSelectedUser(null), []);

  const confirmDelete = async () => {
    if (!deleteTarget && !bulkDeleteTargets.length) return;
    setDeleting(true);
    try {
      if (bulkDeleteTargets.length) {
        await apiAxios.delete('/auth/admin/usuarios', { data: { ids: bulkDeleteTargets.map((user) => user.id) } });
        setFeedback({ type: 'success', text: `Se eliminaron ${bulkDeleteTargets.length} cuentas seleccionadas. El historial de pedidos se conserva.` });
        setSelectedIds([]);
        setBulkDeleteTargets([]);
        if (users.length === bulkDeleteTargets.length && page > 1) setPage((current) => current - 1);
      } else {
        await apiAxios.delete(`/auth/admin/usuarios/${deleteTarget.id}`);
        setDeleteTarget(null);
        setSelectedUser(null);
        setSelectedIds((current) => current.filter((id) => id !== deleteTarget.id));
        setFeedback({ type: 'success', text: `La cuenta de ${deleteTarget.nombre} fue eliminada.` });
        if (users.length === 1 && page > 1) setPage((current) => current - 1);
      }
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setDeleteTarget(null);
      setBulkDeleteTargets([]);
      setSelectedUser(null);
      setFeedback({ type: 'error', text: requestError.response?.data?.message || 'No se pudo eliminar la cuenta.' });
    } finally { setDeleting(false); }
  };

  const firstRow = total ? ((page - 1) * PAGE_SIZE) + 1 : 0;
  const lastRow = Math.min(page * PAGE_SIZE, total);
  const pageNumbers = useMemo(() => Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
    const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
    return startPage + index;
  }), [page, totalPages]);
  const toggleUser = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const togglePage = () => setSelectedIds((current) => allOnPageSelected ? current.filter((id) => !users.some((user) => user.id === id)) : [...new Set([...current, ...users.map((user) => user.id)])]);

  return <section className={tw('mx-auto w-full max-w-7xl space-y-6 pb-10')}>
    <header className={tw('flex flex-col gap-2')}><p className={tw('text-xs font-bold uppercase tracking-[.14em] text-[#e06d43]')}>Administración</p><h1 className={tw('text-3xl font-bold tracking-tight text-slate-800')}>Usuarios</h1><p className={tw('text-sm text-slate-500')}>Consulta las cuentas de clientes y su actividad en CDISFRUTA.</p></header>
    <div className={tw('grid gap-3 sm:grid-cols-3')}>
      {[['Usuarios registrados', summary.total, FaUsers, 'slate'], ['Cuentas verificadas', summary.activos, FaUserCheck, 'green'], ['Pendientes de verificación', summary.pendientes, FaUserClock, 'amber']].map(([label, value, Icon, tone]) => <article key={label} className={tw('flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm')}><span className={tw(`flex h-11 w-11 items-center justify-center rounded-xl ${tone === 'green' ? 'bg-emerald-50 text-emerald-700' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`)}>{createElement(Icon)}</span><div><p className={tw('text-xs text-slate-500')}>{label}</p><p className={tw('text-xl font-bold text-slate-800')}>{value}</p></div></article>)}
    </div>
    {feedback && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={tw(`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`)}><span>{feedback.text}</span><button type="button" onClick={() => setFeedback(null)} aria-label="Cerrar aviso"><FaTimes /></button></div>}
    <section className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <div className={tw('flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5')}>
        <div><h2 className={tw('text-lg font-bold text-slate-800')}>Cuentas de clientes</h2><p className={tw('text-sm text-slate-500')}>Abre el nombre para ver el detalle y su historial.</p>{selectedIds.length > 0 && <div className={tw('mt-2 flex flex-wrap items-center gap-2')}><span className={tw('text-xs font-medium text-slate-500')}>{selectedIds.length} seleccionados</span><button type="button" onClick={() => setBulkDeleteTargets(users.filter((user) => selectedIds.includes(user.id)))} className={tw('inline-flex min-h-9 items-center gap-2 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50')}><FaTrash />Eliminar seleccionados</button></div>}</div>
        <div className={tw('grid gap-2 sm:grid-cols-[minmax(220px,300px)_190px]')}>
          <label className={tw('relative')}><FaSearch className={tw('absolute left-3 top-1/2 -translate-y-1/2 text-slate-400')} /><input type="search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Buscar nombre o correo" aria-label="Buscar usuarios" className={tw('min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100')} /></label>
          <select value={status} onChange={(event) => { setPage(1); setSelectedIds([]); setStatus(event.target.value); }} aria-label="Filtrar usuarios por estado" className={tw('min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#ff7e5f]')}><option value="all">Todos los estados</option><option value="active">Verificados</option><option value="pending">Pendientes</option></select>
        </div>
      </div>
      {error && <div role="alert" className={tw('m-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700')}>{error}</div>}
      <div className={tw('overflow-x-auto')}>
        <table className={tw('w-full min-w-[650px] text-left')}>
          <thead className={tw('bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500')}><tr><th scope="col" className={tw('w-12 px-4 py-3')}><input ref={selectAllRef} type="checkbox" checked={allOnPageSelected} onChange={togglePage} disabled={!users.length || loading} aria-label="Seleccionar todos los usuarios de esta página" className={tw('h-4 w-4 accent-[#ff7e5f]')} /></th><th scope="col" className={tw('px-5 py-3')}>Nombre</th><th scope="col" className={tw('px-5 py-3')}>Correo electrónico</th><th scope="col" className={tw('px-5 py-3')}>Fecha de registro</th><th scope="col" className={tw('px-5 py-3')}>Estado</th></tr></thead>
          <tbody className={tw('divide-y divide-slate-100')}>
            {loading ? <tr><td colSpan="5" className={tw('px-5 py-14 text-center text-sm text-slate-500')}>Cargando usuarios…</td></tr> : !users.length ? <tr><td colSpan="5" className={tw('px-5 py-14 text-center text-sm text-slate-500')}>{search || status !== 'all' ? 'No hay usuarios que coincidan con la búsqueda.' : 'Todavía no hay cuentas de cliente registradas.'}</td></tr> : users.map((user) => <tr key={user.id} className={tw('transition hover:bg-slate-50')}>
              <td className={tw('px-4 py-4')}><input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleUser(user.id)} aria-label={`Seleccionar a ${user.nombre}`} className={tw('h-4 w-4 accent-[#ff7e5f]')} /></td>
              <td className={tw('px-5 py-4')}><button type="button" onClick={() => openUserDetails(user)} className={tw('group flex items-center gap-3 text-left')} aria-label={`Ver detalle y actividad de ${user.nombre}`}><span className={tw('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#e06d43]')}>{initials(user.nombre)}</span><span className={tw('font-semibold text-slate-800 group-hover:text-[#e06d43]')}>{user.nombre}</span><FaEye className={tw('ml-1 shrink-0 text-xs text-slate-400 transition group-hover:text-[#e06d43]')} /></button></td>
              <td className={tw('px-5 py-4 text-sm text-slate-600')}>{user.correo}</td><td className={tw('whitespace-nowrap px-5 py-4 text-sm text-slate-600')}>{dateOnly(user.fechaRegistro)}</td><td className={tw('px-5 py-4')}><span className={tw(`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.estado === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`)}>{user.estado === 'active' ? 'Verificado' : 'Pendiente'}</span></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <footer className={tw('flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5')}>
        <p className={tw('text-xs text-slate-500')}>Mostrando {firstRow}–{lastRow} de {total} usuarios</p>
        <nav aria-label="Paginación de usuarios" className={tw('flex flex-wrap items-center gap-1')}>
          <button type="button" disabled={page <= 1 || loading} onClick={() => { setSelectedIds([]); setPage((current) => current - 1); }} aria-label="Página anterior" className={tw('flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40')}><FaChevronLeft className={tw('text-xs')} /></button>
          {pageNumbers.map((number) => <button key={number} type="button" aria-current={number === page ? 'page' : undefined} onClick={() => { setSelectedIds([]); setPage(number); }} className={tw(`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold ${number === page ? 'bg-[#ff7e5f] text-white' : 'text-slate-600 hover:bg-slate-100'}`)}>{number}</button>)}
          <button type="button" disabled={page >= totalPages || loading} onClick={() => { setSelectedIds([]); setPage((current) => current + 1); }} aria-label="Página siguiente" className={tw('flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40')}><FaChevronRight className={tw('text-xs')} /></button>
        </nav>
      </footer>
    </section>
    {selectedUser && <UserActivityModal userId={selectedUser.id} onClose={closeUserDetails} onRequestDelete={setDeleteTarget} />}
    <ConfirmModal open={Boolean(deleteTarget || bulkDeleteTargets.length)} title={bulkDeleteTargets.length ? `¿Eliminar ${bulkDeleteTargets.length} cuentas?` : '¿Eliminar esta cuenta?'} description={bulkDeleteTargets.length ? `Se eliminarán permanentemente las ${bulkDeleteTargets.length} cuentas seleccionadas y sus métricas analíticas. Los pedidos se conservarán para mantener los registros de venta.` : deleteTarget ? `Se eliminará de forma permanente la cuenta de ${deleteTarget.nombre} y sus métricas analíticas. El historial de pedidos se conservará para mantener los registros de venta.` : ''} confirmLabel={bulkDeleteTargets.length ? 'Sí, eliminar seleccionados' : 'Sí, eliminar cuenta'} busy={deleting} busyLabel="Eliminando…" onCancel={() => { if (!deleting) { setDeleteTarget(null); setBulkDeleteTargets([]); } }} onConfirm={confirmDelete} />
  </section>;
}
