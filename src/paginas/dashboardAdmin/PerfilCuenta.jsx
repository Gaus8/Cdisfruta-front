import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCamera, FaSave, FaUserCircle, FaLock, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../funciones/useAuth';
import { actualizarPerfil, cambiarPassword } from '../../funciones/usuarioAuth';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';
import HeaderDashboard from '../paginaClientes/Header';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100';
const avatars = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Gordi1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Gordi2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool',
];

export default function PerfilCuenta({ adminMode = true }) {
  const { userData, verifyToken } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [password, setPassword] = useState({ actual: '', nueva: '', confirmar: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;
    apiAxios.get('/auth/verificar-token').then(({ data }) => {
      if (active && data.valid) {
        setNombre(data.user.nombre || '');
        setTelefono(data.user.telefono || '');
        setAvatar(data.user.avatar || '');
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const chooseAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', text: 'Selecciona una imagen JPG o PNG de máximo 5 MB.' });
      event.target.value = '';
      return;
    }
    if (avatar.startsWith('blob:')) URL.revokeObjectURL(avatar);
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const selectPresetAvatar = (url) => {
    setAvatar(url);
    setAvatarFile(null);
    if (avatar.startsWith('blob:')) URL.revokeObjectURL(avatar);
    if (fileRef.current) fileRef.current.value = '';
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (nombre.trim().length < 2) return setFeedback({ type: 'error', text: 'El nombre debe tener al menos 2 caracteres.' });
    setSaving(true);
    try {
      const data = new FormData();
      data.append('nombre', nombre.trim());
      data.append('telefono', telefono.trim());
      if (avatarFile) data.append('avatar', avatarFile);
      else if (avatar) data.append('avatar', avatar);
      const response = await actualizarPerfil(data);
      const updatedUser = response.usuario;
      if (avatar.startsWith('blob:')) URL.revokeObjectURL(avatar);
      setAvatar(updatedUser?.avatar || avatar);
      setAvatarFile(null);
      if (fileRef.current) fileRef.current.value = '';
      await verifyToken();
      window.dispatchEvent(new CustomEvent('account-profile-updated', { detail: updatedUser }));
      window.dispatchEvent(new CustomEvent('admin-profile-updated', { detail: updatedUser }));
      setFeedback({ type: 'success', text: response.message || 'Tu perfil se actualizó correctamente.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'No se pudo guardar el perfil.' });
    } finally { setSaving(false); }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    const valid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])[\S]{8,16}$/.test(password.nueva);
    if (!valid) return setFeedback({ type: 'error', text: 'La contraseña debe tener 8–16 caracteres, mayúscula, minúscula, número y símbolo.' });
    if (password.nueva !== password.confirmar) return setFeedback({ type: 'error', text: 'La confirmación no coincide con la nueva contraseña.' });
    setSavingPassword(true);
    try {
      const response = await cambiarPassword(password.actual, password.nueva);
      setPassword({ actual: '', nueva: '', confirmar: '' });
      setFeedback({ type: 'success', text: response.message || 'La contraseña se actualizó correctamente.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'No se pudo cambiar la contraseña.' });
    } finally { setSavingPassword(false); }
  };

  return <div className={tw(!adminMode ? 'min-h-screen bg-slate-50' : '')}>
    {!adminMode && <HeaderDashboard />}
    <section className={tw('mx-auto w-full max-w-4xl space-y-6 px-4 pb-10 pt-8 sm:px-6 sm:pt-10')}>
    <button type="button" onClick={() => navigate(adminMode ? '/admin' : '/cliente/tienda')} className={tw('inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#e06d43]')}><FaArrowLeft /> Volver {adminMode ? 'al panel' : 'a la tienda'}</button>
    <header><p className={tw('text-sm font-semibold uppercase tracking-[.14em] text-[#e06d43]')}>{adminMode ? 'Cuenta administrativa' : 'Cuenta de cliente'}</p><h1 className={tw('mt-1 text-3xl font-bold tracking-tight text-slate-800')}>Mi perfil</h1><p className={tw('mt-2 text-sm text-slate-500')}>Actualiza la información personal que identifica tu cuenta en CDISFRUTA.</p></header>
    {feedback && <div role="status" className={tw('rounded-xl border px-4 py-3 text-sm', feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800')}>{feedback.text}</div>}
    <form onSubmit={saveProfile} className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <div className={tw('border-b border-slate-100 p-5 sm:p-7')}><h2 className={tw('text-lg font-bold text-slate-800')}>Información personal</h2><p className={tw('mt-1 text-sm text-slate-500')}>El correo de acceso se mantiene protegido y no puede cambiarse desde este formulario.</p></div>
      <div className={tw('grid gap-7 p-5 sm:grid-cols-[180px_1fr] sm:p-7')}>
        <div className={tw('flex flex-col items-center gap-3')}>
          <div className={tw('flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 bg-slate-100 text-slate-300')}>
            {avatar ? <img src={avatar} alt="Foto de perfil" className={tw('h-full w-full object-cover')} /> : <FaUserCircle className={tw('text-7xl')} />}
          </div>
          <button type="button" onClick={() => fileRef.current?.click()} className={tw('inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#ff7e5f] hover:text-[#e06d43]')}><FaCamera /> Cambiar foto</button>
          <input ref={fileRef} hidden type="file" accept="image/jpeg,image/png" onChange={chooseAvatar} />
          <p className={tw('text-center text-xs text-slate-400')}>JPG o PNG · Máximo 5 MB</p>
          <button type="button" onClick={() => setShowAvatarOptions((visible) => !visible)} className={tw('text-xs font-semibold text-[#e06d43] hover:underline')}>{showAvatarOptions ? 'Ocultar avatares' : 'O elegir un avatar'}</button>
          {showAvatarOptions && <div className={tw('grid grid-cols-3 gap-2')} aria-label="Avatares predeterminados">{avatars.map((url) => <button key={url} type="button" onClick={() => selectPresetAvatar(url)} aria-label="Elegir avatar predeterminado" aria-pressed={avatar === url} className={tw('h-12 w-12 overflow-hidden rounded-full border-2 bg-white transition hover:scale-105', avatar === url ? 'border-[#ff7e5f]' : 'border-slate-200')}><img src={url} alt="" className={tw('h-full w-full object-cover')} /></button>)}</div>}
        </div>
        <div className={tw('grid content-start gap-5 sm:grid-cols-2')}>
          <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Nombre completo<input required minLength={2} maxLength={80} className={tw(inputClass)} value={nombre} onChange={(event) => setNombre(event.target.value)} autoComplete="name" /></label>
          <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Teléfono<input maxLength={25} className={tw(inputClass)} value={telefono} onChange={(event) => setTelefono(event.target.value)} autoComplete="tel" placeholder="Número de contacto" /></label>
          <label className={tw('space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2')}>Correo de acceso<input disabled className={tw(inputClass, 'cursor-not-allowed bg-slate-50 text-slate-500')} value={userData?.email || ''} autoComplete="email" /></label>
          <div className={tw('rounded-xl bg-slate-50 p-4 sm:col-span-2')}><p className={tw('text-xs font-semibold uppercase tracking-wide text-slate-500')}>Rol de la cuenta</p><p className={tw('mt-1 font-semibold capitalize text-slate-800')}>{userData?.rol || (adminMode ? 'Administrador' : 'Cliente')}</p></div>
        </div>
      </div>
      <div className={tw('flex justify-end border-t border-slate-100 p-5 sm:px-7')}><button type="submit" disabled={saving} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff7e5f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e06d43] disabled:opacity-60')}><FaSave />{saving ? 'Guardando…' : 'Guardar perfil'}</button></div>
    </form>
    {!adminMode && <form onSubmit={savePassword} className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <div className={tw('flex items-start gap-3 border-b border-slate-100 p-5 sm:p-7')}><span className={tw('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-600')}><FaShieldAlt /></span><div><h2 className={tw('text-lg font-bold text-slate-800')}>Seguridad de la cuenta</h2><p className={tw('mt-1 text-sm text-slate-500')}>Cambia la contraseña de acceso a tu cuenta.</p></div></div>
      <div className={tw('grid gap-4 p-5 sm:grid-cols-2 sm:p-7')}>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2')}>Contraseña actual<input required type="password" autoComplete="current-password" className={tw(inputClass)} value={password.actual} onChange={(event) => setPassword({ ...password, actual: event.target.value })} /></label>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Nueva contraseña<input required minLength={8} maxLength={16} type="password" autoComplete="new-password" className={tw(inputClass)} value={password.nueva} onChange={(event) => setPassword({ ...password, nueva: event.target.value })} /></label>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Confirmar nueva contraseña<input required minLength={8} maxLength={16} type="password" autoComplete="new-password" className={tw(inputClass)} value={password.confirmar} onChange={(event) => setPassword({ ...password, confirmar: event.target.value })} /></label>
        <p className={tw('flex items-start gap-2 text-xs leading-5 text-slate-500 sm:col-span-2')}><FaLock className={tw('mt-0.5 shrink-0')} />Incluye 8–16 caracteres, mayúscula, minúscula, número y un símbolo.</p>
      </div>
      <div className={tw('flex justify-end border-t border-slate-100 p-5 sm:px-7')}><button type="submit" disabled={savingPassword} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ff7e5f] hover:text-[#e06d43] disabled:opacity-60')}><FaLock />{savingPassword ? 'Actualizando…' : 'Cambiar contraseña'}</button></div>
    </form>}
    </section>
  </div>;
}
