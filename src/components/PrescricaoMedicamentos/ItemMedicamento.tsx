import { FiTrash2 } from 'react-icons/fi'
import { Input } from '@/components/ui/InputLogin'
import { Select } from '@/components/ui/Select'
import {
  OPCOES_UNIDADE_DOSAGEM,
  OPCOES_UNIDADE_FREQUENCIA,
  OPCOES_VIA_ADMINISTRACAO,
  type MedicamentoForm,
} from './prescricao.types'

type ItemMedicamentoProps = {
  medicamento: MedicamentoForm
  index: number
  podeRemover: boolean
  onChange: (id: string, campo: keyof MedicamentoForm, valor: string) => void
  onRemover: (id: string) => void
}

export function ItemMedicamento({
  medicamento,
  index,
  podeRemover,
  onChange,
  onRemover,
}: ItemMedicamentoProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-zinc-700">
          Medicamento {index + 1}
        </p>
        {podeRemover && (
          <button
            type="button"
            onClick={() => onRemover(medicamento.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-error transition hover:underline"
          >
            <FiTrash2 className="size-4" aria-hidden />
            Remover
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Nome do medicamento"
          size="compact"
          placeholder="Ex: Losartana Potássica"
          value={medicamento.nome}
          onChange={(e) => onChange(medicamento.id, 'nome', e.target.value)}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_minmax(7.5rem,8.5rem)_1.2fr]">
          <Input
            label="Dosagem"
            size="compact"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 50"
            value={medicamento.dosagem}
            onChange={(e) => onChange(medicamento.id, 'dosagem', e.target.value)}
          />
          <Select
            label="Unid."
            size="compact"
            options={OPCOES_UNIDADE_DOSAGEM}
            value={medicamento.unidadeDosagem}
            onChange={(e) => onChange(medicamento.id, 'unidadeDosagem', e.target.value)}
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <Select
              label="Via de administração"
              size="compact"
              options={OPCOES_VIA_ADMINISTRACAO}
              value={medicamento.viaAdministracao}
              onChange={(e) => onChange(medicamento.id, 'viaAdministracao', e.target.value)}
            />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-left text-sm font-medium text-text">
            Frequência
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              aria-label="Vezes"
              value={medicamento.frequenciaVezes}
              onChange={(e) => onChange(medicamento.id, 'frequenciaVezes', e.target.value)}
              className="h-10 w-14 rounded-lg border-0 bg-surface-100 px-2 text-center text-sm text-text focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <span className="text-sm text-text-muted">vez(es) a cada</span>
            <input
              type="text"
              inputMode="numeric"
              aria-label="Intervalo"
              value={medicamento.frequenciaIntervalo}
              onChange={(e) => onChange(medicamento.id, 'frequenciaIntervalo', e.target.value)}
              className="h-10 w-14 rounded-lg border-0 bg-surface-100 px-2 text-center text-sm text-text focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <select
              aria-label="Unidade de frequência"
              value={medicamento.frequenciaUnidade}
              onChange={(e) => onChange(medicamento.id, 'frequenciaUnidade', e.target.value)}
              className="h-10 min-w-[6.5rem] flex-1 rounded-lg border-0 bg-surface-100 px-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-brand-400 sm:flex-none"
            >
              <option value="">Selecione...</option>
              {OPCOES_UNIDADE_FREQUENCIA.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Observação"
          size="compact"
          placeholder="Ex: Tomar com água em jejum"
          value={medicamento.observacao}
          onChange={(e) => onChange(medicamento.id, 'observacao', e.target.value)}
        />
      </div>
    </div>
  )
}
