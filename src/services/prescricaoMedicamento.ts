import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'
import {
  formToPrescricaoRequest,
  responsesToListagem,
  type PrescricaoMedicamentoRequest,
  type PrescricaoMedicamentoResponse,
} from './prescricaoMedicamento.mappers'
import type { PrescricaoFormData } from '@/components/PrescricaoMedicamentos/prescricao.types'
import type { PrescricaoListagem } from '@/components/PrescricaoMedicamentos/prescricaoListagem.types'

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

export const prescricaoMedicamentoService = {
  async listarAtivas(pacienteId: number): Promise<PrescricaoListagem[]> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.base(pacienteId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    const data = await parseJson<PrescricaoMedicamentoResponse[]>(
      res,
      'Erro ao listar prescrições.'
    )
    return responsesToListagem(data ?? [])
  },

  async listarHistorico(pacienteId: number): Promise<PrescricaoListagem[]> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.historico(pacienteId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    const data = await parseJson<PrescricaoMedicamentoResponse[]>(
      res,
      'Erro ao listar histórico de prescrições.'
    )
    return responsesToListagem(data ?? [])
  },

  async criar(
    pacienteId: number,
    form: PrescricaoFormData
  ): Promise<PrescricaoMedicamentoResponse> {
    const payload: PrescricaoMedicamentoRequest = formToPrescricaoRequest(form)
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.base(pacienteId)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    return parseJson<PrescricaoMedicamentoResponse>(res, 'Erro ao salvar prescrição.')
  },

  async atualizar(
    pacienteId: number,
    prescricaoId: string,
    form: PrescricaoFormData
  ): Promise<PrescricaoMedicamentoResponse> {
    const payload = formToPrescricaoRequest(form)
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.porId(pacienteId, prescricaoId)}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    return parseJson<PrescricaoMedicamentoResponse>(res, 'Erro ao atualizar prescrição.')
  },

  async alterarStatus(
    pacienteId: number,
    prescricaoId: string
  ): Promise<PrescricaoMedicamentoResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.porId(pacienteId, prescricaoId)}`
    const res = await fetch(url, { method: 'PATCH', headers: authHeaders() })
    return parseJson<PrescricaoMedicamentoResponse>(res, 'Erro ao alterar status da prescrição.')
  },

  async excluir(pacienteId: number, prescricaoId: string): Promise<void> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.porId(pacienteId, prescricaoId)}`
    const res = await fetch(url, { method: 'DELETE', headers: authHeaders() })
    await parseJson<void>(res, 'Erro ao excluir prescrição.')
  },
}
