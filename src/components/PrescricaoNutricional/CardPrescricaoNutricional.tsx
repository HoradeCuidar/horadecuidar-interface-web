import { useEffect, useState } from 'react'
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiEdit2,
  FiXCircle,
} from 'react-icons/fi'
import { MdRestaurant } from 'react-icons/md'
import { Skeleton } from '@/components'
import { DetalhePrescricaoNutricional } from './DetalhePrescricaoNutricional'
import {
  estiloStatusNutricional,
  formatarPeriodoNutricionalBr,
  isStatusAtiva,
  tituloPlanoNutricional,
} from './prescricaoNutricional.listagem.utils'
import { prescricaoNutricionalService } from '@/services'
import type {
  PrescricaoNutricionalResponse,
  PrescricaoNutricionalResumo,
} from '@/services/prescricaoNutricional.types'

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

type CardPrescricaoNutricionalProps = {
  prescricao: PrescricaoNutricionalResumo
  expandida: boolean
  onToggle: () => void
  onEditar?: () => void
  onInativar?: () => void
  onAtivar?: () => void
}

export function CardPrescricaoNutricional({
  prescricao,
  expandida,
  onToggle,
  onEditar,
  onInativar,
  onAtivar,
}: CardPrescricaoNutricionalProps) {
  const ativa = isStatusAtiva(prescricao.status)
  const statusVisual = estiloStatusNutricional(prescricao.status)
  const periodo = formatarPeriodoNutricionalBr(
    prescricao.dataInicio,
    prescricao.dataFim
  )
  const titulo = tituloPlanoNutricional()

  const [detalhe, setDetalhe] = useState<PrescricaoNutricionalResponse | null>(
    null
  )
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null)

  useEffect(() => {
    if (!expandida) return

    let cancelado = false
    async function carregarDetalhe() {
      setCarregandoDetalhe(true)
      setErroDetalhe(null)
      try {
        const dados = await prescricaoNutricionalService.buscarPorId(prescricao.id)
        if (!cancelado) setDetalhe(dados)
      } catch (error) {
        if (!cancelado) {
          setDetalhe(null)
          setErroDetalhe(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar o detalhe.'
          )
        }
      } finally {
        if (!cancelado) setCarregandoDetalhe(false)
      }
    }
    void carregarDetalhe()

    return () => {
      cancelado = true
    }
  }, [expandida, prescricao.id])

  const qtdRefeicoes = detalhe?.refeicoes?.length

  return (
    <article className="rounded-2xl border border-surface-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <MdRestaurant className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-base font-bold tracking-tight text-text">
                {titulo}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusVisual.badge}`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    ativa ? 'bg-success' : 'bg-current opacity-60'
                  }`}
                  aria-hidden
                />
                {statusVisual.rotulo}
              </span>
            </div>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-text-muted">
              <FiCalendar className="size-3.5 shrink-0" aria-hidden />
              {periodo}
            </p>
            {!expandida && prescricao.observacoes?.trim() ? (
              <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                {prescricao.observacoes}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {ativa && onEditar ? (
            <button
              type="button"
              onClick={onEditar}
              className={`rounded-full p-1.5 text-brand-600 transition hover:bg-brand-100 hover:text-brand-700 ${focoBotao}`}
              title="Editar"
              aria-label="Editar prescrição nutricional"
            >
              <FiEdit2 className="size-4" aria-hidden />
            </button>
          ) : null}
          {ativa && onInativar ? (
            <button
              type="button"
              onClick={onInativar}
              className={`rounded-full p-1.5 text-error-500 transition hover:bg-error-500/15 hover:text-error-700 ${focoBotao}`}
              title="Inativar prescrição"
              aria-label="Inativar prescrição"
            >
              <FiXCircle className="size-4" aria-hidden />
            </button>
          ) : null}
          {!ativa && onAtivar ? (
            <button
              type="button"
              onClick={onAtivar}
              className={`rounded-full p-1.5 text-success-500 transition hover:bg-success-500/15 hover:text-success-700 ${focoBotao}`}
              title="Ativar prescrição"
              aria-label="Ativar prescrição"
            >
              <FiCheckCircle className="size-4" aria-hidden />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onToggle}
            className={`rounded-full p-1.5 text-text-muted transition hover:bg-surface-100 hover:text-text ${focoBotao}`}
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

      {expandida ? (
        <>
          {carregandoDetalhe ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          ) : erroDetalhe ? (
            <p className="mt-4 text-sm text-error-500" role="alert">
              {erroDetalhe}
            </p>
          ) : detalhe ? (
            <>
              {qtdRefeicoes != null && qtdRefeicoes > 0 ? (
                <p className="mt-3 text-xs font-medium text-text-muted">
                  {qtdRefeicoes}{' '}
                  {qtdRefeicoes === 1 ? 'refeição prescrita' : 'refeições prescritas'}
                </p>
              ) : null}
              <DetalhePrescricaoNutricional detalhe={detalhe} />
            </>
          ) : null}
        </>
      ) : null}

      {!expandida && !ativa ? (
        <button
          type="button"
          onClick={onToggle}
          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700 ${focoBotao}`}
        >
          Ver detalhes
          <FiArrowRight className="size-4" aria-hidden />
        </button>
      ) : null}
    </article>
  )
}
