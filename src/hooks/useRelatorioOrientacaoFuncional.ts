import { useCallback, useEffect, useState } from 'react'
import {
  relatorioOrientacaoFuncionalService,
  type PageDetalhamentoOrientacao,
  type PeriodoRelatorio,
  type ResumoOrientacaoFuncional,
} from '@/services'

type UseRelatorioOrientacaoFuncionalArgs = {
  pacienteId: number | null
  periodo: PeriodoRelatorio
  enabled?: boolean
}

export function useRelatorioOrientacaoFuncional({
  pacienteId,
  periodo,
  enabled = true,
}: UseRelatorioOrientacaoFuncionalArgs) {
  const [resumo, setResumo] = useState<ResumoOrientacaoFuncional | null>(null)
  const [detalhamento, setDetalhamento] =
    useState<PageDetalhamentoOrientacao | null>(null)
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
      const [resumoRes, detalheRes] = await Promise.all([
        relatorioOrientacaoFuncionalService.resumo(pacienteId, periodo),
        relatorioOrientacaoFuncionalService.detalhamento(
          pacienteId,
          periodo,
          0
        ),
      ])
      setResumo(resumoRes)
      setDetalhamento(detalheRes.conteudo)
      setPagina(0)
    } catch (error) {
      setResumo(null)
      setDetalhamento(null)
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar o relatório de orientações.'
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
        const detalheRes =
          await relatorioOrientacaoFuncionalService.detalhamento(
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
