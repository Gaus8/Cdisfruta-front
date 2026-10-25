import { tw } from '../../../utils/tw.js';
import { useEffect, useState } from 'react';
import { FaHome, FaMapMarkerAlt, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { COLOMBIA_GEO, DEPARTAMENTOS_ORDENADOS } from '../../../utils/geoColombia.js';
import {
  listarDireccionesEnvio,
  crearDireccionEnvio,
  eliminarDireccionEnvio,
} from '../../../services/api/authService.js';

const emptyAddress = () => ({
  etiqueta: 'Casa',
  nombres: '',
  apellidos: '',
  whatsapp: '',
  departamento: '',
  municipio: '',
  direccion: '',
  barrio: '',
});

export default function Direcciones({ onChanged }) {
  const [direcciones, setDirecciones] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const municipios = COLOMBIA_GEO[form.departamento] || [];

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarDireccionesEnvio();
      setDirecciones(data.direccionesEnvio || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las direcciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'departamento' ? { municipio: '' } : {}),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setOk('');
    try {
      const data = await crearDireccionEnvio(form);
      setDirecciones(data.direccionesEnvio || []);
      setForm(emptyAddress());
      setShowForm(false);
      setOk(data.message || 'Dirección guardada.');
      if (typeof onChanged === 'function') await onChanged();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la dirección.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta dirección?')) return;
    setError('');
    setOk('');
    try {
      const data = await eliminarDireccionEnvio(id);
      setDirecciones(data.direccionesEnvio || []);
      setOk(data.message || 'Dirección eliminada.');
      if (typeof onChanged === 'function') await onChanged();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar.');
    }
  };

  const inputClass = tw('mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100');

  return (
    <div className={tw('space-y-6')}>
      <div>
        <h3 className={tw('text-lg font-bold text-slate-800')}>Direcciones de entrega</h3>
        <p className={tw('mt-1 text-sm text-slate-600')}>
          Regístralas aquí y en el carrito solo tendrás que elegirlas, sin volver a llenar todos los campos.
        </p>
      </div>

      {error && <p role="alert" className={tw('rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700')}>{error}</p>}
      {ok && <p role="status" className={tw('rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800')}>{ok}</p>}

      {loading ? (
        <p className={tw('text-sm text-slate-500')}>Cargando direcciones…</p>
      ) : direcciones.length === 0 && !showForm ? (
        <div className={tw('rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center')}>
          <FaMapMarkerAlt className={tw('mx-auto text-2xl text-slate-400')} />
          <p className={tw('mt-2 text-sm text-slate-600')}>Aún no tienes direcciones guardadas.</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className={tw('mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff7e5f] px-4 text-sm font-semibold text-white hover:bg-[#e06d43]')}
          >
            <FaPlus /> Registrar mi primera dirección
          </button>
        </div>
      ) : (
        <ul className={tw('space-y-3')}>
          {direcciones.map((addr) => (
            <li key={addr.id} className={tw('flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4')}>
              <div className={tw('min-w-0')}>
                <p className={tw('flex items-center gap-2 text-sm font-bold text-slate-800')}>
                  <FaHome className={tw('text-[#ff7e5f]')} /> {addr.etiqueta || 'Dirección'}
                </p>
                <p className={tw('mt-1 text-sm text-slate-700')}>{addr.nombres} {addr.apellidos}</p>
                <p className={tw('text-sm text-slate-600')}>{addr.direccion}, {addr.barrio}</p>
                <p className={tw('text-xs text-slate-500')}>{addr.municipio}, {addr.departamento} · {addr.whatsapp}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className={tw('shrink-0 rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50')}
                aria-label={`Eliminar ${addr.etiqueta || 'dirección'}`}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showForm && direcciones.length > 0 && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className={tw('inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50')}
        >
          <FaPlus /> Agregar otra dirección
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSave} className={tw('space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4')}>
          <h4 className={tw('font-bold text-slate-800')}>Nueva dirección</h4>
          <label className={tw('block text-sm font-medium text-slate-700')}>Nombre / etiqueta<input name="etiqueta" value={form.etiqueta} onChange={handleChange} className={inputClass} placeholder="Casa, Oficina…" /></label>
          <div className={tw('grid gap-3 sm:grid-cols-2')}>
            <label className={tw('block text-sm font-medium text-slate-700')}>Nombres *<input required name="nombres" value={form.nombres} onChange={handleChange} className={inputClass} /></label>
            <label className={tw('block text-sm font-medium text-slate-700')}>Apellidos *<input required name="apellidos" value={form.apellidos} onChange={handleChange} className={inputClass} /></label>
          </div>
          <label className={tw('block text-sm font-medium text-slate-700')}>WhatsApp *<input required name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputClass} /></label>
          <div className={tw('grid gap-3 sm:grid-cols-2')}>
            <label className={tw('block text-sm font-medium text-slate-700')}>Departamento *
              <select required name="departamento" value={form.departamento} onChange={handleChange} className={inputClass}>
                <option value="">Seleccione…</option>
                {DEPARTAMENTOS_ORDENADOS.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </label>
            <label className={tw('block text-sm font-medium text-slate-700')}>Municipio *
              <select required name="municipio" value={form.municipio} onChange={handleChange} disabled={!form.departamento} className={inputClass}>
                <option value="">{form.departamento ? 'Seleccione…' : 'Elija departamento'}</option>
                {municipios.map((mun) => <option key={mun} value={mun}>{mun}</option>)}
              </select>
            </label>
          </div>
          <label className={tw('block text-sm font-medium text-slate-700')}>Dirección *<input required name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Calle / carrera…" /></label>
          <label className={tw('block text-sm font-medium text-slate-700')}>Barrio *<input required name="barrio" value={form.barrio} onChange={handleChange} className={inputClass} /></label>
          <div className={tw('flex flex-wrap gap-2 pt-2')}>
            <button type="submit" disabled={saving} className={tw('inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff7e5f] px-4 text-sm font-semibold text-white hover:bg-[#e06d43] disabled:opacity-60')}>
              <FaSave /> {saving ? 'Guardando…' : 'Guardar dirección'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setForm(emptyAddress()); }} className={tw('min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700')}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
