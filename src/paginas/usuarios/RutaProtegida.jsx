import { Navigate, Outlet } from 'react-router';
import AccesoDenegado from './AccesoDenegado';

export const RutaProtegida = ({ 
  authenticated, 
  loading, 
  user, 
  requiredRole, 
  redirectTo = '/login' 
}) => {

  // 1. Mientras esté cargando O si está autenticado pero el objeto "user" aún no se ha poblado
  if (loading || (authenticated && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-gray-600" style={{ color: '#7d706e', fontFamily: 'Poppins, sans-serif' }}>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Si definitivamente no está autenticado tras terminar la carga
  if (!authenticated) {
    return <AccesoDenegado />;
  }

  // 3. Si requiere un rol específico (ej. 'admin') y el usuario no lo cumple
  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/dashboard_usuario" replace />;
  }

  // 4. Si pasa todas las validaciones, renderizar las rutas hijas
  return <Outlet />;
};