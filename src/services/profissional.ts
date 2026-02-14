import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { formToPayload } from './profissional.mappers'
import { validarCadastroProfissional } from './profissional.validation'

export type { CadastroProfissionalPayload } from './profissional.mappers'

function parseApiError(text: string): string {
  let msg = 'Erro ao cadastrar profissional.'
  try {
    const json = JSON.parse(text)
    if (Array.isArray(json) && json.length > 0) {
      msg = json
        .map((e: { message?: string; field?: string }) =>
          e.message ?? `${e.field}: inválido`
        )
        .join('. ')
    } else if (json.message) {
      msg = json.message
    } else if (json.error) {
      msg = json.error
    }
  } catch {
    if (text) msg = text.slice(0, 300)
  }
  return msg
}

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
      throw new Error(parseApiError(text))
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
}
