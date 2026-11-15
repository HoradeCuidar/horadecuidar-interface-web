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
  const substituicoes = [...(alimento.substituicoes ?? [])].sort(
    (a, b) => a.ordem - b.ordem
  )

  return (
    <li className="border-b border-surface-100 py-2.5 last:border-b-0">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1fr)] sm:items-baseline sm:gap-3">
        <p className="text-sm font-medium text-text">{alimento.descricao}</p>
        <p className="text-sm text-text-muted sm:text-right">
          {[quantidade, alimento.medidaCaseira].filter(Boolean).join(' · ') || '—'}
        </p>
        <p className="text-xs text-text-muted sm:text-right">
          {observacao || ' '}
        </p>
      </div>
      {substituicoes.length > 0 ? (
        <div className="mt-1 text-xs text-text-muted">
          <span className="font-semibold">Pode substituir por: </span>
          {substituicoes
            .map((sub) =>
              [sub.descricao, `${sub.quantidade} ${sub.unidade}`, sub.medidaCaseira, sub.observacao]
                .filter(Boolean)
                .join(' · ')
            )
            .join(' ou ')}
        </div>
      ) : null}
    </li>
  )
}
