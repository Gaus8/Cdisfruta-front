import { useState, useEffect } from 'react';
import { URL_SERVER } from '../../funciones/conexion'; 
import { useAuth } from '../../funciones/useAuth'; // 1. Importa useAuth
import { FaBoxOpen, FaClock, FaCheckCircle, FaTruck, FaHome } from 'react-icons/fa';
import '../../assets/styles/usuarios/mis_pedidos.css';

export default function MisPedidos() {
  const { userData } = useAuth(); 
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisPedidos = async () => {
      // Usamos el ID del usuario autenticado (puede ser _id en Mongoose)
      const userId = userData?._id || userData?.id;
      if (!userId) return;

      try {
        setLoading(true);
        // Ojo: Asegúrate de que el endpoint coincida con tus rutas del backend
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

    if (userData) {
      fetchMisPedidos();
    }
  }, [userData]);

  // Función para asignar un icono y color según el estado del pedido
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}