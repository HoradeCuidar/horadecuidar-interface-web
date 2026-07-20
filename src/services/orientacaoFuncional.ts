import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type {
  OrientacaoFuncionalRequest,
  OrientacaoFuncionalResponse,
  SpringPage,
} from './orientacaoFuncional.types'

function authHeaders(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para continuar.')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function authHeadersNoContentType(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para continuar.')
  return { Authorization: `Bearer ${token}` }
}

async function parseJson<T>(res: Response, fallback: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(parseApiError(text, fallback))
  }
  return res.json() as Promise<T>
}

function montarFormData(
  dados: OrientacaoFuncionalRequest,
  imagem?: File | null
): FormData {
  const formData = new FormData()
  formData.append(
    'dados',
    new Blob([JSON.stringify(dados)], { type: 'application/json' })
  )
  if (imagem) formData.append('imagem', imagem)
  return formData
}

export const orientacaoFuncionalService = {
  async listar(
    page = 0,
    size = 15
  ): Promise<SpringPage<OrientacaoFuncionalResponse>> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.base}?number-page=${page}&page-size=${size}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    return parseJson<SpringPage<OrientacaoFuncionalResponse>>(
      res,
      'Erro ao listar orientações funcionais.'
    )
  },

  async buscarPorId(id: number): Promise<OrientacaoFuncionalResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    return parseJson<OrientacaoFuncionalResponse>(
      res,
      'Erro ao buscar orientação funcional.'
    )
  },

  async criar(
    dados: OrientacaoFuncionalRequest,
    imagem?: File | null
  ): Promise<OrientacaoFuncionalResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.base}`
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeadersNoContentType(),
      body: montarFormData(dados, imagem),
    })
    return parseJson<OrientacaoFuncionalResponse>(
      res,
      'Erro ao cadastrar orientação funcional.'
    )
  },

  async atualizar(
    id: number,
    dados: OrientacaoFuncionalRequest,
    imagem?: File | null
  ): Promise<OrientacaoFuncionalResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: authHeadersNoContentType(),
      body: montarFormData(dados, imagem),
    })
    return parseJson<OrientacaoFuncionalResponse>(
      res,
      'Erro ao atualizar orientação funcional.'
    )
  },
}
