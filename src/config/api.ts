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
  },
  paciente: {
    cadastrar: '/api/paciente',
    listar: '/api/paciente',
    buscar: '/api/paciente/nome',
  },
}
