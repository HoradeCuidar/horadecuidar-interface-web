import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import type { AuthResponse, UserStorage } from '@/types'
import { USER_UPDATED_EVENT } from '@/types/auth'

const TOKEN_KEY = 'hdc_token'
const USER_KEY = 'hdc_user'

function persistUser(user: UserStorage): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event(USER_UPDATED_EVENT))
}

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
    persistUser({
      id: data.id,
      role: data.role,
      username,
    })

    return data
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  updateUser(partial: Partial<Pick<UserStorage, 'nome' | 'fotoDePerfil' | 'username'>>): UserStorage | null {
    const current = this.getUser()
    if (!current) return null
    const next: UserStorage = { ...current, ...partial }
    persistUser(next)
    return next
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

  async solicitarRecuperacao(email: string): Promise<void> {
    let res: Response
    try {
      res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.recuperacaoSenha}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está rodando.')
    }

    if (!res.ok) {
      throw new Error('Erro ao enviar solicitação de recuperação de senha.')
    }
  },

  async resetarSenha(token: string, novaSenha: string, confirmacao: string): Promise<void> {
    let res: Response
    try {
      res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.resetarSenha}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha, confirmacao }),
      })
    } catch {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está rodando.')
    }

    if (!res.ok) {
      let errorMsg = 'Erro ao redefinir a senha.'
      try {
        const errorData = await res.json()
        if (errorData && errorData.message) {
          errorMsg = errorData.message
        }
      } catch {
      }
      throw new Error(errorMsg)
    }
  },
}

