import { FiArrowRight, FiChevronDown, FiEdit2 } from 'react-icons/fi'
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
}

export function CardPrescricao({
  prescricao,
  expandida,
  onToggle,
  onEditar,
}: CardPrescricaoProps) {
  const isAtiva = prescricao.status === 'ativa'
  const periodo = formatarPeriodoPrescricao(prescricao.dataInicio, prescricao.dataTermino)

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            isAtiva
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-zinc-100 text-zinc-500'
          }`}
        >
          {isAtiva ? 'Ativa' : 'Encerrada'}
        </span>

        <p className="min-w-0 flex-1 text-xs font-medium text-zinc-700 sm:text-sm">
          {periodo}
        </p>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {isAtiva && onEditar && (
            <button
              type="button"
              onClick={onEditar}
              className="rounded-full p-1.5 text-brand-500 transition hover:bg-brand-50"
              title="Editar"
              aria-label="Editar prescrição"
            >
              <FiEdit2 className="size-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
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
              className="flex items-start gap-3 rounded-xl bg-zinc-50 px-3 py-3 sm:px-3.5"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EBF2FF] text-[#5D99F4]">
                <BiCapsule className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-800">{med.nome}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
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
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-600"
        >
          Ver detalhes
          <FiArrowRight className="size-4" aria-hidden />
        </button>
      )}
    </article>
  )
}
