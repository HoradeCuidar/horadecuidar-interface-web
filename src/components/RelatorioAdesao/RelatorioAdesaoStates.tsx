import { Skeleton } from '@/components'

export function RelatorioAdesaoSkeleton() {
  return (
    <div className="space-y-5" aria-label="Carregando relatório">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-22 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  )
}

export function RelatorioAdesaoErro({
  mensagem,
  onRetry,
}: {
  mensagem: string | null
  onRetry: () => void
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-sm font-medium text-red-600">
        Não foi possível carregar o relatório
      </p>
      <p className="mt-2 text-sm text-text-muted">
        {mensagem ?? 'Tente novamente em instantes.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 text-sm font-semibold text-brand-600 hover:underline"
      >
        Tentar novamente
      </button>
    </div>
  )
}
