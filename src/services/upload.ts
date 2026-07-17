import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { authService } from './auth'
import { parseApiError } from './apiErrors'

const MAX_BYTES = 5 * 1024 * 1024

export const uploadService = {
  async uploadFotoPerfil(file: File): Promise<string> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Faça login para enviar a foto de perfil.')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Selecione um arquivo de imagem.')
    }
    if (file.size > MAX_BYTES) {
      throw new Error('A imagem deve ter no máximo 5 MB.')
    }

    const formData = new FormData()
    formData.append('file', file)

    const url = `${API_BASE_URL}${API_ENDPOINTS.upload.fotoPerfil}`
    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
    } catch {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está rodando.')
    }

    const text = (await res.text()).trim()
    if (!res.ok) {
      throw new Error(parseApiError(text, 'Erro ao enviar foto de perfil.'))
    }

    const urlFoto = text.replace(/^"|"$/g, '').trim()
    if (!urlFoto) {
      throw new Error('Resposta inválida do servidor ao enviar a foto.')
    }
    return urlFoto
  },
}
