import { tw } from '../../funciones/tw.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL_SERVER, apiAxios } from '../../funciones/conexion';
import { FaClipboardList, FaArrowLeft, FaSave, FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function GestionPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [estadosSeleccionados, setEstadosSeleccionados] = useState({});
  const [actualizandoId, setActualizandoId] = useState(null);
  const [mensajeFeedback, setMensajeFeedback] = useState(null);

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
        <button 
          onClick={() => navigate('/admin')}
          className={tw("btn-volver-admin")}
        >
          <FaArrowLeft /> Volver al Inicio
        </button>
      </div>

      {pedidos.length === 0 ? (
        <div className={tw("empty-state")}>
          <p>No hay pedidos registrados en el sistema.</p>
        </div>
      ) : (
        <div className={tw(tw("admin-orders-list"), "![display:flex]", "![flex-direction:column]", "![gap:20px]")} >
          {pedidos.map((pedido) => {
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