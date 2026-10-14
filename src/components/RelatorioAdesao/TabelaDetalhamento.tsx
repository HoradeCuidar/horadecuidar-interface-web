import { FiInbox } from 'react-icons/fi'
import type {
  PageDetalhamentoMedicamento,
  PageDetalhamentoNutricional,
} from '@/services'
import {
  formatarDataBr,
  formatarPercentual,
  labelTipoOcorrencia,
  nivelAdesao,
} from './relatorioAdesao.utils'

type TabelaDetalhamentoProps = {
  pagina: PageDetalhamentoMedicamento | PageDetalhamentoNutricional
  carregando?: boolean
  onPaginaAnterior: () => void
  onPaginaProxima: () => void
  dominio?: 'medicamentos' | 'nutricional'
}

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

const TOM_BADGE = {
  sucesso: 'bg-success/15 text-success-700',
  alerta: 'bg-orange-100 text-orange-700',
  critico: 'bg-red-100 text-red-700',
  neutro: 'bg-surface-0 text-text-muted',
} as const

export function TabelaDetalhamento({
  pagina,
  carregando = false,
  onPaginaAnterior,
  onPaginaProxima,
  dominio = 'medicamentos',
}: TabelaDetalhamentoProps) {
  const linhas = pagina.content ?? []
  const nutricional = dominio === 'nutricional'

  return (
    <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-base font-semibold text-text">
        {nutricional
          ? 'Detalhamento diário das refeições'
          : 'Detalhamento diário das tomadas'}
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        {nutricional
          ? 'Contagens de adesão às refeições prescritas por dia.'
          : 'Contagens de adesão por dia no período selecionado.'}
      </p>

      {linhas.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-xl bg-surface-0 px-4 py-10 text-center">
          <FiInbox className="size-8 text-text-muted" aria-hidden />
          <p className="text-sm font-medium text-text">
            Sem ocorrências no período
          </p>
          <p className="max-w-sm text-xs text-text-muted">
            {nutricional
              ? 'Não há registros de refeições para detalhar neste intervalo.'
              : 'Não há registros de tomadas para detalhar neste intervalo.'}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-3 py-2 font-semibold">Data</th>
                  <th className="px-3 py-2 font-semibold">Tipo</th>
                  <th className="px-3 py-2 font-semibold text-right">Esperado</th>
                  <th className="px-3 py-2 font-semibold text-right">
                    Realizado
                  </th>
                  <th className="px-3 py-2 font-semibold text-right">
                    Não realizado
                  </th>
                  <th className="px-3 py-2 font-semibold text-right">
                    Sem registro
                  </th>
                  <th className="px-3 py-2 font-semibold text-right">Adesão</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha) => {
                  const nivel = nivelAdesao(linha.percentualAdesao)
                  return (
                    <tr
                      key={`${linha.data}-${linha.tipo}`}
                      className="border-b border-surface-100 last:border-0"
                    >
                      <td className="px-3 py-3 font-medium text-text">
                        {formatarDataBr(linha.data)}
                      </td>
                      <td className="px-3 py-3 text-text-muted">
                        {labelTipoOcorrencia(linha.tipo)}
                      </td>
                      <td className="px-3 py-3 text-right text-text">
                        {linha.esperado}
                      </td>
                      <td className="px-3 py-3 text-right text-text">
                        {linha.realizado}
                      </td>
                      <td className="px-3 py-3 text-right text-text">
                        {linha.naoRealizado}
                      </td>
                      <td className="px-3 py-3 text-right text-text">
                        {linha.semRegistro}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TOM_BADGE[nivel.tom]}`}
                        >
                          {formatarPercentual(linha.percentualAdesao)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {pagina.totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={pagina.first || carregando}
                onClick={onPaginaAnterior}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 ${focoBotao}`}
              >
                Anterior
              </button>
              <span className="text-sm text-text-muted">
                Página {pagina.number + 1} de {pagina.totalPages}
              </span>
              <button
                type="button"
                disabled={pagina.last || carregando}
                onClick={onPaginaProxima}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 ${focoBotao}`}
              >
                Próxima
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
