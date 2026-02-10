import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthLayout, MainLayout } from '@/layouts'
import { Home, Login, Profissionais, Pacientes, MeuPerfil } from '@/pages'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'profissionais', element: <Profissionais /> },
      { path: 'pacientes', element: <Pacientes /> },
      { path: 'meu-perfil', element: <MeuPerfil /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
