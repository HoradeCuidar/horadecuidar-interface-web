import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type { SpringPage } from './orientacaoFuncional.types'
import type { RegistroRealizacaoFuncional } from './realizacaoFuncional.types'

function authHeaders(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para continuar.')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function parseJson<T>(res: Response, fallback: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(parseApiError(text, fallback))
  }
  return res.json() as Promise<T>
}

export const realizacaoFuncionalService = {
  async historico(
    pacienteId: number,
    page = 0,
    size = 15
  ): Promise<SpringPage<RegistroRealizacaoFuncional>> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.realizacaoFuncional.historico(pacienteId)}?number-page=${page}&page-size=${size}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    return parseJson(
      res,
      'Erro ao carregar histórico de realizações.'
    )
  },
}
