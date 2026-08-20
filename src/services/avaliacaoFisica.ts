


import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type {
  AvaliacaoFisica,
  AvaliacaoFisicaRequest,
} from './avaliacaoFisica.types'

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

export const avaliacaoFisicaService = {
  async listar(pacienteId: number): Promise<AvaliacaoFisica[]> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.avaliacaoFisica.base(pacienteId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    return parseJson<AvaliacaoFisica[]>(res, 'Erro ao listar avaliações físicas.')
  },

  async buscarPorId(
    pacienteId: number,
    avaliacaoId: number
  ): Promise<AvaliacaoFisica> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.avaliacaoFisica.porId(pacienteId, avaliacaoId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    return parseJson<AvaliacaoFisica>(res, 'Erro ao buscar avaliação física.')
  },

  async criar(
    pacienteId: number,
    dados: AvaliacaoFisicaRequest
  ): Promise<AvaliacaoFisica> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.avaliacaoFisica.base(pacienteId)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(dados),
    })
    return parseJson<AvaliacaoFisica>(res, 'Erro ao cadastrar avaliação física.')
  },

  async atualizar(
    pacienteId: number,
    avaliacaoId: number,
    dados: AvaliacaoFisicaRequest
  ): Promise<AvaliacaoFisica> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.avaliacaoFisica.porId(pacienteId, avaliacaoId)}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(dados),
    })
    return parseJson<AvaliacaoFisica>(res, 'Erro ao atualizar avaliação física.')
  },
}
