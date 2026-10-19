import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type { TagFuncional } from './orientacaoFuncional.types'

export type TagFuncionalCreate = {
  nome: string
  descricao?: string | null
}

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

  async buscarPorId(id: number): Promise<TagFuncional> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.tagFuncional.porId(id)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao buscar tag funcional.'))
    }
    return res.json() as Promise<TagFuncional>
  },

  async criar(dados: TagFuncionalCreate): Promise<TagFuncional> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.tagFuncional.base}`
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        nome: dados.nome.trim(),
        descricao: dados.descricao?.trim() || null,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao cadastrar tag funcional.'))
    }
    return res.json() as Promise<TagFuncional>
  },

  async atualizar(id: number, dados: TagFuncionalCreate): Promise<void> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.tagFuncional.porId(id)}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        nome: dados.nome.trim(),
        descricao: dados.descricao?.trim() || null,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao atualizar tag funcional.'))
    }
  },

  async excluir(id: number): Promise<void> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.tagFuncional.porId(id)}`
    const res = await fetch(url, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao excluir tag funcional.'))
    }
  },
}
