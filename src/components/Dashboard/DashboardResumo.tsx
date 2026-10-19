import {
  BarChart3,
  ClipboardList,
  TriangleAlert,
  Users,
} from 'lucide-react'
import type { DashboardResumo as DashboardResumoData } from '@/services'

type IconType = React.ComponentType<{
  className?: string
  'aria-hidden'?: boolean
}>

type TomCartao = 'azul' | 'laranja' | 'vermelho'

function CartaoResumo({
  valor,
  titulo,
  Icone,
  tom,
  badge,
}: {
  valor: number
  titulo: string
  Icone: IconType
  tom: TomCartao
  badge?: string
}) {
  const estilos: Record<TomCartao, string> = {
    azul: 'bg-brand-100 text-brand-700',
    laranja: 'bg-orange-100 text-orange-700',
    vermelho: 'bg-red-100 text-red-700',
  }
  const coresValor: Record<TomCartao, string> = {
    azul: 'text-brand-700',
    laranja: 'text-orange-700',
    vermelho: 'text-red-700',
  }
  const badgeTom: Record<TomCartao, string> = {
    azul: 'bg-brand-50 text-brand-700',
    laranja: 'bg-orange-50 text-orange-700',
    vermelho: 'bg-red-50 text-red-700',
  }

  return (
    <article className="flex min-h-24 items-center gap-4 rounded-2xl border border-surface-100 bg-white px-5 py-4 shadow-sm">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${estilos[tom]}`}
      >
        <Icone className="size-6" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`font-heading text-2xl font-bold leading-none ${coresValor[tom]}`}
          >
            {valor.toLocaleString('pt-BR')}
          </p>
          {badge ? (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badgeTom[tom]}`}
            >
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-xs leading-snug text-text-muted">{titulo}</p>
      </div>
    </article>
  )
}

export function DashboardResumo({ dados }: { dados: DashboardResumoData }) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Resumo do dashboard"
    >
      <CartaoResumo
        valor={dados.participantesAtivos}
        titulo="Participantes ativos"
        Icone={Users}
        tom="azul"
      />
      <CartaoResumo
        valor={dados.prescricoesAtivas}
        titulo="Prescrições ativas"
        Icone={ClipboardList}
        tom="azul"
      />
      <CartaoResumo
        valor={dados.prescricoesProximasVencimento}
        titulo="Prescrições próximas do vencimento"
        Icone={TriangleAlert}
        tom="laranja"
        badge="Próximos 10 dias"
      />
      <CartaoResumo
        valor={dados.participantesBaixaAdesao}
        titulo="Participantes com baixa adesão"
        Icone={BarChart3}
        tom="vermelho"
        badge={
          dados.participantesBaixaAdesao === 1
            ? '1 caso'
            : `${dados.participantesBaixaAdesao} casos`
        }
      />
    </section>
  )
}
