import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import { tw } from '../../funciones/tw.js';

export default function ConfirmModal({ open, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', busy = false, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape' && !busy) onCancel(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;
  return createPortal(
    <div className={tw('fixed inset-0 z-[4000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm')} onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" className={tw('w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8')}>
        <div className={tw('mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl text-[#ff7e5f]')}><FaExclamationTriangle /></div>
        <h2 id="admin-confirm-title" className={tw('text-center text-xl font-bold text-slate-800')}>{title}</h2>
        <p className={tw('mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-slate-600')}>{description}</p>
        <div className={tw('mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center')}>
          <button type="button" disabled={busy} onClick={onCancel} className={tw('min-h-12 rounded-full border border-slate-200 bg-slate-50 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60')}>{cancelLabel}</button>
          <button type="button" disabled={busy} onClick={onConfirm} className={tw('min-h-12 rounded-full bg-[#ff7e5f] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#e06d43] disabled:opacity-60')}>{busy ? 'Cerrando sesión…' : confirmLabel}</button>
        </div>
      </section>
    </div>, document.body
  );
}
