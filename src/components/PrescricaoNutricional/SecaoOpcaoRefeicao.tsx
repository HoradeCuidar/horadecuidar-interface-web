import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { Input } from '@/components'
import { ItemAlimento } from './ItemAlimento'
import type { AlimentoForm, OpcaoRefeicaoForm } from './prescricaoNutricional.types'

type SecaoOpcaoRefeicaoProps = {
  opcao: OpcaoRefeicaoForm
  indice: number
  podeRemover: boolean
  onChangeOpcao: (
    opcaoId: string,
    campo: keyof Omit<OpcaoRefeicaoForm, 'id' | 'alimentos'>,
    valor: string
  ) => void
  onChangeAlimento: (
    opcaoId: string,
    alimentoId: string,
    campo: keyof AlimentoForm,
    valor: string
  ) => void
  onAdicionarAlimento: (opcaoId: string) => void
  onRemoverAlimento: (opcaoId: string, alimentoId: string) => void
  onRemoverOpcao: (opcaoId: string) => void
}

export function SecaoOpcaoRefeicao({
  opcao,
  indice,
  podeRemover,
  onChangeOpcao,
  onChangeAlimento,
  onAdicionarAlimento,
  onRemoverAlimento,
  onRemoverOpcao,
}: SecaoOpcaoRefeicaoProps) {
  return (
    <div className="rounded-lg border border-brand-100 bg-brand-50/30 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-700">Opção {indice + 1}</p>
        {podeRemover && (
          <button
            type="button"
            onClick={() => onRemoverOpcao(opcao.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-error transition hover:underline"
          >
            <FiTrash2 className="size-4" aria-hidden />
            Remover opção
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Ordem"
          size="compact"
          inputMode="numeric"
          value={opcao.ordem}
          onChange={(e) => onChangeOpcao(opcao.id, 'ordem', e.target.value)}
        />
        <Input
          label="Descrição da opção"
          size="compact"
          value={opcao.descricao}
          onChange={(e) => onChangeOpcao(opcao.id, 'descricao', e.target.value)}
          placeholder="Ex: Opção A"
        />
      </div>

      <div className="flex flex-col gap-2">
        {opcao.alimentos.map((alimento, i) => (
          <ItemAlimento
            key={alimento.id}
            alimento={alimento}
            indice={i}
            podeRemover={opcao.alimentos.length > 1}
            onChange={(alimentoId, campo, valor) =>
              onChangeAlimento(opcao.id, alimentoId, campo, valor)
            }
            onRemover={(alimentoId) => onRemoverAlimento(opcao.id, alimentoId)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAdicionarAlimento(opcao.id)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-400 bg-transparent py-2.5 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 sm:w-auto sm:px-4"
      >
        <FiPlus className="size-4" aria-hidden />
        Adicionar alimento
      </button>
    </div>
  )
}
