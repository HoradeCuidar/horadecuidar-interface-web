import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import type { PacienteBaixaAdesao } from '@/services'
import {
  BadgePainel,
  EstadoVazioDashboard,
  PaginacaoDashboard,
} from './DashboardShared'
import { formatarPercentual, obterIniciais } from './dashboard.utils'

const ITENS_POR_PAGINA = 3
const focoLink =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

export function PainelBaixaAdesao({
  pacientes,
}: {
  pacientes: PacienteBaixaAdesao[]
}) {
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.max(
    1,
    Math.ceil(pacientes.length / ITENS_POR_PAGINA)
  )
  const pacientesVisiveis = useMemo(
    () =>
      pacientes.slice(
        (pagina - 1) * ITENS_POR_PAGINA,
        pagina * ITENS_POR_PAGINA
      ),
    [pacientes, pagina]
  )

  const rotuloBadge =
    pacientes.length === 1
      ? '1 participante'
      : `${pacientes.length} participantes`

  return (
    <section className="flex min-h-[34rem] flex-col rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex min-h-8 items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold text-text">
            Participantes com baixa adesão
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {pacientes.length > 0 ? (
            <BadgePainel tom="risco">{rotuloBadge}</BadgePainel>
          ) : null}
          <PaginacaoDashboard
            pagina={pagina}
            totalPaginas={totalPaginas}
            onChange={setPagina}
          />
        </div>
      </div>

      <div className="mt-4 flex-1">
        {pacientesVisiveis.length === 0 ? (
          <EstadoVazioDashboard texto="Nenhum participante com baixa adesão no momento." />
        ) : (
          <ul className="space-y-3">
            {pacientesVisiveis.map((paciente) => (
              <li
                key={paciente.pacienteId}
                className="grid gap-3 rounded-2xl bg-surface-0 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                  {obterIniciais(paciente.nome)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {paciente.nome}
                  </p>
                  <p className="mt-1 text-[11px] text-text-muted">
                    {paciente.realizado} de {paciente.esperado} registros
                    realizados
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
                    {formatarPercentual(paciente.percentualAdesao)}
                  </span>
                  <Link
                    to={`/pacientes/${paciente.pacienteId}`}
                    className={`whitespace-nowrap rounded-lg border border-brand-700 px-3 py-2 text-xs font-medium text-brand-700 transition hover:bg-brand-50 ${focoLink}`}
                  >
                    Ver participante
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 flex items-center gap-2 text-xs text-text-muted">
        <Info className="size-5 shrink-0" aria-hidden />
        Classificação baseada nos últimos 14 dias concluídos.
      </p>
    </section>
  )
}
