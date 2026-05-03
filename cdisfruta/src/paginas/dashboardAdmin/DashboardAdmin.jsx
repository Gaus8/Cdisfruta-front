import '../../assets/styles/dashboardAdmin/styles_dashboard_admin.css'
import {
  FaHome, FaBox, FaUsers, FaChartLine, FaCog, FaBell,
  FaUserCircle, FaSignOutAlt,FaUser, FaCogs, FaShieldAlt
} from "react-icons/fa";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, data, Link, useLocation  } from "react-router";
import { URL_SERVER } from '../../funciones/conexion';
import { useAuth } from '../../funciones/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardAdmin() {  
  const { userData, loading, authenticated } = useAuth();
  if (loading) {
    return <div>Cargando información del usuario...</div>;
  }
  else if(!userData){
    
    return <div>Asegurese de Iniciar Sesión.</div>;
  }
  else if(userData.rol !== 'admin' ){
   return <div>No tiene los roles para acceder</div>;
  }
  else{

  


  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header user={userData} />
        <MainContent />
      </div>
    </div>
  );
}
}




/* ========== CONTENIDO PRINCIPAL ========== */
function MainContent() {
  return (
    <div className="dashboard-content">
      <div className="cards">
        <Card title="Ventas Totales" value="$25,400" />
        <Card title="Usuarios Activos" value="1,245" />
        <Card title="Productos" value="312" />
        <Card title="Pedidos Pendientes" value="48" />
      </div>
    </div>
  );
}

/* ========== COMPONENTE CARD ========== */
function Card({ title, value }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}