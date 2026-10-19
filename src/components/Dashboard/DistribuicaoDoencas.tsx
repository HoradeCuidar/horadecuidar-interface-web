import { useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import type { DistribuicaoDoenca } from '@/services'
import { BadgePainel, EstadoVazioDashboard } from './DashboardShared'
import {
  calcularPrevalencia,
  formatarPercentual,
} from './dashboard.utils'

type ModoGrafico = 'prevalencia' | 'absoluto'

const focoControle =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

function textoTooltip(
  nome: string,
  quantidade: number,
  participantesAtivos: number
): string {
  const pct = formatarPercentual(
    calcularPrevalencia(quantidade, participantesAtivos)
  )
  const base = `${nome}: ${quantidade} pac. (${pct})`
  if (
    participantesAtivos > 0 &&
    quantidade >= participantesAtivos
  ) {
    return `${base} | Presente em todos`
  }
  return base
}

function BarraDoenca({
  item,
  valor,
  maximo,
  modo,
  participantesAtivos,
  ativa,
  onAtivar,
  onDesativar,
}: {
  item: DistribuicaoDoenca
  valor: number
  maximo: number
  modo: ModoGrafico
  participantesAtivos: number
  ativa: boolean
  onAtivar: () => void
  onDesativar: () => void
}) {
  const altura = Math.max(10, (valor / maximo) * 92)
  const prevalencia = calcularPrevalencia(
    item.quantidade,
    participantesAtivos
  )
  const rotuloTopo =
    modo === 'absoluto'
      ? `${item.quantidade} pac.`
      : formatarPercentual(valor)
  const rotuloBase =
    modo === 'absoluto'
      ? formatarPercentual(prevalencia)
      : `${item.quantidade} pac.`
  const dica = textoTooltip(
    item.nome,
    item.quantidade,
    participantesAtivos
  )

  return (
    <div
      className={`relative flex h-full min-w-24 flex-1 flex-col justify-end ${
        ativa ? 'z-40' : 'z-10'
      }`}
    >
      {ativa ? (
        <div
          id={`tooltip-doenca-${item.nome}`}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 w-max max-w-[17rem] -translate-x-1/2"
        >
          <div className="rounded-lg bg-[#0f1b3d] px-3 py-2 text-left text-[11px] font-medium leading-snug text-white shadow-lg">
            <span className="inline-flex items-start gap-2">
              <span
                className="mt-1 size-2 shrink-0 rounded-full bg-[#5B8CFF]"
                aria-hidden
              />
              <span>{dica}</span>
            </span>
          </div>
          <span
            className="mx-auto block size-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-[#0f1b3d]"
            aria-hidden
          />
        </div>
      ) : null}

      <span className="mb-1.5 self-center rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
        {rotuloTopo}
      </span>

      <button
        type="button"
        aria-label={dica}
        aria-describedby={ativa ? `tooltip-doenca-${item.nome}` : undefined}
        onMouseEnter={onAtivar}
        onMouseLeave={onDesativar}
        onFocus={onAtivar}
        onBlur={onDesativar}
        onClick={onAtivar}
        className={`group relative mx-auto flex h-[9.5rem] w-full max-w-24 items-end justify-center rounded-t-md bg-surface-100 p-0.5 transition ${focoControle} ${
          ativa ? 'ring-2 ring-brand-400/50' : ''
        }`}
      >
        <span
          className="w-full rounded-t-[5px] bg-gradient-to-t from-brand-800 via-brand-600 to-brand-400 shadow-sm transition-[height] group-hover:brightness-105"
          style={{ height: `${altura}%` }}
        />
      </button>

      <span className="flex h-12 flex-col items-center justify-start gap-1 pt-2 text-center text-[10px] leading-tight text-text">
        <span className="font-medium">{item.nome}</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
          {rotuloBase}
        </span>
      </span>
    </div>
  )
}

function GraficoDoencas({
  dados,
  participantesAtivos,
  modo,
}: {
  dados: DistribuicaoDoenca[]
  participantesAtivos: number
  modo: ModoGrafico
}) {
  const [barraAtiva, setBarraAtiva] = useState<string | null>(null)
  const valores = useMemo(
    () =>
      dados.map((item) =>
        modo === 'absoluto'
          ? item.quantidade
          : calcularPrevalencia(item.quantidade, participantesAtivos)
      ),
    [dados, modo, participantesAtivos]
  )
  const maximo = Math.max(1, ...valores)

  if (dados.length === 0) {
    return (
      <EstadoVazioDashboard texto="Ainda não há dados de doenças para exibir." />
    )
  }

  return (
    <div className="overflow-x-auto overflow-y-visible pb-1">
      <div className="min-w-[42rem] pt-12">
        <div className="grid grid-cols-[2.5rem_1fr] gap-3">
          <div className="flex h-[13.5rem] flex-col justify-between pb-12 text-right text-[10px] text-text-muted">
            <span>
              {modo === 'absoluto' ? maximo : formatarPercentual(maximo)}
            </span>
            <span>
              {modo === 'absoluto'
                ? Math.round(maximo * 0.5)
                : formatarPercentual(maximo * 0.5)}
            </span>
            <span>{modo === 'absoluto' ? '0' : '0%'}</span>
          </div>
          <div className="relative flex h-[13.5rem] items-end gap-4 overflow-visible border-b border-l border-surface-100 px-3">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-12">
              {[0, 1].map((linha) => (
                <span
                  key={linha}
                  className="block border-t border-dashed border-surface-100"
                />
              ))}
            </div>
            {dados.map((item, indice) => (
              <BarraDoenca
                key={item.nome}
                item={item}
                valor={valores[indice]}
                maximo={maximo}
                modo={modo}
                participantesAtivos={participantesAtivos}
                ativa={barraAtiva === item.nome}
                onAtivar={() => setBarraAtiva(item.nome)}
                onDesativar={() => setBarraAtiva(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DistribuicaoDoencas({
  dados,
  participantesAtivos,
}: {
  dados: DistribuicaoDoenca[]
  participantesAtivos: number
}) {
  const [modo, setModo] = useState<ModoGrafico>('prevalencia')
  const totalDiagnosticos = useMemo(
    () => dados.reduce((acc, item) => acc + item.quantidade, 0),
    [dados]
  )

  return (
    <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold text-text">
            Distribuição de doenças nos participantes
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Frequência e prevalência diagnóstica na coorte atual
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BadgePainel tom="brand">Clínico</BadgePainel>
          <div
            className="inline-flex rounded-full bg-surface-0 p-1"
            role="group"
            aria-label="Modo do gráfico"
          >
            <button
              type="button"
              aria-pressed={modo === 'prevalencia'}
              onClick={() => setModo('prevalencia')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${focoControle} ${
                modo === 'prevalencia'
                  ? 'bg-brand-600 text-text-inverse'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Prevalência (%)
            </button>
            <button
              type="button"
              aria-pressed={modo === 'absoluto'}
              onClick={() => setModo('absoluto')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${focoControle} ${
                modo === 'absoluto'
                  ? 'bg-brand-600 text-text-inverse'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Nº Absoluto
            </button>
          </div>
          <p className="text-xs font-medium text-brand-700">
            Total: {totalDiagnosticos.toLocaleString('pt-BR')} diagnósticos em{' '}
            {participantesAtivos.toLocaleString('pt-BR')} pac.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <GraficoDoencas
          dados={dados}
          participantesAtivos={participantesAtivos}
          modo={modo}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs text-text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          Nota clínica: Um participante pode estar associado a mais de uma
          categoria diagnóstica simultaneamente.
        </p>
        <BadgePainel tom="brand">
          {participantesAtivos === 1
            ? '1 participante no total'
            : `${participantesAtivos.toLocaleString('pt-BR')} participantes no total`}
        </BadgePainel>
      </div>
    </section>
  )
}
