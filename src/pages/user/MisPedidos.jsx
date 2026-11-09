import { tw } from '../../utils/tw.js';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBoxOpen, FaClock, FaCheckCircle, 
  FaTruck, FaHome, FaTimesCircle, FaWhatsapp, FaEye 
} from "react-icons/fa";
import { apiAxios } from "../../services/api/client";
import { useAuth } from "../../hooks/useAuth";
import HeaderDashboard from "../../components/layout/CustomerHeader.jsx";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatDate } from "../../i18n/format.js";

const PASOS_ESTADO = ["Pendiente", "Comprobado", "Enviado", "Entregado"];
const STATUS_TRANSLATION_KEYS = { Pendiente: 'pending', Comprobado: 'checked', Enviado: 'shipped', Entregado: 'delivered', Cancelado: 'cancelled' };

export default function MisPedidos() {
  const { t, i18n } = useTranslation(['orders', 'common']);
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
    // The fetch helper owns its loading state and is triggered when the signed-in user changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMisPedidos();
  }, [userData]);

  const handleCancelarPedido = async () => {
    const motivoFinal = motivoCancelacion === "Otro motivo" ? otroMotivoTexto : motivoCancelacion;

    if (!motivoFinal) {
      alert(t('cancel.selectReason'));
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
      alert(t('cancel.failed'));
    }
  };

  const abrirWhatsAppSoporte = (pedido) => {
    const nombresCliente = pedido.datosEnvio ? `${pedido.datosEnvio.nombres} ${pedido.datosEnvio.apellidos}` : "Cliente";
    const idCorto = pedido._id.slice(-8).toUpperCase();
    const totalFormateado = formatCurrency(pedido.total, i18n.resolvedLanguage);
    
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

  if (loading) return <div className={tw("loading-state")}>{t('loading')}</div>;

  return (
    <div className={tw("client-area")}>
      <HeaderDashboard />
      <div className={tw("mis-pedidos-container")}>
      <div className={tw("mis-pedidos-header")}>
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <div className={tw("orders-list")}>
        {pedidos.length === 0 ? (
          <div className={tw("empty-orders")}>
            <FaBoxOpen size={50} className={tw("![color:#ccc]", "![margin-bottom:15px]")} />
            <p>{t('emptyWithRefresh')}</p>
            <button className={tw("btn-ir-tienda")} onClick={() => navigate('/cliente/tienda')}>
              {t('exploreProducts')}
            </button>
          </div>
        ) : (
          pedidos.map((pedido) => {
            const pasoActual = obtenerIndicePaso(pedido.estado);
            const fechaFormateada = formatDate(pedido.fechaCreacion, i18n.resolvedLanguage, { day: 'numeric', month: 'long', year: 'numeric' });
            const idCorto = pedido._id.slice(-8).toUpperCase();
            const nombreDestinatario = pedido.datosEnvio ? `${pedido.datosEnvio.nombres} ${pedido.datosEnvio.apellidos}` : "Cliente CDISFRUTA";

            return (
              <div key={pedido._id} className={tw("order-card")}>
                
                <div className={tw("order-header-amazon")}>
                  <div className={tw("header-col")}>
                    <span className={tw("col-label")}>{t('placed')}</span>
                    <span className={tw("col-value")}>{fechaFormateada}</span>
                  </div>
                  <div className={tw("header-col")}>
                    <span className={tw("col-label")}>{t('total')}</span>
                    <span className={tw("col-value")}>{formatCurrency(pedido.total, i18n.resolvedLanguage)}</span>
                  </div>
                  <div className={tw("header-col")}>
                    <span className={tw("col-label")}>{t('shipTo')}</span>
                    <span className={tw("col-value highlight-name")}>{nombreDestinatario}</span>
                  </div>
                  <div className={tw("header-col order-id-col")}>
                    <span className={tw("col-label")}>{t('orderNumber', { id: idCorto })}</span>
                    <span className={tw("col-links")}>
                      <button onClick={() => { setPedidoSeleccionado(pedido); setShowDetailsModal(true); }}>
                        {t('viewDetails')}
                      </button>
                    </span>
                  </div>
                </div>

                <div className={tw("order-body")}>
                  <div className={tw("order-main-grid")}>
                    <div className={tw("order-products-section")}>
                      <div className={tw("status-badge-row")}>
                        <span className={tw(`badge badge-${pedido.estado.toLowerCase()}`)}>
                          {pedido.estado === 'Pendiente' && <FaClock />}
                          {pedido.estado === 'Comprobado' && <FaCheckCircle />}
                          {pedido.estado === 'Enviado' && <FaTruck />}
                          {pedido.estado === 'Entregado' && <FaHome />}
                          {pedido.estado === 'Cancelado' && <FaTimesCircle />}
                          {t('statusLabel')}: {t(`status.${STATUS_TRANSLATION_KEYS[pedido.estado] || 'pending'}`)}
                        </span>
                      </div>

                      {pedido.estado !== 'Cancelado' ? (
                        <div className={tw("order-timeline")}>
                          {PASOS_ESTADO.map((paso, idx) => {
                            const completado = idx <= pasoActual;
                            return (
                              <div key={idx} className={tw(`timeline-step ${completado ? 'active' : ''}`)}>
                                <div className={tw("step-bullet")}>
                                  {idx === 0 && <FaClock size={10} />}
                                  {idx === 1 && <FaCheckCircle size={10} />}
                                  {idx === 2 && <FaTruck size={10} />}
                                  {idx === 3 && <FaHome size={10} />}
                                </div>
                                <span>{t(`status.${STATUS_TRANSLATION_KEYS[paso]}`)}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={tw("canceled-banner")}>
                          <FaTimesCircle /> {t('cancelledNotice')}
                          {pedido.motivoCancelacion && <span className={tw("![display:block]", "![font-size:12px]", "![margin-top:4px]")}>{t('reason')}: {pedido.motivoCancelacion}</span>}
                        </div>
                      )}

                      <div className={tw("order-products-summary")}>
                        {pedido.productos.map((item, idx) => {
                          const fotoUrl = item.imagen || item.img || item.url || item.foto;

                          return (
                            <div key={idx} className={tw("order-product-item")}>
                              <img 
                                src={fotoUrl || "https://via.placeholder.com/60"} 
                                alt={item.nombre} 
                                className={tw("order-product-thumbnail")} 
                                onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                              />
                              <div className={tw("order-product-info")}>
                                <h4>{item.nombre}</h4>
                                <p>{t('quantity')}: <strong>{item.quantity || item.cantidad}</strong></p>
                              </div>
                              <div className={tw("order-product-subtotal")}>
                                ${(item.precio * (item.quantity || item.cantidad)).toLocaleString('es-CO')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className={tw("order-actions-sidebar")}>
                      <button 
                        className={tw("btn-amazon-action primary")}
                        onClick={() => { setPedidoSeleccionado(pedido); setShowDetailsModal(true); }}
                      >
                        <FaEye /> {t('viewOrEdit')}
                      </button>

                      <button 
                        className={tw("btn-amazon-action secondary")}
                        onClick={() => abrirWhatsAppSoporte(pedido)}
                      >
                        <FaWhatsapp color="#25D366" /> {t('askAboutOrder')}
                      </button>

                      {pedido.estado === 'Pendiente' && (
                        <button 
                          className={tw("btn-amazon-action danger")}
                          onClick={() => {
                            setPedidoACancelar(pedido._id);
                            setShowCancelModal(true);
                          }}
                        >
                          {t('cancelOrder')}
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
        <div className={tw("modal-overlay")}>
          <div className={tw("modal-content details-modal")}>
            <div className={tw("modal-header")}>
              <h3>{t('detailsTitle', { id: pedidoSeleccionado._id.slice(-8).toUpperCase() })}</h3>
              <button className={tw("modal-close")} onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            
            <div className={tw("details-body")}>
              <div className={tw("detail-group")}>
                <h4>👤 {t('customerShipping')}</h4>
                <p><strong>{t('name')}:</strong> {pedidoSeleccionado.datosEnvio?.nombres} {pedidoSeleccionado.datosEnvio?.apellidos}</p>
                <p><strong>WhatsApp:</strong> {pedidoSeleccionado.datosEnvio?.whatsapp}</p>
                <p><strong>{t('department')}:</strong> {pedidoSeleccionado.datosEnvio?.departamento}</p>
                <p><strong>{t('city')}:</strong> {pedidoSeleccionado.datosEnvio?.municipio}</p>
                <p><strong>{t('address')}:</strong> {pedidoSeleccionado.datosEnvio?.direccion} ({pedidoSeleccionado.datosEnvio?.barrio})</p>
                {pedidoSeleccionado.datosEnvio?.nota && (
                  <p><strong>{t('note')}:</strong> {pedidoSeleccionado.datosEnvio?.nota}</p>
                )}
              </div>

              <div className={tw("detail-group")}>
                <h4>💳 {t('paymentMethod')}</h4>
                <p className={tw("payment-method-tag")}>{t('cashOnDelivery')} 🤝</p>
              </div>

              <div className={tw("detail-group")}>
                <h4>📌 {t('currentStatus')}</h4>
                <p><strong>{t(`status.${STATUS_TRANSLATION_KEYS[pedidoSeleccionado.estado] || 'pending'}`)}</strong></p>
                {pedidoSeleccionado.motivoCancelacion && (
                  <p className={tw("![margin-top:5px]", "![color:#c62828]")}><strong>{t('cancellationReason')}:</strong> {pedidoSeleccionado.motivoCancelacion}</p>
                )}
              </div>
            </div>

            <div className={tw("modal-actions")}>
              <button className={tw("btn-secundario")} onClick={() => setShowDetailsModal(false)}>{t('actions.close', { ns: 'common' })}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelación con campo condicional para "Otro motivo" */}
      {showCancelModal && (
        <div className={tw("modal-overlay")}>
          <div className={tw("modal-content")}>
            <div className={tw("modal-header")}>
              <h3>{t('cancelOrder')}</h3>
              <button className={tw("modal-close")} onClick={() => setShowCancelModal(false)}>✕</button>
            </div>
            <p className={tw("modal-subtitle")}>{t('cancel.prompt')}</p>
            
            <select 
              value={motivoCancelacion} 
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              className={tw(tw("modal-select"), "![margin-bottom:15px]")}
              
            >
              <option value="">{t('cancel.select')}</option>
              <option value="Me equivoqué de productos">{t('cancel.wrongItems')}</option>
              <option value="Ya no necesito el pedido">{t('cancel.notNeeded')}</option>
              <option value="Encontré un mejor precio">{t('cancel.betterPrice')}</option>
              <option value="Otro motivo">{t('cancel.other')}</option>
            </select>

            {/* Campo de texto que aparece únicamente si selecciona "Otro motivo" */}
            {motivoCancelacion === "Otro motivo" && (
              <textarea 
                value={otroMotivoTexto}
                onChange={(e) => setOtroMotivoTexto(e.target.value)}
                placeholder={t('cancel.writeReason')}
                className={tw(tw("modal-textarea"), "![margin-bottom:15px]")}
                
                required
              />
            )}

            <div className={tw("modal-actions")}>
              <button className={tw("btn-secundario")} onClick={() => { setShowCancelModal(false); setOtroMotivoTexto(""); }}>{t('back', { ns: 'common' })}</button>
              <button className={tw("btn-peligro")} onClick={handleCancelarPedido}>{t('cancel.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito de Cancelación */}
      {showSuccessModal && (
        <div className={tw("modal-overlay")}>
          <div className={tw(tw("modal-content"), "![text-align:center]", "![padding:30px]")} >
            <FaTimesCircle size={45} className={tw("![color:#e53935]", "![margin-bottom:15px]")} />
            <h3 className={tw("![color:#2c3e50]", "![margin-bottom:10px]")}>{t('cancel.successTitle')}</h3>
            <p className={tw("![color:#666]", "![font-size:14px]", "![margin-bottom:20px]")}>
              {t('cancel.successMessage')}
            </p>
            <button 
              className={tw(tw("btn-ir-tienda"), "![width:100%]", "![margin-top:0]")} 
              
              onClick={() => setShowSuccessModal(false)}
            >
              {t('understood', { ns: 'common' })}
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
