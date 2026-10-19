import { createElement } from 'react'
import { LinhaAlimentoLeitura } from './LinhaAlimentoLeitura'
import { iconeRefeicaoPorNome } from './prescricaoNutricional.listagem.utils'
import type { RefeicaoResponse } from '@/services/prescricaoNutricional.types'

type CardRefeicaoLeituraProps = {
  refeicao: RefeicaoResponse
}

export function CardRefeicaoLeitura({ refeicao }: CardRefeicaoLeituraProps) {
  const opcoes = [...(refeicao.opcoes ?? [])].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
  )
  const qtdOpcoes = opcoes.length

  return (
    <section className="rounded-xl border border-surface-100 bg-surface-0/80 px-3.5 py-3.5 sm:px-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            {createElement(iconeRefeicaoPorNome(refeicao.nome), { className: 'size-4', 'aria-hidden': true })}
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-text">
              {refeicao.nome}
            </h3>
            {refeicao.observacoes?.trim() ? (
              <p className="mt-0.5 text-xs text-text-muted">
                {refeicao.observacoes}
              </p>
            ) : null}
          </div>
        </div>
        {qtdOpcoes > 0 ? (
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-text-muted ring-1 ring-surface-100">
            {qtdOpcoes} {qtdOpcoes === 1 ? 'opção' : 'opções'}
          </span>
        ) : null}
      </header>

      {opcoes.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">Nenhuma opção cadastrada.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2.5">
          {opcoes.map((opcao, indexOpcao) => (
            <li
              key={`${opcao.ordem}-${indexOpcao}`}
              className="rounded-xl border border-surface-100 bg-white px-3 py-3 sm:px-3.5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                Opção {opcao.ordem}
                {opcao.descricao?.trim() ? ` — ${opcao.descricao}` : ''}
              </p>
              {(opcao.alimentos ?? []).length === 0 ? (
                <p className="mt-2 text-sm text-text-muted">
                  Sem alimentos nesta opção.
                </p>
              ) : (
                <ul className="mt-1">
                  {(opcao.alimentos ?? []).map((alimento, indexAlimento) => (
                    <LinhaAlimentoLeitura
                      key={
                        alimento.id ??
                        `${alimento.descricao}-${indexAlimento}`
                      }
                      alimento={alimento}
                    />
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
