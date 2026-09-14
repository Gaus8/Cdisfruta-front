import { useState, useEffect } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';
import { FaSave, FaCheckCircle } from "react-icons/fa";
import { apiAxios } from '../../funciones/conexion';


import Perfil from "./configuraciones/Perfil";
import Seguridad from "./configuraciones/Seguridad";
import HeaderPerfil from "./configuraciones/HeaderPerfil";
import SelectorAvatar from "./configuraciones/SelectorAvatar";

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
  const [avatarSeleccionado, setAvatarSeleccionado] = useState("");
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre || "");
      setEmail(userData.email || "");
      setTelefono(userData.telefono || "");
      setAvatarSeleccionado(userData.avatar || AVATAR_OPTIONS[0]);
    }
  }, [userData]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await apiAxios.put('/usuario/actualizar', {
        nombre,
        telefono,
        avatar: avatarSeleccionado
      });

      if (res.status === 200) {
        setMensaje("¡Perfil y avatar actualizados correctamente!");
        setMostrarSelector(false);
        setTimeout(() => setMensaje(""), 3500);
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
      setMensaje("Error al guardar los cambios en el servidor.");
    }
  };

  return (
    <div className="userpage-container">
      <HeaderDashboard />

      <div className="content-wrapper" style={{ justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          
          <div style={{ background: 'var(--white)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 15px 30px -5px rgba(30, 41, 59, 0.08)', overflow: 'hidden' }}>
            
            {/* Header del módulo */}
            <HeaderPerfil 
              nombre={nombre} 
              avatarSeleccionado={avatarSeleccionado} 
              mostrarSelector={mostrarSelector} 
              setMostrarSelector={setMostrarSelector} 
            />

            {/* Submódulo de selección de avatar */}
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
                onClick={() => setActiveTab("perfil")}
                style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'perfil' ? '3px solid var(--primary-orange)' : '3px solid transparent', color: activeTab === 'perfil' ? 'var(--primary-blue)' : 'var(--text-light)', fontWeight: activeTab === 'perfil' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Información Personal
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("seguridad")}
                style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'seguridad' ? '3px solid var(--primary-orange)' : '3px solid transparent', color: activeTab === 'seguridad' ? 'var(--primary-blue)' : 'var(--text-light)', fontWeight: activeTab === 'seguridad' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Cambiar Contraseña
              </button>
            </div>

            {/* Cuerpo del Formulario según Tab activa */}
            <div style={{ padding: '40px' }}>
              {mensaje && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px 20px', borderRadius: '12px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
                  <FaCheckCircle color="#10b981" size={18} /> {mensaje}
                </div>
              )}

              <form onSubmit={handleUpdate}>
                {activeTab === 'perfil' ? (
                  <Perfil 
                    nombre={nombre} 
                    setNombre={setNombre} 
                    telefono={telefono} 
                    setTelefono={setTelefono} 
                    email={email} 
                  />
                ) : (
                  <Seguridad 
                    passActual={passActual} 
                    setPassActual={setPassActual} 
                    passNueva={passNueva} 
                    setPassNueva={setPassNueva} 
                  />
                )}

                <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <button type="submit" className="hero-explore-btn" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 30px', fontSize: '1rem' }}>
                    <FaSave /> Guardar Cambios
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}