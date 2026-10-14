import { Skeleton } from '@/components'
import { useCalendarioOrientacao7Dias } from '@/hooks/useCalendarioOrientacao7Dias'
import { CalendarioSemana } from './CalendarioSemana'

export function CalendarioOrientacaoPainel({
  pacienteId,
  enabled = true,
  titulo = 'Histórico de realizações (últimos 7 dias)',
}: {
  pacienteId: number
  enabled?: boolean
  titulo?: string
}) {
  const { dias, chips, carregando, erro, recarregar } =
    useCalendarioOrientacao7Dias(pacienteId, enabled)

  if (!enabled) return null

  if (carregando) {
    return <Skeleton className="h-44 w-full rounded-2xl" />
  }

  if (erro) {
    return (
      <div className="rounded-2xl border border-surface-100 bg-white px-4 py-6 text-center shadow-sm">
        <p className="text-sm text-error-500" role="alert">
          {erro}
        </p>
        <button
          type="button"
          onClick={() => void recarregar()}
          className="mt-2 text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <CalendarioSemana
      dias={dias}
      chips={chips}
      titulo={titulo}
      ariaLabel="Calendário semanal de orientações funcionais"
    />
  )
}
