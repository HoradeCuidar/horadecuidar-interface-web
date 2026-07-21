import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { EmptyState, ButtonCadastro, Skeleton } from '@/components'
import {
  CardExercicio,
  ModalConfirmacaoStatusExercicio,
  ModalConfirmacaoExcluirExercicio,
} from '@/components/OrientacoesFuncionais'
import { orientacaoFuncionalService } from '@/services'
import emptyExerciciosSvg from '@/assets/empty-exercicios.svg'
import type {
  OrientacaoFuncionalResponse,
  SpringPage,
} from '@/services/orientacaoFuncional.types'

const PAGE_SIZE = 12

export function Atividades() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [data, setData] = useState<SpringPage<OrientacaoFuncionalResponse> | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [exercicioStatus, setExercicioStatus] =
    useState<OrientacaoFuncionalResponse | null>(null)
  const [exercicioExcluir, setExercicioExcluir] =
    useState<OrientacaoFuncionalResponse | null>(null)

  const carregar = useCallback(async (p: number) => {
    setLoading(true)
    setErro(null)
    try {
      const resultado = await orientacaoFuncionalService.listar(p, PAGE_SIZE)
      setData(resultado)
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : 'Erro ao carregar exercícios.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void carregar(page)
  }, [page, carregar])

  function handleSucessoAcao() {
    void carregar(page)
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
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
          onClick={() => void carregar(page)}
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const items = data?.content ?? []

  const modais = (
    <>
      <ModalConfirmacaoStatusExercicio
        aberto={exercicioStatus != null}
        onFechar={() => setExercicioStatus(null)}
        onSucesso={handleSucessoAcao}
        exercicioId={exercicioStatus?.id ?? null}
        nomeExercicio={exercicioStatus?.nome ?? ''}
        ativar={exercicioStatus ? !exercicioStatus.ativo : false}
      />
      <ModalConfirmacaoExcluirExercicio
        aberto={exercicioExcluir != null}
        onFechar={() => setExercicioExcluir(null)}
        onSucesso={handleSucessoAcao}
        exercicioId={exercicioExcluir?.id ?? null}
        nomeExercicio={exercicioExcluir?.nome ?? ''}
      />
    </>
  )

  if (items.length === 0 && page === 0) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-text sm:text-2xl">Exercícios</h1>
        <EmptyState
          illustration={
            <img
              src={emptyExerciciosSvg}
              alt=""
              className="mx-auto max-h-56 w-auto sm:max-h-80"
            />
          }
          title="Nenhum exercício cadastrado!"
          description="Cadastre orientações funcionais no catálogo global."
          className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-sm"
        >
          <ButtonCadastro
            label="Novo exercício"
            onClick={() => navigate('/atividades/nova')}
          />
        </EmptyState>
        {modais}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-text sm:text-2xl">Exercícios</h1>
        <ButtonCadastro
          label="Novo exercício"
          onClick={() => navigate('/atividades/nova')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <CardExercicio
            key={item.id}
            item={item}
            onAlterarStatus={setExercicioStatus}
            onExcluir={setExercicioExcluir}
          />
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            disabled={data.first}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-40"
          >
            <FiChevronLeft className="size-4" aria-hidden />
            Anterior
          </button>
          <span className="text-sm text-zinc-500">
            Página {data.number + 1} de {data.totalPages}
          </span>
          <button
            type="button"
            disabled={data.last}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-40"
          >
            Próxima
            <FiChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      )}

      {modais}
    </div>
  )
}
