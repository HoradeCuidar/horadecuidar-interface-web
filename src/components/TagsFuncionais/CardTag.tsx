import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import type { TagFuncional } from '@/services/orientacaoFuncional.types'

type CardTagProps = {
  item: TagFuncional
  onEditar: (tag: TagFuncional) => void
  onExcluir: (tag: TagFuncional) => void
}

export function CardTag({ item, onEditar, onExcluir }: CardTagProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-brand-200 border-l-4 border-l-brand-500 bg-white p-4 shadow-card">
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-heading text-base font-bold tracking-tight text-text">
          {item.nome}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-text-muted">
          {item.descricao?.trim() || 'Sem descrição'}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-3">
        <button
          type="button"
          onClick={() => onEditar(item)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
        >
          <FiEdit2 className="size-4" aria-hidden />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onExcluir(item)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-error-500 transition hover:bg-error-500/15"
        >
          <FiTrash2 className="size-4" aria-hidden />
          Excluir
        </button>
      </div>
    </article>
  )
}
