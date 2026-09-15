import { useCallback, useEffect, useState } from 'react'
import {
  relatorioAdesaoMedicamentoService,
  type EvolucaoAdesaoMedicamento,
  type PageDetalhamentoMedicamento,
  type PeriodoRelatorio,
  type ResumoAdesaoMedicamento,
} from '@/services'

type UseRelatorioAdesaoMedicamentoArgs = {
  pacienteId: number | null
  periodo: PeriodoRelatorio
  enabled?: boolean
}

export function useRelatorioAdesaoMedicamento({
  pacienteId,
  periodo,
  enabled = true,
}: UseRelatorioAdesaoMedicamentoArgs) {
  const [resumo, setResumo] = useState<ResumoAdesaoMedicamento | null>(null)
  const [evolucao, setEvolucao] = useState<EvolucaoAdesaoMedicamento | null>(
    null
  )
  const [detalhamento, setDetalhamento] =
    useState<PageDetalhamentoMedicamento | null>(null)
  const [pagina, setPagina] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarPrincipais = useCallback(async () => {
    if (!enabled) return

    if (pacienteId == null || Number.isNaN(pacienteId)) {
      setErro('Paciente inválido.')
      setCarregando(false)
      return
    }

    if (periodo.dataInicial > periodo.dataFinal) {
      setErro('A data inicial deve ser anterior ou igual à data final.')
      setCarregando(false)
      return
    }

    setCarregando(true)
    setErro(null)
    try {
      const [resumoRes, evolucaoRes, detalheRes] = await Promise.all([
        relatorioAdesaoMedicamentoService.resumo(pacienteId, periodo),
        relatorioAdesaoMedicamentoService.evolucao(pacienteId, periodo),
        relatorioAdesaoMedicamentoService.detalhamento(pacienteId, periodo, 0),
      ])
      setResumo(resumoRes)
      setEvolucao(evolucaoRes)
      setDetalhamento(detalheRes.conteudo)
      setPagina(0)
    } catch (error) {
      setResumo(null)
      setEvolucao(null)
      setDetalhamento(null)
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar o relatório de adesão.'
      )
    } finally {
      setCarregando(false)
    }
  }, [pacienteId, periodo, enabled])

  const carregarDetalhamento = useCallback(
    async (proximaPagina: number) => {
      if (!enabled || pacienteId == null || Number.isNaN(pacienteId)) return

      setCarregandoDetalhe(true)
      try {
        const detalheRes = await relatorioAdesaoMedicamentoService.detalhamento(
          pacienteId,
          periodo,
          proximaPagina
        )
        setDetalhamento(detalheRes.conteudo)
        setPagina(proximaPagina)
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar o detalhamento.'
        )
      } finally {
        setCarregandoDetalhe(false)
      }
    },
    [pacienteId, periodo, enabled]
  )

  useEffect(() => {
    void carregarPrincipais()
  }, [carregarPrincipais])

  return {
    resumo,
    evolucao,
    detalhamento,
    pagina,
    carregando,
    carregandoDetalhe,
    erro,
    recarregar: carregarPrincipais,
    paginaAnterior: () => void carregarDetalhamento(pagina - 1),
    paginaProxima: () => void carregarDetalhamento(pagina + 1),
  }
}
