import { useState } from 'react'
import {
  FiActivity,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiSmile,
} from 'react-icons/fi'
import type {
  RegistroRealizacaoFuncional,
  SensacaoFinal,
  StatusRealizacao,
} from '@/services/realizacaoFuncional.types'

const LABEL_STATUS: Record<StatusRealizacao, string> = {
  REALIZADO: 'Realizado',
  PARCIALMENTE_REALIZADO: 'Parcialmente realizado',
}

const TOM_STATUS: Record<StatusRealizacao, string> = {
  REALIZADO: 'bg-success/15 text-success-700',
  PARCIALMENTE_REALIZADO: 'bg-orange-100 text-orange-700',
}

const LABEL_SENSACAO: Record<SensacaoFinal, string> = {
  ME_SUPEREI: 'Me superei',
  BEM_FORTE: 'Bem forte',
  DE_BOA: 'De boa',
  ARRASTADO: 'Arrastado',
  QUASE_NAO_DEU: 'Quase não deu',
}

function formatarData(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type CardRealizacaoProps = {
  item: RegistroRealizacaoFuncional
}

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

export function CardRealizacao({ item }: CardRealizacaoProps) {
  const [obsExpandida, setObsExpandida] = useState(false)
  const observacao = item.observacao?.trim() ?? ''
  const observacaoLonga = observacao.length > 110

  return (
    <article className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <FiActivity className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-base font-bold tracking-tight text-text">
              {item.nomeOrientacao}
            </h3>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-text-muted">
              <FiCalendar className="size-3.5 shrink-0" aria-hidden />
              {formatarData(item.dataRegistro)}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${TOM_STATUS[item.status]}`}
        >
          {LABEL_STATUS[item.status]}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-surface-0 px-3.5 py-3">
          <dt className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            <FiClock className="size-3.5" aria-hidden />
            Duração
          </dt>
          <dd className="text-sm font-semibold text-text">
            {item.duracaoRealizadaMinutos != null
              ? `${item.duracaoRealizadaMinutos} min`
              : '—'}
          </dd>
        </div>
        <div className="rounded-xl bg-surface-0 px-3.5 py-3">
          <dt className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            <FiSmile className="size-3.5" aria-hidden />
            Sensação
          </dt>
          <dd className="text-sm font-semibold text-text">
            {item.sensacaoFinal
              ? LABEL_SENSACAO[item.sensacaoFinal]
              : '—'}
          </dd>
        </div>
      </dl>

      {observacao ? (
        <div className="mt-3 rounded-xl bg-surface-0 px-3.5 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Observação
          </p>
          <p
            className={`text-sm leading-relaxed text-text ${
              !obsExpandida && observacaoLonga ? 'line-clamp-2' : ''
            }`}
          >
            {observacao}
          </p>
          {observacaoLonga ? (
            <button
              type="button"
              onClick={() => setObsExpandida((v) => !v)}
              className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 ${focoBotao}`}
            >
              {obsExpandida ? (
                <>
                  Ver menos <FiChevronUp className="size-3.5" aria-hidden />
                </>
              ) : (
                <>
                  Ver mais <FiChevronDown className="size-3.5" aria-hidden />
                </>
              )}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
