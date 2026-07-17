export const API_BASE_URL = ''

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/logar',
    recuperacaoSenha: '/api/auth/recuperacao-senha',
    resetarSenha: '/api/auth/resetar-senha',
  },
  profissional: {
    cadastrar: '/api/profissional/cadastrar',
    visualizarTodos: '/api/profissional/visualizarTodos',
    buscar: '/api/profissional/buscar',
    detalhes: (id: number) => `/api/profissional/visualizar/${id}`,
    perfil: '/api/profissional/perfil',
    ativar: (id: number) => `/api/profissional/ativar/${id}`,
    inativar: (id: number) => `/api/profissional/inativar/${id}`,
    editar: (id: number) => `/api/profissional/editar/${id}`,
  },
  upload: {
    fotoPerfil: '/api/upload/foto-perfil',
  },
  paciente: {
    cadastrar: '/api/paciente',
    listar: '/api/paciente',
    buscar: '/api/paciente/nome',
    detalhes: (id: number) => `/api/paciente/${id}`,
    editar: (id: number) => `/api/paciente/${id}`,
    alterarStatus: (id: number) => `/api/paciente/status/${id}`,
  },
  doenca: {
    listar: '/api/doenca',
    cadastrar: '/api/doenca',
    deletar: (id: number) => `/api/doenca/${id}`,
    editar: (id: number) => `/api/doenca/${id}`,
  },
  medicamento: {
    buscarOuCriar: '/api/medicamento',
    buscar: '/api/medicamento/buscar',
  },
  prescricaoMedicamento: {
    base: (pacienteId: number) =>
      `/api/pacientes/${pacienteId}/prescricoes/medicamentos`,
    porId: (pacienteId: number, prescricaoId: string) =>
      `/api/pacientes/${pacienteId}/prescricoes/medicamentos/${prescricaoId}`,
    historico: (pacienteId: number) =>
      `/api/pacientes/${pacienteId}/prescricoes/medicamentos/historico`,
    relatorio: (pacienteId: number, prescricaoId: string) =>
      `/api/pacientes/${pacienteId}/prescricoes/medicamentos/${prescricaoId}/relatorio`,
  },
}
