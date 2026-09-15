import {
  CheckCircle2,
  CircleDashed,
  Percent,
  Pill,
  XCircle,
} from 'lucide-react'
import type { ResumoAdesaoMedicamento } from '@/services'
import { formatarPercentual } from './relatorioAdesao.utils'

type IconType = React.ComponentType<{
  className?: string
  'aria-hidden'?: boolean
}>

type Tom = 'azul' | 'verde' | 'vermelho' | 'laranja' | 'neutro'

function Cartao({
  titulo,
  valor,
  Icone,
  tom,
}: {
  titulo: string
  valor: string
  Icone: IconType
  tom: Tom
}) {
  const estilos: Record<Tom, string> = {
    azul: 'bg-brand-100 text-brand-500',
    verde: 'bg-emerald-100 text-emerald-600',
    vermelho: 'bg-red-100 text-red-500',
    laranja: 'bg-orange-100 text-orange-500',
    neutro: 'bg-zinc-100 text-zinc-500',
  }
  const coresValor: Record<Tom, string> = {
    azul: 'text-[#3f5f9f]',
    verde: 'text-emerald-600',
    vermelho: 'text-red-500',
    laranja: 'text-orange-500',
    neutro: 'text-zinc-600',
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

export function ResumoMedicamentos({
  dados,
}: {
  dados: ResumoAdesaoMedicamento
}) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      aria-label="Resumo de adesão a medicamentos"
    >
      <Cartao
        titulo="Doses esperadas"
        valor={dados.esperado.toLocaleString('pt-BR')}
        Icone={Pill}
        tom="azul"
      />
      <Cartao
        titulo="Realizadas"
        valor={dados.realizado.toLocaleString('pt-BR')}
        Icone={CheckCircle2}
        tom="verde"
      />
      <Cartao
        titulo="Não realizadas"
        valor={dados.naoRealizado.toLocaleString('pt-BR')}
        Icone={XCircle}
        tom="vermelho"
      />
      <Cartao
        titulo="Sem registro"
        valor={dados.semRegistro.toLocaleString('pt-BR')}
        Icone={CircleDashed}
        tom="laranja"
      />
      <Cartao
        titulo="Adesão"
        valor={formatarPercentual(dados.percentual)}
        Icone={Percent}
        tom="neutro"
      />
    </section>
  )
}
