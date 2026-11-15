import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { Input, Select } from '@/components'
import { OPCOES_UNIDADE_MEDIDA } from '@/services/prescricaoNutricional.types'
import { BOTAO_REMOVER } from './formularioNutricional.styles'
import { criarSubstituicaoVazia, type AlimentoForm, type SubstituicaoForm } from './prescricaoNutricional.types'

type ItemAlimentoProps = {
  alimento: AlimentoForm
  indice: number
  podeRemover: boolean
  onChange: (id: string, campo: keyof AlimentoForm, valor: string | SubstituicaoForm[]) => void
  onRemover: (id: string) => void
}

export function ItemAlimento({
  alimento,
  indice,
  podeRemover,
  onChange,
  onRemover,
}: ItemAlimentoProps) {
  return (
    <div className="rounded-xl border border-surface-100 bg-surface-0/80 p-3 sm:p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          Alimento {indice + 1}
        </p>
        {podeRemover ? (
          <button
            type="button"
            onClick={() => onRemover(alimento.id)}
            className={BOTAO_REMOVER}
            aria-label={`Remover alimento ${indice + 1}`}
          >
            <FiTrash2 className="size-3.5" aria-hidden />
            Remover
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Descrição"
          size="compact"
          value={alimento.descricao}
          onChange={(e) => onChange(alimento.id, 'descricao', e.target.value)}
          placeholder="Ex.: Arroz integral"
        />
        <Input
          label="Quantidade"
          size="compact"
          inputMode="decimal"
          value={alimento.quantidade}
          onChange={(e) => onChange(alimento.id, 'quantidade', e.target.value)}
          placeholder="Ex.: 100"
        />
        <Select
          label="Unidade"
          size="compact"
          options={OPCOES_UNIDADE_MEDIDA}
          value={alimento.unidade}
          onChange={(e) => onChange(alimento.id, 'unidade', e.target.value)}
        />
        <Input
          label="Observação"
          size="compact"
          value={alimento.observacao}
          onChange={(e) => onChange(alimento.id, 'observacao', e.target.value)}
          placeholder="Opcional"
        />
      </div>
      <div className="mt-3">
        <Input label="Medida caseira" size="compact" value={alimento.medidaCaseira}
          onChange={(e) => onChange(alimento.id, 'medidaCaseira', e.target.value)}
          placeholder="Ex.: 5 colheres de sopa cheias" />
        <p className="mt-3 text-xs font-semibold text-text">Substituições deste alimento</p>
        {alimento.substituicoes.map((sub) => (
          <div key={sub.id} className="mt-2 rounded-xl border border-surface-100 bg-white p-3">
            <button type="button" className={BOTAO_REMOVER}
              onClick={() => onChange(alimento.id, 'substituicoes', alimento.substituicoes.filter((x) => x.id !== sub.id))}>
              <FiTrash2 className="size-3.5" aria-hidden /> Remover substituição
            </button>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {([['Descrição', 'descricao'], ['Ordem', 'ordem'], ['Quantidade', 'quantidade'], ['Medida caseira', 'medidaCaseira'], ['Observação', 'observacao']] as const).map(([label, campo]) => (
                <Input key={campo} label={label} size="compact" value={sub[campo]}
                  onChange={(e) => onChange(alimento.id, 'substituicoes', alimento.substituicoes.map((x) => x.id === sub.id ? { ...x, [campo]: e.target.value } : x))} />
              ))}
              <Select label="Unidade" size="compact" options={OPCOES_UNIDADE_MEDIDA} value={sub.unidade}
                onChange={(e) => onChange(alimento.id, 'substituicoes', alimento.substituicoes.map((x) => x.id === sub.id ? { ...x, unidade: e.target.value as SubstituicaoForm['unidade'] } : x))} />
            </div>
          </div>
        ))}
        <button type="button" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"
          onClick={() => onChange(alimento.id, 'substituicoes', [...alimento.substituicoes, criarSubstituicaoVazia(alimento.substituicoes.length + 1)])}>
          <FiPlus className="size-4" aria-hidden /> Adicionar substituição
        </button>
      </div>
    </div>
  )
}
