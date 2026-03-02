import { dateToApi, onlyDigits } from './profissional.mappers'

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
