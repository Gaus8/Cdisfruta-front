import { useState, useEffect } from 'react';
import { URL_SERVER, apiAxios } from '../../funciones/conexion';
import { FaClipboardList, FaClock, FaCheckCircle, FaTruck, FaHome, FaTimesCircle } from 'react-icons/fa';

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todos los pedidos del backend
  const fetchTodosLosPedidos = async () => {
    try {
      setLoading(true);
      const response = await apiAxios.get('/pedidos'); // Asegúrate de que esta ruta exista en tu backend
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodosLosPedidos();
  }, []);

  // Cambiar el estado del pedido desde el select del admin
  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await apiAxios.patch(`/pedidos/${pedidoId}/estado`, { estado: nuevoEstado });
      // Recargamos la lista para actualizar los datos en pantalla
      fetchTodosLosPedidos();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  if (loading) return <div className="loading-state">Cargando pedidos de la tienda...</div>;

  return (
    <div className="gestion-pedidos-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2><FaClipboardList /> Gestión de Pedidos</h2>
      <p>Administra los pedidos de los clientes y actualiza su estado de seguimiento.</p>

      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados en el sistema.</p>
      ) : (
        <div className="admin-orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {pedidos.map((pedido) => (
            <div key={pedido._id} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <div>
                  <strong>Pedido ID:</strong> {pedido._id} <br />
                  <span style={{ fontSize: '13px', color: '#666' }}>Fecha: {new Date(pedido.fechaCreacion).toLocaleString()}</span>
                </div>
                <div>
                  {/* Selector rápido de Estado */}
                  <label style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '8px' }}>Estado:</label>
                  <select 
                    value={pedido.estado} 
                    onChange={(e) => handleCambiarEstado(pedido._id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '5px', border: '1px solid #ccc', fontWeight: '600' }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Comprobado">Comprobado</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Información del Cliente y Envío */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', fontSize: '14px', background: '#f9f9f9', padding: '12px', borderRadius: '6px' }}>
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

              {/* Productos del pedido */}
              <div style={{ fontSize: '14px' }}>
                <strong>Productos solicitados:</strong>
                <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                  {pedido.productos.map((item, idx) => (
                    <li key={idx} style={{ margin: '4px 0' }}>
                      {item.nombre} — Cantidad: <strong>{item.quantity || item.cantidad}</strong> — Subtotal: <strong>${(item.precio * (item.quantity || item.cantidad)).toLocaleString('es-CO')}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '16px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <strong>Total del Pedido: </strong> 
                <span style={{ color: '#27ae60', fontSize: '18px' }}>${pedido.total?.toLocaleString('es-CO')}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}