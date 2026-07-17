import type { Role } from '@/types/auth'

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Administrador',
  PROFISSIONAL_DA_SAUDE: 'Profissional da Saúde',
  PACIENTE: 'Participante',
}

export function apiDateToForm(apiDate: string): string {
  if (!apiDate) return ''
  const parts = apiDate.split('-')
  if (parts.length !== 3) return apiDate
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

export function apiToFormGenero(g?: string): string {
  if (!g) return ''
  const upper = g
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (upper.includes('FEMININO') || upper === 'F') return 'F'
  if (upper.includes('MASCULINO') || upper === 'M') return 'M'
  if (upper.includes('NAO_BINARIO') || upper.includes('NAO BINARIO') || upper === 'N')
    return 'N'
  if (upper.includes('OUTRO') || upper === 'O') return 'O'
  return g
}

export type MeuPerfilFormState = {
  nome: string
  genero: string
  telefone: string
  dataNascimento: string
  email: string
  rua: string
  numeroCasa: string
  bairro: string
  estado: string
  cidade: string
  username: string
}

export function mapProfissionalToForm(p: {
  nome: string
  username?: string
  email?: string
  telefone?: string
  dataNascimento?: string
  genero?: string
  rua?: string
  numeroDaCasa?: string
  bairro?: string
  cidade?: string
  estado?: string
}): MeuPerfilFormState {
  return {
    nome: p.nome ?? '',
    genero: apiToFormGenero(p.genero),
    telefone: p.telefone ? p.telefone.replace(/\D/g, '') : '',
    dataNascimento: p.dataNascimento ? apiDateToForm(p.dataNascimento) : '',
    email: p.email ?? '',
    rua: p.rua ?? '',
    numeroCasa: p.numeroDaCasa ?? '',
    bairro: p.bairro ?? '',
    estado: p.estado ?? '',
    cidade: p.cidade ?? '',
    username: p.username ?? '',
  }
}

export function formatarTelefoneExibicao(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length === 11) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`
  }
  if (d.length === 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  }
  return digits || '—'
}

export function labelGenero(value: string): string {
  const map: Record<string, string> = {
    F: 'Feminino',
    M: 'Masculino',
    N: 'Não binário',
    O: 'Outro',
  }
  return map[value] || value.trim() || '—'
}

export function valorOuTraco(value: string): string {
  const t = value?.trim()
  return t ? t : '—'
}
