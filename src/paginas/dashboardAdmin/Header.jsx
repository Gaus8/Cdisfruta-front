import { tw } from '../../funciones/tw.js';
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

import { URL_SERVER } from "../../funciones/conexion"; 
import { FaBell, FaUserCircle, FaSignOutAlt, FaUserEdit, FaCog, FaCheck } from "react-icons/fa";
import { apiAxios } from '../../funciones/conexion';
import ConfirmModal from './ConfirmModal';

export default function Header({ userName }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileOverride, setProfileOverride] = useState(null);
  const [profileAvatar, setProfileAvatar] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({ notificarPedidos: true, notificarInventario: true, notificarCatalogo: true });

  useEffect(() => {
    apiAxios.get('/auth/verificar-token').then(({ data }) => {
      if (data.valid) { setProfileOverride(data.user.nombre); setProfileAvatar(data.user.avatar || ''); }
    }).catch(() => {});
    apiAxios.get('/auth/admin/configuracion').then(({ data }) => setNotificationPreferences((current) => ({ ...current, ...data }))).catch(() => {});
    const updateProfile = (event) => {
      if (event.detail?.nombre) setProfileOverride(event.detail.nombre);
      if (event.detail?.avatar !== undefined) setProfileAvatar(event.detail.avatar || '');
    };
    const updateSettings = (event) => setNotificationPreferences((current) => ({ ...current, ...(event.detail || {}) }));
    window.addEventListener('admin-profile-updated', updateProfile);
    window.addEventListener('admin-settings-updated', updateSettings);
    return () => {
      window.removeEventListener('admin-profile-updated', updateProfile);
      window.removeEventListener('admin-settings-updated', updateSettings);
    };
  }, [userName]);

  // 1. CARGAR NOTIFICACIONES
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Quitamos el /api de aquí porque ya está en URL_SERVER
        const res = await axios.get(`${URL_SERVER}/get-notificaciones`, { withCredentials: true });
        setNotifications(res.data.filter((notification) => {
          const text = `${notification.tipo || ''} ${notification.mensaje || ''}`.toLowerCase();
          if (text.includes('pedido')) return notificationPreferences.notificarPedidos;
          if (text.includes('inventario') || text.includes('stock') || text.includes('barras')) return notificationPreferences.notificarInventario;
          return notificationPreferences.notificarCatalogo;
        }));
      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };
    fetchNotifications();
    const notificationsSync = window.setInterval(fetchNotifications, 5000);
    return () => window.clearInterval(notificationsSync);
  }, [notificationPreferences]);

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
    setLogoutLoading(true);
    try {
      // Quitamos /api de la ruta
      await axios.post(`${URL_SERVER}/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch {
      navigate("/"); 
    } finally { setLogoutLoading(false); setShowLogoutModal(false); }
  };

  return (
    <>
      <header className={tw("header-admin")}>
        
    
        <div className={tw("header-actions")}>
          <div className={tw("dropdown-container")}>
            <button type="button" aria-label="Notificaciones" aria-expanded={showNotifications} className={tw("icon-wrapper", "![width:42px]", "![height:42px]", "![flex-shrink:0]")} onClick={toggleNotifications}>
              <FaBell className={tw(`icon-btn-large ${showNotifications ? 'active' : ''}`, "![font-size:20px]")} />
              {notifications.length > 0 && (
                <span className={tw("notification-badge")}>{notifications.length}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className={tw("dropdown-menu notifications-menu")}>
                <div className={tw("dropdown-header")}>Notificaciones</div>
                <ul className={tw("dropdown-list")}>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <li key={notif._id} className={tw("notification-item")}>
                        <span className={tw("notif-text")}>{notif.mensaje}</span> {/* Clase añadida */}
                        <button 
                          className={tw("btn-check-read")} 
                          onClick={() => markAsRead(notif._id)}
                          title="Marcar como leído"
                        >
                          <FaCheck size={12} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className={tw("no-notifications")}>No tienes novedades</li>
                  )}
                </ul>
                {notifications.length > 0 && (
                  <div className={tw(tw("dropdown-footer"), "![cursor:pointer]")} onClick={clearAll} >
                    Limpiar todo
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={tw("dropdown-container")}>
            <button type="button" aria-expanded={showUserMenu} className={tw("user-profile", "![border:0]", "![background:transparent]", "![font:inherit]")} onClick={toggleUserMenu}>
              <span className={tw("user-name-text")}>{profileOverride || userName}</span>
              {profileAvatar ? <img src={profileAvatar} alt="" className={tw('h-[30px] w-[30px] rounded-full object-cover')} /> : <FaUserCircle size={30} />}
            </button>
            {showUserMenu && (
              <div className={tw("dropdown-menu profile-menu")}>
                <div className={tw("dropdown-header")}>Mi Cuenta</div>
                <ul className={tw("dropdown-list")}>
                  <li><button type="button" className={tw('flex w-full items-center gap-3 text-left', '![border:0]', '![background:transparent]', '![padding:0]', '![font:inherit]', '![color:inherit]', '![cursor:pointer]')} onClick={() => { setShowUserMenu(false); navigate('/admin/perfil'); }}><FaUserEdit /> Editar perfil</button></li>
                  <li><button type="button" className={tw('flex w-full items-center gap-3 text-left', '![border:0]', '![background:transparent]', '![padding:0]', '![font:inherit]', '![color:inherit]', '![cursor:pointer]')} onClick={() => { setShowUserMenu(false); navigate('/admin/configuracion'); }}><FaCog /> Configuración</button></li>
                  <hr />
                  <li className={tw("logout-opt")}><button type="button" className={tw('flex w-full items-center gap-3 text-left', '![border:0]', '![background:transparent]', '![padding:0]', '![font:inherit]', '![color:inherit]', '![cursor:pointer]')} onClick={() => {
                    setShowLogoutModal(true);
                    setShowUserMenu(false);
                  }}>
                    <FaSignOutAlt /> Cerrar Sesión
                  </button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmModal open={showLogoutModal} title="¿Cerrar sesión?" description="¿Estás seguro de que deseas salir de la administración de CDISFRUTA?" confirmLabel="Sí, cerrar sesión" busy={logoutLoading} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
}
