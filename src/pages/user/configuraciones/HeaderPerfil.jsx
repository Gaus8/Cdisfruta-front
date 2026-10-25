import { tw } from '../../../utils/tw.js';
import { FaCamera } from 'react-icons/fa';

export default function HeaderPerfil({ nombre, avatarSeleccionado, mostrarSelector, setMostrarSelector }) {
  return (
    <div className={tw('flex flex-wrap items-center gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-7')}>
      <div className={tw('relative')}>
        <div className={tw('flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#ff7e5f] text-xl font-bold text-white')}>
          {avatarSeleccionado ? (
            <img src={avatarSeleccionado} alt="Avatar" className={tw('h-full w-full object-cover bg-white')} />
          ) : (
            <span>{nombre ? nombre.charAt(0).toUpperCase() : '?'}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMostrarSelector(!mostrarSelector)}
          className={tw('absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm')}
          title="Cambiar avatar"
          aria-label="Cambiar avatar"
        >
          <FaCamera size={11} color="#0f172a" />
        </button>
      </div>
      <div className={tw('min-w-0')}>
        <p className={tw('m-0 text-xs font-bold uppercase tracking-wide text-[#e06d43]')}>Tu cuenta</p>
        <h1 className={tw('m-0 truncate text-xl font-extrabold text-slate-800')}>{nombre || 'Cliente'}</h1>
        <p className={tw('m-0 mt-0.5 text-sm text-slate-500')}>Perfil, direcciones y seguridad</p>
      </div>
    </div>
  );
}
