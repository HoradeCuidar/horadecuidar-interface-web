import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-7" aria-label="Carregando dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-22 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-[34rem] rounded-2xl" />
        <Skeleton className="h-[34rem] rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  )
}

export function DashboardError({
  mensagem,
  onRetry,
}: {
  mensagem: string | null
  onRetry: () => void
}) {
  return (
    <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 text-center shadow-sm">
      <TriangleAlert className="size-10 text-red-500" aria-hidden />
      <h2 className="mt-4 font-heading text-lg font-semibold text-text">
        Não foi possível carregar o dashboard
      </h2>
      <p className="mt-2 max-w-lg text-sm text-text-muted">{mensagem}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        <RefreshCw className="size-4" aria-hidden />
        Tentar novamente
      </button>
    </section>
  )
}
