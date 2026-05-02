import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, data, Link, useLocation  } from "react-router";
import { URL_SERVER } from '../../funciones/conexion';
import { useAuth } from '../../funciones/useAuth';
import {
  FaHome, FaBox, FaUsers, FaChartLine, FaCog, FaBell,
  FaUserCircle, FaSignOutAlt,FaUser, FaCogs, FaShieldAlt
} from "react-icons/fa";


export default function Header({user}) {
  const navigate = useNavigate()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications] = useState(3);

  const handleLogoutClick = () => {
    setShowProfileDropdown(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
      try {
       await axios.post('https://web-inventario.onrender.com/api/logout', {}, {
        withCredentials: true,
      });
      // Limpiar estado local
      setUserData(null);
      
      // Redirigir al login
      navigate('/login')
      
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/login')
    }

    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    console.log('Ir a perfil...');
    setShowProfileDropdown(false);
  };

  const handleSettingsClick = () => {
    console.log('Ir a configuraciones...');
    setShowProfileDropdown(false);
  };

  return (
    <div className="header">
      <h1 className="header-title">Gestión de Productos</h1>
      <div className="header-icons">
        {/* Notificaciones */}
        <div className="header-notifications">
          <FaBell className="icon" />
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
        </div>

        {/* Perfil con Dropdown */}
        <div className="header-profile">
          <FaUserCircle
            className="icon"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{ cursor: 'pointer' }}
          />

          {showProfileDropdown && (
            <div className="profile-dropdown">
              {/* Información del usuario */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb'
              }}>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '2px'
                }}>
                    {user.email}
                </div>
              </div>

              {/* Opciones del dropdown */}
              <button className="dropdown-item" onClick={handleProfileClick}>
                <FaUser size={14} />
                Mi Perfil
              </button>

              <button className="dropdown-item" onClick={handleSettingsClick}>
                <FaCogs size={14} />
                Configuración
              </button>

              <button className="dropdown-item">
                <FaShieldAlt size={14} />
                Privacidad
              </button>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item logout" onClick={handleLogoutClick}>
                <FaSignOutAlt size={14} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar el dropdown al hacer click fuera */}
      {showProfileDropdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowProfileDropdown(false)}
        />
      )}

      {/* Modal de Logout */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <FaSignOutAlt className="logout-icon" />
            <h2 className="logout-title">Cerrar Sesión</h2>
            <p className="logout-message">
              ¿Estás seguro de que quieres cerrar sesión?<br />
              Serás redirigido a la página principal.
            </p>
            <div className="logout-actions">
              <button
                className="btn-logout-cancel"
                onClick={handleLogoutCancel}
              >
                Cancelar
              </button>
              <button
                className="btn-logout-confirm"
                onClick={handleLogoutConfirm}
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}