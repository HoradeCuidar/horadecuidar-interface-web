import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { formToPayload } from './paciente.mappers'
import { parseApiError } from './apiErrors'

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
      throw new Error(parseApiError(text, 'Erro ao cadastrar paciente.'))
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
    return data.content || []
  },

  async alterarStatus(id: number): Promise<void> {
    const token = authService.getToken()
    if (!token) throw new Error('Faça login para alterar o status do paciente.')

    const url = `${API_BASE_URL}${API_ENDPOINTS.paciente.alterarStatus(id)}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      if (res.status === 403) throw new Error('Acesso negado. Faça login e tente novamente.')
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao alterar o status do paciente.'))
    }
  },
}
