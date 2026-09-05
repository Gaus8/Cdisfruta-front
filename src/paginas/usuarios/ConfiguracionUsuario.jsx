import { useState } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "../dashboardUsuario/Header";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';
import { FaUser, FaLock, FaEnvelope, FaSave } from "react-icons/fa";

export default function ConfiguracionUsuario() {
  const { userData } = useAuth();
  const [nombre, setNombre] = useState(userData?.nombre || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [mensaje, setMensaje] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    // Lógica para enviar los datos actualizados a tu backend
    setMensaje("¡Perfil actualizado con éxito!");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="userpage-container">
      <HeaderDashboard />
      
      <div className="content-wrapper" style={{ justifyContent: 'center' }}>
        <div className="config-card" style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '700px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUser /> Configuración de la Cuenta
          </h2>
          
          {mensaje && (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                Nombre Completo
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '10px', padding: '0 14px', border: '1px solid #e2e8f0' }}>
                <FaUser color="var(--text-light)" />
                <input 
                  type="text" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  style={{ width: '100%', padding: '12px', border: 'none', background: 'transparent', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                Correo Electrónico
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '10px', padding: '0 14px', border: '1px solid #e2e8f0' }}>
                <FaEnvelope color="var(--text-light)" />
                <input 
                  type="email" 
                  value={email} 
                  disabled 
                  style={{ width: '100%', padding: '12px', border: 'none', background: 'transparent', outline: 'none', color: '#94a3b8' }}
                />
              </div>
              <small style={{ color: '#94a3b8', marginTop: '4px', display: 'block' }}>El correo electrónico no se puede modificar.</small>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />

            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaLock /> Seguridad
            </h3>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                Nueva Contraseña
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f1f5f9', outline: 'none' }}
              />
            </div>

            <button 
              type="submit" 
              className="hero-explore-btn" 
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}
            >
              <FaSave /> Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}