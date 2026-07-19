import { useCallback, useEffect, useState } from 'react'
import emptyExerciciosSvg from '@/assets/empty-exercicios.svg'
import { ButtonCadastro, EmptyState } from '@/components'
import { CardPrescricaoExercicio } from '@/components/PrescricaoExercicios'
import { prescricaoExercicioService } from '@/services'
import type { PrescricaoExercicioResponse } from '@/services/prescricaoExercicio.mappers'

type AbaExerciciosProps = {
  pacienteId: number
  onNovaPrescricao: () => void
}

export function AbaExercicios({
  pacienteId,
  onNovaPrescricao,
}: AbaExerciciosProps) {
  const [prescricoes, setPrescricoes] = useState<
    PrescricaoExercicioResponse[]
  >([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      setPrescricoes(
        await prescricaoExercicioService.listarAtivas(pacienteId)
      )
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar prescrições de exercícios.'
      )
      setPrescricoes([])
    } finally {
      setLoading(false)
    }
  }, [pacienteId])

  useEffect(() => {
    void carregar()
  }, [carregar])

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-zinc-200 bg-white">
        <p className="text-sm text-text-muted">Carregando prescrições...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-10">
        <p className="text-center text-sm text-red-600">{erro}</p>
        <button
          type="button"
          onClick={() => void carregar()}
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (prescricoes.length === 0) {
    return (
      <EmptyState
        illustration={
          <img
            src={emptyExerciciosSvg}
            alt=""
            className="mx-auto max-h-56 w-auto sm:max-h-80"
          />
        }
        title="Nenhuma prescrição de exercícios encontrada!"
        description="Adicione uma prescrição para acompanhar as atividades físicas do participante."
        className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-sm"
      >
        <ButtonCadastro
          label="Nova prescrição"
          onClick={onNovaPrescricao}
        />
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-600">
          Prescrições ativas
        </p>
        <ButtonCadastro
          label="Nova prescrição"
          onClick={onNovaPrescricao}
        />
      </div>
      <div className="flex flex-col gap-3">
        {prescricoes.map((prescricao) => (
          <CardPrescricaoExercicio
            key={prescricao.id}
            prescricao={prescricao}
          />
        ))}
      </div>
    </div>
  )
}
