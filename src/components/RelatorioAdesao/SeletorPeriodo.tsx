import { FiCalendar } from 'react-icons/fi'
import { Button, Input } from '@/components'
import type { PeriodoRelatorio } from '@/services'
import {
  periodoMesAtual,
  periodoUltimosNDias,
} from './relatorioAdesao.utils'

type SeletorPeriodoProps = {
  periodo: PeriodoRelatorio
  onChange: (periodo: PeriodoRelatorio) => void
  onAplicar: (periodo?: PeriodoRelatorio) => void
  carregando?: boolean
  descricao?: string
}

const ATALHOS = [
  { id: '7', rotulo: '7 dias', periodo: () => periodoUltimosNDias(7) },
  { id: '14', rotulo: '14 dias', periodo: () => periodoUltimosNDias(14) },
  { id: '30', rotulo: '30 dias', periodo: () => periodoUltimosNDias(30) },
  { id: 'mes', rotulo: 'Mês atual', periodo: periodoMesAtual },
] as const

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

export function SeletorPeriodo({
  periodo,
  onChange,
  onAplicar,
  carregando = false,
  descricao = 'Selecione o intervalo para analisar a adesão.',
}: SeletorPeriodoProps) {
  return (
    <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <FiCalendar className="size-4" aria-hidden />
            </span>
            <h2 className="font-heading text-base font-semibold text-text">
              Período de análise
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-text-muted">{descricao}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ATALHOS.map((atalho) => {
            const alvo = atalho.periodo()
            const ativo =
              periodo.dataInicial === alvo.dataInicial &&
              periodo.dataFinal === alvo.dataFinal
            return (
              <button
                key={atalho.id}
                type="button"
                disabled={carregando}
                onClick={() => {
                  onChange(alvo)
                  onAplicar(alvo)
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${focoBotao} ${
                  ativo
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-0 text-text-muted hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {atalho.rotulo}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-44 flex-1">
          <Input
            label="Data inicial"
            size="compact"
            type="date"
            value={periodo.dataInicial}
            onChange={(e) =>
              onChange({ ...periodo, dataInicial: e.target.value })
            }
          />
        </div>
        <div className="min-w-44 flex-1">
          <Input
            label="Data final"
            size="compact"
            type="date"
            value={periodo.dataFinal}
            onChange={(e) =>
              onChange({ ...periodo, dataFinal: e.target.value })
            }
          />
        </div>
        <Button
          type="button"
          onClick={() => onAplicar()}
          disabled={carregando || !periodo.dataInicial || !periodo.dataFinal}
          className={`h-10 rounded-xl px-5 sm:mb-0.5 ${focoBotao}`}
        >
          {carregando ? 'Carregando...' : 'Aplicar'}
        </Button>
      </div>
    </section>
  )
}
