import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import type { PrescricaoProximaVencimento } from '@/services'
import { EstadoVazioDashboard, PaginacaoDashboard } from './DashboardShared'
import {
  formatarDataDashboard,
  formatarVencimento,
} from './dashboard.utils'

const ITENS_POR_PAGINA = 4

export function PainelPrescricoes({
  prescricoes,
}: {
  prescricoes: PrescricaoProximaVencimento[]
}) {
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.max(
    1,
    Math.ceil(prescricoes.length / ITENS_POR_PAGINA)
  )
  const prescricoesVisiveis = useMemo(
    () =>
      prescricoes.slice(
        (pagina - 1) * ITENS_POR_PAGINA,
        pagina * ITENS_POR_PAGINA
      ),
    [prescricoes, pagina]
  )

  return (
    <section className="flex min-h-[34rem] flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex min-h-8 items-start justify-between gap-4">
        <h2 className="font-heading text-base font-semibold text-text">
          Prescrições próximas de vencimento
        </h2>
        <PaginacaoDashboard
          pagina={pagina}
          totalPaginas={totalPaginas}
          onChange={setPagina}
        />
      </div>

      <div className="mt-4 flex-1">
        {prescricoesVisiveis.length === 0 ? (
          <EstadoVazioDashboard texto="Nenhuma prescrição próxima do vencimento." />
        ) : (
          <ul className="divide-y divide-zinc-200">
            {prescricoesVisiveis.map((prescricao) => (
              <li
                key={prescricao.prescricaoId}
                className="grid gap-3 py-4 first:pt-1 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                  <FileText className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {prescricao.nomePaciente}
                  </p>
                  <p className="mt-1 text-[11px] text-text-muted">
                    Prescrição de medicamentos · até{' '}
                    {formatarDataDashboard(prescricao.dataFim)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="whitespace-nowrap rounded-full bg-orange-100 px-3 py-2 text-xs font-medium text-orange-600">
                    {formatarVencimento(prescricao.diasRestantes)}
                  </span>
                  <Link
                    to={`/pacientes/${prescricao.pacienteId}/prescricoes/${prescricao.prescricaoId}/editar`}
                    className="whitespace-nowrap text-xs font-medium text-brand-500 transition hover:text-brand-700 hover:underline"
                  >
                    Ver prescrição
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
