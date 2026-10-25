import { tw } from '../../../utils/tw.js';
import React from 'react';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth.js';

const hasShipping = (data) => Boolean(
  data?.direccion || data?.municipio || data?.departamento || data?.whatsapp || data?.barrio
);

export default function Perfil({ nombre, setNombre, telefono, setTelefono, email, onOpenDirecciones }) {
  const { userData } = useAuth();
  const lista = Array.isArray(userData?.direccionesEnvio) ? userData.direccionesEnvio.filter(hasShipping) : [];
  const direcciones = lista.length
    ? lista
    : (hasShipping(userData?.direccionEnvio) ? [{ etiqueta: 'Principal', ...userData.direccionEnvio }] : []);

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

      <div className={tw('rounded-2xl border border-slate-200 bg-slate-50 p-4')}>
        <div className={tw('flex flex-wrap items-center justify-between gap-2')}>
          <h3 className={tw('m-0 flex items-center gap-2 text-sm font-bold text-slate-800')}>
            <FaMapMarkerAlt className={tw('text-[#ff7e5f]')} /> Direcciones guardadas
          </h3>
          {typeof onOpenDirecciones === 'function' && (
            <button
              type="button"
              onClick={onOpenDirecciones}
              className={tw('text-sm font-semibold text-[#e06d43] underline')}
            >
              Administrar
            </button>
          )}
        </div>
        {direcciones.length === 0 ? (
          <p className={tw('mt-2 mb-0 text-sm text-slate-600')}>
            Todavía no hay direcciones. Ábrelas en la pestaña <strong>Direcciones</strong> para registrar una.
          </p>
        ) : (
          <ul className={tw('mt-3 mb-0 space-y-2 p-0 list-none')}>
            {direcciones.map((addr, index) => (
              <li key={addr.id || index} className={tw('rounded-xl border border-slate-200 bg-white px-3 py-2')}>
                <p className={tw('m-0 flex items-center gap-2 text-sm font-semibold text-slate-800')}>
                  <FaHome className={tw('text-[#ff7e5f]')} /> {addr.etiqueta || 'Dirección'}
                </p>
                <p className={tw('m-0 mt-1 text-sm text-slate-600')}>
                  {[addr.direccion, addr.barrio, addr.municipio, addr.departamento].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}