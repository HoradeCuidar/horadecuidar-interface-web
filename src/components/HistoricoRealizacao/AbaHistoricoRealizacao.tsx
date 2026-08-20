import { useCallback, useEffect, useState } from 'react'
import { EmptyState, Skeleton } from '@/components'
import { realizacaoFuncionalService } from '@/services'
import type { RegistroRealizacaoFuncional } from '@/services/realizacaoFuncional.types'
import type { SpringPage } from '@/services/orientacaoFuncional.types'
import { CardRealizacao } from './CardRealizacao'

type AbaHistoricoRealizacaoProps = {
  pacienteId: number
}

export function AbaHistoricoRealizacao({
  pacienteId,
}: AbaHistoricoRealizacaoProps) {
  const [page, setPage] = useState(0)
  const [data, setData] =
    useState<SpringPage<RegistroRealizacaoFuncional> | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      setData(await realizacaoFuncionalService.historico(pacienteId, page))
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar histórico de realizações.'
      )
    } finally {
      setLoading(false)
    }
  }, [pacienteId, page])

  useEffect(() => {
    void carregar()
  }, [carregar])

  if (loading && !data && !erro) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-sm text-red-600">{erro}</p>
        <button
          type="button"
          onClick={() => void carregar()}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!data || data.empty) {
    return (
      <EmptyState
        title="Nenhuma realização registrada!"
        description="Quando o participante registrar exercícios no app, o histórico aparece aqui."
        className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-card"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-text-muted">
        Histórico de realizações
      </p>

      <div className="flex flex-col gap-3">
        {data.content.map((item) => (
          <CardRealizacao key={item.id} item={item} />
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={data.first || loading}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm text-text-muted">
            Página {data.number + 1} de {data.totalPages}
          </span>
          <button
            type="button"
            disabled={data.last || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
