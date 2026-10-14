export type StatusDiaCalendario =
  | 'realizado'
  | 'parcial'
  | 'nao_realizado'
  | 'sem_registro'
  | 'hoje_vazio'

export type DiaCalendario = {
  chave: string
  data: Date
  rotuloDia: string
  rotuloData: string
  ehHoje: boolean
  status: StatusDiaCalendario
  subtitulo?: string
  duracaoMinutos?: number
  qtdRegistros: number
}

export type ChipCalendario = {
  rotulo: string
  tom?: 'sucesso' | 'brand' | 'neutro' | 'alerta'
}

export type DetalheDiarioAdesao = {
  data: string
  esperado: number
  realizado: number
  naoRealizado: number
  semRegistro: number
  percentualAdesao?: number | null
}

export type RegistroDiaOrientacao = {
  data: string
  status: 'REALIZADO' | 'PARCIALMENTE_REALIZADO'
  duracao?: number | null
}

export type RegistroDiaRealizacao = {
  dataRegistro: string
  status: 'REALIZADO' | 'PARCIALMENTE_REALIZADO'
  duracaoRealizadaMinutos?: number | null
}
