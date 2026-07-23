import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, ButtonCadastro, Skeleton } from '@/components'
import {
  CardTag,
  ModalConfirmacaoExcluirTag,
} from '@/components/TagsFuncionais'
import { tagFuncionalService } from '@/services'
import type { TagFuncional } from '@/services/orientacaoFuncional.types'

export function Tags() {
  const navigate = useNavigate()
  const [tags, setTags] = useState<TagFuncional[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tagExcluir, setTagExcluir] = useState<TagFuncional | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      setTags(await tagFuncionalService.listar())
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar tags.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  if (loading && tags.length === 0 && !erro) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16">
        <p className="text-sm text-red-600">{erro}</p>
        <button
          type="button"
          onClick={() => void carregar()}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const modal = (
    <ModalConfirmacaoExcluirTag
      aberto={tagExcluir != null}
      onFechar={() => setTagExcluir(null)}
      onSucesso={() => void carregar()}
      tagId={tagExcluir?.id ?? null}
      nomeTag={tagExcluir?.nome ?? ''}
    />
  )

  if (tags.length === 0) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="font-heading text-xl font-bold tracking-tight text-text sm:text-2xl">
          Tags
        </h1>
        <EmptyState
          title="Nenhuma tag cadastrada!"
          description="Cadastre tags para organizar os exercícios do catálogo."
          className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-card"
        >
          <ButtonCadastro
            label="Nova tag"
            onClick={() => navigate('/atividades/tags/nova')}
          />
        </EmptyState>
        {modal}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-bold tracking-tight text-text sm:text-2xl">
          Tags
        </h1>
        <ButtonCadastro
          label="Nova tag"
          onClick={() => navigate('/atividades/tags/nova')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <CardTag
            key={tag.id}
            item={tag}
            onEditar={(item) => navigate(`/atividades/tags/${item.id}/editar`)}
            onExcluir={setTagExcluir}
          />
        ))}
      </div>

      {modal}
    </div>
  )
}
