import type { IconType } from 'react-icons'
import {
  FaBalanceScale,
  FaChild,
  FaDumbbell,
  FaRunning,
  FaSpa,
  FaWalking,
} from 'react-icons/fa'
import { FiActivity } from 'react-icons/fi'
import type { PrescricaoExercicioResponse } from '@/services/prescricaoExercicio.mappers'
import {
  OPCOES_DURACAO,
  OPCOES_FREQUENCIA,
  OPCOES_TIPO_EXERCICIO,
  type TipoExercicio,
} from './prescricaoExercicio.types'

type CardPrescricaoExercicioProps = {
  prescricao: PrescricaoExercicioResponse
}

function formatarData(value?: string | null): string {
  if (!value) return 'Sem término'
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(
    new Date(value)
  )
}

function labelDe(
  opcoes: ReadonlyArray<{ value: string; label: string }>,
  value: string
): string {
  return opcoes.find((opcao) => opcao.value === value)?.label ?? value
}

function iconePorTipo(tipo: TipoExercicio | string): IconType {
  switch (tipo) {
    case 'AEROBICO':
      return FaRunning
    case 'ALONGAMENTO':
    case 'FLEXIBILIDADE':
      return FaChild
    case 'RESISTENCIA':
      return FaDumbbell
    case 'EQUILIBRIO':
      return FaBalanceScale
    case 'FUNCIONAL':
      return FaWalking
    case 'RELAXAMENTO':
      return FaSpa
    default:
      return FiActivity
  }
}

export function CardPrescricaoExercicio({
  prescricao,
}: CardPrescricaoExercicioProps) {
  return (
    <article className="rounded-lg border border-surface-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Ativa
        </span>
        <p className="text-sm font-medium text-zinc-700">
          {formatarData(prescricao.dataInicio)} até{' '}
          {formatarData(prescricao.dataFim)}
        </p>
        {prescricao.nomeProfissional && (
          <p className="ml-auto text-xs text-text-muted">
            {prescricao.nomeProfissional}
          </p>
        )}
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {prescricao.exercicios.map((exercicio, index) => {
          const Icone = iconePorTipo(exercicio.tipoExercicio)
          return (
            <li
              key={`${prescricao.id}-${index}`}
              className="flex items-start gap-3 rounded-xl bg-zinc-50 px-3 py-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EBF2FF] text-[#5D99F4]">
                <Icone className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-800">
                  {exercicio.nomeExercicio}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                  {labelDe(OPCOES_TIPO_EXERCICIO, exercicio.tipoExercicio)} ·{' '}
                  {exercicio.frequenciaValor} vez(es) por{' '}
                  {labelDe(OPCOES_FREQUENCIA, exercicio.frequenciaTipo)} ·{' '}
                  {exercicio.duracaoValor}{' '}
                  {labelDe(OPCOES_DURACAO, exercicio.unidadeDuracao)}
                </p>
                {(exercicio.series || exercicio.repeticoes) && (
                  <p className="mt-0.5 text-xs text-text-muted">
                    {exercicio.series ? `${exercicio.series} série(s)` : ''}
                    {exercicio.series && exercicio.repeticoes ? ' · ' : ''}
                    {exercicio.repeticoes
                      ? `${exercicio.repeticoes} repetição(ões)`
                      : ''}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {prescricao.observacao && (
        <p className="mt-3 text-sm text-zinc-600">{prescricao.observacao}</p>
      )}
    </article>
  )
}
