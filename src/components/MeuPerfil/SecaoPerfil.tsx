type SecaoPerfilProps = {
  titulo: string
  subtitulo?: string
  icone?: React.ReactNode
  badge?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SecaoPerfil({
  titulo,
  subtitulo,
  icone,
  badge,
  children,
  className = '',
}: SecaoPerfilProps) {
  return (
    <section
      className={`rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icone ? (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              {icone}
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-semibold text-text sm:text-base">
              {titulo}
            </h3>
            {subtitulo ? (
              <p className="mt-0.5 text-xs text-text-muted">{subtitulo}</p>
            ) : null}
          </div>
        </div>
        {badge}
      </div>
      {children}
    </section>
  )
}
