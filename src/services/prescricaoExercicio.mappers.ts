import type {
  FrequenciaTipo,
  PrescricaoExercicioFormData,
  TipoExercicio,
  UnidadeDuracao,
} from '@/components/PrescricaoExercicios/prescricaoExercicio.types'

export type ItemExercicioRequest = {
  nomeExercicio: string
  tipoExercicio: TipoExercicio
  frequenciaValor: number
  frequenciaTipo: FrequenciaTipo
  duracaoValor: number
  unidadeDuracao: UnidadeDuracao
  series?: number | null
  repeticoes?: number | null
  intensidade?: string | null
  observacao?: string | null
}

export type PrescricaoExercicioRequest = {
  dataInicio: string
  dataFim?: string | null
  observacao?: string | null
  exercicios: ItemExercicioRequest[]
}

export type PrescricaoExercicioResponse = PrescricaoExercicioRequest & {
  id: string
  nomeProfissional?: string
  ativo: boolean
}

function numeroOpcional(value: string): number | null {
  return value.trim() ? Number(value) : null
}

export function formToPrescricaoExercicioRequest(
  form: PrescricaoExercicioFormData
): PrescricaoExercicioRequest {
  return {
    dataInicio: form.dataInicio,
    dataFim: form.dataFim || null,
    observacao: form.observacao.trim() || null,
    exercicios: form.exercicios.map((item) => ({
      nomeExercicio: item.nomeExercicio.trim(),
      tipoExercicio: item.tipoExercicio as TipoExercicio,
      frequenciaValor: Number(item.frequenciaValor),
      frequenciaTipo: item.frequenciaTipo as FrequenciaTipo,
      duracaoValor: Number(item.duracaoValor),
      unidadeDuracao: item.unidadeDuracao as UnidadeDuracao,
      series: numeroOpcional(item.series),
      repeticoes: numeroOpcional(item.repeticoes),
      intensidade: item.intensidade.trim() || null,
      observacao: item.observacao.trim() || null,
    })),
  }
}

function inteiroPositivo(value: string): boolean {
  const numero = Number(value)
  return Number.isInteger(numero) && numero >= 1
}

export function validarPrescricaoExercicioForm(
  form: PrescricaoExercicioFormData
): string | null {
  if (!form.dataInicio) return 'Informe a data de início.'
  if (form.dataFim && form.dataFim < form.dataInicio) {
    return 'A data de término deve ser posterior à data de início.'
  }
  if (form.exercicios.length === 0) {
    return 'Adicione ao menos um exercício.'
  }

  for (const [index, item] of form.exercicios.entries()) {
    const numero = index + 1
    if (!item.nomeExercicio.trim()) {
      return `Informe o nome do exercício ${numero}.`
    }
    if (!item.tipoExercicio) {
      return `Selecione o tipo do exercício ${numero}.`
    }
    if (!inteiroPositivo(item.frequenciaValor)) {
      return `Informe uma frequência válida para o exercício ${numero}.`
    }
    if (!item.frequenciaTipo) {
      return `Selecione o período da frequência do exercício ${numero}.`
    }
    if (!inteiroPositivo(item.duracaoValor)) {
      return `Informe uma duração válida para o exercício ${numero}.`
    }
    if (!item.unidadeDuracao) {
      return `Selecione a unidade de duração do exercício ${numero}.`
    }
    if (item.series && !inteiroPositivo(item.series)) {
      return `Informe um número de séries válido para o exercício ${numero}.`
    }
    if (item.repeticoes && !inteiroPositivo(item.repeticoes)) {
      return `Informe um número de repetições válido para o exercício ${numero}.`
    }
  }

  return null
}
