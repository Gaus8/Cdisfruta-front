import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaBoxOpen, FaClock, FaCheckCircle, 
  FaTruck, FaHome, FaTimesCircle, FaWhatsapp, FaEye 
} from "react-icons/fa";
import { apiAxios } from "../../funciones/conexion";
import { useAuth } from "../../funciones/useAuth";
import "../../assets/styles/usuarios/mis_pedidos.css";

const PASOS_ESTADO = ["Pendiente", "Comprobado", "Enviado", "Entregado"];

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modales de cancelación
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [otroMotivoTexto, setOtroMotivoTexto] = useState(""); // 👈 Estado para el texto personalizado

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { userData } = useAuth();
  const navigate = useNavigate();

  const fetchMisPedidos = async () => {
    try {
      setLoading(true);
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
    const motivoFinal = motivoCancelacion === "Otro motivo" ? otroMotivoTexto : motivoCancelacion;

    if (!motivoFinal) {
      alert("⚠️ Por favor selecciona o escribe un motivo de cancelación.");
      return;
    }

    try {
      await apiAxios.patch(`/pedidos/${pedidoACancelar}/estado`, { 
        estado: 'Cancelado',
        motivo: motivoFinal 
      });

      setShowCancelModal(false);
      setPedidoACancelar(null);
      setMotivoCancelacion("");
      setOtroMotivoTexto("");
      fetchMisPedidos();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
      alert("No se pudo cancelar el pedido.");
    }
  };

  const abrirWhatsAppSoporte = (pedido) => {
    const nombresCliente = pedido.datosEnvio ? `${pedido.datosEnvio.nombres} ${pedido.datosEnvio.apellidos}` : "Cliente";
    const idCorto = pedido._id.slice(-8).toUpperCase();
    const totalFormateado = pedido.total.toLocaleString('es-CO');
    
    const listaProductos = pedido.productos
      .map(item => `• ${item.nombre} (Cant: ${item.quantity || item.cantidad})`)
      .join('\n');

    const mensaje = 
      `Hola, necesito soporte con mi pedido *#${idCorto}* ` +
      `a nombre de *${nombresCliente}*.\n\n` +
      `*Productos:* \n${listaProductos}\n\n` +
      `*Valor Total:* *$${totalFormateado}*.`;

    const miNumero = "573229683625";
    window.open(`https://wa.me/${miNumero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const obtenerIndicePaso = (estado) => {
    if (estado === "Cancelado") return -1;
    const index = PASOS_ESTADO.indexOf(estado);
    return index !== -1 ? index : 0;
  };

  if (loading) return <div className="loading-state">Cargando tus compras...</div>;

  return (
    <div className="mis-pedidos-container">
      
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
            const idCorto = pedido._id.slice(-8).toUpperCase();
            const nombreDestinatario = pedido.datosEnvio ? `${pedido.datosEnvio.nombres} ${pedido.datosEnvio.apellidos}` : "Cliente CDISFRUTA";

            return (
              <div key={pedido._id} className="order-card">
                
                <div className="order-header-amazon">
                  <div className="header-col">
                    <span className="col-label">PEDIDO REALIZADO</span>
                    <span className="col-value">{fechaFormateada}</span>
                  </div>
                  <div className="header-col">
                    <span className="col-label">TOTAL</span>
                    <span className="col-value">${pedido.total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="header-col">
                    <span className="col-label">ENVIAR A</span>
                    <span className="col-value highlight-name">{nombreDestinatario}</span>
                  </div>
                  <div className="header-col order-id-col">
                    <span className="col-label">PEDIDO N.° {idCorto}</span>
                    <span className="col-links">
                      <button onClick={() => { setPedidoSeleccionado(pedido); setShowDetailsModal(true); }}>
                        Ver detalles del pedido
                      </button>
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-main-grid">
                    <div className="order-products-section">
                      <div className="status-badge-row">
                        <span className={`badge badge-${pedido.estado.toLowerCase()}`}>
                          {pedido.estado === 'Pendiente' && <FaClock />}
                          {pedido.estado === 'Comprobado' && <FaCheckCircle />}
                          {pedido.estado === 'Enviado' && <FaTruck />}
                          {pedido.estado === 'Entregado' && <FaHome />}
                          {pedido.estado === 'Cancelado' && <FaTimesCircle />}
                          Estado: {pedido.estado}
                        </span>
                      </div>

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
                          {pedido.motivoCancelacion && <span style={{display: 'block', fontSize: '12px', marginTop: '4px'}}>Motivo: {pedido.motivoCancelacion}</span>}
                        </div>
                      )}

                      <div className="order-products-summary">
                        {pedido.productos.map((item, idx) => {
                          const fotoUrl = item.imagen || item.img || item.url || item.foto;

                          return (
                            <div key={idx} className="order-product-item">
                              <img 
                                src={fotoUrl || "https://via.placeholder.com/60"} 
                                alt={item.nombre} 
                                className="order-product-thumbnail" 
                                onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                              />
                              <div className="order-product-info">
                                <h4>{item.nombre}</h4>
                                <p>Cantidad: <strong>{item.quantity || item.cantidad}</strong></p>
                              </div>
                              <div className="order-product-subtotal">
                                ${(item.precio * (item.quantity || item.cantidad)).toLocaleString('es-CO')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="order-actions-sidebar">
                      <button 
                        className="btn-amazon-action primary"
                        onClick={() => { setPedidoSeleccionado(pedido); setShowDetailsModal(true); }}
                      >
                        <FaEye /> Ver o editar pedido
                      </button>

                      <button 
                        className="btn-amazon-action secondary"
                        onClick={() => abrirWhatsAppSoporte(pedido)}
                      >
                        <FaWhatsapp color="#25D366" /> Preguntar sobre este pedido
                      </button>

                      {pedido.estado === 'Pendiente' && (
                        <button 
                          className="btn-amazon-action danger"
                          onClick={() => {
                            setPedidoACancelar(pedido._id);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancelar Pedido
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal de Detalles del Pedido */}
      {showDetailsModal && pedidoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <div className="modal-header">
              <h3>Detalles del Pedido #{pedidoSeleccionado._id.slice(-8).toUpperCase()}</h3>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            
            <div className="details-body">
              <div className="detail-group">
                <h4>👤 Información del Cliente y Envío</h4>
                <p><strong>Nombre:</strong> {pedidoSeleccionado.datosEnvio?.nombres} {pedidoSeleccionado.datosEnvio?.apellidos}</p>
                <p><strong>WhatsApp:</strong> {pedidoSeleccionado.datosEnvio?.whatsapp}</p>
                <p><strong>Departamento:</strong> {pedidoSeleccionado.datosEnvio?.departamento}</p>
                <p><strong>Municipio / Ciudad:</strong> {pedidoSeleccionado.datosEnvio?.municipio}</p>
                <p><strong>Dirección:</strong> {pedidoSeleccionado.datosEnvio?.direccion} ({pedidoSeleccionado.datosEnvio?.barrio})</p>
                {pedidoSeleccionado.datosEnvio?.nota && (
                  <p><strong>Nota / Apto:</strong> {pedidoSeleccionado.datosEnvio?.nota}</p>
                )}
              </div>

              <div className="detail-group">
                <h4>💳 Método de Pago</h4>
                <p className="payment-method-tag">Pago Contra Entrega 🤝</p>
              </div>

              <div className="detail-group">
                <h4>📌 Estado Actual</h4>
                <p><strong>{pedidoSeleccionado.estado}</strong></p>
                {pedidoSeleccionado.motivoCancelacion && (
                  <p style={{marginTop: '5px', color: '#c62828'}}><strong>Motivo de cancelación:</strong> {pedidoSeleccionado.motivoCancelacion}</p>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secundario" onClick={() => setShowDetailsModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelación con campo condicional para "Otro motivo" */}
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
              style={{ marginBottom: '15px' }}
            >
              <option value="">Seleccione un motivo...</option>
              <option value="Me equivoqué de productos">Me equivoqué de productos</option>
              <option value="Ya no necesito el pedido">Ya no necesito el pedido</option>
              <option value="Encontré un mejor precio">Encontré un mejor precio</option>
              <option value="Otro motivo">Otro motivo</option>
            </select>

            {/* Campo de texto que aparece únicamente si selecciona "Otro motivo" */}
            {motivoCancelacion === "Otro motivo" && (
              <textarea 
                value={otroMotivoTexto}
                onChange={(e) => setOtroMotivoTexto(e.target.value)}
                placeholder="Escribe aquí el motivo detallado..."
                className="modal-textarea"
                style={{ marginBottom: '15px' }}
                required
              />
            )}

            <div className="modal-actions">
              <button className="btn-secundario" onClick={() => { setShowCancelModal(false); setOtroMotivoTexto(""); }}>Regresar</button>
              <button className="btn-peligro" onClick={handleCancelarPedido}>Confirmar Cancelación</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito de Cancelación */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: '30px' }}>
            <FaTimesCircle size={45} style={{ color: '#e53935', marginBottom: '15px' }} />
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>¡Pedido Cancelado!</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Tu pedido ha sido cancelado con éxito y el motivo fue registrado para el administrador.
            </p>
            <button 
              className="btn-ir-tienda" 
              style={{ width: '100%', marginTop: '0' }}
              onClick={() => setShowSuccessModal(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}