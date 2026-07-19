import { FiPlus, FiUser } from 'react-icons/fi'
import { Button, Input } from '@/components'
import { ItemExercicioForm } from './ItemExercicioForm'
import type {
  ExercicioForm,
  PrescricaoExercicioFormData,
} from './prescricaoExercicio.types'

type FormularioPrescricaoExercicioProps = {
  form: PrescricaoExercicioFormData
  onChangeCampo: <
    K extends keyof Omit<PrescricaoExercicioFormData, 'exercicios'>,
  >(
    campo: K,
    valor: PrescricaoExercicioFormData[K]
  ) => void
  onChangeExercicio: (
    id: string,
    campo: keyof ExercicioForm,
    valor: string
  ) => void
  onAdicionarExercicio: () => void
  onRemoverExercicio: (id: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancelar: () => void
  salvando: boolean
}

export function FormularioPrescricaoExercicio({
  form,
  onChangeCampo,
  onChangeExercicio,
  onAdicionarExercicio,
  onRemoverExercicio,
  onSubmit,
  onCancelar,
  salvando,
}: FormularioPrescricaoExercicioProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-6 md:p-8"
    >
      <header className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-brand-600 sm:text-2xl">
          Prescrição de exercícios
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Preencha os dados da prescrição do participante.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <Input
          id="participante-prescricao-exercicio"
          label="Nome do participante"
          size="compact"
          leftIcon={<FiUser className="size-4 text-text-muted" />}
          value={form.nomeParticipante}
          readOnly
          className="cursor-default"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="data-inicio-prescricao-exercicio"
            label="Data de início"
            size="compact"
            type="date"
            value={form.dataInicio}
            onChange={(e) => onChangeCampo('dataInicio', e.target.value)}
            required
          />
          <Input
            id="data-fim-prescricao-exercicio"
            label="Data de término (opcional)"
            size="compact"
            type="date"
            value={form.dataFim}
            onChange={(e) => onChangeCampo('dataFim', e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="observacao-prescricao-exercicio"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Observação geral (opcional)
          </label>
          <textarea
            id="observacao-prescricao-exercicio"
            rows={3}
            value={form.observacao}
            onChange={(e) => onChangeCampo('observacao', e.target.value)}
            placeholder="Orientações gerais da prescrição"
            className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="mt-2 flex flex-col gap-4">
          {form.exercicios.map((exercicio, index) => (
            <ItemExercicioForm
              key={exercicio.id}
              exercicio={exercicio}
              index={index}
              podeRemover={form.exercicios.length > 1}
              onChange={onChangeExercicio}
              onRemover={onRemoverExercicio}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onAdicionarExercicio}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-400 py-3 text-sm font-semibold text-brand-500 transition hover:bg-brand-50"
        >
          <FiPlus className="size-4" aria-hidden />
          Adicionar exercício
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
        <Button type="submit" disabled={salvando} className="sm:min-w-48">
          {salvando ? 'Salvando...' : 'Salvar prescrição'}
        </Button>
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          className="py-2 text-sm font-semibold text-brand-500 transition hover:text-brand-600 disabled:opacity-50 sm:px-4"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
