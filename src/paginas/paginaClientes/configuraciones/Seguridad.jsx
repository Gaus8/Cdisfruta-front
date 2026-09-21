import { useState } from 'react';
import { FaLock, FaShieldAlt, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Seguridad({ 
  passActual, 
  setPassActual, 
  passNueva, 
  setPassNueva, 
  passConfirmar, 
  setPassConfirmar 
}) {
  const [verPassActual, setVerPassActual] = useState(false);
  const [verPassNueva, setVerPassNueva] = useState(false);
  const [verPassConfirmar, setVerPassConfirmar] = useState(false);

  const tieneLongitud = passNueva.length >= 8 && passNueva.length <= 16;
  const tieneNumero = /\d/.test(passNueva);
  const tieneMinuscula = /[a-z]/.test(passNueva);
  const tieneMayuscula = /[A-Z]/.test(passNueva);
  const tieneEspecial = /[.!@#$%^&*]/.test(passNueva);
  const sinEspacios = !/\s/.test(passNueva);

  const regexCompleta = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$\%^&*])[\S]{8,16}$/;
  const esValida = regexCompleta.test(passNueva);
  const sonIguales = passNueva !== "" && passNueva === passConfirmar;

  const itemStyle = (valido) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.82rem',
    color: valido ? '#10b981' : '#64748b',
    marginTop: '4px',
    transition: 'color 0.2s ease'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      
      {/* Contraseña Actual */}
      <div>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
          Contraseña Actual
        </label>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: '1px solid #cbd5e1' }}>
          <FaLock color="#64748b" style={{ marginRight: '8px' }} />
          <input 
            type={verPassActual ? "text" : "password"} 
            placeholder="••••••••" 
            value={passActual} 
            onChange={(e) => setPassActual(e.target.value)} 
            style={{ width: '100%', padding: '14px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }} 
          />
          <button type="button" onClick={() => setVerPassActual(!verPassActual)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            {verPassActual ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Nueva Contraseña y su checklist... (sin cambios) */}
      <div>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
          Nueva Contraseña
        </label>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: `1px solid ${passNueva && !esValida ? '#ef4444' : '#cbd5e1'}` }}>
          <FaShieldAlt color="#64748b" style={{ marginRight: '8px' }} />
          <input 
            type={verPassNueva ? "text" : "password"} 
            placeholder="8 a 16 caracteres (Ej: Clave.123)" 
            value={passNueva} 
            onChange={(e) => setPassNueva(e.target.value)} 
            style={{ width: '100%', padding: '14px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }} 
          />
          <button type="button" onClick={() => setVerPassNueva(!verPassNueva)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            {verPassNueva ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div style={{ marginTop: '10px', paddingLeft: '4px' }}>
          <div style={itemStyle(tieneLongitud)}><span>{tieneLongitud ? '✓' : '•'}</span> Entre 8 y 16 caracteres</div>
          <div style={itemStyle(tieneMayuscula)}><span>{tieneMayuscula ? '✓' : '•'}</span> Al menos una letra mayúscula</div>
          <div style={itemStyle(tieneMinuscula)}><span>{tieneMinuscula ? '✓' : '•'}</span> Al menos una letra minúscula</div>
          <div style={itemStyle(tieneNumero)}><span>{tieneNumero ? '✓' : '•'}</span> Al menos un número</div>
          <div style={itemStyle(tieneEspecial)}><span>{tieneEspecial ? '✓' : '•'}</span> Al menos un carácter especial (. ! @ # $ % ^ & *)</div>
          <div style={itemStyle(sinEspacios && passNueva.length > 0)}><span>{sinEspacios && passNueva.length > 0 ? '✓' : '•'}</span> Sin espacios en blanco</div>
        </div>
      </div>

      {/* Confirmar Nueva Contraseña */}
      <div>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
          Confirmar Nueva Contraseña
        </label>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0 16px', border: `1px solid ${passConfirmar && !sonIguales ? '#ef4444' : '#cbd5e1'}` }}>
          <FaShieldAlt color="#64748b" style={{ marginRight: '8px' }} />
          <input 
            type={verPassConfirmar ? "text" : "password"} 
            placeholder="Repite la contraseña" 
            value={passConfirmar} 
            onChange={(e) => setPassConfirmar(e.target.value)} 
            style={{ width: '100%', padding: '14px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }} 
          />
          <button type="button" onClick={() => setVerPassConfirmar(!verPassConfirmar)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            {verPassConfirmar ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {passConfirmar && (
          <p style={{ fontSize: '0.8rem', marginTop: '6px', marginLeft: '4px', color: sonIguales ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {sonIguales ? <FaCheckCircle /> : <FaTimesCircle />}
            {sonIguales ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
          </p>
        )}
      </div>

    </div>
  );
}