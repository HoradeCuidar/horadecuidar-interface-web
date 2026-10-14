import { useCallback, useEffect, useState } from 'react'
import {
  chipsPadraoRealizacao,
  montarCalendarioDeOrientacoes,
  periodoUltimos7Dias,
  type ChipCalendario,
  type DiaCalendario,
} from '@/components/CalendarioSemana'
import { relatorioOrientacaoFuncionalService } from '@/services'

export function useCalendarioOrientacao7Dias(
  pacienteId: number,
  enabled = true
) {
  const [dias, setDias] = useState<DiaCalendario[]>([])
  const [chips, setChips] = useState<ChipCalendario[]>([])
  const [carregando, setCarregando] = useState(enabled)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!enabled) return
    setCarregando(true)
    setErro(null)
    try {
      const periodo = periodoUltimos7Dias()
      const resposta = await relatorioOrientacaoFuncionalService.detalhamento(
        pacienteId,
        periodo,
        0,
        100
      )
      const montados = montarCalendarioDeOrientacoes(
        resposta.conteudo?.content ?? []
      )
      setDias(montados)
      setChips(chipsPadraoRealizacao(montados))
    } catch (error) {
      setDias([])
      setChips([])
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar calendário de orientações.'
      )
    } finally {
      setCarregando(false)
    }
  }, [pacienteId, enabled])

  useEffect(() => {
    void carregar()
  }, [carregar])

  return { dias, chips, carregando, erro, recarregar: carregar }
}
