type CampoDadoProps = {
  label: string
  valor: string
  dica?: string
  className?: string
  destaque?: boolean
}

export function CampoDado({
  label,
  valor,
  dica,
  className = '',
  destaque = false,
}: CampoDadoProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl px-3.5 py-3 ${
        destaque
          ? 'border border-success/20 bg-success/5'
          : 'bg-surface-0'
      } ${className}`}
    >
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="text-sm font-semibold break-words text-text">{valor}</dd>
      {dica ? <p className="text-[11px] text-text-muted">{dica}</p> : null}
    </div>
  )
}
