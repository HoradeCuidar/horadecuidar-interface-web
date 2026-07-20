import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthLayout, MainLayout } from '@/layouts'
import {
  Home,
  Login,
  Profissionais,
  Pacientes,
  PerfilPaciente,
  CadastroPrescricaoMedicamentos,
  EditarPrescricaoMedicamentos,
  MeuPerfil,
  RecuperarSenha,
  ResetPassword,
  Atividades,
  CadastroAtividade,
} from '@/pages'

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
    path: '/recuperar-senha',
    element: <AuthLayout />,
    children: [
      { index: true, element: <RecuperarSenha /> },
    ],
  },
  {
    path: '/reset-password',
    element: <AuthLayout />,
    children: [
      { index: true, element: <ResetPassword /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'profissionais', element: <Profissionais /> },
      { path: 'pacientes', element: <Pacientes /> },
      { path: 'pacientes/:id', element: <PerfilPaciente /> },
      { path: 'pacientes/:id/prescricoes/nova', element: <CadastroPrescricaoMedicamentos /> },
      { path: 'pacientes/:id/prescricoes/:prescricaoId/editar', element: <EditarPrescricaoMedicamentos /> },
      { path: 'atividades', element: <Atividades /> },
      { path: 'atividades/nova', element: <CadastroAtividade /> },
      { path: 'meu-perfil', element: <MeuPerfil /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
