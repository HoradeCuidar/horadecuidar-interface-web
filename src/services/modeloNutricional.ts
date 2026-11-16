import { API_BASE_URL } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import type { RefeicaoRequest } from './prescricaoNutricional.types'

export type ModeloNutricionalRequest = {
  nome: string
  versao?: number
  referenciaKcal: number | null
  descricao: string | null
  refeicoes: RefeicaoRequest[]
}

export type ModeloNutricionalResumo = {
  id: number
  nome: string
  referenciaKcal: number | null
  descricao: string | null
  versao: number
  atualizadoEm: string
  quantidadeRefeicoes: number
}

export type ModeloNutricional = ModeloNutricionalResumo & {
  criadoPorId: number
  criadoEm: string
  refeicoes: RefeicaoRequest[]
}

const caminho = `${API_BASE_URL}/api/modelos-nutricionais`

function headers(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para continuar.')
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

async function resposta<T>(response: Response, mensagem: string): Promise<T> {
  if (!response.ok) throw new Error(parseApiError(await response.text(), mensagem))
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const modeloNutricionalService = {
  listar: async () => resposta<ModeloNutricionalResumo[]>(
    await fetch(caminho, { headers: headers() }), 'Erro ao carregar modelos nutricionais.'
  ),
  buscar: async (id: number) => resposta<ModeloNutricional>(
    await fetch(`${caminho}/${id}`, { headers: headers() }), 'Erro ao carregar modelo nutricional.'
  ),
  criar: async (dados: ModeloNutricionalRequest) => resposta<ModeloNutricional>(
    await fetch(caminho, { method: 'POST', headers: headers(), body: JSON.stringify(dados) }),
    'Erro ao salvar modelo nutricional.'
  ),
  editar: async (id: number, dados: ModeloNutricionalRequest) => resposta<ModeloNutricional>(
    await fetch(`${caminho}/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(dados) }),
    'Erro ao atualizar modelo nutricional.'
  ),
  duplicar: async (id: number) => resposta<ModeloNutricional>(
    await fetch(`${caminho}/${id}/duplicar`, { method: 'POST', headers: headers() }),
    'Erro ao duplicar modelo nutricional.'
  ),
  excluir: async (id: number) => resposta<void>(
    await fetch(`${caminho}/${id}`, { method: 'DELETE', headers: headers() }),
    'Erro ao excluir modelo nutricional.'
  ),
}
