import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type { TagFuncional } from './orientacaoFuncional.types'

function authHeaders(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para continuar.')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export const tagFuncionalService = {
  async listar(): Promise<TagFuncional[]> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.tagFuncional.base}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao listar tags funcionais.'))
    }
    return res.json() as Promise<TagFuncional[]>
  },
}
