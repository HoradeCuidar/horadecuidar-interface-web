import { dateToApi, onlyDigits } from './profissional.mappers'

export type PacienteDetalhes = {
  id: number
  nome: string
  email: string
  username: string
  dataDeNascimento: string
  telefone: string
  rua?: string
  bairro?: string
  estado?: string
  cidade?: string
  numeroDaCasa?: string
  genero?: string
  doencas?: { id: number; nome: string }[]
  observacoes?: string
}

export type FormEditarPaciente = {
  nome: string
  dataNascimento: string
  telefone: string
  genero: string
  email: string
  rua: string
  bairro: string
  estado: string
  cidade: string
  numeroCasa: string
  doencaId: string
  observacoes: string
  username: string
}

export const FORM_EDITAR_PACIENTE_INICIAL: FormEditarPaciente = {
  nome: '',
  dataNascimento: '',
  telefone: '',
  genero: '',
  email: '',
  rua: '',
  bairro: '',
  estado: '',
  cidade: '',
  numeroCasa: '',
  doencaId: '',
  observacoes: '',
  username: '',
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
  const upper = g.toUpperCase()
  if (upper === 'FEMININO' || upper === 'F') return 'F'
  if (upper === 'MASCULINO' || upper === 'M') return 'M'
  if (upper === 'NAO_BINARIO' || upper === 'N') return 'N'
  if (upper === 'OUTRO' || upper === 'O') return 'O'
  return g
}

export function detalhesToForm(p: PacienteDetalhes): FormEditarPaciente {
  const primeiraDoenca = p.doencas?.[0]
  return {
    nome: p.nome ?? '',
    dataNascimento: p.dataDeNascimento ? apiDateToForm(p.dataDeNascimento) : '',
    telefone: p.telefone ? p.telefone.replace(/\D/g, '') : '',
    genero: apiToFormGenero(p.genero),
    email: p.email ?? '',
    rua: p.rua ?? '',
    bairro: p.bairro ?? '',
    estado: p.estado ?? '',
    cidade: p.cidade ?? '',
    numeroCasa: p.numeroDaCasa ?? '',
    doencaId: primeiraDoenca ? String(primeiraDoenca.id) : '',
    observacoes: p.observacoes ?? '',
    username: p.username ?? '',
  }
}

export type CadastroPacientePayload = {
  nome: string
  username: string
  senha: string
  dataDeNascimento: string
  telefone: string
  genero: 'MASCULINO' | 'FEMININO' | 'NAO_BINARIO' | 'OUTRO'
  email: string
  rua?: string
  bairro?: string
  estado?: string
  cidade?: string
  numeroDaCasa?: string
  doencas: number[]
  observacoes?: string
}

function generoFormToApi(value: string): CadastroPacientePayload['genero'] {
  const map: Record<string, CadastroPacientePayload['genero']> = {
    F: 'FEMININO',
    FEMININO: 'FEMININO',
    M: 'MASCULINO',
    MASCULINO: 'MASCULINO',
    O: 'OUTRO',
    OUTRO: 'OUTRO',
    N: 'NAO_BINARIO',
    NAO_BINARIO: 'NAO_BINARIO',
  }
  return map[value] ?? 'OUTRO'
}

export function formToPayload(dados: Record<string, unknown>): CadastroPacientePayload {
  const doencaId = dados.doencaId
  const doencas: number[] =
    typeof doencaId === 'string' && doencaId && !doencaId.startsWith('temp-')
      ? [Number(doencaId)]
      : typeof doencaId === 'number'
        ? [doencaId]
        : []

  return {
    nome: String(dados.nome ?? '').trim(),
    username: String(dados.username ?? '').trim(),
    senha: String(dados.senha ?? ''),
    dataDeNascimento: dateToApi(String(dados.dataNascimento ?? '')),
    telefone: onlyDigits(String(dados.telefone ?? '')),
    genero: generoFormToApi(String(dados.genero ?? '')),
    email: String(dados.email ?? '').trim(),
    rua: String(dados.rua ?? '').trim() || undefined,
    bairro: String(dados.bairro ?? '').trim() || undefined,
    estado: (String(dados.estado ?? '').trim().slice(0, 2) || undefined)?.toUpperCase(),
    cidade: String(dados.cidade ?? '').trim() || undefined,
    numeroDaCasa: String(dados.numeroCasa ?? '').trim() || undefined,
    doencas,
    observacoes: String(dados.observacoes ?? '').trim() || undefined,
  }
}

export type EdicaoPacientePayload = Omit<CadastroPacientePayload, 'senha'>

export function formToEdicaoPayload(dados: Record<string, unknown>): EdicaoPacientePayload {
  const { senha: _senha, ...payload } = formToPayload({ ...dados, senha: 'placeholder' })
  return payload
}

function normalizeDigits(val: string): string {
  return val.replace(/\D/g, '')
}

function trimVal(val: string): string {
  return val.trim()
}

export function formTemAlteracoes(
  form: FormEditarPaciente,
  inicial: FormEditarPaciente | null,
): boolean {
  if (!inicial) return false

  return (
    trimVal(form.nome) !== trimVal(inicial.nome) ||
    trimVal(form.genero) !== trimVal(inicial.genero) ||
    normalizeDigits(form.telefone) !== normalizeDigits(inicial.telefone) ||
    normalizeDigits(form.dataNascimento) !== normalizeDigits(inicial.dataNascimento) ||
    trimVal(form.email) !== trimVal(inicial.email) ||
    trimVal(form.rua) !== trimVal(inicial.rua) ||
    trimVal(form.numeroCasa) !== trimVal(inicial.numeroCasa) ||
    trimVal(form.bairro) !== trimVal(inicial.bairro) ||
    trimVal(form.estado) !== trimVal(inicial.estado) ||
    trimVal(form.cidade) !== trimVal(inicial.cidade) ||
    trimVal(form.doencaId) !== trimVal(inicial.doencaId) ||
    trimVal(form.observacoes) !== trimVal(inicial.observacoes) ||
    trimVal(form.username) !== trimVal(inicial.username)
  )
}
