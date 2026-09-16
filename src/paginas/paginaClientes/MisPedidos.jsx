import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaBoxOpen, FaClock, FaCheckCircle, 
  FaTruck, FaHome, FaTimesCircle, FaStore 
} from "react-icons/fa";
import { apiAxios } from "../../funciones/conexion";
import { useAuth } from "../../funciones/useAuth";
import "../../assets/styles/usuarios/mis_pedidos.css";

const PASOS_ESTADO = ["Pendiente", "Comprobado", "Enviado", "Entregado"];

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const { userData } = useAuth();
  const navigate = useNavigate();

  const fetchMisPedidos = async () => {
    try {
      setLoading(true);
      // Hacemos la petición; el backend filtrará por la sesión activa o el ID del usuario
      const response = await apiAxios.get('/pedidos/mis-pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMisPedidos();
  }, [userData]);

  const handleCancelarPedido = async () => {
    if (!motivoCancelacion) {
      alert("⚠️ Por favor selecciona o escribe un motivo de cancelación.");
      return;
    }

    try {
      await apiAxios.patch(`/pedidos/${pedidoACancelar}/estado`, { 
        estado: 'Cancelado',
        motivo: motivoCancelacion 
      });

      setShowCancelModal(false);
      setPedidoACancelar(null);
      setMotivoCancelacion("");
      fetchMisPedidos();
      alert("✅ Tu pedido ha sido cancelado con éxito.");
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
      alert("No se pudo cancelar el pedido.");
    }
  };

  const obtenerIndicePaso = (estado) => {
    if (estado === "Cancelado") return -1;
    const index = PASOS_ESTADO.indexOf(estado);
    return index !== -1 ? index : 0;
  };

  if (loading) return <div className="loading-state">Cargando tus compras...</div>;

  return (
    <div className="mis-pedidos-container">
      
      {/* Botón de Retorno Profesional estilo píldora */}
      <div className="mis-pedidos-nav-top">
        <button className="btn-volver-pro" onClick={() => navigate('/cliente/tienda')}>
          <FaArrowLeft /> Seguir Comprando en la Tienda
        </button>
      </div>

      <div className="mis-pedidos-header">
        <h2>Mis Pedidos</h2>
        <p>Consulta el historial, estado y seguimiento en tiempo real de tus compras en CDISFRUTA.</p>
      </div>

      <div className="orders-list">
        {pedidos.length === 0 ? (
          <div className="empty-orders">
            <FaBoxOpen size={50} style={{ color: '#ccc', marginBottom: '15px' }} />
            <p>Aún no has realizado ningún pedido o tu sesión necesita recargar el historial.</p>
            <button className="btn-ir-tienda" onClick={() => navigate('/cliente/tienda')}>
              Explorar productos
            </button>
          </div>
        ) : (
          pedidos.map((pedido) => {
            const pasoActual = obtenerIndicePaso(pedido.estado);
            const fechaFormateada = new Date(pedido.fechaCreacion).toLocaleDateString('es-CO', {
              day: 'numeric', month: 'long', year: 'numeric'
            });

            return (
              <div key={pedido._id} className="order-card">
                
                {/* Cabecera de la Tarjeta */}
                <div className="order-header">
                  <span className="order-date">
                    <FaClock /> Realizado el {fechaFormateada}
                  </span>
                  <span className={`badge badge-${pedido.estado.toLowerCase()}`}>
                    {pedido.estado === 'Pendiente' && <FaClock />}
                    {pedido.estado === 'Comprobado' && <FaCheckCircle />}
                    {pedido.estado === 'Enviado' && <FaTruck />}
                    {pedido.estado === 'Entregado' && <FaHome />}
                    {pedido.estado === 'Cancelado' && <FaTimesCircle />}
                    {pedido.estado}
                  </span>
                </div>

                <div className="order-body">
                  {/* Línea de Progreso Visual (Timeline) */}
                  {pedido.estado !== 'Cancelado' ? (
                    <div className="order-timeline">
                      {PASOS_ESTADO.map((paso, idx) => {
                        const completado = idx <= pasoActual;
                        return (
                          <div key={idx} className={`timeline-step ${completado ? 'active' : ''}`}>
                            <div className="step-bullet">
                              {idx === 0 && <FaClock size={10} />}
                              {idx === 1 && <FaCheckCircle size={10} />}
                              {idx === 2 && <FaTruck size={10} />}
                              {idx === 3 && <FaHome size={10} />}
                            </div>
                            <span>{paso}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="canceled-banner">
                      <FaTimesCircle /> Este pedido fue cancelado.
                    </div>
                  )}

                  {/* Lista de Productos */}
                  <div className="order-products-summary">
                    {pedido.productos.map((item, idx) => (
                      <div key={idx} className="order-product-item">
                        <img 
                          src={item.imagen || "https://via.placeholder.com/60"} 
                          alt={item.nombre} 
                          className="order-product-thumbnail" 
                        />
                        <div className="order-product-info">
                          <h4>{item.nombre}</h4>
                          <p>Cantidad: <strong>{item.quantity || item.cantidad}</strong></p>
                        </div>
                        <div className="order-product-subtotal">
                          ${(item.precio * (item.quantity || item.cantidad)).toLocaleString('es-CO')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer de la Tarjeta */}
                  <div className="order-footer-info">
                    <div className="order-total">
                      <span>Total Pagado:</span>
                      <strong>${pedido.total.toLocaleString('es-CO')}</strong>
                    </div>

                    {pedido.estado === 'Pendiente' && (
                      <div className="order-actions">
                        <button 
                          className="btn-cancelar-pedido"
                          onClick={() => {
                            setPedidoACancelar(pedido._id);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancelar Pedido
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal de Cancelación */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cancelar Pedido</h3>
              <button className="modal-close" onClick={() => setShowCancelModal(false)}>✕</button>
            </div>
            <p className="modal-subtitle">Selecciona un motivo para ayudarnos a mejorar:</p>
            
            <select 
              value={motivoCancelacion} 
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              className="modal-select"
            >
              <option value="">Seleccione un motivo...</option>
              <option value="Me equivoqué de productos">Me equivoqué de productos</option>
              <option value="Ya no necesito el pedido">Ya no necesito el pedido</option>
              <option value="Encontré un mejor precio">Encontré un mejor precio</option>
              <option value="Otro motivo">Otro motivo</option>
            </select>

            <div className="modal-actions">
              <button className="btn-secundario" onClick={() => setShowCancelModal(false)}>Regresar</button>
              <button className="btn-peligro" onClick={handleCancelarPedido}>Confirmar Cancelación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}