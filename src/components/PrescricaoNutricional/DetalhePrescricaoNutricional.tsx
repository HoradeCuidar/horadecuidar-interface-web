import {
  formatarAlimentoPrescrito,
  type PrescricaoNutricionalResponse,
} from '@/services/prescricaoNutricional.types'

type DetalhePrescricaoNutricionalProps = {
  detalhe: PrescricaoNutricionalResponse
}

export function DetalhePrescricaoNutricional({
  detalhe,
}: DetalhePrescricaoNutricionalProps) {
  const refeicoes = [...(detalhe.refeicoes ?? [])].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
  )

  return (
    <div className="mt-4 space-y-3">
      {detalhe.observacoes ? (
        <p className="rounded-xl border border-zinc-200 bg-surface-0 px-3 py-2 text-sm text-text-muted">
          {detalhe.observacoes}
        </p>
      ) : null}

      {refeicoes.length === 0 ? (
        <p className="text-sm text-text-muted">Nenhuma refeição cadastrada.</p>
      ) : (
        refeicoes.map((refeicao, indexRefeicao) => {
          const opcoes = [...(refeicao.opcoes ?? [])].sort(
            (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
          )
          return (
            <section
              key={`${refeicao.nome}-${refeicao.ordem}-${indexRefeicao}`}
              className="rounded-xl border border-zinc-200 bg-surface-0 px-3 py-3 sm:px-3.5"
            >
              <h3 className="font-heading text-sm font-bold text-text sm:text-base">
                {refeicao.nome}
              </h3>
              {refeicao.observacoes ? (
                <p className="mt-1 text-xs text-text-muted">
                  {refeicao.observacoes}
                </p>
              ) : null}

              <ul className="mt-3 flex flex-col gap-2.5">
                {opcoes.map((opcao, indexOpcao) => (
                  <li
                    key={`${opcao.ordem}-${indexOpcao}`}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Opção {opcao.ordem}
                      {opcao.descricao ? ` — ${opcao.descricao}` : ''}
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {(opcao.alimentos ?? []).map((alimento, indexAlimento) => {
                        const detalheAlimento = formatarAlimentoPrescrito(alimento)
                        return (
                          <li
                            key={alimento.id ?? `${alimento.descricao}-${indexAlimento}`}
                            className="text-sm text-text"
                          >
                            <span className="font-medium">{alimento.descricao}</span>
                            {detalheAlimento ? (
                              <span className="text-text-muted">
                                {' '}
                                · {detalheAlimento}
                              </span>
                            ) : null}
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}
