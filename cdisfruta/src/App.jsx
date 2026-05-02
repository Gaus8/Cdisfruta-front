import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from './paginas/mainPage/MainPage';
import Login from './paginas/usuarios/Login';
import Registro from './paginas/usuarios/Registro';
import Validacion from "./paginas/usuarios/Validacion";
import Dashboard from "./paginas/dashboardAdmin/Dashboard";

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
      path: '/dashboard_user',
      element: <Dashboard />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;