import { useEffect, useState } from 'react'
import { FiArrowRight, FiCheckCircle, FiChevronDown, FiXCircle } from 'react-icons/fi'
import { MdRestaurant } from 'react-icons/md'
import { DetalhePrescricaoNutricional } from './DetalhePrescricaoNutricional'
import { prescricaoNutricionalService } from '@/services'
import {
  formatarPeriodoNutricional,
  isStatusAtiva,
  rotuloStatusPrescricaoNutricional,
  type PrescricaoNutricionalResponse,
  type PrescricaoNutricionalResumo,
} from '@/services/prescricaoNutricional.types'

type CardPrescricaoNutricionalProps = {
  prescricao: PrescricaoNutricionalResumo
  expandida: boolean
  onToggle: () => void
  onInativar?: () => void
  onAtivar?: () => void
}

export function CardPrescricaoNutricional({
  prescricao,
  expandida,
  onToggle,
  onInativar,
  onAtivar,
}: CardPrescricaoNutricionalProps) {
  const ativa = isStatusAtiva(prescricao.status)
  const periodo = formatarPeriodoNutricional(
    prescricao.dataInicio,
    prescricao.dataFim
  )

  const [detalhe, setDetalhe] = useState<PrescricaoNutricionalResponse | null>(
    null
  )
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null)

  useEffect(() => {
    if (!expandida) return

    let cancelado = false
    setCarregandoDetalhe(true)
    setErroDetalhe(null)

    void prescricaoNutricionalService
      .buscarPorId(prescricao.id)
      .then((dados) => {
        if (!cancelado) setDetalhe(dados)
      })
      .catch((error) => {
        if (!cancelado) {
          setDetalhe(null)
          setErroDetalhe(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar o detalhe.'
          )
        }
      })
      .finally(() => {
        if (!cancelado) setCarregandoDetalhe(false)
      })

    return () => {
      cancelado = true
    }
  }, [expandida, prescricao.id])

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
            ativa ? 'bg-success-500' : 'bg-error-500'
          }`}
        >
          {rotuloStatusPrescricaoNutricional(prescricao.status)}
        </span>

        <p className="min-w-0 flex-1 text-xs font-semibold text-text sm:text-sm">
          {periodo}
        </p>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {ativa && onInativar && (
            <button
              type="button"
              onClick={onInativar}
              className="rounded-full p-1.5 text-error-500 transition hover:bg-error-500/15 hover:text-error-700"
              title="Inativar prescrição"
              aria-label="Inativar prescrição"
            >
              <FiXCircle className="size-4" aria-hidden />
            </button>
          )}
          {!ativa && onAtivar && (
            <button
              type="button"
              onClick={onAtivar}
              className="rounded-full p-1.5 text-success-500 transition hover:bg-success-500/15 hover:text-success-700"
              title="Ativar prescrição"
              aria-label="Ativar prescrição"
            >
              <FiCheckCircle className="size-4" aria-hidden />
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

      {!expandida && (
        <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
          <MdRestaurant className="size-4 shrink-0 text-brand-600" aria-hidden />
          <span>Plano alimentar prescrito</span>
        </div>
      )}

      {expandida && (
        <>
          {carregandoDetalhe ? (
            <p className="mt-4 text-sm text-text-muted">Carregando detalhes...</p>
          ) : erroDetalhe ? (
            <p className="mt-4 text-sm text-error-500">{erroDetalhe}</p>
          ) : detalhe ? (
            <DetalhePrescricaoNutricional detalhe={detalhe} />
          ) : null}
        </>
      )}

      {!expandida && !ativa && (
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
