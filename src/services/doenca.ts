import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'

export type DoencaDto = {
  id: number
  nome: string
}

export const doencaService = {
  async listar(): Promise<DoencaDto[]> {
    const token = authService.getToken()
    if (!token) return []
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.doenca.listar}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Erro ao listar doenças.')
    return res.json()
  },

  async cadastrar(nome: string): Promise<DoencaDto> {
    const token = authService.getToken()
    if (!token) throw new Error('Faça login para cadastrar uma doença.')
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.doenca.cadastrar}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: nome.trim() }),
    })
    if (!res.ok) {
      const text = await res.text()
      try {
        const json = JSON.parse(text)
        const msg = json.message ?? json.error ?? text
        throw new Error(typeof msg === 'string' ? msg : 'Erro ao cadastrar doença.')
      } catch (e) {
        if (e instanceof Error) throw e
        throw new Error('Erro ao cadastrar doença.')
      }
    }
    return res.json()
  },

  async deletar(id: number): Promise<void> {
    const token = authService.getToken()
    if (!token) throw new Error('Faça login para excluir uma doença.')
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.doenca.deletar(id)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      const text = await res.text()
      try {
        const json = JSON.parse(text)
        const msg = json.message ?? json.error ?? text
        throw new Error(typeof msg === 'string' ? msg : 'Erro ao excluir doença.')
      } catch (e) {
        if (e instanceof Error) throw e
        throw new Error('Erro ao excluir doença.')
      }
    }
  },
}
