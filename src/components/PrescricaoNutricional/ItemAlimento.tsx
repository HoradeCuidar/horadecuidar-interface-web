import { FiTrash2 } from 'react-icons/fi'
import { Input, Select } from '@/components'
import { OPCOES_UNIDADE_MEDIDA } from '@/services/prescricaoNutricional.types'
import type { AlimentoForm } from './prescricaoNutricional.types'

type ItemAlimentoProps = {
  alimento: AlimentoForm
  indice: number
  podeRemover: boolean
  onChange: (id: string, campo: keyof AlimentoForm, valor: string) => void
  onRemover: (id: string) => void
}

export function ItemAlimento({
  alimento,
  indice,
  podeRemover,
  onChange,
  onRemover,
}: ItemAlimentoProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-text-muted">
          Alimento {indice + 1}
        </p>
        {podeRemover && (
          <button
            type="button"
            onClick={() => onRemover(alimento.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-error transition hover:underline"
          >
            <FiTrash2 className="size-3.5" aria-hidden />
            Remover
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Descrição"
          size="compact"
          value={alimento.descricao}
          onChange={(e) => onChange(alimento.id, 'descricao', e.target.value)}
          placeholder="Ex: Arroz integral"
        />
        <Input
          label="Quantidade"
          size="compact"
          inputMode="decimal"
          value={alimento.quantidade}
          onChange={(e) => onChange(alimento.id, 'quantidade', e.target.value)}
          placeholder="Ex: 100"
        />
        <Select
          label="Unidade"
          size="compact"
          options={OPCOES_UNIDADE_MEDIDA}
          value={alimento.unidade}
          onChange={(e) => onChange(alimento.id, 'unidade', e.target.value)}
        />
        <Input
          label="Observação"
          size="compact"
          value={alimento.observacao}
          onChange={(e) => onChange(alimento.id, 'observacao', e.target.value)}
          placeholder="Opcional"
        />
      </div>
    </div>
  )
}
