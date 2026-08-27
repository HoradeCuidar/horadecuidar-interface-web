import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { Input } from '@/components'
import { SecaoOpcaoRefeicao } from './SecaoOpcaoRefeicao'
import type {
  AlimentoForm,
  OpcaoRefeicaoForm,
  RefeicaoForm,
} from './prescricaoNutricional.types'

type SecaoRefeicaoProps = {
  refeicao: RefeicaoForm
  indice: number
  podeRemover: boolean
  onChangeRefeicao: (
    refeicaoId: string,
    campo: keyof Omit<RefeicaoForm, 'id' | 'opcoes'>,
    valor: string
  ) => void
  onChangeOpcao: (
    refeicaoId: string,
    opcaoId: string,
    campo: keyof Omit<OpcaoRefeicaoForm, 'id' | 'alimentos'>,
    valor: string
  ) => void
  onChangeAlimento: (
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string,
    campo: keyof AlimentoForm,
    valor: string
  ) => void
  onAdicionarOpcao: (refeicaoId: string) => void
  onRemoverOpcao: (refeicaoId: string, opcaoId: string) => void
  onAdicionarAlimento: (refeicaoId: string, opcaoId: string) => void
  onRemoverAlimento: (
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string
  ) => void
  onRemoverRefeicao: (refeicaoId: string) => void
}

export function SecaoRefeicao({
  refeicao,
  indice,
  podeRemover,
  onChangeRefeicao,
  onChangeOpcao,
  onChangeAlimento,
  onAdicionarOpcao,
  onRemoverOpcao,
  onAdicionarAlimento,
  onRemoverAlimento,
  onRemoverRefeicao,
}: SecaoRefeicaoProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-bold text-text">
          Refeição {indice + 1}
        </h3>
        {podeRemover && (
          <button
            type="button"
            onClick={() => onRemoverRefeicao(refeicao.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-error transition hover:underline"
          >
            <FiTrash2 className="size-4" aria-hidden />
            Remover refeição
          </button>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Nome da refeição"
          size="compact"
          value={refeicao.nome}
          onChange={(e) => onChangeRefeicao(refeicao.id, 'nome', e.target.value)}
          placeholder="Ex: Café da manhã"
        />
        <Input
          label="Ordem"
          size="compact"
          inputMode="numeric"
          value={refeicao.ordem}
          onChange={(e) => onChangeRefeicao(refeicao.id, 'ordem', e.target.value)}
        />
        <div className="sm:col-span-2">
          <label
            htmlFor={`obs-refeicao-${refeicao.id}`}
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Observações da refeição
          </label>
          <textarea
            id={`obs-refeicao-${refeicao.id}`}
            rows={2}
            value={refeicao.observacoes}
            onChange={(e) =>
              onChangeRefeicao(refeicao.id, 'observacoes', e.target.value)
            }
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {refeicao.opcoes.map((opcao, i) => (
          <SecaoOpcaoRefeicao
            key={opcao.id}
            opcao={opcao}
            indice={i}
            podeRemover={refeicao.opcoes.length > 1}
            onChangeOpcao={(opcaoId, campo, valor) =>
              onChangeOpcao(refeicao.id, opcaoId, campo, valor)
            }
            onChangeAlimento={(opcaoId, alimentoId, campo, valor) =>
              onChangeAlimento(refeicao.id, opcaoId, alimentoId, campo, valor)
            }
            onAdicionarAlimento={(opcaoId) =>
              onAdicionarAlimento(refeicao.id, opcaoId)
            }
            onRemoverAlimento={(opcaoId, alimentoId) =>
              onRemoverAlimento(refeicao.id, opcaoId, alimentoId)
            }
            onRemoverOpcao={(opcaoId) => onRemoverOpcao(refeicao.id, opcaoId)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAdicionarOpcao(refeicao.id)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-400 bg-transparent py-2.5 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 sm:w-auto sm:px-4"
      >
        <FiPlus className="size-4" aria-hidden />
        Adicionar opção
      </button>
    </section>
  )
}
