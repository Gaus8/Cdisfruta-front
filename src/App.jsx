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
import Terminos from "./assets/styles/legal/Terminos";
import PoliticaDatos from "./assets/styles/legal/PoliticaDatos";

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
      path: '/terminos',
      element: <Terminos />,
    },
    {
      path: '/politica-datos',
      element: <PoliticaDatos />,
    },
    {
      path: '/dashboard_admin',
      element: <DashboardAdmin />,
      children: [
        {
          index: true,
          element: <HomeAdmin />,
        },
        {
          path: 'dashboard',
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