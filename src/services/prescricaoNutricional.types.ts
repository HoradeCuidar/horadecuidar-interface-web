export type UnidadeDeMedida =
  | 'G'
  | 'KG'
  | 'ML'
  | 'L'
  | 'UNIDADE'
  | 'FATIA'
  | 'COLHER'
  | 'XICARA'

export type StatusPrescricaoNutricional = 'ATIVA' | 'ENCERRADA'

export type AlimentoPrescritoRequest = {
  descricao: string
  quantidade: number
  unidade: UnidadeDeMedida
  observacao?: string | null
}

export type OpcaoRefeicaoRequest = {
  ordem: number
  descricao?: string | null
  alimentos: AlimentoPrescritoRequest[]
}

export type RefeicaoRequest = {
  nome: string
  ordem: number
  observacoes?: string | null
  opcoes: OpcaoRefeicaoRequest[]
}

export type PrescricaoNutricionalRequest = {
  pacienteId: number
  dataInicio: string
  dataFim: string
  observacoes?: string | null
  refeicoes: RefeicaoRequest[]
}

export type AlimentoPrescritoResponse = {
  id?: number
  descricao: string
  quantidade: number
  unidade: string
  observacao?: string | null
}

export type OpcaoRefeicaoResponse = {
  ordem: number
  descricao?: string | null
  alimentos: AlimentoPrescritoResponse[]
}

export type RefeicaoResponse = {
  nome: string
  ordem: number
  observacoes?: string | null
  opcoes: OpcaoRefeicaoResponse[]
}

export type PrescricaoNutricionalResponse = {
  pacienteId: number
  profissionalId: number
  dataInicio: string
  dataFim: string
  dataEncerramento?: string | null
  status: string
  observacoes?: string | null
  refeicoes: RefeicaoResponse[]
}

export const OPCOES_UNIDADE_MEDIDA: { value: UnidadeDeMedida; label: string }[] =
  [
    { value: 'G', label: 'g' },
    { value: 'KG', label: 'kg' },
    { value: 'ML', label: 'ml' },
    { value: 'L', label: 'Litro' },
    { value: 'UNIDADE', label: 'Unidade' },
    { value: 'FATIA', label: 'Fatia' },
    { value: 'COLHER', label: 'Colher' },
    { value: 'XICARA', label: 'Xícara' },
  ]
