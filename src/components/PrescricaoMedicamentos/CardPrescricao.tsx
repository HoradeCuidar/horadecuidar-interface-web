import { FiArrowRight, FiChevronDown, FiEdit2, FiXCircle } from 'react-icons/fi'
import { BiCapsule } from 'react-icons/bi'
import {
  detalhesMedicamento,
  formatarPeriodoPrescricao,
  type PrescricaoListagem,
} from './prescricaoListagem.types'

type CardPrescricaoProps = {
  prescricao: PrescricaoListagem
  expandida: boolean
  onToggle: () => void
  onEditar?: () => void
  onEncerrar?: () => void
}

export function CardPrescricao({
  prescricao,
  expandida,
  onToggle,
  onEditar,
  onEncerrar,
}: CardPrescricaoProps) {
  const isAtiva = prescricao.status === 'ativa'
  const periodo = formatarPeriodoPrescricao(prescricao.dataInicio, prescricao.dataTermino)

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
        <ul className="mt-4 flex flex-col gap-2.5">
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
