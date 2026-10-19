import { FiInfo } from 'react-icons/fi'
import { CardRefeicaoLeitura } from './CardRefeicaoLeitura'
import type { PrescricaoNutricionalResponse } from '@/services/prescricaoNutricional.types'

type DetalhePrescricaoNutricionalProps = {
  detalhe: PrescricaoNutricionalResponse
}

export function DetalhePrescricaoNutricional({
  detalhe,
}: DetalhePrescricaoNutricionalProps) {
  const refeicoes = [...(detalhe.refeicoes ?? [])].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
  )
  const observacoes = detalhe.observacoes?.trim()

  return (
    <div className="mt-4 space-y-3">
      {observacoes ? (
        <div className="flex gap-2.5 rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-3">
          <FiInfo
            className="mt-0.5 size-4 shrink-0 text-brand-600"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
              Orientações gerais
            </p>
            <p className="mt-1 text-sm leading-relaxed text-brand-900/80">
              {observacoes}
            </p>
          </div>
        </div>
      ) : null}

      {refeicoes.length === 0 ? (
        <p className="text-sm text-text-muted">Nenhuma refeição cadastrada.</p>
      ) : (
        refeicoes.map((refeicao, indexRefeicao) => (
          <CardRefeicaoLeitura
            key={`${refeicao.nome}-${refeicao.ordem}-${indexRefeicao}`}
            refeicao={refeicao}
          />
        ))
      )}
    </div>
  )
}
