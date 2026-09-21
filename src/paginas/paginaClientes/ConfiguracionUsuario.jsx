import { useState, useEffect } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';
import { FaSave, FaCheckCircle } from "react-icons/fa";
import Perfil from "./configuraciones/Perfil";
import Seguridad from "./configuraciones/Seguridad";
import HeaderPerfil from "./configuraciones/HeaderPerfil";
import SelectorAvatar from "./configuraciones/SelectorAvatar";
import { cambiarPassword, actualizarPerfil } from "../../funciones/usuarioAuth";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Gordi1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Gordi2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool"
];

export default function ConfiguracionUsuario() {
  const { userData } = useAuth();
  
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(AVATAR_OPTIONS[0]);
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirmar, setPassConfirmar] = useState("");
  
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  // Precargar los datos tan pronto como userData cambie o esté disponible
  useEffect(() => {
    if (userData) {
      console.log("Datos de usuario recibidos:", userData); // 👈 Revisa tu consola si persiste el detalle
      setNombre(userData.nombre || "");
      setEmail(userData.email || "");
      setTelefono(userData.telefono || ""); 
      setAvatarSeleccionado(userData.avatar || AVATAR_OPTIONS[0]);
    }
  }, [userData]);

  const regexCompleta = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$\%^&*])[\S]{8,16}$/;

  // Guardar Perfil y Avatar con soporte para FormData / Archivos
  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("telefono", telefono);

      // Verificamos si el avatar seleccionado es un archivo local o una URL de texto
      if (avatarSeleccionado instanceof File || (typeof avatarSeleccionado === 'string' && avatarSeleccionado.startsWith("blob:"))) {
        if (avatarSeleccionado.startsWith("blob:")) {
          const responseBlob = await fetch(avatarSeleccionado);
          const blob = await responseBlob.blob();
          formData.append("avatar", blob, "avatar_usuario.jpg");
        } else {
          formData.append("avatar", avatarSeleccionado);
        }
      } else {
        // Es un avatar predeterminado de DiceBear o la URL existente de Cloudinary
        formData.append("avatar", avatarSeleccionado);
      }

      const respuesta = await actualizarPerfil(formData);

      setTipoMensaje("success");
      setMensaje(respuesta.message || "¡Perfil y avatar actualizados correctamente!");
      setMostrarSelector(false);
      setTimeout(() => setMensaje(""), 3500);

    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setTipoMensaje("error");
      setMensaje(err.message || "Error al actualizar el perfil.");
    }
  };

  // Guardar solo Contraseña de forma independiente
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      if (!passActual) {
        setTipoMensaje("error");
        setMensaje("Debes ingresar tu contraseña actual.");
        return;
      }

      if (!regexCompleta.test(passNueva)) {
        setTipoMensaje("error");
        setMensaje("La nueva contraseña no cumple con los requisitos de seguridad.");
        return;
      }

      if (passNueva !== passConfirmar) {
        setTipoMensaje("error");
        setMensaje("Las contraseñas nuevas no coinciden.");
        return;
      }

      const respuesta = await cambiarPassword(passActual, passNueva);
      
      setTipoMensaje("success");
      setMensaje(respuesta.message || "Contraseña actualizada exitosamente.");
      
      setPassActual("");
      setPassNueva("");
      setPassConfirmar("");

      setTimeout(() => setMensaje(""), 3500);
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      setTipoMensaje("error");
      setMensaje(err.message || "Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="userpage-container">
      <HeaderDashboard />

      <div className="content-wrapper" style={{ justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          
          <div style={{ background: 'var(--white)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 15px 30px -5px rgba(30, 41, 59, 0.08)', overflow: 'hidden' }}>
            
            <HeaderPerfil 
              nombre={nombre} 
              avatarSeleccionado={avatarSeleccionado} 
              mostrarSelector={mostrarSelector} 
              setMostrarSelector={setMostrarSelector} 
            />

            {mostrarSelector && (
              <SelectorAvatar 
                avatarOptions={AVATAR_OPTIONS} 
                avatarSeleccionado={avatarSeleccionado} 
                setAvatarSeleccionado={setAvatarSeleccionado} 
              />
            )}

            {/* Pestañas de Navegación */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 30px' }}>
              <button 
                type="button"
                onClick={() => { setActiveTab("perfil"); setMensaje(""); }}
                style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'perfil' ? '3px solid var(--primary-orange)' : '3px solid transparent', color: activeTab === 'perfil' ? 'var(--primary-blue)' : 'var(--text-light)', fontWeight: activeTab === 'perfil' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Información Personal
              </button>
              <button 
                type="button"
                onClick={() => { setActiveTab("seguridad"); setMensaje(""); }}
                style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'seguridad' ? '3px solid var(--primary-orange)' : '3px solid transparent', color: activeTab === 'seguridad' ? 'var(--primary-blue)' : 'var(--text-light)', fontWeight: activeTab === 'seguridad' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Cambiar Contraseña
              </button>
            </div>

            <div style={{ padding: '40px' }}>
              {mensaje && (
                <div style={{ 
                  background: tipoMensaje === 'success' ? '#ecfdf5' : '#fee2e2', 
                  border: `1px solid ${tipoMensaje === 'success' ? '#a7f3d0' : '#fecaca'}`, 
                  color: tipoMensaje === 'success' ? '#065f46' : '#991b1b', 
                  padding: '14px 20px', 
                  borderRadius: '12px', 
                  marginBottom: '25px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  fontWeight: '500' 
                }}>
                  <FaCheckCircle color={tipoMensaje === 'success' ? '#10b981' : '#ef4444'} size={18} /> {mensaje}
                </div>
              )}

              {/* Renderizado condicional con formularios independientes por pestaña */}
              {activeTab === 'perfil' ? (
                <form onSubmit={handleUpdatePerfil}>
                  <Perfil 
                    nombre={nombre} 
                    setNombre={setNombre} 
                    telefono={telefono} 
                    setTelefono={setTelefono} 
                    email={email} 
                  />
                  <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                    <button type="submit" className="hero-explore-btn" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 30px', fontSize: '1rem' }}>
                      <FaSave /> Guardar Cambios de Perfil
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleUpdatePassword}>
                  <Seguridad 
                    passActual={passActual} 
                    setPassActual={setPassActual} 
                    passNueva={passNueva} 
                    setPassNueva={setPassNueva} 
                    passConfirmar={passConfirmar}
                    setPassConfirmar={setPassConfirmar}
                  />
                  <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                    <button type="submit" className="hero-explore-btn" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 30px', fontSize: '1rem' }}>
                      <FaSave /> Actualizar Contraseña
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}