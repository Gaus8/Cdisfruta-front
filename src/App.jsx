import { createBrowserRouter, RouterProvider } from "react-router";
import { useAuth } from "./funciones/useAuth";
import { RutaProtegida } from "./paginas/usuariosAuth/RutaProtegida";

import MainPage from './paginas/landingPage/MainPage';
import Validacion from "./paginas/usuariosAuth/Validacion";
import DashboardUsuario from "./paginas/paginaClientes/DashboardUsuario";
import ConfiguracionUsuario from "./paginas/usuariosAuth/ConfiguracionUsuario";
import DashboardAdmin from "./paginas/dashboardAdmin/DashboardAdmin";
import Productos from "./paginas/dashboardAdmin/productos/Productos";
import HomeAdmin from "./paginas/dashboardAdmin/HomeAdmin";
import Tienda from "./paginas/paginaTienda/Tienda";
import Terminos from "./assets/styles/legal/Terminos";
import PoliticaDatos from "./assets/styles/legal/PoliticaDatos";
import { ResetPasswordPage } from "./paginas/usuariosAuth/ResetPasswordPage";

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

// 3. Objeto router estático
const router = createBrowserRouter([
  // --- RUTAS PÚBLICAS ---
  { path: '/', element: <MainPage /> },
  { path: '/login', element: <MainPage /> },
  { path: '/registro', element: <MainPage /> },
  { path: '/tienda', element: <Tienda /> }, // 👈 Vista pública de catálogo (sin login)
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/validacion', element: <Validacion /> },
  { path: '/terminos', element: <Terminos /> },
  { path: '/politica-datos', element: <PoliticaDatos /> },

  // --- RUTAS PROTEGIDAS (Cliente Autenticado) ---
  {
    element: <LayoutUsuario />,
    children: [
      { path: '/cliente/tienda', element: <DashboardUsuario /> }, // 👈 Panel del cliente autenticado
      { path: '/cliente/perfil', element: <DashboardUsuario /> },
      { path: '/cliente/configuracion', element: <ConfiguracionUsuario /> },
    ],
  },

  // --- RUTAS PROTEGIDAS (Administrador) ---
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
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;