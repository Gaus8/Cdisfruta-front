import {FaHome, FaBox, FaUsers, FaChartLine, FaCog} from "react-icons/fa";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, data, Link, useLocation  } from "react-router";
import { URL_SERVER } from '../../funciones/conexion';
import { useAuth } from '../../funciones/useAuth';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="logo">ShopAdmin</h2>
      <ul className="menu">
        <li className={location.pathname === "/dashboard_admin" ? "active" : ""}>
          <Link to="/dashboard_admin" className="link"><FaHome /> Dashboard</Link>
        </li>

        <li className={location.pathname === "/productos" ? "active" : ""}>
          <Link to="/productos" className="link"><FaBox /> Productos</Link>
        </li>

        <li className={location.pathname === "/usuarios" ? "active" : ""}>
          <Link to="/usuarios" className="link"><FaUsers /> Usuarios</Link>
        </li>

        <li className={location.pathname === "/ventas" ? "active" : ""}>
          <Link to="/ventas" className="link"><FaChartLine /> Ventas</Link>
        </li>

        <li className={location.pathname === "/configuracion" ? "active" : ""}>
          <Link to="/configuracion" className="link"><FaCog /> Configuración</Link>
        </li>
      </ul>
    </div>
  );
}