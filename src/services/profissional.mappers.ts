export type CadastroProfissionalPayload = {
  nome: string
  username: string
  senha: string
  dataDeNascimento: string
  telefone: string
  rua: string
  bairro: string
  estado: string
  cidade: string
  numeroDaCasa: string
  genero: 'MASCULINO' | 'FEMININO' | 'NAO_BINARIO' | 'OUTRO'
  email: string
}

function generoFormToApi(value: string): CadastroProfissionalPayload['genero'] {
  const map: Record<string, CadastroProfissionalPayload['genero']> = {
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

export function dateToApi(dateStr: string): string {
  const raw = (dateStr ?? '').trim().replace(/\D/g, '')
  if (raw.length !== 8) return ''
  const d = raw.slice(0, 2)
  const m = raw.slice(2, 4)
  const y = raw.slice(4, 8)
  const day = parseInt(d, 10)
  const month = parseInt(m, 10)
  if (day < 1 || day > 31 || month < 1 || month > 12) return ''
  return `${y}-${m}-${d}`
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formToPayload(dados: Record<string, string>): CadastroProfissionalPayload {
  return {
    nome: dados.nome?.trim() ?? '',
    username: dados.username?.trim() ?? '',
    senha: dados.senha ?? '',
    dataDeNascimento: dateToApi(dados.dataNascimento ?? ''),
    telefone: onlyDigits(dados.telefone ?? ''),
    rua: dados.rua?.trim() ?? '',
    bairro: dados.bairro?.trim() ?? '',
    estado: (dados.estado?.trim() ?? '').slice(0, 2).toUpperCase(),
    cidade: dados.cidade?.trim() ?? '',
    numeroDaCasa: dados.numeroCasa?.trim() ?? '',
    genero: generoFormToApi(dados.genero ?? ''),
    email: dados.email?.trim() ?? '',
  }
}

export type MeuPerfilProfissionalPayload = {
  nome: string
  email: string
  telefone: string
  genero: CadastroProfissionalPayload['genero']
  dataDeNascimento: string
  rua: string
  bairro: string
  estado: string
  cidade: string
  numeroDaCasa: string
}

export function formToMeuPerfilPayload(
  dados: Record<string, string>
): MeuPerfilProfissionalPayload {
  const full = formToPayload(dados)
  return {
    nome: full.nome,
    email: full.email,
    telefone: full.telefone,
    genero: full.genero,
    dataDeNascimento: full.dataDeNascimento,
    rua: full.rua,
    bairro: full.bairro,
    estado: full.estado,
    cidade: full.cidade,
    numeroDaCasa: full.numeroDaCasa,
  }
}
