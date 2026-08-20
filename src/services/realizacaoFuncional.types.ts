export type StatusRealizacao = 'REALIZADO' | 'PARCIALMENTE_REALIZADO'

export type SensacaoFinal =
  | 'ME_SUPEREI'
  | 'BEM_FORTE'
  | 'DE_BOA'
  | 'ARRASTADO'
  | 'QUASE_NAO_DEU'

export type RegistroRealizacaoFuncional = {
  id: number
  orientacaoFuncionalId: number
  nomeOrientacao: string
  status: StatusRealizacao
  duracaoRealizadaMinutos: number | null
  sensacaoFinal: SensacaoFinal | null
  observacao: string | null
  dataRegistro: string
}
