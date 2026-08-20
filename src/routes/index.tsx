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
  EditarAtividade,
  Tags,
  CadastroTag,
  EditarTag,
  CadastroAvaliacaoFisica,
  EditarAvaliacaoFisica,
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
      { path: 'pacientes/:id/avaliacoes/nova', element: <CadastroAvaliacaoFisica /> },
      { path: 'pacientes/:id/avaliacoes/:avaliacaoId/editar', element: <EditarAvaliacaoFisica /> },
      { path: 'atividades/tags', element: <Tags /> },
      { path: 'atividades/tags/nova', element: <CadastroTag /> },
      { path: 'atividades/tags/:id/editar', element: <EditarTag /> },
      { path: 'atividades', element: <Atividades /> },
      { path: 'atividades/nova', element: <CadastroAtividade /> },
      { path: 'atividades/:id/editar', element: <EditarAtividade /> },
      { path: 'meu-perfil', element: <MeuPerfil /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
