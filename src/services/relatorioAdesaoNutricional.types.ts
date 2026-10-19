export type ResumoAdesaoNutricional = {
  dataInicial: string
  dataFinal: string
  esperado: number
  realizado: number
  naoRealizado: number
  semRegistro: number
  percentual: number | null
}

export type PeriodoEvolucaoNutricional = {
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

export type EvolucaoAdesaoNutricional = {
  dataInicial: string
  dataFinal: string
  agrupamento: string
  periodos: PeriodoEvolucaoNutricional[]
}

export type DetalhamentoDiarioNutricional = {
  data: string
  tipo: string
  esperado: number
  realizado: number
  naoRealizado: number
  semRegistro: number
  percentualAdesao: number | null
}

export type PageDetalhamentoNutricional = {
  content: DetalhamentoDiarioNutricional[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export type DetalhamentoAdesaoNutricional = {
  dataInicial: string
  dataFinal: string
  conteudo: PageDetalhamentoNutricional
}

