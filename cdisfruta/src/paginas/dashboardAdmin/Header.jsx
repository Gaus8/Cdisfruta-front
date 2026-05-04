import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router";
import axios from "axios"; 

import { URL_SERVER } from "../../funciones/conexion"; 
import { FaBell, FaUserCircle, FaSignOutAlt, FaUserEdit, FaCog, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import '../../assets/styles/dashboardAdmin/header_admin.css';

export default function Header({ userName }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 1. CARGAR NOTIFICACIONES
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Quitamos el /api de aquí porque ya está en URL_SERVER
        const res = await axios.get(`${URL_SERVER}/get-notificaciones`, { withCredentials: true });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };
    fetchNotifications();
  }, []);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  // 2. MARCAR COMO LEÍDA
  const markAsRead = async (id) => {
    try {
      
      await axios.patch(`${URL_SERVER}/notificaciones/${id}`, {}, { withCredentials: true });
      setNotifications(notifications.filter(notif => notif._id !== id));
    } catch (err) {
      console.error("No se pudo marcar como leída:", err);
    }
  };

  // 3. LIMPIAR TODAS
  const clearAll = async () => {
    try {
      
      await axios.delete(`${URL_SERVER}/notificaciones-todas`, { withCredentials: true });
      setNotifications([]);
    } catch (err) {
      console.error("Error al limpiar notificacioness:", err);
    }
  };

  const handleLogout = async () => {
    try {
      // Quitamos /api de la ruta
      await axios.post(`${URL_SERVER}/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      navigate("/"); 
    }
  };

  return (
    <>
      <header className="header-admin">
        
    
        <div className="header-actions">
          <div className="dropdown-container">
            <div className="icon-wrapper" onClick={toggleNotifications}>
              <FaBell className={`icon-btn-large ${showNotifications ? 'active' : ''}`} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </div>
            
            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">Notificaciones</div>
                <ul className="dropdown-list">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <li key={notif._id} className="notification-item">
                        <span className="notif-text">{notif.mensaje}</span> {/* Clase añadida */}
                        <button 
                          className="btn-check-read" 
                          onClick={() => markAsRead(notif._id)}
                          title="Marcar como leído"
                        >
                          <FaCheck size={12} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="no-notifications">No tienes novedades</li>
                  )}
                </ul>
                {notifications.length > 0 && (
                  <div className="dropdown-footer" onClick={clearAll} style={{cursor: 'pointer'}}>
                    Limpiar todo
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dropdown-container">
            <div className="user-profile" onClick={toggleUserMenu}>
              <span className="user-name-text">{userName}</span>
              <FaUserCircle size={30} />
            </div>
            {showUserMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="dropdown-header">Mi Cuenta</div>
                <ul className="dropdown-list">
                  <li><FaUserEdit /> Editar Perfil</li>
                  <li><FaCog /> Configuración</li>
                  <hr />
                  <li className="logout-opt" onClick={() => {
                    setShowLogoutModal(true);
                    setShowUserMenu(false);
                  }}>
                    <FaSignOutAlt /> Cerrar Sesión
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="modal-overlay-logout">
          <div className="logout-modal-content">
            <FaExclamationTriangle className="warning-icon" />
            <h3>¿Cerrar Sesión?</h3>
            <p>¿Estás seguro de que deseas salir del sistema SIECU?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={handleLogout}>Sí, Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}