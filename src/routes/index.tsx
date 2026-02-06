import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthLayout, MainLayout } from '@/layouts'
import { Home, Login } from '@/pages'

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
    path: '/home',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
