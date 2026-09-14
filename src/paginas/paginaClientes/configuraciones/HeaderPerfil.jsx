import { FaCamera } from 'react-icons/fa';

export default function HeaderPerfil({ nombre, avatarSeleccionado, mostrarSelector, setMostrarSelector }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, var(--primary-blue) 0%, #0f172a 100%)', padding: '35px 40px', color: 'white', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: '85px', height: '85px', borderRadius: '50%', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white', overflow: 'hidden', boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)' }}>
          {avatarSeleccionado ? (
            <img src={avatarSeleccionado} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', background: 'white' }} />
          ) : (
            <span>{nombre ? nombre.charAt(0).toUpperCase() : "👤"}</span>
          )}
        </div>

        <button 
          type="button"
          onClick={() => setMostrarSelector(!mostrarSelector)} 
          style={{ position: 'absolute', bottom: '0', right: '0', background: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} 
          title="Elegir estilo de avatar"
        >
          <FaCamera size={12} color="var(--primary-blue)" />
        </button>
      </div>

      <div>
        <span style={{ color: 'var(--primary-orange)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1.5px' }}>Panel de Cliente</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '4px 0' }}>{nombre}</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>Gestiona la información de tu cuenta y seguridad</p>
      </div>
    </div>
  );
}