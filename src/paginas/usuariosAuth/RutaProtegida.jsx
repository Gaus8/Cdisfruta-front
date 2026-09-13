import { Navigate, Outlet } from 'react-router';

export const RutaProtegida = ({ 
  authenticated, 
  loading, 
  user, 
  requiredRole, 
  redirectTo = '/login' 
}) => {

  // 1. Carga inicial
  if (loading || (authenticated && !user)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#7d706e', fontFamily: 'Poppins, sans-serif' }}>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Si no está autenticado, redirigir al Login agregando expired=true
  if (!authenticated) {
    return <Navigate to={`${redirectTo}?expired=true`} replace />;
  }

  // 3. Validación de rol: Redirige a la vista principal del cliente si intenta acceder a /admin sin permisos
  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/cliente/tienda" replace />;
  }

  // 4. Render de rutas hijas
  return <Outlet />;
};