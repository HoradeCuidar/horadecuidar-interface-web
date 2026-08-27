import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import type { PrescricaoNutricionalFormData } from '@/components/PrescricaoNutricional/prescricaoNutricional.types'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import {
  formToPrescricaoNutricionalRequest,
  validarPrescricaoNutricionalForm,
} from './prescricaoNutricional.mappers'
import type { PrescricaoNutricionalResponse } from './prescricaoNutricional.types'

function authHeaders(): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para continuar.')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
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

    if (!res.ok) {
      const text = await res.text()
      throw new Error(parseApiError(text, 'Erro ao cadastrar prescrição nutricional.'))
    }

    return res.json() as Promise<PrescricaoNutricionalResponse>
  },
}
