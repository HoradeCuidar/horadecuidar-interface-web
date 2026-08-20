import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, ButtonCadastro, Skeleton } from '@/components'
import emptyExerciciosSvg from '@/assets/empty-exercicios.svg'
import { authService, avaliacaoFisicaService } from '@/services'
import type { AvaliacaoFisica } from '@/services/avaliacaoFisica.types'
import { CardAvaliacaoFisica } from './CardAvaliacaoFisica'

type AbaAvaliacaoFisicaProps = {
  pacienteId: number
}

export function AbaAvaliacaoFisica({ pacienteId }: AbaAvaliacaoFisicaProps) {
  const navigate = useNavigate()
  const userId = authService.getUser()?.id
  const [lista, setLista] = useState<AvaliacaoFisica[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      setLista(await avaliacaoFisicaService.listar(pacienteId))
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : 'Erro ao carregar avaliações.'
      )
    } finally {
      setLoading(false)
    }
  }, [pacienteId])

  useEffect(() => {
    void carregar()
  }, [carregar])

  if (loading && lista.length === 0 && !erro) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
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

  if (lista.length === 0) {
    return (
      <EmptyState
        illustration={
          <img
            src={emptyExerciciosSvg}
            alt=""
            className="mx-auto max-h-[14rem] w-auto sm:max-h-[20rem]"
          />
        }
        title="Nenhuma avaliação física registrada!"
        description="Cadastre a primeira avaliação física deste participante."
        className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-card"
      >
        <ButtonCadastro
          label="Nova avaliação"
          onClick={() =>
            navigate(`/pacientes/${pacienteId}/avaliacoes/nova`)
          }
        />
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-muted">
          Avaliações físicas
        </p>
        <ButtonCadastro
          label="Nova avaliação"
          onClick={() =>
            navigate(`/pacientes/${pacienteId}/avaliacoes/nova`)
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        {lista.map((item) => (
          <CardAvaliacaoFisica
            key={item.id}
            item={item}
            podeEditar={userId != null && item.profissional.id === userId}
            onEditar={() =>
              navigate(
                `/pacientes/${pacienteId}/avaliacoes/${item.id}/editar`
              )
            }
          />
        ))}
      </div>
    </div>
  )
}
