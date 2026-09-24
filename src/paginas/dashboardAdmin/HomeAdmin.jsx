import { tw } from '../../funciones/tw.js';
import React from 'react';
import { FaMoneyBillWave, FaBoxOpen, FaChartLine, FaTruckLoading, FaPlus, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from "react-router";

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
    <div className={tw("home-admin-content")}>
      <header className={tw("home-header")}>
        <h1>Panel de Control</h1>
        <p>Revisa el estado de CDISFRUTA hoy</p>
      </header>

      {/* MÉTRICAS */}
      <div className={tw("stats-grid")}>
        <div className={tw("card-stat sales")}>
          <div className={tw("stat-icon")}><FaMoneyBillWave /></div>
          <div className={tw("stat-data")}>
            <span className={tw("label")}>Ventas del Mes</span>
            <strong className={tw("value")}>{stats.ventasMes}</strong>
          </div>
        </div>

        <div className={tw("card-stat orders")}>
          <div className={tw("stat-icon")}><FaTruckLoading /></div>
          <div className={tw("stat-data")}>
            <span className={tw("label")}>Pedidos por Despachar</span>
            <strong className={tw("value")}>{stats.pedidosPendientes}</strong>
          </div>
        </div>

        <div className={tw("card-stat inventory-alert")}>
          <div className={tw("stat-icon")}><FaBoxOpen /></div>
          <div className={tw("stat-data")}>
            <span className={tw("label")}>Stock Crítico</span>
            <strong className={tw("value")}>{stats.stockCritico} ítems</strong>
          </div>
        </div>
      </div>

      <div className={tw("dashboard-sections")}>
        {/* ACCIONES RÁPIDAS */}
        <section className={tw("quick-actions")}>
          <h3>Acciones Rápidas</h3>
          <div className={tw("actions-grid")}>
            <button className={tw("action-btn")} onClick={handleNuevoProducto}>
              <FaPlus /> Nuevo Producto
            </button>
            <button className={tw("action-btn")} onClick={handleVerReportes}>
              <FaChartLine /> Ver Reportes
            </button>
            <button className={tw("action-btn")} onClick={handleNuevaVenta}>
              <FaFileAlt /> Nueva Venta
            </button>
          </div>
        </section>

        {/* TABLA RECIENTE */}
        <section className={tw("recent-orders")}>
          <h3>Ventas Recientes</h3>
          <div className={tw("table-container")}>
            <table className={tw("summary-table")}>
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
                  <td><span className={tw("status-tag shipped")}>Enviado</span></td>
                </tr>
                <tr>
                  <td>María López</td>
                  <td>Snack Fruta Deshidratada Mix x50g</td>
                  <td>$35,500</td>
                  <td><span className={tw("status-tag pending")}>Pendiente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}