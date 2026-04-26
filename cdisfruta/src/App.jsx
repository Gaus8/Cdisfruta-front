import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from './paginas/mainPage/MainPage';
import Login from './paginas/usuarios/Login';
import Registro from './paginas/usuarios/Registro';

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
  ]);

  return <RouterProvider router={router} />;
}

export default App;