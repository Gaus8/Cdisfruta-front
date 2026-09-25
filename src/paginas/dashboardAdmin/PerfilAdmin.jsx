import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCamera, FaSave, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../funciones/useAuth';
import { actualizarPerfil } from '../../funciones/usuarioAuth';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100';

export default function PerfilAdmin() {
  const { userData, verifyToken } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
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
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
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
      setAvatar(updatedUser?.avatar || avatar);
      setAvatarFile(null);
      await verifyToken();
      window.dispatchEvent(new CustomEvent('admin-profile-updated', { detail: updatedUser }));
      setFeedback({ type: 'success', text: response.message || 'Tu perfil se actualizó correctamente.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'No se pudo guardar el perfil.' });
    } finally { setSaving(false); }
  };

  return <section className={tw('mx-auto w-full max-w-4xl space-y-6 pb-10')}>
    <button type="button" onClick={() => navigate('/admin')} className={tw('inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#e06d43]')}><FaArrowLeft /> Volver al panel</button>
    <header><p className={tw('text-sm font-semibold uppercase tracking-[.14em] text-[#e06d43]')}>Cuenta administrativa</p><h1 className={tw('mt-1 text-3xl font-bold tracking-tight text-slate-800')}>Mi perfil</h1><p className={tw('mt-2 text-sm text-slate-500')}>Actualiza la información personal que identifica tu cuenta en CDISFRUTA.</p></header>
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
        </div>
        <div className={tw('grid content-start gap-5 sm:grid-cols-2')}>
          <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Nombre completo<input required minLength={2} maxLength={80} className={tw(inputClass)} value={nombre} onChange={(event) => setNombre(event.target.value)} autoComplete="name" /></label>
          <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Teléfono<input maxLength={25} className={tw(inputClass)} value={telefono} onChange={(event) => setTelefono(event.target.value)} autoComplete="tel" placeholder="Número de contacto" /></label>
          <label className={tw('space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2')}>Correo de acceso<input disabled className={tw(inputClass, 'cursor-not-allowed bg-slate-50 text-slate-500')} value={userData?.email || ''} autoComplete="email" /></label>
          <div className={tw('rounded-xl bg-slate-50 p-4 sm:col-span-2')}><p className={tw('text-xs font-semibold uppercase tracking-wide text-slate-500')}>Rol de la cuenta</p><p className={tw('mt-1 font-semibold capitalize text-slate-800')}>{userData?.rol || 'Administrador'}</p></div>
        </div>
      </div>
      <div className={tw('flex justify-end border-t border-slate-100 p-5 sm:px-7')}><button type="submit" disabled={saving} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff7e5f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e06d43] disabled:opacity-60')}><FaSave />{saving ? 'Guardando…' : 'Guardar perfil'}</button></div>
    </form>
  </section>;
}
