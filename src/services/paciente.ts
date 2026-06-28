import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { formToPayload, formToEdicaoPayload, type PacienteDetalhes } from './paciente.mappers'
import { parseApiError } from './apiErrors'

type PacienteApiResponse = {
  id: number
  nome: string
  email: string
  username: string
  dataDeNascimento?: string
  telefone?: string
  rua?: string
  bairro?: string
  estado?: string
  cidade?: string
  numeroDaCasa?: string
  genero?: string
  doencas?: { id: number; nome: string }[]
  observacoes?: string
}

function mapDetalhes(data: PacienteApiResponse): PacienteDetalhes {
  return {
    id: data.id,
    nome: data.nome,
    email: data.email,
    username: data.username,
    dataDeNascimento: data.dataDeNascimento ?? '',
    telefone: data.telefone ?? '',
    rua: data.rua,
    bairro: data.bairro,
    estado: data.estado,
    cidade: data.cidade,
    numeroDaCasa: data.numeroDaCasa,
    genero: data.genero,
    doencas: data.doencas,
    observacoes: data.observacoes,
  }
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

  async buscarPorId(id: number): Promise<PacienteDetalhes> {
    const token = authService.getToken()
    if (!token) throw new Error('Faça login para visualizar o paciente.')

    const url = `${API_BASE_URL}${API_ENDPOINTS.paciente.detalhes(id)}`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao buscar detalhes do paciente.'))
    }

    const data = (await res.json()) as PacienteApiResponse
    return mapDetalhes(data)
  },

  async editar(id: number, dados: Record<string, unknown>): Promise<void> {
    const token = authService.getToken()
    if (!token) throw new Error('Faça login para editar um paciente.')

    const payload = formToEdicaoPayload(dados)
    const url = `${API_BASE_URL}${API_ENDPOINTS.paciente.editar(id)}`

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
      throw new Error(parseApiError(text, 'Erro ao editar paciente.'))
    }
  },
}
