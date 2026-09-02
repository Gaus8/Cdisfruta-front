import React from 'react';
import { FaMoneyBillWave, FaBoxOpen, FaChartLine, FaTruckLoading, FaPlus, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from "react-router";
import '../../assets/styles/dashboardAdmin/home_admin.css';

export default function HomeAdmin() {
  const navigate = useNavigate();

  const stats = {
    ventasMes: "$2,450,000",
    pedidosPendientes: 8,
    stockCritico: 3,
    productosActivos: 15
  };

  const handleNuevoProducto = () => {
    navigate('/dashboard_admin/productos', { state: { openModal: true } });
  };

  const handleNuevaVenta = () => {
    navigate('/dashboard_admin/inventario', { state: { openSale: true } });
  };

  const handleVerReportes = () => {
    navigate('/dashboard_admin/reportes');
  };

  return (
    <div className="home-admin-content">
      <header className="home-header">
        <h1>Panel de Control</h1>
        <p>Revisa el estado de CDISFRUTA hoy</p>
      </header>

      {/* MÉTRICAS */}
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
            <span className="label">Stock Crítico</span>
            <strong className="value">{stats.stockCritico} ítems</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* ACCIONES RÁPIDAS */}
        <section className="quick-actions">
          <h3>Acciones Rápidas</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={handleNuevoProducto}>
              <FaPlus /> Nuevo Producto
            </button>
            <button className="action-btn" onClick={handleVerReportes}>
              <FaChartLine /> Ver Reportes
            </button>
            <button className="action-btn" onClick={handleNuevaVenta}>
              <FaFileAlt /> Nueva Venta
            </button>
          </div>
        </section>

        {/* TABLA RECIENTE */}
        <section className="recent-orders">
          <h3>Ventas Recientes</h3>
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
                  <td>Saco Aromáticas x10 Unidades</td>
                  <td>$15,000</td>
                  <td><span className="status-tag shipped">Enviado</span></td>
                </tr>
                <tr>
                  <td>María López</td>
                  <td>Snack Fruta Deshidratada Mix x50g</td>
                  <td>$35,500</td>
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