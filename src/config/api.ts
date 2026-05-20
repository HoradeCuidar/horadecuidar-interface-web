export const API_BASE_URL = ''

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/logar',
  },
  profissional: {
    cadastrar: '/api/profissional/cadastrar',
    visualizarTodos: '/api/profissional/visualizarTodos',
    buscar: '/api/profissional/buscar',
    detalhes: (id: number) => `/api/profissional/visualizar/${id}`,
    ativar: (id: number) => `/api/profissional/ativar/${id}`,
    inativar: (id: number) => `/api/profissional/inativar/${id}`,
    editar: (id: number) => `/api/profissional/editar/${id}`,
  },
  paciente: {
    cadastrar: '/api/paciente',
    listar: '/api/paciente',
    buscar: '/api/paciente/nome',
  },
  doenca: {
    listar: '/api/doenca',
    cadastrar: '/api/doenca',
  },
}
