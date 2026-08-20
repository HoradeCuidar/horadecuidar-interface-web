import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar, Skeleton } from '@/components'
import {
  FormularioAvaliacaoFisica,
  responseToForm,
  type ValoresFormAvaliacao,
} from '@/components/AvaliacaoFisica'
import { authService, avaliacaoFisicaService } from '@/services'
import type { AvaliacaoFisicaRequest } from '@/services/avaliacaoFisica.types'

export function EditarAvaliacaoFisica() {
  const { id, avaliacaoId } = useParams<{
    id: string
    avaliacaoId: string
  }>()
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [valores, setValores] = useState<ValoresFormAvaliacao | null>(null)

  const pacienteId = Number(id)
  const avId = Number(avaliacaoId)

  function voltar() {
    navigate(`/pacientes/${id}`, { state: { aba: 'avaliacao' } })
  }

  useEffect(() => {
    if (!id || Number.isNaN(pacienteId) || !avaliacaoId || Number.isNaN(avId)) {
      setErro('Avaliação inválida.')
      setCarregando(false)
      return
    }

    let ativo = true
    setCarregando(true)
    setErro(null)

    avaliacaoFisicaService
      .buscarPorId(pacienteId, avId)
      .then((avaliacao) => {
        if (!ativo) return
        const userId = authService.getUser()?.id
        if (userId == null || avaliacao.profissional.id !== userId) {
          setErro('Apenas o profissional que criou a avaliação pode editá-la.')
          return
        }
        setValores(responseToForm(avaliacao))
      })
      .catch((err) => {
        if (!ativo) return
        setErro(
          err instanceof Error ? err.message : 'Erro ao carregar avaliação.'
        )
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id, avaliacaoId, pacienteId, avId])

  async function handleSubmit(dados: AvaliacaoFisicaRequest) {
    setSalvando(true)
    try {
      await avaliacaoFisicaService.atualizar(pacienteId, avId, dados)
      toast.success('Avaliação física atualizada com sucesso.')
      voltar()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao atualizar avaliação.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="mx-auto h-96 w-full max-w-3xl rounded-xl" />
      </div>
    )
  }

  if (erro || !valores) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltar}>Voltar</BotaoVoltar>
        <p className="text-sm text-red-600">
          {erro ?? 'Avaliação não encontrada.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltar}>Voltar</BotaoVoltar>
      </div>
      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <FormularioAvaliacaoFisica
            titulo="Editar avaliação física"
            descricaoPagina="Atualize os dados da avaliação física."
            labelSalvar="Salvar alterações"
            valoresIniciais={valores}
            salvando={salvando}
            onSubmit={handleSubmit}
            onCancelar={voltar}
          />
        </div>
      </main>
    </div>
  )
}
