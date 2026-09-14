
import { FaLock, FaShieldAlt } from 'react-icons/fa';

export default function Seguridad({ passActual, setPassActual, passNueva, setPassNueva }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
      <div>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Contraseña Actual</label>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
          <FaLock color="var(--text-light)" />
          <input 
            type="password" 
            placeholder="••••••••" 
            value={passActual} 
            onChange={(e) => setPassActual(e.target.value)} 
            style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }} 
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Nueva Contraseña</label>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
          <FaShieldAlt color="var(--text-light)" />
          <input 
            type="password" 
            placeholder="Mínimo 8 caracteres" 
            value={passNueva} 
            onChange={(e) => setPassNueva(e.target.value)} 
            style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }} 
          />
        </div>
      </div>
    </div>
  );
}