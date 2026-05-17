import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { formToPayload } from './paciente.mappers'

function parseApiError(text: string): string {
  const msgPadrao = 'Erro ao cadastrar paciente.'
  try {
    const json = JSON.parse(text)
    let msg: string | null = null
    if (Array.isArray(json) && json.length > 0) {
      msg = json
        .map((e: { message?: string; field?: string }) =>
          e.message ?? `${e.field}: inválido`
        )
        .join('. ')
    } else if (typeof json.message === 'string' && json.message.trim()) {
      msg = json.message.trim()
    } else if (typeof json.error === 'string' && json.error.trim()) {
      msg = json.error.trim()
    }
    if (msg && !isRawDbError(msg)) return msg
    if (msg && isRawDbError(msg)) return messageFriendlyForDbError(msg)
  } catch {
    if (text && isRawDbError(text)) return messageFriendlyForDbError(text)
    if (text) return text.length > 200 ? msgPadrao : text
  }
  return msgPadrao
}

function isRawDbError(msg: string): boolean {
  const s = msg.toLowerCase()
  return (
    s.includes('could not execute statement') ||
    s.includes('duplicar valor da chave') ||
    s.includes('unique constraint') ||
    s.includes('violates unique constraint') ||
    s.includes('usuarios_email_key') ||
    s.includes('usuarios_username') ||
    s.includes('insert into') ||
    s.includes('constraint')
  )
}

function messageFriendlyForDbError(msg: string): string {
  const s = msg.toLowerCase()
  const isEmailConstraint =
    s.includes('usuarios_email_key') ||
    /chave\s*\(\s*email\s*\)|detalhe:.*\(\s*email\s*\)\s*=/i.test(msg) ||
    (s.includes('duplicar') && s.includes('(email)='))
  const isUsernameConstraint =
    s.includes('usuarios_username') ||
    /chave\s*\(\s*username\s*\)|detalhe:.*\(\s*username\s*\)\s*=/i.test(msg) ||
    (s.includes('duplicar') && s.includes('(username)='))
  if (isEmailConstraint) {
    return 'Este e-mail já está cadastrado. Use outro e-mail.'
  }
  if (isUsernameConstraint) {
    return 'Este nome de usuário já está em uso. Escolha outro.'
  }
  return 'Dados já cadastrados. Verifique e-mail e nome de usuário.'
}

export const pacienteService = {
  async cadastrar(dados: Record<string, unknown>): Promise<unknown> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Faça login para cadastrar um paciente.')
    }

    const payload = formToPayload(dados)
    const url = `${API_BASE_URL}${API_ENDPOINTS.paciente.cadastrar}`

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

  async listar(): Promise<any[]> {
    const token = authService.getToken()
    if (!token) throw new Error('Faça login para listar pacientes.')

    const url = `${API_BASE_URL}${API_ENDPOINTS.paciente.listar}?pagina=0&limite=100`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error('Erro ao buscar pacientes.')
    }

    const data = await res.json()
    // The backend returns a Page<PacienteResponseDto>, which has a "content" array
    return data.content || []
  },

  async buscar(nome: string): Promise<any[]> {
    const token = authService.getToken()
    if (!token) throw new Error('Faça login para buscar pacientes.')

    const url = `${API_BASE_URL}${API_ENDPOINTS.paciente.buscar}?nome=${encodeURIComponent(nome)}&pagina=0&limite=100`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error('Erro ao buscar pacientes por nome.')
    }

    const data = await res.json()
    // The backend returns a Page<PacienteResponseDto>, which has a "content" array
    return data.content || []
  },
}
