import { Activity, Clock } from 'lucide-react'
import type { ResumoOrientacaoFuncional } from '@/services'
import { formatarDuracaoMinutos } from './relatorioAdesao.utils'

type IconType = React.ComponentType<{
  className?: string
  'aria-hidden'?: boolean
}>

function Cartao({
  titulo,
  valor,
  Icone,
  tom,
}: {
  titulo: string
  valor: string
  Icone: IconType
  tom: 'azul' | 'verde'
}) {
  const estilos = {
    azul: 'bg-brand-100 text-brand-500',
    verde: 'bg-emerald-100 text-emerald-600',
  }
  const coresValor = {
    azul: 'text-[#3f5f9f]',
    verde: 'text-emerald-600',
  }

  return (
    <article className="flex min-h-22 items-center gap-4 rounded-2xl border border-zinc-100 bg-white px-5 py-4 shadow-sm">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${estilos[tom]}`}
      >
        <Icone className="size-6" aria-hidden />
      </span>
      <div className="min-w-0">
        <p
          className={`font-heading text-2xl font-bold leading-none ${coresValor[tom]}`}
        >
          {valor}
        </p>
        <p className="mt-1 text-xs leading-snug text-text-muted">{titulo}</p>
      </div>
    </article>
  )
}

export function ResumoOrientacoes({
  dados,
}: {
  dados: ResumoOrientacaoFuncional
}) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Resumo de orientações funcionais"
    >
      <Cartao
        titulo="Realizações no período"
        valor={dados.quantidade.toLocaleString('pt-BR')}
        Icone={Activity}
        tom="azul"
      />
      <Cartao
        titulo="Tempo total de realização"
        valor={formatarDuracaoMinutos(dados.tempoRealizacao)}
        Icone={Clock}
        tom="verde"
      />
    </section>
  )
}
