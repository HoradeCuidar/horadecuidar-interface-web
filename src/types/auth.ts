export type Role = 'ADMIN' | 'PACIENTE' | 'PROFISSIONAL_DA_SAUDE'

export interface AuthResponse {
  id: number
  token: string
  role: Role
}
