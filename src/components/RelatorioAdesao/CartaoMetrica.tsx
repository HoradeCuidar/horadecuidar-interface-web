type Tom = 'azul' | 'verde' | 'vermelho' | 'laranja' | 'neutro'

type CartaoMetricaProps = {
  titulo: string
  valor: string
  Icone: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  tom: Tom
  rodape?: string
  badge?: { rotulo: string; tom?: Tom }
}

const ESTILOS_ICONE: Record<Tom, string> = {
  azul: 'bg-brand-100 text-brand-700',
  verde: 'bg-success/15 text-success-700',
  vermelho: 'bg-red-100 text-red-600',
  laranja: 'bg-orange-100 text-orange-600',
  neutro: 'bg-surface-0 text-text-muted',
}

const CORES_VALOR: Record<Tom, string> = {
  azul: 'text-brand-700',
  verde: 'text-success-700',
  vermelho: 'text-red-600',
  laranja: 'text-orange-600',
  neutro: 'text-text',
}

const BADGE: Record<Tom, string> = {
  azul: 'bg-brand-100 text-brand-700',
  verde: 'bg-success/15 text-success-700',
  vermelho: 'bg-red-100 text-red-700',
  laranja: 'bg-orange-100 text-orange-700',
  neutro: 'bg-surface-0 text-text-muted',
}

export function CartaoMetrica({
  titulo,
  valor,
  Icone,
  tom,
  rodape,
  badge,
}: CartaoMetricaProps) {
  return (
    <article className="flex min-h-[5.5rem] flex-col justify-center gap-2 rounded-2xl border border-surface-100 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${ESTILOS_ICONE[tom]}`}
        >
          <Icone className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`font-heading text-2xl font-bold leading-none ${CORES_VALOR[tom]}`}
            >
              {valor}
            </p>
            {badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  BADGE[badge.tom ?? tom]
                }`}
              >
                {badge.rotulo}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-snug text-text-muted">{titulo}</p>
        </div>
      </div>
      {rodape ? (
        <p className="border-t border-surface-100 pt-2 text-[11px] text-text-muted">
          {rodape}
        </p>
      ) : null}
    </article>
  )
}
