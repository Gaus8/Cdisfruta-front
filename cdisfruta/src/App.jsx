import { useState } from 'react'
import MainPage from './paginas/mainPage/MainPage';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router";
import Login from './paginas/usuarios/Login';

function App() {

 const router = createBrowserRouter([
    {
      path:'/', Component: MainPage,
      path:'/login', Component: Login
    }
  ])



  return (
  <RouterProvider router={router} />
  )
}

export default App
