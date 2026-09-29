import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { tw } from '../../funciones/tw.js';
import { apiAxios } from '../../funciones/conexion.js';

export default function PagoResultado() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Estamos confirmando el resultado con Wompi.');

  useEffect(() => {
    const reference = params.get('reference');
    const id = params.get('id');
    if (!reference || !id) {
      setStatus('pending');
      setMessage('No recibimos la referencia de la transacción. Tu carrito se conserva; consulta el estado con nuestro equipo.');
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const check = async () => {
      try {
        const { data } = await apiAxios.get('/pedidos/estado-pago', { params: { reference, id } });
        if (cancelled) return;
        if (data.estadoPago === 'APPROVED') {
          localStorage.removeItem('cart_cdisfruta');
          window.dispatchEvent(new Event('cartUpdate'));
          setStatus('approved'); setMessage('El pago fue aprobado y el pedido quedó confirmado.'); return;
        }
        if (['DECLINED', 'ERROR', 'VOIDED'].includes(data.estadoPago)) {
          setStatus('failed'); setMessage('El pago no se completó. Tu carrito sigue guardado; vuelve a la tienda para intentarlo otra vez.'); return;
        }
      } catch (error) {
        if (cancelled) return;
        setMessage(error.response?.data?.message || 'Wompi aún está procesando el pago.');
      }
      attempts += 1;
      if (attempts < 24 && !cancelled) window.setTimeout(check, 2500);
      else if (!cancelled) setStatus('pending');
    };
    check();
    return () => { cancelled = true; };
  }, [params]);

  const heading = status === 'approved' ? 'Pago confirmado' : status === 'failed' ? 'Pago no completado' : 'Confirmando tu pago';
  const tone = status === 'approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : status === 'failed' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-orange-200 bg-orange-50 text-orange-800';

  return <main className={tw('flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 py-10')}>
    <section className={tw('w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-lg sm:p-10')}>
      <div className={tw(`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${tone}`)} aria-hidden="true">{status === 'approved' ? '✓' : status === 'failed' ? '!' : '…'}</div>
      <h1 className={tw('mt-5 text-2xl font-bold text-slate-900')}>{heading}</h1>
      <p className={tw('mt-3 text-sm leading-6 text-slate-600')} aria-live="polite">{message}</p>
      <p className={tw('mt-3 text-xs text-slate-500')}>No cierres ni repitas el pago mientras figure como pendiente. El estado del pedido se actualiza automáticamente.</p>
      <Link to="/tienda" className={tw('mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ff7e5f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#e06d43]')}>{status === 'failed' ? 'Volver a la tienda e intentar de nuevo' : 'Ir a la tienda'}</Link>
    </section>
  </main>;
}
