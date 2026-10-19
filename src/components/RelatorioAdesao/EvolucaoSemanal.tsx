import type {
  EvolucaoAdesaoMedicamento,
  EvolucaoAdesaoNutricional,
} from '@/services'
import {
  formatarDataBr,
  formatarPercentual,
  limitarPercentual,
  nivelAdesao,
} from './relatorioAdesao.utils'

type EvolucaoSemanalProps = {
  dados: EvolucaoAdesaoMedicamento | EvolucaoAdesaoNutricional
  dominio?: 'medicamentos' | 'nutricional'
}

const TOM_BARRA = {
  sucesso: 'bg-success',
  alerta: 'bg-orange-400',
  critico: 'bg-red-500',
  neutro: 'bg-brand-500',
} as const

export function EvolucaoSemanal({
  dados,
  dominio = 'medicamentos',
}: EvolucaoSemanalProps) {
  const periodos = dados.periodos ?? []
  const maxPercentual = Math.max(
    1,
    ...periodos.map((p) => limitarPercentual(p.percentualAdesao))
  )
  const nutricional = dominio === 'nutricional'

  return (
    <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-base font-semibold text-text">
        {nutricional
          ? 'Evolução semanal das refeições'
          : 'Evolução semanal'}
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
            const nivel = nivelAdesao(periodo.percentualAdesao)
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
                  <p className="text-sm font-semibold text-brand-700">
                    {formatarPercentual(periodo.percentualAdesao)}
                  </p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-0">
                  <div
                    className={`h-full rounded-full transition-all ${TOM_BARRA[nivel.tom]}`}
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
