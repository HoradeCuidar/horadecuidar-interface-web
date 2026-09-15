import { useEffect, useState } from 'react'
import { FiArrowRight, FiChevronDown, FiEdit2, FiXCircle } from 'react-icons/fi'
import { BiCapsule } from 'react-icons/bi'
import {
  detalhesMedicamento,
  formatarPeriodoPrescricao,
  type PrescricaoListagem,
} from './prescricaoListagem.types'
import {
  prescricaoMedicamentoService,
  type RelatorioAdesaoPrescricao,
} from '@/services/prescricaoMedicamento'
import { formatarPercentual } from '@/components/RelatorioAdesao/relatorioAdesao.utils'

type CardPrescricaoProps = {
  pacienteId: number
  prescricao: PrescricaoListagem
  expandida: boolean
  onToggle: () => void
  onEditar?: () => void
  onEncerrar?: () => void
}

export function CardPrescricao({
  pacienteId,
  prescricao,
  expandida,
  onToggle,
  onEditar,
  onEncerrar,
}: CardPrescricaoProps) {
  const isAtiva = prescricao.status === 'ativa'
  const periodo = formatarPeriodoPrescricao(
    prescricao.dataInicio,
    prescricao.dataTermino
  )

  const [relatorio, setRelatorio] = useState<RelatorioAdesaoPrescricao | null>(
    null
  )
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false)
  const [erroRelatorio, setErroRelatorio] = useState<string | null>(null)

  useEffect(() => {
    if (!expandida) return

    let cancelado = false
    setCarregandoRelatorio(true)
    setErroRelatorio(null)

    void prescricaoMedicamentoService
      .relatorioAdesao(pacienteId, prescricao.id)
      .then((dados) => {
        if (!cancelado) setRelatorio(dados)
      })
      .catch((error) => {
        if (!cancelado) {
          setRelatorio(null)
          setErroRelatorio(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar a adesão.'
          )
        }
      })
      .finally(() => {
        if (!cancelado) setCarregandoRelatorio(false)
      })

    return () => {
      cancelado = true
    }
  }, [expandida, pacienteId, prescricao.id])

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
            isAtiva ? 'bg-success-500' : 'bg-error-500'
          }`}
        >
          {isAtiva ? 'Ativa' : 'Encerrada'}
        </span>

        <p className="min-w-0 flex-1 text-xs font-semibold text-text sm:text-sm">
          {periodo}
        </p>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {isAtiva && onEditar && (
            <button
              type="button"
              onClick={onEditar}
              className="rounded-full p-1.5 text-brand-600 transition hover:bg-brand-100 hover:text-brand-700"
              title="Editar"
              aria-label="Editar prescrição"
            >
              <FiEdit2 className="size-4" aria-hidden />
            </button>
          )}
          {isAtiva && onEncerrar && (
            <button
              type="button"
              onClick={onEncerrar}
              className="rounded-full p-1.5 text-error-500 transition hover:bg-error-500/15 hover:text-error-700"
              title="Encerrar prescrição"
              aria-label="Encerrar prescrição"
            >
              <FiXCircle className="size-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full p-1.5 text-text-muted transition hover:bg-surface-100 hover:text-text"
            aria-expanded={expandida}
            aria-label={expandida ? 'Recolher' : 'Expandir'}
          >
            <FiChevronDown
              className={`size-4 transition-transform ${expandida ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {expandida && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-zinc-200 bg-surface-0 px-3 py-3 sm:px-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Adesão desta prescritção
            </p>
            {carregandoRelatorio ? (
              <p className="mt-2 text-sm text-text-muted">Carregando adesão...</p>
            ) : erroRelatorio ? (
              <p className="mt-2 text-sm text-error-500">{erroRelatorio}</p>
            ) : relatorio ? (
              <dl className="mt-2 grid grid-cols-3 gap-2 text-center sm:text-left">
                <div>
                  <dt className="text-[11px] text-text-muted">Esperadas</dt>
                  <dd className="font-heading text-base font-bold text-text">
                    {relatorio.totalDosesEsperadas}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-text-muted">Realizadas</dt>
                  <dd className="font-heading text-base font-bold text-text">
                    {relatorio.dosesRealizadas}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-text-muted">Adesão</dt>
                  <dd className="font-heading text-base font-bold text-brand-600">
                    {formatarPercentual(relatorio.percentualAdesao)}
                  </dd>
                </div>
              </dl>
            ) : null}
          </div>

          <ul className="flex flex-col gap-2.5">
            {prescricao.medicamentos.map((med) => (
              <li
                key={med.id}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-surface-100 px-3 py-3 sm:px-3.5"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <BiCapsule className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold tracking-tight text-text sm:text-base">
                    {med.nome}
                  </p>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-text-muted sm:text-[13px]">
                    {detalhesMedicamento(med)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!expandida && !isAtiva && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          Ver detalhes
          <FiArrowRight className="size-4" aria-hidden />
        </button>
      )}
    </article>
  )
}
