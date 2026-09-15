import { useState, useEffect } from 'react';
import { URL_SERVER, apiAxios } from '../../funciones/conexion'; 
import { useAuth } from '../../funciones/useAuth'; 
import { FaBoxOpen, FaClock, FaCheckCircle, FaTruck, FaHome, FaTimesCircle, FaTimes } from 'react-icons/fa';
import '../../assets/styles/usuarios/mis_pedidos.css';

export default function MisPedidos() {
  const { userData } = useAuth(); 
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para controlar el Modal de Cancelación
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState(null);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState('Me equivoqué de productos');
  const [motivoPersonalizado, setMotivoPersonalizado] = useState('');

  const fetchMisPedidos = async () => {
    const userId = userData?._id || userData?.id;
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(`${URL_SERVER}/mis-pedidos/${userId}`);
      if (!response.ok) throw new Error('No se pudieron cargar los pedidos');
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchMisPedidos();
    }
  }, [userData]);

  // Abre el modal para un pedido específico
  const abrirModalCancelacion = (pedido) => {
    setPedidoACancelar(pedido);
    setMotivoSeleccionado('Me equivoqué de productos');
    setMotivoPersonalizado('');
    setModalAbierto(true);
  };

  // Cierra el modal
  const cerrarModalCancelacion = () => {
    setModalAbierto(false);
    setPedidoACancelar(null);
  };

  // Confirma la cancelación procesando la BD y el WhatsApp
  const confirmarCancelacion = async (e) => {
    e.preventDefault();
    if (!pedidoACancelar) return;

    const motivoFinal = motivoSeleccionado === 'Otro' ? motivoPersonalizado : motivoSeleccionado;

    try {
      // 1. Actualiza el estado en la base de datos
      await apiAxios.patch(`/pedidos/${pedidoACancelar._id}/estado`, { estado: 'Cancelado' });

      // 2. Prepara y abre el enlace de WhatsApp con el motivo
      const telefonoEmpresa = "573000000000"; // Reemplaza con tu número real
      const mensaje = encodeURIComponent(`Hola, cancelé mi pedido ID: ${pedidoACancelar._id}.\nMotivo: ${motivoFinal}`);
      window.open(`https://wa.me/${telefonoEmpresa}?text=${mensaje}`, '_blank');

      // 3. Cierra modal y recarga la lista
      cerrarModalCancelacion();
      fetchMisPedidos();
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
      alert("No se pudo cancelar el pedido. Intenta de nuevo.");
    }
  };

  // Función para asignar badges de estado
  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <span className="badge badge-pendiente"><FaClock /> Pendiente</span>;
      case 'Comprobado':
        return <span className="badge badge-comprobado"><FaCheckCircle /> Comprobado</span>;
      case 'Enviado':
        return <span className="badge badge-enviado"><FaTruck /> Enviado</span>;
      case 'Entregado':
        return <span className="badge badge-entregado"><FaHome /> Entregado</span>;
      case 'Cancelado':
        return <span className="badge badge-cancelado"><FaTimesCircle /> Cancelado</span>;
      default:
        return <span className="badge">{estado}</span>;
    }
  };

  if (loading) return <div className="loading-state">Cargando tus pedidos...</div>;

  return (
    <div className="mis-pedidos-container">
      <h2>Mis Pedidos</h2>
      <p>Consulta el historial y seguimiento de tus compras en CDISFRUTA.</p>

      {pedidos.length === 0 ? (
        <div className="empty-orders">
          <FaBoxOpen size={40} />
          <p>Aún no has realizado ningún pedido.</p>
        </div>
      ) : (
        <div className="orders-list">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Pedido ID: {pedido._id}</span>
                <span className="order-date">
                  {new Date(pedido.fechaCreacion).toLocaleDateString()}
                </span>
              </div>

              <div className="order-body">
                <div className="order-products-summary">
                  {pedido.productos.map((item, idx) => (
                    <div key={idx} className="order-product-item">
                      <span>{item.nombre} (x{item.cantidad})</span>
                      <span>${item.precio * item.cantidad}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer-info">
                  <div className="order-total">
                    <strong>Total: </strong> ${pedido.total}
                  </div>
                  <div className="order-status-wrapper">
                    {getStatusBadge(pedido.estado)}
                  </div>
                </div>

                {pedido.estado === 'Pendiente' && (
                  <div className="order-actions">
                    <button 
                      className="btn-cancelar-pedido"
                      onClick={() => abrirModalCancelacion(pedido)}
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cancelación */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cancelar Pedido</h3>
              <button className="modal-close" onClick={cerrarModalCancelacion}><FaTimes /></button>
            </div>
            
            <form onSubmit={confirmarCancelacion}>
              <p className="modal-subtitle">Por favor, selecciona el motivo de la cancelación:</p>
              
              <div className="form-group">
                <select 
                  value={motivoSeleccionado} 
                  onChange={(e) => setMotivoSeleccionado(e.target.value)}
                  className="modal-select"
                >
                  <option value="Me equivoqué de productos">Me equivoqué de productos</option>
                  <option value="Ya no necesito la compra">Ya no necesito la compra</option>
                  <option value="Encontré otro medio / mejor precio">Encontré otro medio / mejor precio</option>
                  <option value="Otro">Otro motivo...</option>
                </select>
              </div>

              {motivoSeleccionado === 'Otro' && (
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <textarea 
                    placeholder="Especifica tu motivo..."
                    value={motivoPersonalizado}
                    onChange={(e) => setMotivoPersonalizado(e.target.value)}
                    required
                    className="modal-textarea"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secundario" onClick={cerrarModalCancelacion}>
                  Volver
                </button>
                <button type="submit" className="btn-peligro">
                  Confirmar Cancelación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}