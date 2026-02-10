export type Role = 'ADMIN' | 'PACIENTE' | 'PROFISSIONAL_DA_SAUDE'

export interface AuthResponse {
  id: number
  token: string
  role: Role
}

export interface UserStorage {
  id: number
  role: Role
  username: string
}
