import type { PeriodoRelatorio } from './relatorioAdesaoMedicamento.types'
import type {
  SensacaoFinal,
  StatusRealizacao,
} from './realizacaoFuncional.types'

export type ResumoOrientacaoFuncional = {
  dataInicial: string
  dataFinal: string
  quantidade: number
  tempoRealizacao: number
}

export type DetalhamentoRealizacaoFuncional = {
  data: string
  nomeOrientacao: string
  idOrientacao: number
  status: StatusRealizacao
  duracao: number | null
  sensacaoFinal: SensacaoFinal | null
}

export type PageDetalhamentoOrientacao = {
  content: DetalhamentoRealizacaoFuncional[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export type DetalhamentoOrientacaoFuncional = {
  dataInicial: string
  dataFinal: string
  conteudo: PageDetalhamentoOrientacao
}

export type { PeriodoRelatorio }
