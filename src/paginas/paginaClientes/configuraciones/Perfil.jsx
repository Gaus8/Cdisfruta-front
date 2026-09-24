import { tw } from '../../../funciones/tw.js';
import React from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa';

export default function Perfil({ nombre, setNombre, telefono, setTelefono, email }) {
  return (
    <div className={tw("![display:flex]", "![flex-direction:column]", "![gap:24px]")}>
      <div className={tw("![display:grid]", "![grid-template-columns:repeat(auto-fit,_minmax(280px,_1fr))]", "![gap:24px]")}>
        <div>
          <label className={tw("![display:block]", "![font-weight:600]", "![margin-bottom:8px]", "![color:var(--text-main)]", "![font-size:0.9rem]")}>Nombre Completo</label>
          <div className={tw("![display:flex]", "![align-items:center]", "![background:#f8fafc]", "![border-radius:12px]", "![padding:0_16px]", "![border:1px_solid_#cbd5e1]")}>
            <FaUser color="var(--text-light)" />
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={tw("![width:100%]", "![padding:14px_12px]", "![border:none]", "![background:transparent]", "![outline:none]", "![font-size:0.95rem]")} />
          </div>
        </div>

        <div>
          <label className={tw("![display:block]", "![font-weight:600]", "![margin-bottom:8px]", "![color:var(--text-main)]", "![font-size:0.9rem]")}>Teléfono de Contacto</label>
          <div className={tw("![display:flex]", "![align-items:center]", "![background:#f8fafc]", "![border-radius:12px]", "![padding:0_16px]", "![border:1px_solid_#cbd5e1]")}>
            <span className={tw("![font-size:1rem]", "![margin-right:4px]")}>📞</span>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={tw("![width:100%]", "![padding:14px_12px]", "![border:none]", "![background:transparent]", "![outline:none]", "![font-size:0.95rem]")} />
          </div>
        </div>
      </div>

      <div>
        <label className={tw("![display:block]", "![font-weight:600]", "![margin-bottom:8px]", "![color:var(--text-main)]", "![font-size:0.9rem]")}>Correo Electrónico (Principal)</label>
        <div className={tw("![display:flex]", "![align-items:center]", "![background:#f1f5f9]", "![border-radius:12px]", "![padding:0_16px]", "![border:1px_solid_#e2e8f0]")}>
          <FaEnvelope color="#94a3b8" />
          <input type="email" value={email} disabled className={tw("![width:100%]", "![padding:14px_12px]", "![border:none]", "![background:transparent]", "![outline:none]", "![color:#64748b]", "![font-size:0.95rem]", "![cursor:not-allowed]")} />
        </div>
      </div>
    </div>
  );
}