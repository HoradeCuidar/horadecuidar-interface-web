import { FiEdit2 } from 'react-icons/fi'
import type { AvaliacaoFisica } from '@/services/avaliacaoFisica.types'
import {
  formatarDataAvaliacao,
  labelFlexibilidade,
} from './avaliacaoFisica.utils'

type CardAvaliacaoFisicaProps = {
  item: AvaliacaoFisica
  podeEditar: boolean
  onEditar: () => void
}

export function CardAvaliacaoFisica({
  item,
  podeEditar,
  onEditar,
}: CardAvaliacaoFisicaProps) {
  const nomeProf =
    item.profissional.nome?.trim() ||
    item.profissional.username?.trim() ||
    'Profissional'

  return (
    <article className="rounded-xl border border-brand-200 border-l-4 border-l-brand-500 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold tracking-tight text-text">
            {formatarDataAvaliacao(item.dataRegistro)}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">por {nomeProf}</p>
        </div>
        {podeEditar && (
          <button
            type="button"
            onClick={onEditar}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
          >
            <FiEdit2 className="size-4" aria-hidden />
            Editar
          </button>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Atividade física</dt>
          <dd className="font-medium text-text">
            {item.realizaAtividadeFisica
              ? `${item.atividadeRealizada ?? 'Sim'}${
                  item.frequenciaSemanal != null
                    ? ` · ${item.frequenciaSemanal}x/semana`
                    : ''
                }`
              : 'Não realiza'}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Flexibilidade</dt>
          <dd className="font-medium text-text">
            {labelFlexibilidade(item.flexibilidade)}
          </dd>
        </div>
      </dl>

      {item.indicacoesFuncionais.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.indicacoesFuncionais.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700"
            >
              {tag.nome}
            </span>
          ))}
        </div>
      )}

      {item.orientacoesGerais?.trim() && (
        <p className="mt-3 line-clamp-2 text-xs text-text-muted">
          {item.orientacoesGerais}
        </p>
      )}
    </article>
  )
}
