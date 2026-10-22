import { useEffect, useState } from 'react';
import { FaArrowLeft, FaSave, FaShieldAlt } from 'react-icons/fa';
import { apiAxios } from '../../funciones/conexion';
import { tw } from '../../funciones/tw.js';

const roleNames = { admin: 'Administrador', user: 'Usuario cliente', logistica: 'Gestión Logística', catalogo: 'Gestión de Catálogo' };
const permissionNames = { 'inventory:read': 'Ver inventario', 'inventory:write': 'Actualizar existencias y artículos', 'catalog:read': 'Ver catálogo', 'catalog:write': 'Crear y editar artículos del catálogo' };

export default function RolesPermisosAdmin({ onBack }) {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await apiAxios.get('/auth/admin/roles');
      setRoles(data.rolesDisponibles || []); setUsers(data.usuarios || []);
      setDrafts(Object.fromEntries((data.usuarios || []).map((user) => [user.id, { rol: user.rol, permisos: user.permisos || [] }])));
    } catch (requestError) { setError(requestError.response?.data?.message || 'No se pudieron cargar los roles.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateRole = (id, rol) => {
    const options = roles.find((role) => role.id === rol)?.permisos || [];
    setDrafts((current) => ({ ...current, [id]: { rol, permisos: rol === 'admin' ? ['*'] : [...options] } }));
  };
  const togglePermission = (id, permission) => setDrafts((current) => {
    const draft = current[id];
    const permissions = draft.permisos.includes(permission) ? draft.permisos.filter((item) => item !== permission) : [...draft.permisos, permission];
    return { ...current, [id]: { ...draft, permisos: permissions } };
  });
  const save = async (user) => {
    setSaving(user.id); setFeedback(''); setError('');
    try {
      const draft = drafts[user.id];
      await apiAxios.patch(`/auth/admin/roles/${user.id}`, draft);
      setFeedback(`Permisos de ${user.nombre} actualizados.`);
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'No se pudo actualizar la asignación.'); }
    finally { setSaving(''); }
  };

  return <section className={tw('mx-auto w-full max-w-7xl space-y-5 pb-10')}>
    <button type="button" onClick={onBack} className={tw('inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50')}><FaArrowLeft /> Volver a usuarios</button>
    <header><p className={tw('text-xs font-bold uppercase tracking-[.14em] text-[#e06d43]')}>Seguridad y acceso</p><h1 className={tw('mt-1 text-3xl font-bold tracking-tight text-slate-800')}>Roles y permisos</h1><p className={tw('mt-2 max-w-3xl text-sm leading-6 text-slate-500')}>Asigna accesos operativos. Los permisos disponibles se limitan al alcance del rol y se validan también en el servidor.</p></header>
    {error && <p role="alert" className={tw('rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700')}>{error}</p>}
    {feedback && <p role="status" className={tw('rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800')}>{feedback}</p>}
    {loading ? <p className={tw('rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500')}>Cargando cuentas…</p> : <div className={tw('grid gap-4')}>
      {users.map((user) => {
        const draft = drafts[user.id] || { rol: user.rol, permisos: user.permisos || [] };
        const availablePermissions = roles.find((role) => role.id === draft.rol)?.permisos || [];
        const changed = draft.rol !== user.rol || JSON.stringify([...draft.permisos].sort()) !== JSON.stringify([...(user.permisos || [])].sort());
        return <article key={user.id} className={tw('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5')}>
          <div className={tw('flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between')}>
            <div className={tw('min-w-0')}><h2 className={tw('truncate font-bold text-slate-800')}>{user.nombre}</h2><p className={tw('break-all text-sm text-slate-500')}>{user.correo}</p><p className={tw('mt-1 text-xs text-slate-400')}>Registrado: {new Date(user.fechaRegistro).toLocaleDateString('es-CO')}</p></div>
            <div className={tw('w-full lg:max-w-xs')}><label className={tw('mb-1 block text-xs font-semibold text-slate-600')}>Rol asignado</label><select value={draft.rol} onChange={(event) => updateRole(user.id, event.target.value)} className={tw('min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#ff7e5f] focus:outline-none')}>{roles.map((role) => <option key={role.id} value={role.id}>{role.nombre}</option>)}</select></div>
          </div>
          <div className={tw('mt-4 rounded-xl bg-slate-50 p-3 sm:p-4')}><p className={tw('mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600')}><FaShieldAlt className={tw('text-[#e06d43]')} /> Permisos de módulo</p>{draft.rol === 'admin' ? <p className={tw('text-sm font-medium text-slate-700')}>Acceso total a todos los módulos y funciones administrativas.</p> : availablePermissions.length ? <div className={tw('grid gap-2 sm:grid-cols-2')}>{availablePermissions.map((permission) => <label key={permission} className={tw('flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-700')}><input type="checkbox" checked={draft.permisos.includes(permission)} onChange={() => togglePermission(user.id, permission)} className={tw('mt-0.5 accent-[#ff7e5f]')} /><span>{permissionNames[permission] || permission}</span></label>)}</div> : <p className={tw('text-sm text-slate-500')}>Sin permisos de administración.</p>}</div>
          <div className={tw('mt-4 flex justify-end')}><button type="button" onClick={() => save(user)} disabled={!changed || saving === user.id} className={tw('inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#ff7e5f] px-4 text-sm font-semibold text-white hover:bg-[#e06d43] disabled:cursor-not-allowed disabled:opacity-50')}><FaSave />{saving === user.id ? 'Guardando…' : 'Guardar asignación'}</button></div>
        </article>;
      })}
      {!users.length && <p className={tw('rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500')}>No hay otras cuentas para administrar.</p>}
    </div>}
  </section>;
}
