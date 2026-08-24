import {
  DashboardError,
  DashboardResumo,
  DashboardSkeleton,
  DistribuicaoDoencas,
  PainelBaixaAdesao,
  PainelPrescricoes,
} from '@/components/Dashboard'
import { useDashboard } from '@/hooks'

export function Home() {
  const { dados, carregando, erro, carregarDashboard } = useDashboard()

  return (
    <div className="flex flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-7">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-text">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-text-muted">Visão geral do sistema</p>
      </header>

      {carregando ? (
        <DashboardSkeleton />
      ) : erro || !dados ? (
        <DashboardError
          mensagem={erro}
          onRetry={() => void carregarDashboard()}
        />
      ) : (
        <div className="space-y-7">
          <DashboardResumo dados={dados.resumo} />

          <div className="grid items-stretch gap-4 xl:grid-cols-2">
            <PainelBaixaAdesao pacientes={dados.pacientes} />
            <PainelPrescricoes prescricoes={dados.prescricoes} />
          </div>

          <DistribuicaoDoencas dados={dados.doencas} />
        </div>
      )}
    </div>
  )
}
