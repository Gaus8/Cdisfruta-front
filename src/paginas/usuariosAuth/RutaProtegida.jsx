import { tw } from '../../funciones/tw.js';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RutaProtegida = ({ 
  authenticated, 
  loading, 
  user, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const location = useLocation();

  // 1. Estado de carga inicial mientras se verifica la sesión o los datos de usuario
  if (loading || (authenticated && !user)) {
    return (
      <div className={tw("![min-height:100vh]", "![display:flex]", "![align-items:center]", "![justify-content:center]")}>
        <p className={tw("![color:#7d706e]", "![font-family:Poppins,_sans-serif]")}>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Si no está autenticado, redirigir al login guardando la ubicación original
  if (!authenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 3. Validación de rol: Redirige al cliente si intenta acceder a rutas administrativas sin rol de admin
  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/cliente/tienda" replace />;
  }

  // 4. Renderizar rutas protegidas hijas
  return <Outlet />;
};