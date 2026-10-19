import {
  formatarQuantidadeAlimento,
} from './prescricaoNutricional.listagem.utils'
import type { AlimentoPrescritoResponse } from '@/services/prescricaoNutricional.types'

type LinhaAlimentoLeituraProps = {
  alimento: AlimentoPrescritoResponse
}

export function LinhaAlimentoLeitura({ alimento }: LinhaAlimentoLeituraProps) {
  const quantidade = formatarQuantidadeAlimento(alimento)
  const observacao = alimento.observacao?.trim()

  return (
    <li className="grid grid-cols-1 gap-1 border-b border-surface-100 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1fr)] sm:items-baseline sm:gap-3">
      <p className="text-sm font-medium text-text">{alimento.descricao}</p>
      <p className="text-sm text-text-muted sm:text-right">
        {quantidade || '—'}
      </p>
      <p className="text-xs text-text-muted sm:text-right">
        {observacao || ' '}
      </p>
    </li>
  )
}
