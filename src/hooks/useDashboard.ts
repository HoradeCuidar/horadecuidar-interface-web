import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  dashboardService,
  type DashboardResumo,
  type DistribuicaoDoenca,
  type PacienteBaixaAdesao,
  type PrescricaoProximaVencimento,
} from '@/services'

export type DashboardData = {
  resumo: DashboardResumo
  prescricoes: PrescricaoProximaVencimento[]
  pacientes: PacienteBaixaAdesao[]
  doencas: DistribuicaoDoenca[]
}

export function useDashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregarDashboard = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const [resumo, prescricoes, pacientes, doencas] = await Promise.all([
        dashboardService.resumo(),
        dashboardService.prescricoesProximasVencimento(),
        dashboardService.pacientesBaixaAdesao(),
        dashboardService.distribuicaoDoencas(),
      ])
      setDados({ resumo, prescricoes, pacientes, doencas })
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar o dashboard.'
      setErro(mensagem)
      toast.error(mensagem)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void carregarDashboard()
  }, [carregarDashboard])

  return { dados, carregando, erro, carregarDashboard }
}
