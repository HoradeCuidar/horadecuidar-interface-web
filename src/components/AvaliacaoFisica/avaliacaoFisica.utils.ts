import type {
  AvaliacaoFisica,
  AvaliacaoFisicaRequest,
  FlexibilidadeFisica,
  NivelAssimetria,
} from '@/services/avaliacaoFisica.types'

export type ValoresFormAvaliacao = {
  realizaAtividadeFisica: boolean
  atividadeRealizada: string
  frequenciaSemanal: string
  flexibilidade: FlexibilidadeFisica | ''
  forcaPalmarDireita: string
  forcaPalmarEsquerda: string
  assimetriaPalmar: NivelAssimetria | ''
  forcaJoelhoDireita: string
  forcaJoelhoEsquerda: string
  assimetriaJoelho: NivelAssimetria | ''
  queixas: string
  observacoesMusculoEsqueleticas: string
  orientacoesGerais: string
  indicacoesFuncionaisIds: number[]
}

export const VALORES_VAZIOS_AVALIACAO: ValoresFormAvaliacao = {
  realizaAtividadeFisica: false,
  atividadeRealizada: '',
  frequenciaSemanal: '',
  flexibilidade: '',
  forcaPalmarDireita: '',
  forcaPalmarEsquerda: '',
  assimetriaPalmar: '',
  forcaJoelhoDireita: '',
  forcaJoelhoEsquerda: '',
  assimetriaJoelho: '',
  queixas: '',
  observacoesMusculoEsqueleticas: '',
  orientacoesGerais: '',
  indicacoesFuncionaisIds: [],
}

function parseDecimal(valor: string): number | null {
  const trim = valor.trim().replace(',', '.')
  if (!trim) return null
  const n = Number(trim)
  return Number.isFinite(n) ? n : null
}

function parseIntOrNull(valor: string): number | null {
  const trim = valor.trim()
  if (!trim) return null
  const n = Number.parseInt(trim, 10)
  return Number.isFinite(n) ? n : null
}

export function responseToForm(avaliacao: AvaliacaoFisica): ValoresFormAvaliacao {
  return {
    realizaAtividadeFisica: avaliacao.realizaAtividadeFisica,
    atividadeRealizada: avaliacao.atividadeRealizada ?? '',
    frequenciaSemanal:
      avaliacao.frequenciaSemanal != null ? String(avaliacao.frequenciaSemanal) : '',
    flexibilidade: avaliacao.flexibilidade,
    forcaPalmarDireita:
      avaliacao.forcaPalmarDireita != null ? String(avaliacao.forcaPalmarDireita) : '',
    forcaPalmarEsquerda:
      avaliacao.forcaPalmarEsquerda != null ? String(avaliacao.forcaPalmarEsquerda) : '',
    assimetriaPalmar: avaliacao.assimetriaPalmar ?? '',
    forcaJoelhoDireita:
      avaliacao.forcaJoelhoDireita != null ? String(avaliacao.forcaJoelhoDireita) : '',
    forcaJoelhoEsquerda:
      avaliacao.forcaJoelhoEsquerda != null ? String(avaliacao.forcaJoelhoEsquerda) : '',
    assimetriaJoelho: avaliacao.assimetriaJoelho ?? '',
    queixas: avaliacao.queixas ?? '',
    observacoesMusculoEsqueleticas: avaliacao.observacoesMusculoEsqueleticas ?? '',
    orientacoesGerais: avaliacao.orientacoesGerais ?? '',
    indicacoesFuncionaisIds: avaliacao.indicacoesFuncionais.map((t) => t.id),
  }
}

export function formToRequest(
  form: ValoresFormAvaliacao
): AvaliacaoFisicaRequest | string {
  if (!form.flexibilidade) {
    return 'Informe o nível de flexibilidade.'
  }

  if (form.realizaAtividadeFisica && !form.atividadeRealizada.trim()) {
    return 'Informe a atividade física realizada.'
  }

  return {
    realizaAtividadeFisica: form.realizaAtividadeFisica,
    atividadeRealizada: form.realizaAtividadeFisica
      ? form.atividadeRealizada.trim() || null
      : null,
    frequenciaSemanal: form.realizaAtividadeFisica
      ? parseIntOrNull(form.frequenciaSemanal)
      : null,
    flexibilidade: form.flexibilidade,
    forcaPalmarDireita: parseDecimal(form.forcaPalmarDireita),
    forcaPalmarEsquerda: parseDecimal(form.forcaPalmarEsquerda),
    assimetriaPalmar: form.assimetriaPalmar || null,
    forcaJoelhoDireita: parseDecimal(form.forcaJoelhoDireita),
    forcaJoelhoEsquerda: parseDecimal(form.forcaJoelhoEsquerda),
    assimetriaJoelho: form.assimetriaJoelho || null,
    queixas: form.queixas.trim() || null,
    observacoesMusculoEsqueleticas:
      form.observacoesMusculoEsqueleticas.trim() || null,
    orientacoesGerais: form.orientacoesGerais.trim() || null,
    indicacoesFuncionaisIds: form.indicacoesFuncionaisIds,
  }
}

export function formatarDataAvaliacao(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function labelFlexibilidade(valor: FlexibilidadeFisica): string {
  if (valor === 'FRACA') return 'Fraca'
  if (valor === 'MEDIA') return 'Média'
  return 'Excelente'
}
