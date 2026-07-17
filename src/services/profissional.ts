import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { formToMeuPerfilPayload, formToPayload } from './profissional.mappers'
import {
  validarCadastroProfissional,
  validarEdicaoProfissional,
  validarMeuPerfilProfissional,
} from './profissional.validation'
import { parseApiError } from './apiErrors'

export type { CadastroProfissionalPayload } from './profissional.mappers'

export const profissionalService = {
  async cadastrar(dados: Record<string, string>): Promise<unknown> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Faça login para cadastrar um profissional.')
    }

    const erroValidacao = validarCadastroProfissional(dados)
    if (erroValidacao) throw new Error(erroValidacao)

    const payload = formToPayload(dados)
    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.cadastrar}`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao cadastrar profissional.'))
    }

    return res.json()
  },
  async listar(): Promise<Array<{ id: number; nome: string; telefone?: string; status?: string }>> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.visualizarTodos}?page=0&size=100`
    const token = authService.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers.Authorization = `Bearer ${token}`

    let res: Response
    try {
      res = await fetch(url, { method: 'GET', headers })
    } catch {
      throw new Error('Não foi possível conectar ao servidor de API.')
    }

    if (!res.ok) {
      if (res.status === 403) throw new Error('Acesso negado. Faça login e tente novamente.')
      const text = await res.text()
      throw new Error(text || 'Erro ao buscar profissionais')
    }

    const json = await res.json()

    return json.content ?? []
  },
  async buscar(nome: string): Promise<Array<{ id: number; nome: string; telefone?: string; status?: string }>> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.buscar}?nome=${encodeURIComponent(nome)}&page=0&size=100`
    const token = authService.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers.Authorization = `Bearer ${token}`

    let res: Response
    try {
      res = await fetch(url, { method: 'GET', headers })
    } catch {
      throw new Error('Não foi possível conectar ao servidor de API.')
    }

    if (!res.ok) {
      if (res.status === 403) throw new Error('Acesso negado. Faça login e tente novamente.')
      const text = await res.text()
      throw new Error(text || 'Erro ao buscar profissionais')
    }

    const json = await res.json()

    return json.content ?? []
  },

  async buscarPorId(
    id: number
  ): Promise<{
    id: number
    nome: string
    username?: string
    email?: string
    telefone?: string
    dataNascimento?: string
    genero?: string
    status?: string
    rua?: string
    numeroDaCasa?: string
    bairro?: string
    cidade?: string
    estado?: string
    fotoDePerfil?: string | null
  }> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.detalhes(id)}`
    const token = authService.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(url, { method: 'GET', headers })
    if (!res.ok) {
      if (res.status === 404) throw new Error('Profissional não encontrado.')
      if (res.status === 403) throw new Error('Acesso negado.')
      const text = await res.text()
      let msg = 'Não foi possível carregar os detalhes do profissional.'
      try {
        const json = JSON.parse(text)
        if (typeof json.message === 'string' && json.message.trim()) {
          msg = json.message.includes('static resource') || res.status === 500
            ? 'Detalhes do profissional indisponíveis no momento. Tente novamente mais tarde.'
            : json.message
        }
      } catch {
        if (text.trim()) msg = text.slice(0, 200)
      }
      throw new Error(msg)
    }
    const data = await res.json()
    return {
      ...data,
      dataNascimento: data.dataDeNascimento ?? data.dataNascimento,
      fotoDePerfil: data.fotoDePerfil ?? null,
    }
  },

  async atualizarMeuPerfil(dados: Record<string, string>): Promise<{
    id: number
    nome: string
    email?: string
    fotoDePerfil?: string | null
  }> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Faça login para atualizar seu perfil.')
    }

    const erroValidacao = validarMeuPerfilProfissional(dados)
    if (erroValidacao) throw new Error(erroValidacao)

    const payload = formToMeuPerfilPayload(dados)
    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.perfil}`

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao atualizar perfil.'))
    }

    return res.json()
  },

  async ativar(id: number): Promise<void> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.ativar(id)}`
    const token = authService.getToken()
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(url, { method: 'PUT', headers })
    if (!res.ok) {
      if (res.status === 403) throw new Error('Acesso negado. Faça login e tente novamente.')
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao ativar profissional.'))
    }
  },

  async inativar(id: number): Promise<void> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.inativar(id)}`
    const token = authService.getToken()
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(url, { method: 'PUT', headers })
    if (!res.ok) {
      if (res.status === 403) throw new Error('Acesso negado. Faça login e tente novamente.')
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao inativar profissional.'))
    }
  },

  async editar(id: number, dados: Record<string, string>): Promise<unknown> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Faça login para editar um profissional.')
    }

    const erroValidacao = validarEdicaoProfissional(dados)
    if (erroValidacao) throw new Error(erroValidacao)

    const payload = formToPayload(dados)
    const updatePayload = { ...payload }
    delete (updatePayload as any).senha

    const url = `${API_BASE_URL}${API_ENDPOINTS.profissional.editar(id)}`

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatePayload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao editar profissional.'))
    }

    return res.json()
  },
}
