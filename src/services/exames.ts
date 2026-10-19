import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'

export type StatusExame = 'RASCUNHO' | 'AGENDADO' | 'PUBLICADO' | 'INATIVADO'

export type Exame = {
  id: number
  pacienteId: number
  profissionalCadastroId: number
  dataColeta: string
  laboratorio: string | null
  observacao: string | null
  status: StatusExame
  disponibilizacaoEm: string | null
  publicadoEm: string | null
  criadoEm: string
  atualizadoEm: string
  nomeArquivo: string | null
  tamanhoBytes: number | null
}

export type DadosExame = {
  dataColeta: string
  laboratorio: string
  observacao: string
}

function authHeaders(json = false): HeadersInit {
  const token = authService.getToken()
  if (!token) throw new Error('Faça login para continuar.')
  return json
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { Authorization: `Bearer ${token}` }
}

async function verificar(res: Response, fallback: string): Promise<void> {
  if (!res.ok) {
    throw new Error(parseApiError(await res.text(), fallback))
  }
}

function montarFormData(dados: DadosExame, arquivo?: File): FormData {
  const form = new FormData()
  form.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }))
  if (arquivo) form.append('arquivo', arquivo, arquivo.name)
  return form
}

export const examesService = {
  async listar(pacienteId: number): Promise<Exame[]> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.exames.listar(pacienteId)}`, {
      headers: authHeaders(),
    })
    await verificar(res, 'Não foi possível carregar os exames.')
    return res.json() as Promise<Exame[]>
  },

  async detalhar(id: number): Promise<Exame> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.exames.detalhes(id)}`, {
      headers: authHeaders(),
    })
    await verificar(res, 'Não foi possível carregar o exame.')
    return res.json() as Promise<Exame>
  },

  async cadastrar(pacienteId: number, dados: DadosExame, arquivo: File): Promise<Exame> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.exames.cadastrar(pacienteId)}`, {
      method: 'POST',
      headers: authHeaders(),
      body: montarFormData(dados, arquivo),
    })
    await verificar(res, 'Não foi possível cadastrar o exame.')
    return res.json() as Promise<Exame>
  },

  async corrigir(id: number, dados: DadosExame, arquivo?: File): Promise<Exame> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.exames.corrigir(id)}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: montarFormData(dados, arquivo),
    })
    await verificar(res, 'Não foi possível corrigir o exame.')
    return res.json() as Promise<Exame>
  },

  async publicar(id: number): Promise<Exame> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.exames.publicar(id)}`, {
      method: 'POST',
      headers: authHeaders(),
    })
    await verificar(res, 'O exame foi salvo, mas não foi disponibilizado.')
    return res.json() as Promise<Exame>
  },

  async agendar(id: number, disponibilizacaoEm: string): Promise<Exame> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.exames.agendar(id)}`, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify({ disponibilizacaoEm }),
    })
    await verificar(res, 'O exame foi salvo, mas não foi agendado.')
    return res.json() as Promise<Exame>
  },

  async baixar(id: number): Promise<Blob> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.exames.arquivo(id)}`, {
      headers: authHeaders(),
    })
    await verificar(res, 'Não foi possível baixar o PDF.')
    return res.blob()
  },
}
