import React from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa';

export default function Perfil({ nombre, setNombre, telefono, setTelefono, email }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Nombre Completo</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
            <FaUser color="var(--text-light)" />
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Teléfono de Contacto</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontSize: '1rem', marginRight: '4px' }}>📞</span>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }} />
          </div>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Correo Electrónico (Principal)</label>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '12px', padding: '0 16px', border: '1px solid #e2e8f0' }}>
          <FaEnvelope color="#94a3b8" />
          <input type="email" value={email} disabled style={{ width: '100%', padding: '14px 12px', border: 'none', background: 'transparent', outline: 'none', color: '#64748b', fontSize: '0.95rem', cursor: 'not-allowed' }} />
        </div>
      </div>
    </div>
  );
}