import { createElement, useState } from 'react'
import { FiChevronDown, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Input } from '@/components'
import {
  BOTAO_REMOVER,
  BOTAO_TRACEJADO,
  TEXTAREA_FORM,
} from './formularioNutricional.styles'
import { iconeRefeicaoPorNome } from './prescricaoNutricional.listagem.utils'
import { SecaoOpcaoRefeicao } from './SecaoOpcaoRefeicao'
import type {
  AlimentoForm,
  SubstituicaoForm,
  OpcaoRefeicaoForm,
  RefeicaoForm,
} from './prescricaoNutricional.types'
import type { ErrosPrescricaoNutricional } from '@/services/prescricaoNutricional.mappers'

type SecaoRefeicaoProps = {
  refeicao: RefeicaoForm
  indice: number
  podeRemover: boolean
  erros?: ErrosPrescricaoNutricional
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
    valor: string | SubstituicaoForm[]
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
  erros = {},
  onChangeRefeicao,
  onChangeOpcao,
  onChangeAlimento,
  onAdicionarOpcao,
  onRemoverOpcao,
  onAdicionarAlimento,
  onRemoverAlimento,
  onRemoverRefeicao,
}: SecaoRefeicaoProps) {
  const [aberta, setAberta] = useState(true)
  const titulo =
    refeicao.nome.trim() || `Refeição ${indice + 1}`
  const qtdOpcoes = refeicao.opcoes.length
  const ids = [refeicao.id, ...refeicao.opcoes.flatMap((opcao) => [opcao.id, ...opcao.alimentos.flatMap((alimento) => [alimento.id, ...alimento.substituicoes.map((sub) => sub.id)])])]
  const temErro = Object.keys(erros).some((chave) => ids.some((id) => chave.startsWith(`${id}.`)))
  const expandida = aberta || temErro

  return (
    <section className="rounded-xl border border-surface-100 bg-surface-0/70 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <button type="button" aria-expanded={expandida} disabled={temErro} title={temErro ? 'Corrija os campos destacados para recolher esta refeição.' : undefined} onClick={() => setAberta(!aberta)} className="flex min-w-0 items-center gap-2.5 text-left disabled:cursor-default">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            {createElement(iconeRefeicaoPorNome(refeicao.nome || 'refeição'), { className: 'size-4', 'aria-hidden': true })}
          </span>
          <FiChevronDown className={`size-4 shrink-0 text-brand-700 transition-transform ${expandida ? '' : '-rotate-90'}`} aria-hidden />
          <span className="min-w-0">
            <span className="block font-heading text-sm font-bold text-text">
              {titulo}
            </span>
            <span className="block text-[11px] font-medium text-text-muted">
              Refeição {indice + 1} · {qtdOpcoes}{' '}
              {qtdOpcoes === 1 ? 'opção' : 'opções'}
            </span>
          </span>
        </button>
        {podeRemover ? (
          <button
            type="button"
            onClick={() => onRemoverRefeicao(refeicao.id)}
            className={BOTAO_REMOVER}
          >
            <FiTrash2 className="size-3.5" aria-hidden />
            Remover
          </button>
        ) : null}
      </div>

      {expandida ? <>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          id={`refeicao-${refeicao.id}-nome`}
          label="Nome da refeição"
          error={erros[`${refeicao.id}.nome`]}
          size="compact"
          value={refeicao.nome}
          onChange={(e) => onChangeRefeicao(refeicao.id, 'nome', e.target.value)}
          placeholder="Ex.: Café da manhã"
        />
        <Input
          id={`refeicao-${refeicao.id}-ordem`}
          label="Ordem"
          error={erros[`${refeicao.id}.ordem`]}
          size="compact"
          inputMode="numeric"
          value={refeicao.ordem}
          onChange={(e) =>
            onChangeRefeicao(refeicao.id, 'ordem', e.target.value)
          }
        />
        <Input id={`refeicao-${refeicao.id}-horario`} label="Horário" type="time" size="compact" value={refeicao.horario} onChange={(e) => onChangeRefeicao(refeicao.id, 'horario', e.target.value)} />
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
            placeholder="Horário, preparo ou restrições desta refeição (opcional)"
            className={TEXTAREA_FORM}
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
            erros={erros}
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
      {erros[`${refeicao.id}.opcoes`] ? <p role="alert" className="mt-2 text-sm text-error-500">{erros[`${refeicao.id}.opcoes`]}</p> : null}

      <button
        type="button"
        onClick={() => onAdicionarOpcao(refeicao.id)}
        className={`mt-4 ${BOTAO_TRACEJADO}`}
      >
        <FiPlus className="size-4" aria-hidden />
        Adicionar opção
      </button>
      </> : null}
    </section>
  )
}
