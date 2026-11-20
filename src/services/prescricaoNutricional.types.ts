export type UnidadeDeMedida =
  | 'G'
  | 'KG'
  | 'ML'
  | 'L'
  | 'UNIDADE'
  | 'FATIA'
  | 'COLHER'
  | 'COLHER_SOPA'
  | 'COLHER_CHA'
  | 'COLHER_SOBREMESA'
  | 'XICARA'

export type StatusPrescricaoNutricional = 'ATIVA' | 'INATIVA' | 'ENCERRADA'

export type SubstituicaoAlimentarRequest = {
  id?: number
  ordem: number
  descricao: string
  quantidade: number
  unidade: UnidadeDeMedida
  medidaCaseira?: string | null
  observacao?: string | null
}

export type AlimentoPrescritoRequest = {
  id?: number
  medidaCaseira?: string | null
  substituicoes: SubstituicaoAlimentarRequest[]
  descricao: string
  quantidade: number
  unidade: UnidadeDeMedida
  observacao?: string | null
}

export type OpcaoRefeicaoRequest = {
  id?: number
  orientacoesPreparo?: string | null
  ordem: number
  descricao?: string | null
  alimentos: AlimentoPrescritoRequest[]
}

export type RefeicaoRequest = {
  id?: number
  horario?: string | null
  nome: string
  ordem: number
  observacoes?: string | null
  opcoes: OpcaoRefeicaoRequest[]
}

export type PrescricaoNutricionalRequest = {
  modeloOrigemId?: number | null
  modeloOrigemVersao?: number | null
  pacienteId: number
  dataInicio: string
  dataFim: string
  observacoes?: string | null
  refeicoes: RefeicaoRequest[]
}

export type SubstituicaoAlimentarResponse = SubstituicaoAlimentarRequest

export type AlimentoPrescritoResponse = {
  medidaCaseira?: string | null
  substituicoes?: SubstituicaoAlimentarResponse[]
  id?: number
  descricao: string
  quantidade: number
  unidade: string
  observacao?: string | null
}

export type OpcaoRefeicaoResponse = {
  id?: number
  orientacoesPreparo?: string | null
  ordem: number
  descricao?: string | null
  alimentos: AlimentoPrescritoResponse[]
}

export type RefeicaoResponse = {
  id?: number
  horario?: string | null
  nome: string
  ordem: number
  observacoes?: string | null
  opcoes: OpcaoRefeicaoResponse[]
}

export type PrescricaoNutricionalResumo = {
  id: number
  pacienteId: number
  profissionalId: number
  dataInicio: string
  dataFim: string
  dataEncerramento?: string | null
  status: StatusPrescricaoNutricional | string
  observacoes?: string | null
}

export type PrescricaoNutricionalResponse = {
  modeloOrigemId?: number | null
  modeloOrigemVersao?: number | null
  modeloOrigemNome?: string | null
  id?: number
  pacienteId: number
  profissionalId: number
  dataInicio: string
  dataFim: string
  dataEncerramento?: string | null
  status: StatusPrescricaoNutricional | string
  observacoes?: string | null
  refeicoes: RefeicaoResponse[]
}

export type PrescricaoNutricionalUpdateRequest = {
  dataFim: string
  observacoes?: string | null
  refeicoes: RefeicaoRequest[]
}

export function isStatusAtiva(
  status: StatusPrescricaoNutricional | string
): boolean {
  return String(status).toUpperCase() === 'ATIVA'
}

export function rotuloStatusPrescricaoNutricional(
  status: StatusPrescricaoNutricional | string
): string {
  const normalizado = String(status).toUpperCase()
  if (normalizado === 'ATIVA') return 'Ativa'
  if (normalizado === 'INATIVA') return 'Inativa'
  if (normalizado === 'ENCERRADA') return 'Encerrada'
  return status
}

export function formatarPeriodoNutricional(
  inicio: string,
  fim: string
): string {
  const dataFim = fim ? fim : 'sem data fim'
  return `${inicio || '—'} – ${dataFim}`
}

export function formatarAlimentoPrescrito(
  alimento: AlimentoPrescritoResponse
): string {
  const quantidade = [alimento.quantidade, alimento.unidade]
    .filter((v) => v !== null && v !== undefined && String(v).length > 0)
    .join(' ')
  const partes = [quantidade, alimento.observacao].filter(Boolean)
  return partes.join(' • ')
}

export const OPCOES_UNIDADE_MEDIDA: { value: UnidadeDeMedida; label: string }[] =
  [
    { value: 'G', label: 'g' },
    { value: 'KG', label: 'kg' },
    { value: 'ML', label: 'ml' },
    { value: 'L', label: 'Litro' },
    { value: 'UNIDADE', label: 'Unidade' },
    { value: 'FATIA', label: 'Fatia' },
    { value: 'COLHER', label: 'Colher (sem tipo)' },
    { value: 'COLHER_SOPA', label: 'Colher de sopa' },
    { value: 'COLHER_CHA', label: 'Colher de chá' },
    { value: 'COLHER_SOBREMESA', label: 'Colher de sobremesa' },
    { value: 'XICARA', label: 'Xícara' },
  ]
