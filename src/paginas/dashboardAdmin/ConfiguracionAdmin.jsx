import { useEffect, useState } from 'react';
import { FaArrowLeft, FaBell, FaCheck, FaLock, FaSave, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiAxios } from '../../funciones/conexion';
import { cambiarPassword } from '../../funciones/usuarioAuth';
import { tw } from '../../funciones/tw.js';

const defaults = { notificarPedidos: true, notificarInventario: true, notificarCatalogo: true, umbralStockCritico: 5 };
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100';
const rules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])[\S]{8,16}$/;

export default function ConfiguracionAdmin() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let active = true;
    apiAxios.get('/auth/admin/configuracion').then(({ data }) => {
      if (active) setPreferences({ ...defaults, ...data });
    }).catch((error) => {
      if (active) setFeedback({ type: 'error', text: error.response?.data?.message || 'No se pudieron cargar tus preferencias.' });
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const toggle = (key) => setPreferences((current) => ({ ...current, [key]: !current[key] }));

  const savePreferences = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await apiAxios.patch('/auth/admin/configuracion', preferences);
      const saved = data.preferencias || preferences;
      setPreferences({ ...defaults, ...saved });
      window.dispatchEvent(new CustomEvent('admin-settings-updated', { detail: saved }));
      setFeedback({ type: 'success', text: 'Las preferencias del panel se guardaron correctamente.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.response?.data?.message || 'No se pudieron guardar las preferencias.' });
    } finally { setSaving(false); }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (!rules.test(passwords.nueva)) return setFeedback({ type: 'error', text: 'La contraseña nueva debe tener 8–16 caracteres, mayúscula, minúscula, número y símbolo.' });
    if (passwords.nueva !== passwords.confirmar) return setFeedback({ type: 'error', text: 'La confirmación no coincide con la contraseña nueva.' });
    setSavingPassword(true);
    try {
      const result = await cambiarPassword(passwords.actual, passwords.nueva);
      setPasswords({ actual: '', nueva: '', confirmar: '' });
      setFeedback({ type: 'success', text: result.message || 'La contraseña se cambió correctamente.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'No se pudo cambiar la contraseña.' });
    } finally { setSavingPassword(false); }
  };

  const notificationOptions = [
    { key: 'notificarPedidos', title: 'Pedidos nuevos', detail: 'Avisos cuando un cliente confirma un pedido.' },
    { key: 'notificarInventario', title: 'Inventario y existencias', detail: 'Ingresos, retiros y ajustes de stock.' },
    { key: 'notificarCatalogo', title: 'Catálogo', detail: 'Productos publicados, editados o retirados.' },
  ];

  return <section className={tw('mx-auto w-full max-w-4xl space-y-6 pb-10')}>
    <button type="button" onClick={() => navigate('/admin')} className={tw('inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#e06d43]')}><FaArrowLeft /> Volver al panel</button>
    <header><p className={tw('text-sm font-semibold uppercase tracking-[.14em] text-[#e06d43]')}>Administración</p><h1 className={tw('mt-1 text-3xl font-bold tracking-tight text-slate-800')}>Configuración</h1><p className={tw('mt-2 text-sm text-slate-500')}>Gestiona las alertas operativas y la seguridad de tu cuenta administrativa.</p></header>
    {feedback && <div role="status" className={tw('flex items-start gap-2 rounded-xl border px-4 py-3 text-sm', feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800')}>{feedback.type === 'success' ? <FaCheck className={tw('mt-0.5 shrink-0')} /> : <FaExclamationTriangle className={tw('mt-0.5 shrink-0')} />}{feedback.text}</div>}

    <form onSubmit={savePreferences} className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <div className={tw('flex items-start gap-3 border-b border-slate-100 p-5 sm:p-7')}><span className={tw('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg text-[#e06d43]')}><FaBell /></span><div><h2 className={tw('text-lg font-bold text-slate-800')}>Notificaciones y alertas</h2><p className={tw('mt-1 text-sm text-slate-500')}>Elige qué novedades aparecen en la campana de administración.</p></div></div>
      <div className={tw('divide-y divide-slate-100 px-5 sm:px-7')}>
        {notificationOptions.map((option) => <label key={option.key} className={tw('flex cursor-pointer items-center justify-between gap-4 py-4')}><span><span className={tw('block text-sm font-semibold text-slate-800')}>{option.title}</span><span className={tw('mt-1 block text-xs text-slate-500')}>{option.detail}</span></span><input type="checkbox" checked={Boolean(preferences[option.key])} onChange={() => toggle(option.key)} className={tw('h-5 w-5 shrink-0 accent-[#ff7e5f]')} /></label>)}
      </div>
      <div className={tw('grid gap-4 border-t border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-[1fr_180px] sm:items-center sm:px-7')}><div><label htmlFor="critical-stock" className={tw('block text-sm font-semibold text-slate-800')}>Umbral de stock crítico</label><p className={tw('mt-1 text-xs leading-5 text-slate-500')}>El panel marcará artículos con esta cantidad o menos como críticos.</p></div><div className={tw('relative')}><input id="critical-stock" type="number" min="0" max="10000" step="1" required disabled={loading} value={preferences.umbralStockCritico} onChange={(event) => setPreferences((current) => ({ ...current, umbralStockCritico: event.target.value === '' ? '' : Number(event.target.value) }))} className={tw(inputClass, 'pr-16')} /><span className={tw('absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400')}>unidades</span></div></div>
      <div className={tw('flex justify-end border-t border-slate-100 p-5 sm:px-7')}><button type="submit" disabled={loading || saving || preferences.umbralStockCritico === ''} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff7e5f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e06d43] disabled:opacity-60')}><FaSave />{saving ? 'Guardando…' : 'Guardar preferencias'}</button></div>
    </form>

    <form onSubmit={savePassword} className={tw('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm')}>
      <div className={tw('flex items-start gap-3 border-b border-slate-100 p-5 sm:p-7')}><span className={tw('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-600')}><FaShieldAlt /></span><div><h2 className={tw('text-lg font-bold text-slate-800')}>Seguridad de la cuenta</h2><p className={tw('mt-1 text-sm text-slate-500')}>Actualiza la contraseña usada para acceder al panel.</p></div></div>
      <div className={tw('grid gap-4 p-5 sm:grid-cols-2 sm:p-7')}>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2')}>Contraseña actual<input required type="password" autoComplete="current-password" className={tw(inputClass)} value={passwords.actual} onChange={(event) => setPasswords({ ...passwords, actual: event.target.value })} /></label>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Nueva contraseña<input required minLength={8} maxLength={16} type="password" autoComplete="new-password" className={tw(inputClass)} value={passwords.nueva} onChange={(event) => setPasswords({ ...passwords, nueva: event.target.value })} /></label>
        <label className={tw('space-y-1.5 text-sm font-medium text-slate-700')}>Confirmar contraseña<input required minLength={8} maxLength={16} type="password" autoComplete="new-password" className={tw(inputClass)} value={passwords.confirmar} onChange={(event) => setPasswords({ ...passwords, confirmar: event.target.value })} /></label>
        <p className={tw('flex items-start gap-2 text-xs leading-5 text-slate-500 sm:col-span-2')}><FaLock className={tw('mt-0.5 shrink-0')} />Usa de 8 a 16 caracteres e incluye mayúscula, minúscula, número y uno de estos símbolos: . ! @ # $ % ^ &amp; *</p>
      </div>
      <div className={tw('flex justify-end border-t border-slate-100 p-5 sm:px-7')}><button type="submit" disabled={savingPassword} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ff7e5f] hover:text-[#e06d43] disabled:opacity-60')}><FaLock />{savingPassword ? 'Actualizando…' : 'Cambiar contraseña'}</button></div>
    </form>
  </section>;
}
