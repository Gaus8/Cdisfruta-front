import { tw } from '../../../funciones/tw.js';
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
    <div className={tw("![display:flex]", "![flex-direction:column]", "![gap:20px]", "![max-width:500px]")}>
      
      {/* Contraseña Actual */}
      <div>
        <label className={tw("![display:block]", "![font-weight:600]", "![margin-bottom:8px]", "![color:var(--text-main)]", "![font-size:0.9rem]")}>
          Contraseña Actual
        </label>
        <div className={tw("![display:flex]", "![align-items:center]", "![background:#f8fafc]", "![border-radius:12px]", "![padding:0_16px]", "![border:1px_solid_#cbd5e1]")}>
          <FaLock color="#64748b" className={tw("![margin-right:8px]")} />
          <input 
            type={verPassActual ? "text" : "password"} 
            placeholder="••••••••" 
            value={passActual} 
            onChange={(e) => setPassActual(e.target.value)} 
            className={tw("![width:100%]", "![padding:14px_0]", "![border:none]", "![background:transparent]", "![outline:none]", "![font-size:0.95rem]")} 
          />
          <button type="button" onClick={() => setVerPassActual(!verPassActual)} className={tw("![background:none]", "![border:none]", "![cursor:pointer]", "![color:#64748b]")}>
            {verPassActual ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Nueva Contraseña y su checklist... (sin cambios) */}
      <div>
        <label className={tw("![display:block]", "![font-weight:600]", "![margin-bottom:8px]", "![color:var(--text-main)]", "![font-size:0.9rem]")}>
          Nueva Contraseña
        </label>
        <div className={tw("![display:flex]", "![align-items:center]", "![background:#f8fafc]", "![border-radius:12px]", "![padding:0_16px]", "![border:var(--tw-inline-Seguridad-2671-0)]")} style={{ "--tw-inline-Seguridad-2671-0": `1px solid ${passNueva && !esValida ? '#ef4444' : '#cbd5e1'}` }}>
          <FaShieldAlt color="#64748b" className={tw("![margin-right:8px]")} />
          <input 
            type={verPassNueva ? "text" : "password"} 
            placeholder="8 a 16 caracteres (Ej: Clave.123)" 
            value={passNueva} 
            onChange={(e) => setPassNueva(e.target.value)} 
            className={tw("![width:100%]", "![padding:14px_0]", "![border:none]", "![background:transparent]", "![outline:none]", "![font-size:0.95rem]")} 
          />
          <button type="button" onClick={() => setVerPassNueva(!verPassNueva)} className={tw("![background:none]", "![border:none]", "![cursor:pointer]", "![color:#64748b]")}>
            {verPassNueva ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className={tw("![margin-top:10px]", "![padding-left:4px]")}>
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
        <label className={tw("![display:block]", "![font-weight:600]", "![margin-bottom:8px]", "![color:var(--text-main)]", "![font-size:0.9rem]")}>
          Confirmar Nueva Contraseña
        </label>
        <div className={tw("![display:flex]", "![align-items:center]", "![background:#f8fafc]", "![border-radius:12px]", "![padding:0_16px]", "![border:var(--tw-inline-Seguridad-4696-0)]")} style={{ "--tw-inline-Seguridad-4696-0": `1px solid ${passConfirmar && !sonIguales ? '#ef4444' : '#cbd5e1'}` }}>
          <FaShieldAlt color="#64748b" className={tw("![margin-right:8px]")} />
          <input 
            type={verPassConfirmar ? "text" : "password"} 
            placeholder="Repite la contraseña" 
            value={passConfirmar} 
            onChange={(e) => setPassConfirmar(e.target.value)} 
            className={tw("![width:100%]", "![padding:14px_0]", "![border:none]", "![background:transparent]", "![outline:none]", "![font-size:0.95rem]")} 
          />
          <button type="button" onClick={() => setVerPassConfirmar(!verPassConfirmar)} className={tw("![background:none]", "![border:none]", "![cursor:pointer]", "![color:#64748b]")}>
            {verPassConfirmar ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {passConfirmar && (
          <p className={tw("![font-size:0.8rem]", "![margin-top:6px]", "![margin-left:4px]", "![color:var(--tw-inline-Seguridad-5648-0)]", "![display:flex]", "![align-items:center]", "![gap:4px]")} style={{ "--tw-inline-Seguridad-5648-0": sonIguales ? '#10b981' : '#ef4444' }}>
            {sonIguales ? <FaCheckCircle /> : <FaTimesCircle />}
            {sonIguales ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
          </p>
        )}
      </div>

    </div>
  );
}