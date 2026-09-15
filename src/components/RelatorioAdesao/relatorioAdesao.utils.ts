export function formatarPercentual(valor: number | null | undefined): string {
  if (valor == null || Number.isNaN(Number(valor))) return '—'
  return `${Number(valor).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })}%`
}

export function formatarDataBr(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [y, m, d] = iso.slice(0, 10).split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

export function limitarPercentual(valor: number | null | undefined): number {
  if (valor == null || Number.isNaN(Number(valor))) return 0
  return Math.min(100, Math.max(0, Number(valor)))
}

export function labelTipoOcorrencia(tipo: string): string {
  const map: Record<string, string> = {
    MEDICAMENTO: 'Medicamento',
    ALIMENTACAO: 'Alimentação',
  }
  return map[tipo] ?? tipo
}

export function formatarDuracaoMinutos(
  minutos: number | null | undefined
): string {
  if (minutos == null || Number.isNaN(Number(minutos))) return '—'
  const total = Math.max(0, Number(minutos))
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

export function labelStatusRealizacao(status: string | null | undefined): string {
  const map: Record<string, string> = {
    REALIZADO: 'Realizado',
    PARCIALMENTE_REALIZADO: 'Parcialmente realizado',
  }
  if (!status) return '—'
  return map[status] ?? status
}

export function labelSensacaoFinal(
  sensacao: string | null | undefined
): string {
  const map: Record<string, string> = {
    ME_SUPEREI: 'Me superei',
    BEM_FORTE: 'Bem forte',
    DE_BOA: 'De boa',
    ARRASTADO: 'Arrastado',
    QUASE_NAO_DEU: 'Quase não deu',
  }
  if (!sensacao) return '—'
  return map[sensacao] ?? sensacao
}
