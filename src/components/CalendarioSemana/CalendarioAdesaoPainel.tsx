import { Skeleton } from '@/components'
import { useCalendarioAdesao7Dias } from '@/hooks/useCalendarioAdesao7Dias'
import { CalendarioSemana } from './CalendarioSemana'

type Dominio = 'medicamentos' | 'nutricional'

const TITULOS: Record<Dominio, string> = {
  medicamentos: 'Histórico de tomadas (últimos 7 dias)',
  nutricional: 'Histórico de refeições (últimos 7 dias)',
}

export function CalendarioAdesaoPainel({
  pacienteId,
  dominio,
  titulo,
  enabled = true,
}: {
  pacienteId: number
  dominio: Dominio
  titulo?: string
  enabled?: boolean
}) {
  const { dias, chips, carregando, erro, recarregar } = useCalendarioAdesao7Dias(
    pacienteId,
    dominio,
    enabled
  )

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
      titulo={titulo ?? TITULOS[dominio]}
      ariaLabel={
        dominio === 'medicamentos'
          ? 'Calendário semanal de adesão a medicamentos'
          : 'Calendário semanal de adesão nutricional'
      }
    />
  )
}
