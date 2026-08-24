import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import type { PacienteBaixaAdesao } from '@/services'
import { EstadoVazioDashboard, PaginacaoDashboard } from './DashboardShared'
import { limitarPercentual, obterIniciais } from './dashboard.utils'

const ITENS_POR_PAGINA = 3

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

  return (
    <section className="flex min-h-[34rem] flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex min-h-8 items-start justify-between gap-4">
        <h2 className="font-heading text-base font-semibold text-text">
          Participantes com baixa adesão
        </h2>
        <PaginacaoDashboard
          pagina={pagina}
          totalPaginas={totalPaginas}
          onChange={setPagina}
        />
      </div>

      <div className="mt-4 flex-1">
        {pacientesVisiveis.length === 0 ? (
          <EstadoVazioDashboard texto="Nenhum participante com baixa adesão no momento." />
        ) : (
          <ul className="space-y-3">
            {pacientesVisiveis.map((paciente) => {
              const percentual = limitarPercentual(
                paciente.percentualAdesao
              )
              return (
                <li
                  key={paciente.pacienteId}
                  className="grid gap-3 rounded-2xl bg-surface-0 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-500">
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
                    <span className="text-base font-semibold text-red-500">
                      {percentual.toLocaleString('pt-BR', {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </span>
                    <Link
                      to={`/pacientes/${paciente.pacienteId}`}
                      className="whitespace-nowrap rounded-lg border border-brand-400 px-3 py-2 text-xs font-medium text-brand-500 transition hover:bg-brand-50"
                    >
                      Ver participante
                    </Link>
                  </div>
                </li>
              )
            })}
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
