import type { PageDetalhamentoMedicamento } from '@/services'
import {
  formatarDataBr,
  formatarPercentual,
  labelTipoOcorrencia,
} from './relatorioAdesao.utils'

type TabelaDetalhamentoProps = {
  pagina: PageDetalhamentoMedicamento
  carregando?: boolean
  onPaginaAnterior: () => void
  onPaginaProxima: () => void
}

export function TabelaDetalhamento({
  pagina,
  carregando = false,
  onPaginaAnterior,
  onPaginaProxima,
}: TabelaDetalhamentoProps) {
  const linhas = pagina.content ?? []

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-base font-semibold text-text">
        Detalhamento diário
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Contagens de adesão por dia no período selecionado.
      </p>

      {linhas.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          Sem ocorrências no período para detalhar.
        </p>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-text-muted">
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
                {linhas.map((linha) => (
                  <tr
                    key={`${linha.data}-${linha.tipo}`}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-3 py-3 text-text">
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
                    <td className="px-3 py-3 text-right font-medium text-brand-600">
                      {formatarPercentual(linha.percentualAdesao)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagina.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={pagina.first || carregando}
                onClick={onPaginaAnterior}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
