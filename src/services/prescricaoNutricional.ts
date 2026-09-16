import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import type { PrescricaoNutricionalFormData } from '@/components/PrescricaoNutricional/prescricaoNutricional.types'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import {
  formToPrescricaoNutricionalRequest,
  validarPrescricaoNutricionalForm,
} from './prescricaoNutricional.mappers'
import type {
  PrescricaoNutricionalResponse,
  PrescricaoNutricionalResumo,
} from './prescricaoNutricional.types'

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
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const prescricaoNutricionalService = {
  async criar(
    pacienteId: number,
    form: PrescricaoNutricionalFormData
  ): Promise<PrescricaoNutricionalResponse> {
    const erro = validarPrescricaoNutricionalForm(form)
    if (erro) throw new Error(erro)

    const payload = formToPrescricaoNutricionalRequest(pacienteId, form)
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoNutricional.cadastrar}`

    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })

    return parseJson<PrescricaoNutricionalResponse>(
      res,
      'Erro ao cadastrar prescrição nutricional.'
    )
  },

  async listarPorPaciente(
    pacienteId: number
  ): Promise<PrescricaoNutricionalResumo[]> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoNutricional.visualizarTodos(pacienteId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    const data = await parseJson<PrescricaoNutricionalResumo[]>(
      res,
      'Erro ao listar prescrições nutricionais.'
    )
    return data ?? []
  },

  async buscarPorId(
    prescricaoId: number
  ): Promise<PrescricaoNutricionalResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoNutricional.visualizar(prescricaoId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    return parseJson<PrescricaoNutricionalResponse>(
      res,
      'Erro ao carregar detalhe da prescrição nutricional.'
    )
  },

  async ativar(prescricaoId: number): Promise<PrescricaoNutricionalResumo> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoNutricional.ativar(prescricaoId)}`
    const res = await fetch(url, { method: 'PATCH', headers: authHeaders() })
    return parseJson<PrescricaoNutricionalResumo>(
      res,
      'Erro ao ativar a prescrição nutricional.'
    )
  },

  async inativar(prescricaoId: number): Promise<PrescricaoNutricionalResumo> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoNutricional.inativar(prescricaoId)}`
    const res = await fetch(url, { method: 'PATCH', headers: authHeaders() })
    return parseJson<PrescricaoNutricionalResumo>(
      res,
      'Erro ao inativar a prescrição nutricional.'
    )
  },
}
