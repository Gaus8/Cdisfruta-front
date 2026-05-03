import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from './paginas/mainPage/MainPage';
import Login from './paginas/usuarios/Login';
import Registro from './paginas/usuarios/Registro';
import Validacion from "./paginas/usuarios/Validacion";
import Dashboard from "./paginas/dashboardAdmin/DashboardAdmin";
import DashboardUsuario from "./paginas/dashboardUsuario/DashboardUsuario";
import DashboardAdmin from "./paginas/dashboardAdmin/DashboardAdmin";
import Productos from "./paginas/dashboardAdmin/productos/Productos";

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
          // Esta ruta se convierte en /dashboard_admin/productos
          path: 'productos',
          element: <Productos />,
        },
       
      ],
    },
    {
      path: '/dashboard_usuario',
      element: <DashboardUsuario />,
    },

  ]);

  return <RouterProvider router={router} />;
}

export default App;