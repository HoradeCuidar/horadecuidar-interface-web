import type { TagFuncional } from './orientacaoFuncional.types'

export type FlexibilidadeFisica = 'FRACA' | 'MEDIA' | 'EXCELENTE'

export type NivelAssimetria = 'LEVE' | 'MODERADA' | 'ALTA'

export type ProfissionalAvaliacao = {
  id: number
  nome?: string | null
  username?: string | null
}

export type AvaliacaoFisica = {
  id: number
  profissional: ProfissionalAvaliacao
  realizaAtividadeFisica: boolean
  atividadeRealizada: string | null
  frequenciaSemanal: number | null
  flexibilidade: FlexibilidadeFisica
  forcaPalmarDireita: number | null
  forcaPalmarEsquerda: number | null
  assimetriaPalmar: NivelAssimetria | null
  forcaJoelhoDireita: number | null
  forcaJoelhoEsquerda: number | null
  assimetriaJoelho: NivelAssimetria | null
  queixas: string | null
  observacoesMusculoEsqueleticas: string | null
  orientacoesGerais: string | null
  indicacoesFuncionais: TagFuncional[]
  dataRegistro: string
  dataAtualizacao: string | null
}

export type AvaliacaoFisicaRequest = {
  realizaAtividadeFisica: boolean
  atividadeRealizada: string | null
  frequenciaSemanal: number | null
  flexibilidade: FlexibilidadeFisica
  forcaPalmarDireita: number | null
  forcaPalmarEsquerda: number | null
  assimetriaPalmar: NivelAssimetria | null
  forcaJoelhoDireita: number | null
  forcaJoelhoEsquerda: number | null
  assimetriaJoelho: NivelAssimetria | null
  queixas: string | null
  observacoesMusculoEsqueleticas: string | null
  orientacoesGerais: string | null
  indicacoesFuncionaisIds: number[]
}

export const OPCOES_FLEXIBILIDADE: { value: FlexibilidadeFisica; label: string }[] = [
  { value: 'FRACA', label: 'Fraca' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'EXCELENTE', label: 'Excelente' },
]

export const OPCOES_ASSIMETRIA: { value: NivelAssimetria; label: string }[] = [
  { value: 'LEVE', label: 'Leve' },
  { value: 'MODERADA', label: 'Moderada' },
  { value: 'ALTA', label: 'Alta' },
]
