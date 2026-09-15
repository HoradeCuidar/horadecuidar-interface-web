import type { EvolucaoAdesaoMedicamento } from '@/services'
import {
  formatarDataBr,
  formatarPercentual,
  limitarPercentual,
} from './relatorioAdesao.utils'

export function EvolucaoSemanal({
  dados,
}: {
  dados: EvolucaoAdesaoMedicamento
}) {
  const periodos = dados.periodos ?? []
  const maxPercentual = Math.max(
    1,
    ...periodos.map((p) => limitarPercentual(p.percentualAdesao))
  )

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-base font-semibold text-text">
        Evolução semanal
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Percentual de adesão agrupado por semana no período selecionado.
      </p>

      {periodos.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          Sem ocorrências no período para montar a evolução.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {periodos.map((periodo) => {
            const percentual = limitarPercentual(periodo.percentualAdesao)
            const largura = (percentual / maxPercentual) * 100
            return (
              <li
                key={`${periodo.inicioSemana}-${periodo.fimSemana}`}
                className="space-y-2"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-text">
                    {formatarDataBr(periodo.inicioConsiderado)} –{' '}
                    {formatarDataBr(periodo.fimConsiderado)}
                  </p>
                  <p className="text-sm font-semibold text-brand-600">
                    {formatarPercentual(periodo.percentualAdesao)}
                  </p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${largura}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted">
                  {periodo.realizado}/{periodo.esperado} realizadas ·{' '}
                  {periodo.naoRealizado} não realizadas · {periodo.semRegistro}{' '}
                  sem registro
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
