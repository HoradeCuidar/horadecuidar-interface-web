import { FiTrash2 } from 'react-icons/fi'
import { Input, Select } from '@/components'
import {
  OPCOES_DURACAO,
  OPCOES_FREQUENCIA,
  OPCOES_TIPO_EXERCICIO,
  type ExercicioForm,
} from './prescricaoExercicio.types'

type ItemExercicioFormProps = {
  exercicio: ExercicioForm
  index: number
  podeRemover: boolean
  onChange: (id: string, campo: keyof ExercicioForm, valor: string) => void
  onRemover: (id: string) => void
}

export function ItemExercicioForm({
  exercicio,
  index,
  podeRemover,
  onChange,
  onRemover,
}: ItemExercicioFormProps) {
  const id = exercicio.id

  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-700">
          Exercício {index + 1}
        </h3>
        {podeRemover && (
          <button
            type="button"
            onClick={() => onRemover(id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-700 transition hover:underline"
          >
            <FiTrash2 className="size-4" aria-hidden />
            Remover
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Input
          id={`nome-exercicio-${id}`}
          label="Nome do exercício"
          size="compact"
          placeholder="Ex: Caminhada"
          value={exercicio.nomeExercicio}
          onChange={(e) => onChange(id, 'nomeExercicio', e.target.value)}
          required
        />

        <Select
          id={`tipo-exercicio-${id}`}
          label="Tipo de exercício"
          size="compact"
          options={OPCOES_TIPO_EXERCICIO}
          value={exercicio.tipoExercicio}
          onChange={(e) => onChange(id, 'tipoExercicio', e.target.value)}
          required
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            id={`frequencia-${id}`}
            label="Frequência"
            size="compact"
            type="number"
            min={1}
            inputMode="numeric"
            value={exercicio.frequenciaValor}
            onChange={(e) => onChange(id, 'frequenciaValor', e.target.value)}
            required
          />
          <Select
            id={`periodo-frequencia-${id}`}
            label="Por"
            size="compact"
            options={OPCOES_FREQUENCIA}
            value={exercicio.frequenciaTipo}
            onChange={(e) => onChange(id, 'frequenciaTipo', e.target.value)}
            required
          />
          <Input
            id={`duracao-${id}`}
            label="Duração da sessão"
            size="compact"
            type="number"
            min={1}
            inputMode="numeric"
            value={exercicio.duracaoValor}
            onChange={(e) => onChange(id, 'duracaoValor', e.target.value)}
            required
          />
          <Select
            id={`unidade-duracao-${id}`}
            label="Unidade de duração"
            size="compact"
            options={OPCOES_DURACAO}
            value={exercicio.unidadeDuracao}
            onChange={(e) => onChange(id, 'unidadeDuracao', e.target.value)}
            required
          />
          <Input
            id={`series-${id}`}
            label="Séries (opcional)"
            size="compact"
            type="number"
            min={1}
            inputMode="numeric"
            value={exercicio.series}
            onChange={(e) => onChange(id, 'series', e.target.value)}
          />
          <Input
            id={`repeticoes-${id}`}
            label="Repetições (opcional)"
            size="compact"
            type="number"
            min={1}
            inputMode="numeric"
            value={exercicio.repeticoes}
            onChange={(e) => onChange(id, 'repeticoes', e.target.value)}
          />
        </div>

        <Input
          id={`intensidade-${id}`}
          label="Intensidade (opcional)"
          size="compact"
          placeholder="Ex: Leve"
          value={exercicio.intensidade}
          onChange={(e) => onChange(id, 'intensidade', e.target.value)}
        />

        <Input
          id={`observacao-exercicio-${id}`}
          label="Observação (opcional)"
          size="compact"
          placeholder="Orientações específicas do exercício"
          value={exercicio.observacao}
          onChange={(e) => onChange(id, 'observacao', e.target.value)}
        />
      </div>
    </section>
  )
}
