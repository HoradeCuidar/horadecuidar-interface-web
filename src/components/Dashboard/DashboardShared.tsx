import { ChevronLeft, ChevronRight } from 'lucide-react'

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
        className="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={pagina === totalPaginas}
        onClick={() => onChange(pagina + 1)}
        aria-label="Próxima página"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  )
}

export function EstadoVazioDashboard({ texto }: { texto: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-surface-0 px-6 text-center text-sm text-text-muted">
      {texto}
    </div>
  )
}
