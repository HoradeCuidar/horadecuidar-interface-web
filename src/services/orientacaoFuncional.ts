import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type {
  OrientacaoFuncionalRequest,
  OrientacaoFuncionalResponse,
  SpringPage, CategoriaOrientacao, MidiaRequest, HistoricoOrientacao,
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
    size = 15,
    filtros: { categoriaId?: number; tagId?: number } = {}
  ): Promise<SpringPage<OrientacaoFuncionalResponse>> {
    const params = new URLSearchParams({ 'number-page': String(page), 'page-size': String(size) })
    if (filtros.categoriaId) params.set('categoriaId', String(filtros.categoriaId))
    if (filtros.tagId) params.set('tagId', String(filtros.tagId))
    const participante = authService.getUser()?.role === 'PACIENTE'
    const url = `${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.base}${participante ? '/paciente' : ''}?${params}`
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

  async alterarStatus(
    id: number,
    ativo: boolean
  ): Promise<OrientacaoFuncionalResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.status(id)}?ativo=${ativo}`
    const res = await fetch(url, { method: 'PATCH', headers: authHeaders() })
    return parseJson<OrientacaoFuncionalResponse>(
      res,
      'Erro ao alterar status da orientação funcional.'
    )
  },

  async excluir(id: number): Promise<void> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}`
    const res = await fetch(url, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(
        parseApiError(text, 'Erro ao excluir orientação funcional.')
      )
    }
  },

  async salvarCategoria(nome: string, id?: number): Promise<CategoriaOrientacao> {
    return parseJson(await fetch(`${API_BASE_URL}/api/categorias-orientacao${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify({ nome }),
    }), 'Erro ao salvar categoria. Verifique se o nome já existe.')
  },
  async inativarCategoria(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/categorias-orientacao/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) throw new Error(parseApiError(await res.text(), 'Erro ao inativar categoria.'))
  },
  async categorias(): Promise<CategoriaOrientacao[]> {
    return parseJson(await fetch(`${API_BASE_URL}/api/categorias-orientacao`, { headers: authHeaders() }), 'Erro ao carregar categorias.')
  },
  async publicar(id: number): Promise<OrientacaoFuncionalResponse> {
    return parseJson(await fetch(`${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}/publicar`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify({ cuidadosRevisados: true }),
    }), 'Erro ao publicar orientação.')
  },
  async adicionarMidia(id: number, arquivo: File, dados: MidiaRequest): Promise<OrientacaoFuncionalResponse> {
    const form = new FormData()
    form.append('arquivo', arquivo)
    form.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }))
    return parseJson(await fetch(`${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}/midias`, {
      method: 'POST', headers: authHeadersNoContentType(), body: form,
    }), 'Erro ao enviar imagem. O rascunho foi preservado.')
  },
  async atualizarMidia(id: number, midiaId: number, dados: MidiaRequest): Promise<OrientacaoFuncionalResponse> {
    return parseJson(await fetch(`${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}/midias/${midiaId}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(dados),
    }), 'Erro ao atualizar imagem.')
  },
  async removerMidia(id: number, midiaId: number): Promise<OrientacaoFuncionalResponse> {
    return parseJson(await fetch(`${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}/midias/${midiaId}`, {
      method: 'DELETE', headers: authHeaders(),
    }), 'Erro ao remover imagem.')
  },
  async historico(id: number): Promise<HistoricoOrientacao[]> {
    return parseJson(await fetch(`${API_BASE_URL}${API_ENDPOINTS.orientacaoFuncional.porId(id)}/historico`, {
      headers: authHeaders(),
    }), 'Erro ao carregar histórico.')
  },
}
