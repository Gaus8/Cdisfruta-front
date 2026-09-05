import { useState } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "../dashboardUsuario/Header";
import '../../assets/styles/dashboardUsuario/dashboardUsuario.css';
import { FaUser, FaLock, FaEnvelope, FaShieldAlt, FaCamera, FaSave, FaCheckCircle } from "react-icons/fa";

export default function ConfiguracionUsuario() {
  const { userData } = useAuth();
  const [nombre, setNombre] = useState(userData?.nombre || "Gordi");
  const [email] = useState(userData?.email || "cdisfruta.ubate@gmail.com");
  const [telefono, setTelefono] = useState(userData?.telefono || "+57 300 123 4567");
  const [activeTab, setActiveTab] = useState("perfil");
  const [mensaje, setMensaje] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    setMensaje("¡Cambios guardados correctamente!");
    setTimeout(() => setMensaje(""), 3500);
  };

  return (
    <div className="userpage-container">
      <HeaderDashboard />

      <div className="content-wrapper" style={{ justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          
          {/* Tarjeta Principal de Configuración */}
          <div style={{ background: 'var(--white)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 15px 30px -5px rgba(30, 41, 59, 0.08)', overflow: 'hidden' }}>
            
            {/* Banner superior de perfil */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary-blue) 0%, #0f172a 100%)', padding: '35px 40px', color: 'white', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '85px', height: '85px', borderRadius: '50%', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white', boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)' }}>
                  {nombre.charAt(0).toUpperCase()}
                </div>
                <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} title="Cambiar foto">
                  <FaCamera size={12} color="var(--primary-blue)" />
                </button>
              </div>
              <div>
                <span style={{ color: 'var(--primary-orange)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1.5px' }}>Panel de Cliente</span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '4px 0' }}>{nombre}</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>Gestiona la información de tu cuenta y seguridad</p>
              </div>
            </div>

            {/* Pestañas de Navegación Interna */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 30px' }}>
              <button 
                onClick={() => setActiveTab("perfil")}
                style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'perfil' ? '3px solid var(--primary-orange)' : '3px solid transparent', color: activeTab === 'perfil' ? 'var(--primary-blue)' : 'var(--text-light)', fontWeight: activeTab === 'perfil' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem', transition: '0.2s' }}
              >
                Información Personal
              </button>
              <button 
                onClick={() => setActiveTab("seguridad")}
                style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'seguridad' ? '3px solid var(--primary-orange)' : '3px solid transparent', color: activeTab === 'seguridad' ? 'var(--primary-blue)' : 'var(--text-light)', fontWeight: activeTab === 'seguridad' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem', transition: '0.2s' }}
              >
                Seguridad y Contraseña
              </button>
            </div>

            {/* Cuerpo del Formulario */}
            <div style={{ padding: '40px' }}>
              {mensaje && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px 20px', borderRadius: '12px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
                  <FaCheckCircle color="#10b981" size={18} /> {mensaje}
                </div>
              )}

              <form onSubmit={handleUpdate}>
                {activeTab === 'perfil' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          Nombre Completo
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
                          <FaUser color="var(--text-light)" />
                          <input 
                            type="text" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: 'var(--text-main)' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          Teléfono de Contacto
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
                          <span style={{ fontSize: '1rem', marginRight: '4px' }}>📞</span>
                          <input 
                            type="text" 
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} 
                            style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: 'var(--text-main)' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        Correo Electrónico (Principal)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '12px', padding: '0 16px', border: '1px solid #e2e8f0' }}>
                        <FaEnvelope color="#94a3b8" />
                        <input 
                          type="email" 
                          value={email} 
                          disabled 
                          style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', color: '#64748b', fontSize: '0.95rem', cursor: 'not-allowed' }}
                        />
                      </div>
                      <small style={{ color: '#64748b', marginTop: '6px', display: 'block' }}>Por seguridad, el correo electrónico registrado no se puede modificar directamente.</small>
                    </div>
                  </div>
                )}

                {activeTab === 'seguridad' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        Contraseña Actual
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
                        <FaLock color="var(--text-light)" />
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        Nueva Contraseña
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
                        <FaShieldAlt color="var(--text-light)" />
                        <input 
                          type="password" 
                          placeholder="Mínimo 8 caracteres" 
                          style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <button 
                    type="submit" 
                    className="hero-explore-btn" 
                    style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 30px', fontSize: '1rem' }}
                  >
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