import { useState } from 'react'
import MainPage from './paginas/usuarios/MainPage'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router";

function App() {

 const router = createBrowserRouter([
    {
      path:'/main', Component: MainPage
    }
  ])



  return (
  <RouterProvider router={router} />
  )
}

export default App
