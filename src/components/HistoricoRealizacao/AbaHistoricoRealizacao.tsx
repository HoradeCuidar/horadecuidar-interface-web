import { useCallback, useEffect, useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import { Skeleton } from '@/components'
import {
  CalendarioOrientacaoPainel,
  CalendarioSemana,
  chipsPadraoRealizacao,
  montarCalendarioDeRealizacoes,
} from '@/components/CalendarioSemana'
import { realizacaoFuncionalService } from '@/services'
import type { RegistroRealizacaoFuncional } from '@/services/realizacaoFuncional.types'
import type { SpringPage } from '@/services/orientacaoFuncional.types'
import { CardRealizacao } from './CardRealizacao'
import { REALIZACOES_MOCK } from './realizacao.mock'

type AbaHistoricoRealizacaoProps = {
  pacienteId: number
}

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

export function AbaHistoricoRealizacao({
  pacienteId,
}: AbaHistoricoRealizacaoProps) {
  const [page, setPage] = useState(0)
  const [data, setData] =
    useState<SpringPage<RegistroRealizacaoFuncional> | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarMock, setMostrarMock] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const pagina = await realizacaoFuncionalService.historico(pacienteId, page)
      setData(pagina)
      setMostrarMock(pagina.empty)
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar histórico de realizações.'
      )
      setMostrarMock(true)
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
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    )
  }

  if (erro && !mostrarMock) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-sm text-error-500" role="alert">
          {erro}
        </p>
        <button
          type="button"
          onClick={() => void carregar()}
          className={`text-sm font-medium text-brand-700 hover:text-brand-800 ${focoBotao}`}
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const itens = mostrarMock ? REALIZACOES_MOCK : (data?.content ?? [])
  const diasMock = mostrarMock ? montarCalendarioDeRealizacoes(itens) : []
  const chipsMock = mostrarMock ? chipsPadraoRealizacao(diasMock) : []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-text">
            Realizações
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Histórico do que o participante registrou no app
          </p>
        </div>
        {!mostrarMock && data ? (
          <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
            {data.totalElements}{' '}
            {data.totalElements === 1 ? 'registro' : 'registros'}
          </span>
        ) : null}
      </div>

      {mostrarMock ? (
        <div
          className="flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800"
          role="status"
        >
          <FiInfo className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Prévia visual com dados de exemplo</p>
            <p className="mt-0.5 text-xs text-brand-700/90">
              Calendário de 7 dias + lista detalhada, no mesmo formato do que o
              mobile envia (orientação, status, duração, sensação e observação).
            </p>
          </div>
        </div>
      ) : null}

      {mostrarMock ? (
        <CalendarioSemana
          dias={diasMock}
          chips={chipsMock}
          titulo="Histórico de atividades (últimos 7 dias)"
          ariaLabel="Calendário semanal de realizações"
        />
      ) : (
        <CalendarioOrientacaoPainel pacienteId={pacienteId} />
      )}

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold text-text">
          Detalhamento das sessões
        </h3>
        <div className="flex flex-col gap-3">
          {itens.map((item) => (
            <CardRealizacao key={item.id} item={item} />
          ))}
        </div>
      </div>

      {!mostrarMock && data && data.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            disabled={data.first || loading}
            onClick={() => setPage((p) => p - 1)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 ${focoBotao}`}
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
            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 ${focoBotao}`}
          >
            Próxima
          </button>
        </div>
      ) : null}
    </div>
  )
}
