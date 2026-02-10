import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import type { AuthResponse, UserStorage } from '@/types'

const TOKEN_KEY = 'hdc_token'
const USER_KEY = 'hdc_user'

export const authService = {
  async login(username: string, senha: string): Promise<AuthResponse> {
    let res: Response

    try {
      res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha }),
      })
    } catch {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está rodando.')
    }

    if (!res.ok) {
      const msg =
        res.status === 401
          ? 'Usuário ou senha inválidos.'
          : res.status === 500
            ? 'Erro no servidor'
            : 'Erro ao fazer login.'
      throw new Error(msg)
    }

    const data: AuthResponse = await res.json()

    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: data.id,
        role: data.role,
        username,
      })
    )

    return data
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken())
  },

  getUser(): UserStorage | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as UserStorage
    } catch {
      return null
    }
  },

}
