export type TipoExercicio =
  | 'AEROBICO'
  | 'ALONGAMENTO'
  | 'RESISTENCIA'
  | 'FLEXIBILIDADE'
  | 'EQUILIBRIO'
  | 'FUNCIONAL'
  | 'RELAXAMENTO'
  | 'OUTRO'

export type FrequenciaTipo = 'DIA' | 'SEMANA' | 'MES'
export type UnidadeDuracao = 'MINUTOS' | 'HORAS'

export type ExercicioForm = {
  id: string
  nomeExercicio: string
  tipoExercicio: TipoExercicio | ''
  frequenciaValor: string
  frequenciaTipo: FrequenciaTipo | ''
  duracaoValor: string
  unidadeDuracao: UnidadeDuracao | ''
  series: string
  repeticoes: string
  intensidade: string
  observacao: string
}

export type PrescricaoExercicioFormData = {
  nomeParticipante: string
  dataInicio: string
  dataFim: string
  observacao: string
  exercicios: ExercicioForm[]
}

export function criarExercicioVazio(): ExercicioForm {
  return {
    id: crypto.randomUUID(),
    nomeExercicio: '',
    tipoExercicio: '',
    frequenciaValor: '1',
    frequenciaTipo: '',
    duracaoValor: '',
    unidadeDuracao: '',
    series: '',
    repeticoes: '',
    intensidade: '',
    observacao: '',
  }
}

export const OPCOES_TIPO_EXERCICIO = [
  { value: 'AEROBICO', label: 'Aeróbico' },
  { value: 'ALONGAMENTO', label: 'Alongamento' },
  { value: 'RESISTENCIA', label: 'Resistência / Força' },
  { value: 'FLEXIBILIDADE', label: 'Flexibilidade / Alongamento' },
  { value: 'EQUILIBRIO', label: 'Equilíbrio' },
  { value: 'FUNCIONAL', label: 'Funcional' },
  { value: 'RELAXAMENTO', label: 'Relaxamento / Respiração' },
  { value: 'OUTRO', label: 'Outro' },
]

export const OPCOES_FREQUENCIA = [
  { value: 'DIA', label: 'dia' },
  { value: 'SEMANA', label: 'semana' },
  { value: 'MES', label: 'mês' },
]

export const OPCOES_DURACAO = [
  { value: 'MINUTOS', label: 'minutos' },
  { value: 'HORAS', label: 'horas' },
]
