import { useCallback, useEffect, useState } from 'react'
import {
  chipsPadraoAdesao,
  montarCalendarioDeAdesaoDiaria,
  periodoUltimos7Dias,
  type ChipCalendario,
  type DiaCalendario,
} from '@/components/CalendarioSemana'
import { relatorioAdesaoMedicamentoService } from '@/services/relatorioAdesaoMedicamento'
import { relatorioAdesaoNutricionalService } from '@/services/relatorioAdesaoNutricional'

type Dominio = 'medicamentos' | 'nutricional'

export function useCalendarioAdesao7Dias(
  pacienteId: number,
  dominio: Dominio,
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
      const resposta =
        dominio === 'medicamentos'
          ? await relatorioAdesaoMedicamentoService.detalhamento(
              pacienteId,
              periodo,
              0,
              100
            )
          : await relatorioAdesaoNutricionalService.detalhamento(
              pacienteId,
              periodo,
              0,
              100
            )
      const montados = montarCalendarioDeAdesaoDiaria(
        resposta.conteudo?.content ?? []
      )
      setDias(montados)
      setChips(chipsPadraoAdesao(montados))
    } catch (error) {
      setDias([])
      setChips([])
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar calendário de adesão.'
      )
    } finally {
      setCarregando(false)
    }
  }, [pacienteId, dominio, enabled])

  useEffect(() => {
    void carregar()
  }, [carregar])

  return { dias, chips, carregando, erro, recarregar: carregar }
}
