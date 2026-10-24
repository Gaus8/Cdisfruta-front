const rolePermissions = {
  admin: ['*'],
  user: [],
  logistica: [
    'inventory:read',
    'inventory:write',
    'orders:read',
    'orders:write',
    'notifications:read',
    'profile:write',
  ],
  catalogo: [
    'catalog:read',
    'catalog:write',
    'inventory:read',
    'landing:write',
    'analytics:read',
    'profile:write',
  ],
};

export const permissionsForRole = (role) => rolePermissions[role] || [];

export const effectivePermissions = (user) => {
  if (!user) return [];
  if (user.rol === 'admin') return ['*'];
  return [...new Set([...(permissionsForRole(user.rol) || []), ...(user.permisos || [])])];
};

export const hasPermission = (user, permission) => {
  const perms = effectivePermissions(user);
  return perms.includes('*') || perms.includes(permission);
};
