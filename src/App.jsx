import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from './paginas/mainPage/MainPage';
import Login from './paginas/usuarios/Login';
import Registro from './paginas/usuarios/Registro';
import Validacion from "./paginas/usuarios/Validacion";
import DashboardUsuario from "./paginas/dashboardUsuario/DashboardUsuario";
import DashboardAdmin from "./paginas/dashboardAdmin/DashboardAdmin";
import Productos from "./paginas/dashboardAdmin/productos/Productos";
import HomeAdmin from "./paginas/dashboardAdmin/HomeAdmin";
import CartModal from "./paginas/dashboardUsuario/CartModal";
import DashboardMain from "./paginas/dashboardMain/DashboardMain";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainPage />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/registro',
      element: <Registro />,
    },
    {
      path: '/validacion',
      element: <Validacion />,
    },
    {
      path: '/dashboard_admin',
      element: <DashboardAdmin />,
      children: [
        {
          index: true, // Para cuando entras a /dashboard_admin
          element: <HomeAdmin />,
        },
        {
          path: 'dashboard', // Esto habilita /dashboard_admin/dashboard
          element: <HomeAdmin />,
        },
        {
          path: 'productos',
          element: <Productos />,
        },
      ],
    },
    {
      path: '/dashboard_usuario',
      element: <DashboardUsuario />,
    },
     {
      path: '/dashboard_main',
      element: <DashboardMain />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;