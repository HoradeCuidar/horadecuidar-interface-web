import {
  FiActivity,
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiMinus,
  FiX,
} from 'react-icons/fi'
import type { ChipCalendario, DiaCalendario, StatusDiaCalendario } from './calendarioSemana.types'

const ESTILO: Record<
  StatusDiaCalendario,
  { card: string; icone: string; texto: string; label: string }
> = {
  realizado: {
    card: 'border-success/30 bg-success/10',
    icone: 'bg-success text-white',
    texto: 'text-success-700',
    label: 'Concluído',
  },
  parcial: {
    card: 'border-orange-200 bg-orange-50',
    icone: 'bg-orange-500 text-white',
    texto: 'text-orange-700',
    label: 'Parcial',
  },
  nao_realizado: {
    card: 'border-red-200 bg-red-50',
    icone: 'bg-red-500 text-white',
    texto: 'text-red-700',
    label: 'Não realizado',
  },
  sem_registro: {
    card: 'border-surface-100 bg-white',
    icone: 'bg-surface-100 text-text-muted',
    texto: 'text-text-muted',
    label: 'Sem registro',
  },
  hoje_vazio: {
    card: 'border-brand-300 bg-brand-50 ring-2 ring-brand-200',
    icone: 'bg-brand-600 text-white',
    texto: 'text-brand-700',
    label: 'Em andamento',
  },
}

const TOM_CHIP: Record<NonNullable<ChipCalendario['tom']>, string> = {
  sucesso: 'bg-success/15 text-success-700',
  brand: 'bg-brand-100 text-brand-700',
  neutro: 'bg-surface-0 text-text-muted',
  alerta: 'bg-orange-100 text-orange-700',
}

function IconeStatus({ status }: { status: StatusDiaCalendario }) {
  if (status === 'realizado') return <FiCheck className="size-3.5" aria-hidden />
  if (status === 'parcial') return <FiAlertCircle className="size-3.5" aria-hidden />
  if (status === 'nao_realizado') return <FiX className="size-3.5" aria-hidden />
  if (status === 'hoje_vazio') return <FiActivity className="size-3.5" aria-hidden />
  return <FiMinus className="size-3.5" aria-hidden />
}

export function CalendarioSemana({
  dias,
  titulo = 'Histórico dos últimos 7 dias',
  chips = [],
  ariaLabel = 'Calendário semanal',
}: {
  dias: DiaCalendario[]
  titulo?: string
  chips?: ChipCalendario[]
  ariaLabel?: string
}) {
  return (
    <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold text-text">{titulo}</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-0 px-2.5 py-1 text-[11px] font-medium text-text-muted">
          <FiClock className="size-3" aria-hidden />
          Últimos 7 dias
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="list"
        aria-label={ariaLabel}
      >
        {dias.map((dia) => {
          const estilo = ESTILO[dia.status]
          return (
            <article
              key={dia.chave}
              role="listitem"
              className={`flex min-w-[6.5rem] flex-1 flex-col items-center gap-2 rounded-2xl border px-2.5 py-3 ${estilo.card}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
                {dia.rotuloDia}
              </p>
              <p className="text-xs font-semibold text-text">{dia.rotuloData}</p>
              <span
                className={`flex size-8 items-center justify-center rounded-full ${estilo.icone}`}
              >
                <IconeStatus status={dia.status} />
              </span>
              <p className={`text-center text-[10px] font-semibold ${estilo.texto}`}>
                {estilo.label}
              </p>
              <p className="min-h-[1rem] text-center text-[10px] text-text-muted">
                {dia.subtitulo ?? ' '}
              </p>
            </article>
          )
        })}
      </div>

      {chips.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip.rotulo}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                TOM_CHIP[chip.tom ?? 'neutro']
              }`}
            >
              {chip.rotulo}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}
