import React from 'react';
import { FaMoneyBillWave, FaBoxOpen, FaChartLine, FaTruckLoading, FaPlus, FaFileAlt } from 'react-icons/fa';
import '../../assets/styles/dashboardAdmin/home_admin.css';

export default function HomeAdmin() {
  // Estos datos luego los traerás con un useEffect desde tu API
  const stats = {
    ventasMes: "$2,450,000",
    pedidosPendientes: 8,
    stockCritico: 3,
    productosActivos: 15
  };

  return (
    <div className="home-admin-content">
      <header className="home-header">
        <h1>Panel de Control</h1>
        <p>Revisa el estado de CDISFRUTA hoy.</p>
      </header>

      {/* SECCIÓN 1: MÉTRICAS DE VENTAS E INVENTARIO */}
      <div className="stats-grid">
        <div className="card-stat sales">
          <div className="stat-icon"><FaMoneyBillWave /></div>
          <div className="stat-data">
            <span className="label">Ventas del Mes</span>
            <strong className="value">{stats.ventasMes}</strong>
          </div>
        </div>

        <div className="card-stat orders">
          <div className="stat-icon"><FaTruckLoading /></div>
          <div className="stat-data">
            <span className="label">Pedidos por Despachar</span>
            <strong className="value">{stats.pedidosPendientes}</strong>
          </div>
        </div>

        <div className="card-stat inventory-alert">
          <div className="stat-icon"><FaBoxOpen /></div>
          <div className="stat-data">
            <span className="label">Agotándose</span>
            <strong className="value">{stats.stockCritico} ítems</strong>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: ACCESOS RÁPIDOS (BOTONES GRANDES) */}
      <div className="dashboard-sections">
        <section className="quick-actions">
          <h3>Acciones Rápidas</h3>
          <div className="actions-grid">
            <button className="action-btn">
              <FaPlus /> Nuevo Producto
            </button>
            <button className="action-btn">
              <FaChartLine /> Ver Reportes
            </button>
            <button className="action-btn">
              <FaFileAlt /> Nueva Venta
            </button>
          </div>
        </section>

        {/* SECCIÓN 3: RESUMEN VISUAL (TABLA SIMPLE) */}
        <section className="recent-orders">
          <h3>Últimas Ventas</h3>
          <div className="table-container">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Juan Pérez</td>
                  <td>Mix Frutos 250g</td>
                  <td>$15,000</td>
                  <td><span className="status-tag shipped">Enviado</span></td>
                </tr>
                <tr>
                  <td>María López</td>
                  <td>Mango Deshidratado</td>
                  <td>$45,000</td>
                  <td><span className="status-tag pending">Pendiente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}