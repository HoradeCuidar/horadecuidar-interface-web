import { FiPlus, FiUser } from 'react-icons/fi'
import { Input, Button } from '@/components'
import { ItemMedicamento } from './ItemMedicamento'
import type { MedicamentoForm, PrescricaoFormData } from './prescricao.types'

type FormularioPrescricaoProps = {
  form: PrescricaoFormData
  onChangeCampo: <K extends keyof Omit<PrescricaoFormData, 'medicamentos'>>(
    campo: K,
    valor: PrescricaoFormData[K]
  ) => void
  onChangeMedicamento: (id: string, campo: keyof MedicamentoForm, valor: string) => void
  onAdicionarMedicamento: () => void
  onRemoverMedicamento: (id: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancelar: () => void
  salvando?: boolean
  titulo?: string
  subtitulo?: string
  labelSalvar?: string
}

export function FormularioPrescricao({
  form,
  onChangeCampo,
  onChangeMedicamento,
  onAdicionarMedicamento,
  onRemoverMedicamento,
  onSubmit,
  onCancelar,
  salvando = false,
  titulo = 'Prescrição de Medicamentos e Suplementação',
  subtitulo = 'Preencha os dados abaixo',
  labelSalvar = 'Salvar Prescrição',
}: FormularioPrescricaoProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-6 md:p-8"
    >
      <div className="mb-5 sm:mb-6">
        <h2 className="font-heading text-lg font-bold text-brand-600 sm:text-xl md:text-2xl">
          {titulo}
        </h2>
        <p className="mt-1 text-xs text-text-muted sm:text-sm">{subtitulo}</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Nome do Participante"
          size="compact"
          leftIcon={<FiUser className="size-4 text-text-muted" />}
          value={form.nomeParticipante}
          readOnly
          className="cursor-default"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Data de Início"
            size="compact"
            type="date"
            value={form.dataInicio}
            onChange={(e) => onChangeCampo('dataInicio', e.target.value)}
            required
          />
          <Input
            label="Data de Término"
            size="compact"
            type="date"
            value={form.dataTermino}
            onChange={(e) => onChangeCampo('dataTermino', e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="observacao-geral"
            className="mb-1.5 block text-left text-sm font-medium text-text"
          >
            Observação Geral
          </label>
          <textarea
            id="observacao-geral"
            rows={3}
            placeholder="Observações gerais da prescrição..."
            value={form.observacaoGeral}
            onChange={(e) => onChangeCampo('observacaoGeral', e.target.value)}
            className="w-full resize-none rounded-lg border-0 bg-surface-100 px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
        </div>

        <div className="mt-2">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700">
            Medicamentos e Suplementos
          </h3>

          <div className="flex flex-col gap-4">
            {form.medicamentos.map((med, index) => (
              <ItemMedicamento
                key={med.id}
                medicamento={med}
                index={index}
                podeRemover={form.medicamentos.length > 1}
                onChange={onChangeMedicamento}
                onRemover={onRemoverMedicamento}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onAdicionarMedicamento}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-400 bg-transparent py-3 text-sm font-semibold text-brand-500 transition hover:bg-brand-50"
          >
            <FiPlus className="size-4" aria-hidden />
            Adicionar Medicamento
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
        <Button type="submit" disabled={salvando} className="sm:min-w-[12rem]">
          {salvando ? 'Salvando...' : labelSalvar}
        </Button>
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          className="py-2 text-center text-sm font-semibold text-brand-500 transition hover:text-brand-600 disabled:opacity-50 sm:px-4"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
