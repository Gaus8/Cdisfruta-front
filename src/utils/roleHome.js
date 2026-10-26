/** Roles con acceso al panel administrativo. */
export const STAFF_ROLES = ['admin', 'logistica', 'catalogo'];

export const isStaffRole = (role) => STAFF_ROLES.includes(role);

/**
 * Destino post-login / “inicio” según el rol.
 * Los clientes van al hub operativo; el personal al módulo propio del panel.
 */
export const homePathForRole = (role) => {
  if (role === 'logistica') return '/admin/inventario';
  if (role === 'catalogo') return '/admin/productos';
  if (role === 'admin') return '/admin';
  return '/cliente/tienda';
};
