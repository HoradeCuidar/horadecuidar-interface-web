import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'

export type DashboardResumo = {
  participantesAtivos: number
  prescricoesAtivas: number
  prescricoesProximasVencimento: number
  participantesBaixaAdesao: number
}

export type PrescricaoProximaVencimento = {
  prescricaoId: string
  pacienteId: number
  nomePaciente: string
  dataFim: string
  diasRestantes: number
}

export type PacienteBaixaAdesao = {
  pacienteId: number
  nome: string
  percentualAdesao: number
  realizado: number
  esperado: number
}

export type DistribuicaoDoenca = {
  nome: string
  quantidade: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isResumo(value: unknown): value is DashboardResumo {
  if (!isRecord(value)) return false
  return (
    isNumber(value.participantesAtivos) &&
    isNumber(value.prescricoesAtivas) &&
    isNumber(value.prescricoesProximasVencimento) &&
    isNumber(value.participantesBaixaAdesao)
  )
}

function isPrescricao(value: unknown): value is PrescricaoProximaVencimento {
  if (!isRecord(value)) return false
  return (
    isString(value.prescricaoId) &&
    isNumber(value.pacienteId) &&
    isString(value.nomePaciente) &&
    isString(value.dataFim) &&
    isNumber(value.diasRestantes)
  )
}

function isPacienteBaixaAdesao(value: unknown): value is PacienteBaixaAdesao {
  if (!isRecord(value)) return false
  return (
    isNumber(value.pacienteId) &&
    isString(value.nome) &&
    isNumber(value.percentualAdesao) &&
    isNumber(value.realizado) &&
    isNumber(value.esperado)
  )
}

function isDistribuicaoDoenca(value: unknown): value is DistribuicaoDoenca {
  if (!isRecord(value)) return false
  return isString(value.nome) && isNumber(value.quantidade)
}

async function getJson<T>(
  endpoint: string,
  mensagemErro: string,
  validar: (value: unknown) => value is T
): Promise<T> {
  const token = authService.getToken()
  if (!token) {
    throw new Error('Faça login para visualizar o dashboard.')
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(parseApiError(text, mensagemErro))
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('A API retornou uma resposta inválida para o dashboard.')
  }

  if (!validar(data)) {
    throw new Error('Os dados recebidos para o dashboard estão em formato inválido.')
  }

  return data
}

export const dashboardService = {
  resumo(): Promise<DashboardResumo> {
    return getJson(
      API_ENDPOINTS.dashboard.resumo,
      'Erro ao carregar o resumo do dashboard.',
      isResumo
    )
  },

  prescricoesProximasVencimento(): Promise<PrescricaoProximaVencimento[]> {
    return getJson(
      API_ENDPOINTS.dashboard.prescricoesProximasVencimento,
      'Erro ao carregar as prescrições próximas do vencimento.',
      (value): value is PrescricaoProximaVencimento[] =>
        Array.isArray(value) && value.every(isPrescricao)
    )
  },

  pacientesBaixaAdesao(): Promise<PacienteBaixaAdesao[]> {
    return getJson(
      API_ENDPOINTS.dashboard.pacientesBaixaAdesao,
      'Erro ao carregar os participantes com baixa adesão.',
      (value): value is PacienteBaixaAdesao[] =>
        Array.isArray(value) && value.every(isPacienteBaixaAdesao)
    )
  },

  distribuicaoDoencas(): Promise<DistribuicaoDoenca[]> {
    return getJson(
      API_ENDPOINTS.dashboard.distribuicaoDoencas,
      'Erro ao carregar a distribuição de doenças.',
      (value): value is DistribuicaoDoenca[] =>
        Array.isArray(value) && value.every(isDistribuicaoDoenca)
    )
  },
}
