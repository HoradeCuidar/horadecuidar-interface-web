import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { Input } from '@/components'
import {
  BOTAO_REMOVER,
  BOTAO_TRACEJADO,
} from './formularioNutricional.styles'
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
  const qtdAlimentos = opcao.alimentos.length
  const titulo =
    opcao.descricao.trim() || `Opção ${indice + 1}`

  return (
    <div className="rounded-xl border border-surface-100 bg-white p-3.5 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-text">{titulo}</p>
          <p className="text-[11px] font-medium text-text-muted">
            {qtdAlimentos}{' '}
            {qtdAlimentos === 1 ? 'alimento prescrito' : 'alimentos prescritos'}
          </p>
        </div>
        {podeRemover ? (
          <button
            type="button"
            onClick={() => onRemoverOpcao(opcao.id)}
            className={BOTAO_REMOVER}
          >
            <FiTrash2 className="size-3.5" aria-hidden />
            Remover opção
          </button>
        ) : null}
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
          placeholder="Ex.: Opção A"
        />
      </div>

      <div className="flex flex-col gap-2.5">
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
        className={`mt-3 ${BOTAO_TRACEJADO}`}
      >
        <FiPlus className="size-4" aria-hidden />
        Adicionar alimento
      </button>
    </div>
  )
}
