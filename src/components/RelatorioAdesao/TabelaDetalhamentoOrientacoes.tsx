import { FiInbox } from 'react-icons/fi'
import type { PageDetalhamentoOrientacao } from '@/services'
import {
  formatarDataBr,
  formatarDuracaoMinutos,
  labelSensacaoFinal,
  labelStatusRealizacao,
} from './relatorioAdesao.utils'

type TabelaDetalhamentoOrientacoesProps = {
  pagina: PageDetalhamentoOrientacao
  carregando?: boolean
  onPaginaAnterior: () => void
  onPaginaProxima: () => void
}

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

function badgeStatus(status: string | null | undefined): string {
  if (status === 'REALIZADO') return 'bg-success/15 text-success-700'
  if (status === 'PARCIALMENTE_REALIZADO')
    return 'bg-orange-100 text-orange-700'
  return 'bg-surface-0 text-text-muted'
}

export function TabelaDetalhamentoOrientacoes({
  pagina,
  carregando = false,
  onPaginaAnterior,
  onPaginaProxima,
}: TabelaDetalhamentoOrientacoesProps) {
  const linhas = pagina.content ?? []

  return (
    <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-heading text-base font-semibold text-text">
            Detalhamento das realizações
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Registros de orientações funcionais no período selecionado.
          </p>
        </div>
        {!pagina.empty ? (
          <span className="rounded-full bg-surface-0 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
            {pagina.totalElements}{' '}
            {pagina.totalElements === 1 ? 'registro' : 'registros'}
          </span>
        ) : null}
      </div>

      {linhas.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-xl bg-surface-0 px-4 py-10 text-center">
          <FiInbox className="size-8 text-text-muted" aria-hidden />
          <p className="text-sm font-medium text-text">
            Nenhuma realização registrada no período
          </p>
          <p className="max-w-md text-xs text-text-muted">
            O participante ainda não confirmou execuções das orientações
            funcionais neste intervalo.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-3 py-2 font-semibold">Data</th>
                  <th className="px-3 py-2 font-semibold">Orientação</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold text-right">Duração</th>
                  <th className="px-3 py-2 font-semibold">Sensação</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha, index) => (
                  <tr
                    key={`${linha.data}-${linha.idOrientacao}-${index}`}
                    className="border-b border-surface-100 last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-text">
                      {formatarDataBr(linha.data)}
                    </td>
                    <td className="px-3 py-3 text-text">
                      {linha.nomeOrientacao || '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStatus(linha.status)}`}
                      >
                        {labelStatusRealizacao(linha.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-text">
                      {formatarDuracaoMinutos(linha.duracao)}
                    </td>
                    <td className="px-3 py-3 text-text-muted">
                      {labelSensacaoFinal(linha.sensacaoFinal)}
                    </td>
                  </tr>
                ))}
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
