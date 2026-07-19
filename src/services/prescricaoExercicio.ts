import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import type { PrescricaoExercicioFormData } from '@/components/PrescricaoExercicios/prescricaoExercicio.types'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import {
  formToPrescricaoExercicioRequest,
  type PrescricaoExercicioResponse,
} from './prescricaoExercicio.mappers'

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
  return res.json() as Promise<T>
}

export const prescricaoExercicioService = {
  async listarAtivas(pacienteId: number): Promise<PrescricaoExercicioResponse[]> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoExercicio.base(pacienteId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    const data = await parseJson<PrescricaoExercicioResponse[]>(
      res,
      'Erro ao listar prescrições de exercícios.'
    )
    return data ?? []
  },

  async criar(
    pacienteId: number,
    form: PrescricaoExercicioFormData
  ): Promise<PrescricaoExercicioResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoExercicio.base(pacienteId)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(formToPrescricaoExercicioRequest(form)),
    })
    return parseJson<PrescricaoExercicioResponse>(
      res,
      'Erro ao salvar prescrição de exercícios.'
    )
  },
}
