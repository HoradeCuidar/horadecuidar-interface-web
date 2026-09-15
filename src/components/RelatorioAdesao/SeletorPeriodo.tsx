import { Button, Input } from '@/components'
import type { PeriodoRelatorio } from '@/services'

type SeletorPeriodoProps = {
  periodo: PeriodoRelatorio
  onChange: (periodo: PeriodoRelatorio) => void
  onAplicar: () => void
  carregando?: boolean
}

export function SeletorPeriodo({
  periodo,
  onChange,
  onAplicar,
  carregando = false,
}: SeletorPeriodoProps) {
  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-base font-semibold text-text">Período</h2>
      <p className="mt-1 text-sm text-text-muted">
        Selecione o intervalo para analisar a adesão aos medicamentos.
      </p>

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
          onClick={onAplicar}
          disabled={carregando || !periodo.dataInicial || !periodo.dataFinal}
          className="h-10 rounded-xl px-5 sm:mb-0.5"
        >
          {carregando ? 'Carregando...' : 'Aplicar'}
        </Button>
      </div>
    </section>
  )
}
