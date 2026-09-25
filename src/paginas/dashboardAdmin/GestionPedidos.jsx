import { tw } from '../../funciones/tw.js';
import { useState, useEffect, useMemo } from 'react';
import { apiAxios } from '../../funciones/conexion';
import { FaSave, FaCheckCircle, FaTimes, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [estadosSeleccionados, setEstadosSeleccionados] = useState({});
  const [actualizandoId, setActualizandoId] = useState(null);
  const [mensajeFeedback, setMensajeFeedback] = useState(null);
  const [periodoFecha, setPeriodoFecha] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const pedidosFiltrados = useMemo(() => {
    const now = new Date();
    const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let start = null;
    let end = null;
    if (periodoFecha === 'hoy') start = startOfDay(now);
    if (periodoFecha === 'ayer') {
      start = startOfDay(now);
      start.setDate(start.getDate() - 1);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    }
    if (periodoFecha === '7' || periodoFecha === '15') {
      start = startOfDay(now);
      start.setDate(start.getDate() - (Number(periodoFecha) - 1));
    }
    if (periodoFecha === 'mes') start = new Date(now.getFullYear(), now.getMonth(), 1);
    if (periodoFecha === 'personalizado' && (!fechaInicio || !fechaFin || fechaInicio > fechaFin)) return [];
    if (periodoFecha === 'personalizado') {
      start = new Date(`${fechaInicio}T00:00:00`);
      end = new Date(`${fechaFin}T23:59:59.999`);
    }
    return pedidos.filter((pedido) => {
      const date = new Date(pedido.fechaCreacion || pedido.createdAt);
      return !Number.isNaN(date.getTime()) && (!start || date >= start) && (!end || date <= end);
    });
  }, [pedidos, periodoFecha, fechaInicio, fechaFin]);

  const fetchTodosLosPedidos = async () => {
    try {
      setLoading(true);
      const response = await apiAxios.get('/admin/pedidos');
      setPedidos(response.data);
      
      const initialStates = {};
      response.data.forEach(p => {
        initialStates[p._id] = p.estado;
      });
      setEstadosSeleccionados(initialStates);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodosLosPedidos();
  }, []);

  const handleSelectChange = (pedidoId, nuevoEstado) => {
    setEstadosSeleccionados(prev => ({
      ...prev,
      [pedidoId]: nuevoEstado
    }));
  };

  const handleGuardarEstado = async (pedidoId) => {
    const estadoAEjecutar = estadosSeleccionados[pedidoId];
    try {
      setActualizandoId(pedidoId);
      await apiAxios.patch(`/admin/pedidos/${pedidoId}/estado`, { estado: estadoAEjecutar });
      
      setPedidos(prev => prev.map(p => p._id === pedidoId ? { ...p, estado: estadoAEjecutar } : p));
      
      setMensajeFeedback({ texto: '¡Estado del pedido actualizado con éxito!', tipo: 'success' });
      setTimeout(() => setMensajeFeedback(null), 4000);

    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      setMensajeFeedback({ texto: 'No se pudo actualizar el estado del pedido.', tipo: 'error' });
      setTimeout(() => setMensajeFeedback(null), 4000);
    } finally {
      setActualizandoId(null);
    }
  };

  if (loading) return <div className={tw("loading-state")}>Cargando pedidos de la tienda...</div>;

  return (
    <div className={tw("gestion-pedidos-container")}>
      
      {mensajeFeedback && (
        <div className={tw(`admin-toast-notification ${mensajeFeedback.tipo}`)}>
          {mensajeFeedback.tipo === 'success' ? <FaCheckCircle size={18} /> : <FaTimes size={18} />}
          <span>{mensajeFeedback.texto}</span>
        </div>
      )}

      {/* Cabecera */}
      <div className={tw("gestion-pedidos-header")}>
        <div>
          <h2> Gestión de Pedidos</h2>
          <p>Administra los pedidos de los clientes y actualiza su estado de seguimiento.</p>
        </div>
      </div>

      <details className={tw('mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm')}>
        <summary className={tw('flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-700 marker:hidden sm:px-5')}>
          <span className={tw('flex items-center gap-2')}><FaCalendarAlt className={tw('text-[#e06d43]')} />Filtrar pedidos por fecha <span className={tw('rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500')}>{pedidosFiltrados.length} de {pedidos.length}</span></span>
          <FaChevronDown className={tw('shrink-0 text-xs text-slate-400')} />
        </summary>
        <div className={tw('grid gap-3 border-t border-slate-100 p-4 sm:grid-cols-[minmax(180px,240px)_1fr] sm:items-end sm:px-5')}>
          <label className={tw('grid gap-1.5 text-xs font-semibold text-slate-600')}>Periodo
            <select value={periodoFecha} onChange={(event) => setPeriodoFecha(event.target.value)} className={tw('min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#ff7e5f]')}>
              <option value="todos">Todos los pedidos</option><option value="hoy">Hoy</option><option value="ayer">Ayer</option><option value="7">Últimos 7 días</option><option value="15">Últimos 15 días</option><option value="mes">Este mes</option><option value="personalizado">Rango personalizado</option>
            </select>
          </label>
          {periodoFecha === 'personalizado' && <div className={tw('grid gap-3 sm:grid-cols-2')}>
            <label className={tw('grid gap-1.5 text-xs font-semibold text-slate-600')}>Desde<input type="date" value={fechaInicio} max={fechaFin || undefined} onChange={(event) => setFechaInicio(event.target.value)} className={tw('min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#ff7e5f]')} /></label>
            <label className={tw('grid gap-1.5 text-xs font-semibold text-slate-600')}>Hasta<input type="date" value={fechaFin} min={fechaInicio || undefined} onChange={(event) => setFechaFin(event.target.value)} className={tw('min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#ff7e5f]')} /></label>
          </div>}
        </div>
      </details>

      {pedidosFiltrados.length === 0 ? (
        <div className={tw("empty-state")}>
          <p>{pedidos.length === 0 ? 'No hay pedidos registrados en el sistema.' : periodoFecha === 'personalizado' && (!fechaInicio || !fechaFin) ? 'Selecciona una fecha inicial y final para consultar el rango.' : 'No hay pedidos para el periodo seleccionado.'}</p>
        </div>
      ) : (
        <div className={tw(tw("admin-orders-list"), "![display:flex]", "![flex-direction:column]", "![gap:20px]")} >
          {pedidosFiltrados.map((pedido) => {
            const estadoActualModificado = estadosSeleccionados[pedido._id] !== pedido.estado;

            return (
              <div key={pedido._id} className={tw("admin-order-card")}>
                <div className={tw("admin-order-top")}>
                  <div>
                    <span className={tw("![font-size:0.85rem]", "![color:#555]", "![word-break:break-all]")}><strong>ID:</strong> {pedido._id}</span><br />
                    <span className={tw("![font-size:0.82rem]", "![color:#888]")}>Fecha: {new Date(pedido.fechaCreacion).toLocaleString()}</span>
                  </div>

                  <div className={tw("admin-order-actions")}>
                    <label className={tw("![font-size:0.9rem]", "![font-weight:bold]", "![color:#444]")}>Estado:</label>
                    <select 
                      value={estadosSeleccionados[pedido._id] || pedido.estado} 
                      onChange={(e) => handleSelectChange(pedido._id, e.target.value)}
                      className={tw("admin-order-select")}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Comprobado">Comprobado</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>

                    <button
                      onClick={() => handleGuardarEstado(pedido._id)}
                      disabled={!estadoActualModificado || actualizandoId === pedido._id}
                      className={tw(`btn-guardar-estado ${estadoActualModificado ? 'active' : 'disabled'}`)}
                      title={estadoActualModificado ? "Guardar nuevo estado" : "Selecciona un estado diferente para guardar"}
                    >
                      <FaSave /> {actualizandoId === pedido._id ? 'Guardando...' : 'Actualizar'}
                    </button>
                  </div>
                </div>

                <div className={tw("admin-order-grid")}>
                  <div>
                    <p><strong>Cliente:</strong> {pedido.datosEnvio?.nombres} {pedido.datosEnvio?.apellidos}</p>
                    <p><strong>WhatsApp:</strong> {pedido.datosEnvio?.whatsapp}</p>
                    <p><strong>Correo:</strong> {pedido.datosEnvio?.correo || 'No registrado'}</p>
                  </div>
                  <div>
                    <p><strong>Dirección:</strong> {pedido.datosEnvio?.direccion}, {pedido.datosEnvio?.barrio}</p>
                    <p><strong>Ciudad / Depto:</strong> {pedido.datosEnvio?.municipio}, {pedido.datosEnvio?.departamento}</p>
                    <p><strong>Nota:</strong> {pedido.datosEnvio?.nota || 'Ninguna'}</p>
                  </div>
                </div>

                <div className={tw("admin-order-products")}>
                  <strong>Productos solicitados:</strong>
                  <ul>
                    {pedido.productos.map((item, idx) => (
                      <li key={idx}>
                        {item.nombre} — Cant.: <strong>{item.quantity || item.cantidad}</strong> — Subtotal: <strong className={tw("![color:#2c3e50]")}>${(item.precio * (item.quantity || item.cantidad)).toLocaleString('es-CO')}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={tw("admin-order-footer")}>
                  <span className={tw("![font-weight:600]", "![color:#555]")}>Total del Pedido:</span> 
                  <span className={tw("![color:#27ae60]", "![font-size:1.2rem]", "![font-weight:bold]")}>${pedido.total?.toLocaleString('es-CO')}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
