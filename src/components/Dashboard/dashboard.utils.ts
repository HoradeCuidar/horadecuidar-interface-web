export function obterIniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
}

export function formatarDataDashboard(data: string): string {
  const partes = data.split('-').map(Number)
  if (partes.length !== 3 || partes.some((parte) => !Number.isFinite(parte))) {
    return data
  }
  const [ano, mes, dia] = partes
  return new Intl.DateTimeFormat('pt-BR').format(new Date(ano, mes - 1, dia))
}

export function formatarVencimento(dias: number): string {
  if (dias < 0) return 'prescrição vencida'
  if (dias === 0) return 'vence hoje'
  if (dias === 1) return 'vence em 1 dia'
  return `vence em ${dias} dias`
}

export function limitarPercentual(percentual: number): number {
  return Math.min(100, Math.max(0, percentual))
}

export function calcularPrevalencia(
  quantidade: number,
  participantesAtivos: number
): number {
  if (participantesAtivos <= 0) return 0
  return limitarPercentual((quantidade / participantesAtivos) * 100)
}

export function formatarPercentual(valor: number): string {
  return `${limitarPercentual(valor).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })}%`
}
