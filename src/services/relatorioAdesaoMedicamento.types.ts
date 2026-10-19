export type PeriodoRelatorio = {
  dataInicial: string
  dataFinal: string
}

export type ResumoAdesaoMedicamento = {
  dataInicial: string
  dataFinal: string
  esperado: number
  realizado: number
  naoRealizado: number
  semRegistro: number
  percentual: number | null
}

export type PeriodoEvolucaoMedicamento = {
  inicioSemana: string
  fimSemana: string
  inicioConsiderado: string
  fimConsiderado: string
  esperado: number
  realizado: number
  naoRealizado: number
  semRegistro: number
  percentualAdesao: number | null
}

export type EvolucaoAdesaoMedicamento = {
  dataInicial: string
  dataFinal: string
  agrupamento: string
  periodos: PeriodoEvolucaoMedicamento[]
}

export type DetalhamentoDiarioMedicamento = {
  data: string
  tipo: string
  esperado: number
  realizado: number
  naoRealizado: number
  semRegistro: number
  percentualAdesao: number | null
}

export type PageDetalhamentoMedicamento = {
  content: DetalhamentoDiarioMedicamento[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export type DetalhamentoAdesaoMedicamento = {
  dataInicial: string
  dataFinal: string
  conteudo: PageDetalhamentoMedicamento
}

export function periodoPadraoUltimos14Dias(): PeriodoRelatorio {
  const fim = new Date()
  const inicio = new Date()
  inicio.setDate(fim.getDate() - 13)

  return {
    dataInicial: toIsoDate(inicio),
    dataFinal: toIsoDate(fim),
  }
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
