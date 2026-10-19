import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

export function PaginacaoDashboard({
  pagina,
  totalPaginas,
  onChange,
}: {
  pagina: number
  totalPaginas: number
  onChange: (pagina: number) => void
}) {
  if (totalPaginas <= 1) return null

  return (
    <nav className="flex items-center justify-end gap-1" aria-label="Paginação">
      <button
        type="button"
        className={`flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-40 ${focoBotao}`}
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      <span className="min-w-6 text-center text-sm font-medium text-text">
        {pagina}
      </span>
      <button
        type="button"
        className={`flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-40 ${focoBotao}`}
        disabled={pagina === totalPaginas}
        onClick={() => onChange(pagina + 1)}
        aria-label="Próxima página"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  )
}

export function EstadoVazioDashboard({
  texto,
  detalhe,
  destaque,
}: {
  texto: string
  detalhe?: string
  destaque?: string
}) {
  return (
    <div
      className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-surface-100 bg-surface-0 px-6 text-center"
      role="status"
    >
      {destaque ? (
        <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success-700">
          {destaque}
        </span>
      ) : null}
      {destaque ? (
        <CheckCircle2 className="size-10 text-success" aria-hidden />
      ) : null}
      <p className="text-sm font-medium text-text">{texto}</p>
      {detalhe ? (
        <p className="max-w-sm text-xs text-text-muted">{detalhe}</p>
      ) : null}
    </div>
  )
}

export function BadgePainel({
  children,
  tom = 'brand',
}: {
  children: React.ReactNode
  tom?: 'brand' | 'sucesso' | 'alerta' | 'risco'
}) {
  const tons = {
    brand: 'bg-brand-100 text-brand-700',
    sucesso: 'bg-success/15 text-success-700',
    alerta: 'bg-orange-100 text-orange-700',
    risco: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tons[tom]}`}
    >
      {children}
    </span>
  )
}
