const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

// An empty value preserves Vite's development proxy as a local fallback.
export const API_BASE_URL = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/+$/, '')
  : ''

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
  orientacaoFuncional: {
    base: '/api/orientacoes-funcionais',
    porId: (id: number) => `/api/orientacoes-funcionais/${id}`,
    status: (id: number) => `/api/orientacoes-funcionais/${id}/status`,
  },
  tagFuncional: {
    base: '/api/tags-funcionais',
    porId: (id: number) => `/api/tags-funcionais/${id}`,
  },
  avaliacaoFisica: {
    base: (pacienteId: number) =>
      `/api/pacientes/${pacienteId}/avaliacoes-fisicas`,
    porId: (pacienteId: number, avaliacaoId: number) =>
      `/api/pacientes/${pacienteId}/avaliacoes-fisicas/${avaliacaoId}`,
  },
  realizacaoFuncional: {
    historico: (pacienteId: number) =>
      `/api/paciente/${pacienteId}/realizacao-funcional/historico`,
  },
  dashboard: {
    resumo: '/api/dashboard/resumo',
    prescricoesProximasVencimento:
      '/api/dashboard/prescricoes-proximas-vencimento',
    pacientesBaixaAdesao: '/api/dashboard/pacientes-baixa-adesao',
    distribuicaoDoencas: '/api/dashboard/distribuicao-doencas',
  },
  prescricaoNutricional: {
    cadastrar: '/api/nutricional/cadastrar',
  },
}
