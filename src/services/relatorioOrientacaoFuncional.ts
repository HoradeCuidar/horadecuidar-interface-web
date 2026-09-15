import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type { PeriodoRelatorio } from './relatorioAdesaoMedicamento.types'
import type {
  DetalhamentoOrientacaoFuncional,
  ResumoOrientacaoFuncional,
} from './relatorioOrientacaoFuncional.types'

function authHeaders(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para visualizar o relatório.')
  return { Authorization: `Bearer ${token}` }
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

export const relatorioOrientacaoFuncionalService = {
  resumo(
    pacienteId: number,
    periodo: PeriodoRelatorio
  ): Promise<ResumoOrientacaoFuncional> {
    const params = new URLSearchParams({
      'data-inicial': periodo.dataInicial,
      'data-final': periodo.dataFinal,
    })
    const url = `${API_BASE_URL}${API_ENDPOINTS.relatorioOrientacaoFuncional.resumo(pacienteId)}?${params}`
    return getJson(url, 'Erro ao carregar o resumo de orientações.')
  },

  detalhamento(
    pacienteId: number,
    periodo: PeriodoRelatorio,
    pagina = 0,
    tamanho = 10
  ): Promise<DetalhamentoOrientacaoFuncional> {
    const params = new URLSearchParams({
      dataInicial: periodo.dataInicial,
      dataFinal: periodo.dataFinal,
      pagina: String(pagina),
      tamanho: String(tamanho),
    })
    const url = `${API_BASE_URL}${API_ENDPOINTS.relatorioOrientacaoFuncional.detalhamento(pacienteId)}?${params}`
    return getJson(url, 'Erro ao carregar o detalhamento de orientações.')
  },
}
