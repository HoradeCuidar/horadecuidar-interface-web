import type { IconType } from 'react-icons'
import { FiCoffee, FiMoon, FiSun } from 'react-icons/fi'
import { MdRestaurant } from 'react-icons/md'
import {
  OPCOES_UNIDADE_MEDIDA,
  isStatusAtiva,
  type AlimentoPrescritoResponse,
  type StatusPrescricaoNutricional,
} from '@/services/prescricaoNutricional.types'

export function formatarDataNutricionalBr(isoOuBr: string): string {
  if (!isoOuBr) return '—'
  if (isoOuBr.includes('/')) return isoOuBr
  const data = isoOuBr.slice(0, 10)
  const [y, m, d] = data.split('-')
  if (!d || !m || !y) return isoOuBr
  const meses = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]
  const mes = meses[Number(m) - 1]
  if (!mes) return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
  return `${d.padStart(2, '0')} ${mes} ${y}`
}

export function formatarPeriodoNutricionalBr(
  inicio: string,
  fim: string
): string {
  const inicioFmt = formatarDataNutricionalBr(inicio)
  const fimFmt = fim ? formatarDataNutricionalBr(fim) : 'sem data fim'
  return `${inicioFmt} – ${fimFmt}`
}

export function estiloStatusNutricional(
  status: StatusPrescricaoNutricional | string
): { badge: string; rotulo: string } {
  const normalizado = String(status).toUpperCase()
  if (normalizado === 'ATIVA') {
    return { badge: 'bg-success/15 text-success-700', rotulo: 'Ativa' }
  }
  if (normalizado === 'INATIVA') {
    return { badge: 'bg-orange-100 text-orange-700', rotulo: 'Inativa' }
  }
  if (normalizado === 'ENCERRADA') {
    return { badge: 'bg-surface-0 text-text-muted', rotulo: 'Encerrada' }
  }
  return { badge: 'bg-surface-0 text-text-muted', rotulo: String(status) }
}

export function tituloPlanoNutricional(): string {
  return 'Plano alimentar'
}

export function rotuloUnidade(unidade: string): string {
  const encontrada = OPCOES_UNIDADE_MEDIDA.find(
    (o) => o.value === String(unidade).toUpperCase()
  )
  return encontrada?.label ?? unidade
}

export function formatarQuantidadeAlimento(
  alimento: AlimentoPrescritoResponse
): string {
  if (alimento.quantidade == null) return ''
  return `${alimento.quantidade} ${rotuloUnidade(alimento.unidade)}`.trim()
}

export function iconeRefeicaoPorNome(nome: string): IconType {
  const n = nome.toLowerCase()
  if (
    n.includes('café') ||
    n.includes('cafe') ||
    n.includes('manhã') ||
    n.includes('manha')
  ) {
    return FiSun
  }
  if (n.includes('jantar') || n.includes('noite') || n.includes('ceia')) {
    return FiMoon
  }
  if (n.includes('lanche') || n.includes('colação') || n.includes('colacao')) {
    return FiCoffee
  }
  return MdRestaurant
}

export { isStatusAtiva }
