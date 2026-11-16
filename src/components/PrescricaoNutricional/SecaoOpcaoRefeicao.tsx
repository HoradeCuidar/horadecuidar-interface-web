import { useState } from 'react'
import { FiChevronDown, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Input } from '@/components'
import {
  BOTAO_REMOVER,
  BOTAO_TRACEJADO,
} from './formularioNutricional.styles'
import { ItemAlimento } from './ItemAlimento'
import type { AlimentoForm, SubstituicaoForm, OpcaoRefeicaoForm } from './prescricaoNutricional.types'
import type { ErrosPrescricaoNutricional } from '@/services/prescricaoNutricional.mappers'

type SecaoOpcaoRefeicaoProps = {
  opcao: OpcaoRefeicaoForm
  indice: number
  podeRemover: boolean
  erros?: ErrosPrescricaoNutricional
  onChangeOpcao: (
    opcaoId: string,
    campo: keyof Omit<OpcaoRefeicaoForm, 'id' | 'alimentos'>,
    valor: string
  ) => void
  onChangeAlimento: (
    opcaoId: string,
    alimentoId: string,
    campo: keyof AlimentoForm,
    valor: string | SubstituicaoForm[]
  ) => void
  onAdicionarAlimento: (opcaoId: string) => void
  onRemoverAlimento: (opcaoId: string, alimentoId: string) => void
  onRemoverOpcao: (opcaoId: string) => void
}

export function SecaoOpcaoRefeicao({
  opcao,
  indice,
  podeRemover,
  erros = {},
  onChangeOpcao,
  onChangeAlimento,
  onAdicionarAlimento,
  onRemoverAlimento,
  onRemoverOpcao,
}: SecaoOpcaoRefeicaoProps) {
  const [aberta, setAberta] = useState(true)
  const qtdAlimentos = opcao.alimentos.length
  const titulo =
    opcao.descricao.trim() || `Opção ${indice + 1}`
  const ids = [opcao.id, ...opcao.alimentos.flatMap((alimento) => [alimento.id, ...alimento.substituicoes.map((sub) => sub.id)])]
  const temErro = Object.keys(erros).some((chave) => ids.some((id) => chave.startsWith(`${id}.`)))
  const expandida = aberta || temErro

  return (
    <div className="rounded-xl border border-surface-100 bg-white p-3.5 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <button type="button" aria-expanded={expandida} disabled={temErro} title={temErro ? 'Corrija os campos destacados para recolher esta opção.' : undefined} onClick={() => setAberta(!aberta)} className="flex items-center gap-2 text-left disabled:cursor-default">
          <FiChevronDown className={`size-4 shrink-0 text-brand-700 transition-transform ${expandida ? '' : '-rotate-90'}`} aria-hidden />
          <span>
          <span className="block text-sm font-semibold text-text">{titulo}</span>
          <span className="block text-[11px] font-medium text-text-muted">
            {qtdAlimentos}{' '}
            {qtdAlimentos === 1 ? 'alimento prescrito' : 'alimentos prescritos'}
          </span>
          </span>
        </button>
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

      {expandida ? <>
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          id={`opcao-${opcao.id}-ordem`}
          label="Ordem"
          error={erros[`${opcao.id}.ordem`]}
          size="compact"
          inputMode="numeric"
          value={opcao.ordem}
          onChange={(e) => onChangeOpcao(opcao.id, 'ordem', e.target.value)}
        />
        <Input
          id={`opcao-${opcao.id}-descricao`}
          label="Descrição da opção"
          size="compact"
          value={opcao.descricao}
          onChange={(e) => onChangeOpcao(opcao.id, 'descricao', e.target.value)}
          placeholder="Ex.: Opção A"
        />
      </div>

      <Input
        id={`opcao-${opcao.id}-preparo`}
        label="Orientações de preparo"
        size="compact"
        value={opcao.orientacoesPreparo}
        onChange={(e) => onChangeOpcao(opcao.id, 'orientacoesPreparo', e.target.value)}
        placeholder="Opcional"
      />

      <div className="mt-3 flex flex-col gap-2.5">
        {opcao.alimentos.map((alimento, i) => (
          <ItemAlimento
            key={alimento.id}
            alimento={alimento}
            indice={i}
            podeRemover={opcao.alimentos.length > 1}
            erros={erros}
            onChange={(alimentoId, campo, valor) =>
              onChangeAlimento(opcao.id, alimentoId, campo, valor)
            }
            onRemover={(alimentoId) => onRemoverAlimento(opcao.id, alimentoId)}
          />
        ))}
      </div>
      {erros[`${opcao.id}.alimentos`] ? <p role="alert" className="mt-2 text-sm text-error-500">{erros[`${opcao.id}.alimentos`]}</p> : null}

      <button
        type="button"
        onClick={() => onAdicionarAlimento(opcao.id)}
        className={`mt-3 ${BOTAO_TRACEJADO}`}
      >
        <FiPlus className="size-4" aria-hidden />
        Adicionar alimento
      </button>
      </> : null}
    </div>
  )
}
