import { Info } from 'lucide-react'
import type { DistribuicaoDoenca } from '@/services'
import { EstadoVazioDashboard } from './DashboardShared'

function GraficoDoencas({ dados }: { dados: DistribuicaoDoenca[] }) {
  const maximo = Math.max(1, ...dados.map((item) => item.quantidade))

  if (dados.length === 0) {
    return (
      <EstadoVazioDashboard texto="Ainda não há dados de doenças para exibir." />
    )
  }

  return (
    <div
      className="overflow-x-auto pb-1"
      role="img"
      aria-label={`Distribuição de doenças: ${dados
        .map((item) => `${item.nome}, ${item.quantidade}`)
        .join('; ')}`}
    >
      <div className="min-w-[42rem]">
        <div className="grid grid-cols-[2.5rem_1fr] gap-3">
          <div className="flex h-60 flex-col justify-between pb-12 text-right text-[10px] text-text-muted">
            <span>{maximo}</span>
            <span>{Math.round(maximo * 0.75)}</span>
            <span>{Math.round(maximo * 0.5)}</span>
            <span>{Math.round(maximo * 0.25)}</span>
            <span>0</span>
          </div>
          <div className="relative flex h-60 items-end gap-5 border-b border-l border-zinc-300 px-4">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-12">
              {[0, 1, 2, 3].map((linha) => (
                <span key={linha} className="block border-t border-zinc-200" />
              ))}
            </div>
            {dados.map((item) => (
              <div
                key={item.nome}
                className="relative z-10 flex h-full min-w-20 flex-1 flex-col justify-end"
              >
                <span className="mb-1 text-center text-xs font-semibold text-[#3f5f9f]">
                  {item.quantidade}
                </span>
                <div
                  className="mx-auto w-full max-w-28 rounded-t-sm bg-[#42629f] transition-[height]"
                  style={{
                    height: `${Math.max(
                      2,
                      (item.quantidade / maximo) * 75
                    )}%`,
                  }}
                />
                <span className="flex h-12 items-start justify-center pt-2 text-center text-[10px] leading-tight text-text">
                  {item.nome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DistribuicaoDoencas({
  dados,
}: {
  dados: DistribuicaoDoenca[]
}) {
  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-base font-semibold text-text">
        Distribuição de doenças nos participantes
      </h2>
      <div className="mt-5">
        <GraficoDoencas dados={dados} />
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-text-muted">
        <Info className="size-5 shrink-0" aria-hidden />
        Um participante pode estar associado a mais de uma categoria.
      </p>
    </section>
  )
}
