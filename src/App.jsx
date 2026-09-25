import { tw } from './funciones/tw.js';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate,
  useLocation
} from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "./funciones/useAuth";
import { RutaProtegida } from "./paginas/usuariosAuth/RutaProtegida";

import MainPage from './paginas/landingPage/MainPage';
import Validacion from "./paginas/usuariosAuth/Validacion";
import DashboardUsuario from "./paginas/paginaClientes/DashboardUsuario";
import ConfiguracionUsuario from "./paginas/paginaClientes/ConfiguracionUsuario";
import MisPedidos from "./paginas/paginaClientes/MisPedidos"; 
import DashboardAdmin from "./paginas/dashboardAdmin/DashboardAdmin";
import Productos from "./paginas/dashboardAdmin/productos/Productos";
import HomeAdmin from "./paginas/dashboardAdmin/HomeAdmin";
import Tienda from "./paginas/paginaTienda/Tienda";
import Terminos from "./assets/styles/legal/Terminos";
import PoliticaDatos from "./assets/styles/legal/PoliticaDatos";
import { ResetPasswordPage } from "./paginas/usuariosAuth/ResetPasswordPage";
import Login from "./paginas/usuariosAuth/Login";
import Registro from "./paginas/usuariosAuth/Registro";
import GestionPedidos from "./paginas/dashboardAdmin/GestionPedidos";
import DisenoPortada from "./paginas/dashboardAdmin/DisenoPortada";
import Inventario from "./paginas/dashboardAdmin/Inventario";

// Componente Wrapper para pasar verifyToken al Login standalone
function LoginWrapper() {
  const { verifyToken } = useAuth();
  return <Login verifyToken={verifyToken} />;
}

// Cada cuánto se revisa la sesión mientras el usuario está quieto en una página.
// Debe ser MENOR al tiempo de vida del token para detectarlo antes de que
// el usuario haga cualquier otra cosa. Con tokens de 1 minuto (pruebas),
// 15s es razonable; en producción con tokens más largos, súbelo (ej. 60000).
const SESSION_CHECK_INTERVAL_MS = 120000;

// Hook que combina useAuth con re-verificación al navegar Y con un chequeo
// periódico (polling) mientras el usuario permanece inactivo en la misma
// página. Detecta expiración real (hubo sesión válida antes y ya no la hay)
// sin disparar falsos positivos en logout o en visitas sin sesión previa.
function useGuardedAuth() {
  const { userData, loading, authenticated, verifyToken } = useAuth();
  const location = useLocation();
  const wasAuthenticated = useRef(false);
  const isFirstCheck = useRef(true);

  // Recordamos si en algún momento SÍ estuvo autenticado
  useEffect(() => {
    if (authenticated) {
      wasAuthenticated.current = true;
    }
  }, [authenticated]);

  // Verificación reutilizable: si había sesión antes y ya no la hay, marcamos expiración real
  const checkAndFlagExpiration = useCallback(async () => {
    const data = await verifyToken();
    if (!data && wasAuthenticated.current) {
      sessionStorage.setItem('session_was_expired', 'true');
    }
  }, [verifyToken]);

  // 1. Re-verifica la sesión cada vez que cambia de ruta (dentro del área protegida)
  useEffect(() => {
    // La primera verificación ya la hace useAuth al montar; evitamos duplicarla
    if (isFirstCheck.current) {
      isFirstCheck.current = false;
      return;
    }
    checkAndFlagExpiration();
  }, [location.pathname, checkAndFlagExpiration]);

  // 2. Chequeo periódico: detecta la expiración aunque el usuario no navegue
  //    ni haga ninguna acción, solo esté quieto viendo una página protegida.
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkAndFlagExpiration();
    }, SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [checkAndFlagExpiration]);

  return { userData, loading, authenticated };
}

// Layouts de Seguridad
// Layouts de Seguridad con control de carga previo
function LayoutUsuario() {
  const { userData, loading, authenticated } = useGuardedAuth();

  // 👇 Mientras verifica la sesión, mostramos un loader limpio en lugar de dejar parpadear la vista
  if (loading) {
    return (
      <div className={tw("flex items-center justify-center min-h-screen bg-gray-50")}>
        <div className={tw("animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600")}></div>
      </div>
    );
  }

  return (
    <RutaProtegida 
      authenticated={authenticated} 
      loading={loading} 
      user={userData} 
      redirectTo="/login"
    />
  );
}

function LayoutAdmin() {
  const { userData, loading, authenticated } = useGuardedAuth();

  // 👇 Mismo comportamiento para el panel de administración
  if (loading) {
    return (
      <div className={tw("flex items-center justify-center min-h-screen bg-gray-50")}>
        <div className={tw("animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600")}></div>
      </div>
    );
  }

  return (
    <RutaProtegida 
      authenticated={authenticated} 
      loading={loading} 
      user={userData} 
      requiredRole="admin" 
      redirectTo="/login"
    />
  );
}

// Definición de las Rutas de la Aplicación
const router = createBrowserRouter([
  // Rutas públicas independientes
  { path: '/', element: <MainPage /> },
  { path: '/tienda', element: <Tienda /> },
  { path: '/login', element: <LoginWrapper /> },
  { path: '/registro', element: <Registro /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/validacion', element: <Validacion /> },
  { path: '/terminos', element: <Terminos /> },
  { path: '/politica-datos', element: <PoliticaDatos /> },

  // Rutas protegidas (Clientes)
  {
    element: <LayoutUsuario />,
    children: [
      { path: '/cliente/tienda', element: <DashboardUsuario /> },
      { path: '/cliente/perfil', element: <DashboardUsuario /> },
      { path: '/cliente/configuracion', element: <ConfiguracionUsuario /> },
      { path: '/cliente/pedidos', element: <MisPedidos /> },
    ],
  },

  // Rutas protegidas (Administración)
  {
    element: <LayoutAdmin />,
    children: [
      {
        path: '/admin',
        element: <DashboardAdmin />,
        children: [
          { index: true, element: <HomeAdmin /> },
          { path: 'dashboard', element: <HomeAdmin /> },
          { path: 'productos', element: <Productos /> },
          { path: 'inventario', element: <Inventario /> },
          { path: 'pedidos', element: <GestionPedidos /> },
          { path: 'diseno-portada', element: <DisenoPortada /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
