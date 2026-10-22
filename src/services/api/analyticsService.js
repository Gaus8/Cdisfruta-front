import { apiAxios } from './conexion';

const recentProductViews = new Map();
const PRODUCT_VIEW_COOLDOWN_MS = 30_000;

async function sendActivity(payload) {
  try {
    await apiAxios.post('/auth/actividad', payload);
    return true;
  } catch {
    // La analítica no debe interrumpir una navegación o una acción de compra.
    return false;
  }
}

/** Registra una visita de producto desde los componentes de tienda autenticados. */
export function registrarVistaProducto(productoId) {
  if (!productoId) return Promise.resolve(false);
  const now = Date.now();
  if (now - (recentProductViews.get(String(productoId)) || 0) < PRODUCT_VIEW_COOLDOWN_MS) return Promise.resolve(false);
  recentProductViews.set(String(productoId), now);
  return sendActivity({ tipo: 'product_view', productoId });
}

/** Registra únicamente el intento, nunca los datos personales escritos en el formulario. */
export function registrarIntentoFormulario(tipoFormulario, productoId) {
  if (!['cart', 'quote', 'product_interest'].includes(tipoFormulario)) return Promise.resolve(false);
  if (tipoFormulario === 'product_interest' && !productoId) return Promise.resolve(false);
  return sendActivity({ tipo: 'form_attempt', tipoFormulario, ...(productoId ? { productoId } : {}) });
}
