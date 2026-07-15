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
  if (!token) throw new Error('Faca login para continuar.')
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

async function listarAtivasRaw(
  pacienteId: number
): Promise<PrescricaoMedicamentoResponse[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.base(pacienteId)}`
  const res = await fetch(url, { method: 'GET', headers: authHeaders() })
  const data = await parseJson<PrescricaoMedicamentoResponse[]>(
    res,
    'Erro ao listar prescricoes.'
  )
  return data ?? []
}

export const prescricaoMedicamentoService = {
  async listarAtivas(pacienteId: number): Promise<PrescricaoListagem[]> {
    const data = await listarAtivasRaw(pacienteId)
    return responsesToListagem(data)
  },

  async listarHistorico(pacienteId: number): Promise<PrescricaoListagem[]> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.historico(pacienteId)}`
    const res = await fetch(url, { method: 'GET', headers: authHeaders() })
    const data = await parseJson<PrescricaoMedicamentoResponse[]>(
      res,
      'Erro ao listar historico de prescricoes.'
    )
    return responsesToListagem(data ?? [])
  },

  async buscarPorId(
    pacienteId: number,
    prescricaoId: string
  ): Promise<PrescricaoMedicamentoResponse> {
    const lista = await listarAtivasRaw(pacienteId)
    const encontrada = lista.find((p) => String(p.id) === String(prescricaoId))
    if (!encontrada) {
      throw new Error('Prescricao nao encontrada.')
    }
    return encontrada
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
    return parseJson<PrescricaoMedicamentoResponse>(res, 'Erro ao salvar prescricao.')
  },

  async atualizar(
    pacienteId: number,
    prescricaoId: string,
    form: PrescricaoFormData
  ): Promise<PrescricaoMedicamentoResponse> {
    const payload = formToPrescricaoRequest(form)
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.porId(
      pacienteId,
      prescricaoId
    )}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    return parseJson<PrescricaoMedicamentoResponse>(res, 'Erro ao atualizar prescricao.')
  },

  async alterarStatus(
    pacienteId: number,
    prescricaoId: string
  ): Promise<PrescricaoMedicamentoResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.porId(
      pacienteId,
      prescricaoId
    )}`
    const res = await fetch(url, { method: 'PATCH', headers: authHeaders() })
    return parseJson<PrescricaoMedicamentoResponse>(
      res,
      'Erro ao alterar status da prescricao.'
    )
  },

  async excluir(pacienteId: number, prescricaoId: string): Promise<void> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.prescricaoMedicamento.porId(
      pacienteId,
      prescricaoId
    )}`
    const res = await fetch(url, { method: 'DELETE', headers: authHeaders() })
    await parseJson<void>(res, 'Erro ao excluir prescricao.')
  },
}
