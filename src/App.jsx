import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { useAuth } from "./funciones/useAuth";
import { RutaProtegida } from "./paginas/usuarios/RutaProtegida";

import MainPage from './paginas/mainPage/MainPage';
import Validacion from "./paginas/usuarios/Validacion";
import DashboardUsuario from "./paginas/dashboardUsuario/DashboardUsuario";
import ConfiguracionUsuario from "./paginas/usuarios/ConfiguracionUsuario";
import DashboardAdmin from "./paginas/dashboardAdmin/DashboardAdmin";
import Productos from "./paginas/dashboardAdmin/productos/Productos";
import HomeAdmin from "./paginas/dashboardAdmin/HomeAdmin";
import DashboardMain from "./paginas/dashboardMain/DashboardMain";
import Terminos from "./assets/styles/legal/Terminos";
import PoliticaDatos from "./assets/styles/legal/PoliticaDatos";
import { ResetPasswordPage } from "./paginas/usuarios/ResetPasswordPage";

// 1. Componente Layout para rutas de Usuarios Autenticados
function LayoutUsuario() {
  const { userData, loading, authenticated } = useAuth();
  return (
    <RutaProtegida 
      authenticated={authenticated} 
      loading={loading} 
      user={userData} 
      redirectTo="/login"
    />
  );
}

// 2. Componente Layout para rutas exclusivas de Administrador
function LayoutAdmin() {
  const { userData, loading, authenticated } = useAuth();
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

// 3. Objeto router estático (se instancia solo UNA vez fuera de la renderización de App)
const router = createBrowserRouter([
  // --- RUTAS PÚBLICAS ---
  { path: '/', element: <MainPage /> },
  { path: '/login', element: <MainPage /> },
  { path: '/registro', element: <MainPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/validacion', element: <Validacion /> },
  { path: '/terminos', element: <Terminos /> },
  { path: '/politica-datos', element: <PoliticaDatos /> },

  // --- RUTAS PROTEGIDAS (Cualquier usuario autenticado) ---
  {
    element: <LayoutUsuario />,
    children: [
      { path: '/dashboard_usuario', element: <DashboardUsuario /> },
      { path: '/configuracion', element: <ConfiguracionUsuario /> },
      { path: '/dashboard_main', element: <DashboardMain /> },
    ],
  },

  // --- RUTAS PROTEGIDAS (Solo Administradores) ---
  {
    element: <LayoutAdmin />,
    children: [
      {
        path: '/dashboard_admin',
        element: <DashboardAdmin />,
        children: [
          { index: true, element: <HomeAdmin /> },
          { path: 'dashboard', element: <HomeAdmin /> },
          { path: 'productos', element: <Productos /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;