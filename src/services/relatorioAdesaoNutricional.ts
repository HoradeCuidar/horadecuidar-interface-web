import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type {
  DetalhamentoAdesaoNutricional,
  EvolucaoAdesaoNutricional,
  ResumoAdesaoNutricional,
} from './relatorioAdesaoNutricional.types'
import type { PeriodoRelatorio } from './relatorioAdesaoMedicamento.types'

function authHeaders(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para visualizar o relatório.')
  return { Authorization: `Bearer ${token}` }
}

function queryPeriodo(periodo: PeriodoRelatorio): string {
  const params = new URLSearchParams({
    dataInicial: periodo.dataInicial,
    dataFinal: periodo.dataFinal,
  })
  return params.toString()
}

async function getJson<T>(url: string, mensagemErro: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { method: 'GET', headers: authHeaders() })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(parseApiError(text, mensagemErro))
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new Error('A API retornou uma resposta inválida para o relatório.')
  }
}

export const relatorioAdesaoNutricionalService = {
  resumo(
    pacienteId: number,
    periodo: PeriodoRelatorio
  ): Promise<ResumoAdesaoNutricional> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.relatorioAdesaoNutricional.resumo(pacienteId)}?${queryPeriodo(periodo)}`
    return getJson(url, 'Erro ao carregar o resumo de adesão.')
  },

  evolucao(
    pacienteId: number,
    periodo: PeriodoRelatorio
  ): Promise<EvolucaoAdesaoNutricional> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.relatorioAdesaoNutricional.evolucao(pacienteId)}?${queryPeriodo(periodo)}`
    return getJson(url, 'Erro ao carregar a evolução de adesão.')
  },

  detalhamento(
    pacienteId: number,
    periodo: PeriodoRelatorio,
    pagina = 0,
    limite = 10
  ): Promise<DetalhamentoAdesaoNutricional> {
    const params = new URLSearchParams({
      dataInicial: periodo.dataInicial,
      dataFinal: periodo.dataFinal,
      pagina: String(pagina),
      limite: String(limite),
    })
    const url = `${API_BASE_URL}${API_ENDPOINTS.relatorioAdesaoNutricional.detalhamento(pacienteId)}?${params}`
    return getJson(url, 'Erro ao carregar o detalhamento de adesão.')
  },
}
