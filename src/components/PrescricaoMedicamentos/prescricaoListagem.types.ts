export type StatusPrescricao = 'ativa' | 'encerrada'

export type MedicamentoListagem = {
  id: string
  nome: string
  dosagemLabel: string
  quantidadeLabel: string
  frequenciaLabel: string
  viaLabel: string
}

export type PrescricaoListagem = {
  id: string
  status: StatusPrescricao
  dataInicio: string
  dataTermino: string
  medicamentos: MedicamentoListagem[]
}

export function formatarPeriodoPrescricao(inicio: string, termino: string): string {
  const fim = termino ? formatarDataBr(termino) : 'sem data fim'
  return `${formatarDataBr(inicio)} – ${fim}`
}

function formatarDataBr(isoOuBr: string): string {
  if (!isoOuBr) return '—'
  if (isoOuBr.includes('/')) return isoOuBr
  const data = isoOuBr.slice(0, 10)
  const [y, m, d] = data.split('-')
  if (!d || !m || !y) return isoOuBr
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

export function detalhesMedicamento(med: MedicamentoListagem): string {
  return [med.dosagemLabel, med.quantidadeLabel, med.frequenciaLabel, med.viaLabel]
    .filter(Boolean)
    .join(' • ')
}
