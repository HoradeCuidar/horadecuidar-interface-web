import type {
  RegistroRealizacaoFuncional,
  SensacaoFinal,
  StatusRealizacao,
} from '@/services/realizacaoFuncional.types'

const LABEL_STATUS: Record<StatusRealizacao, string> = {
  REALIZADO: 'Realizado',
  PARCIALMENTE_REALIZADO: 'Parcialmente realizado',
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

export function CardRealizacao({ item }: CardRealizacaoProps) {
  return (
    <article className="rounded-xl border border-zinc-200 border-l-4 border-l-brand-500 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold tracking-tight text-text">
            {item.nomeOrientacao}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {formatarData(item.dataRegistro)}
          </p>
        </div>
        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-medium text-brand-700">
          {LABEL_STATUS[item.status]}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Duração</dt>
          <dd className="font-medium text-text">
            {item.duracaoRealizadaMinutos != null
              ? `${item.duracaoRealizadaMinutos} min`
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Sensação</dt>
          <dd className="font-medium text-text">
            {item.sensacaoFinal
              ? LABEL_SENSACAO[item.sensacaoFinal]
              : '—'}
          </dd>
        </div>
      </dl>

      {item.observacao?.trim() && (
        <p className="mt-3 line-clamp-2 text-xs text-text-muted">
          {item.observacao}
        </p>
      )}
    </article>
  )
}
