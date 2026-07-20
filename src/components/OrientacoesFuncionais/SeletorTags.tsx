import type { TagFuncional } from '@/services/orientacaoFuncional.types'

type SeletorTagsProps = {
  tags: TagFuncional[]
  selecionadas: number[]
  onChange: (ids: number[]) => void
  loading?: boolean
  erro?: string | null
}

export function SeletorTags({
  tags,
  selecionadas,
  onChange,
  loading = false,
  erro = null,
}: SeletorTagsProps) {
  function toggleTag(id: number) {
    if (selecionadas.includes(id)) {
      onChange(selecionadas.filter((tagId) => tagId !== id))
      return
    }
    onChange([...selecionadas, id])
  }

  if (loading) {
    return (
      <p className="text-sm text-text-muted">Carregando tags...</p>
    )
  }

  if (erro) {
    return <p className="text-sm text-red-600">{erro}</p>
  }

  if (tags.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Nenhuma tag cadastrada. O exercício será salvo sem tags.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-text">Tags (opcional)</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const ativa = selecionadas.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              title={tag.descricao ?? tag.nome}
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                ativa
                  ? 'border-brand-500 bg-brand-100 text-brand-700'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-brand-300'
              }`}
            >
              {tag.nome}
            </button>
          )
        })}
      </div>
    </div>
  )
}
