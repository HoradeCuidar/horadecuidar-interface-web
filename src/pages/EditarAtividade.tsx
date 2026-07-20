import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar, Skeleton } from '@/components'
import {
  FormularioExercicio,
  type ValoresFormExercicio,
} from '@/components/OrientacoesFuncionais'
import { orientacaoFuncionalService } from '@/services'
import type { OrientacaoFuncionalRequest } from '@/services/orientacaoFuncional.types'

export function EditarAtividade() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [valores, setValores] = useState<ValoresFormExercicio | null>(null)

  useEffect(() => {
    const exercicioId = Number(id)
    if (!id || Number.isNaN(exercicioId)) {
      setErro('Exercício inválido.')
      setCarregando(false)
      return
    }

    let ativo = true
    setCarregando(true)
    setErro(null)

    orientacaoFuncionalService
      .buscarPorId(exercicioId)
      .then((exercicio) => {
        if (!ativo) return
        setValores({
          nome: exercicio.nome,
          descricao: exercicio.descricao ?? '',
          finalidade: exercicio.finalidade ?? '',
          tagsIds: exercicio.tags.map((tag) => tag.id),
          urlImagemAtual: exercicio.urlImagem,
        })
      })
      .catch((err) => {
        if (!ativo) return
        setErro(
          err instanceof Error ? err.message : 'Erro ao carregar exercício.'
        )
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  async function handleSubmit(
    dados: OrientacaoFuncionalRequest,
    imagem: File | null
  ) {
    const exercicioId = Number(id)
    if (Number.isNaN(exercicioId)) return

    setSalvando(true)
    try {
      await orientacaoFuncionalService.atualizar(exercicioId, dados, imagem)
      toast.success('Exercício atualizado com sucesso.')
      navigate('/atividades')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao atualizar exercício.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="mx-auto h-96 w-full max-w-2xl rounded-xl" />
      </div>
    )
  }

  if (erro || !valores) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={() => navigate('/atividades')}>Voltar</BotaoVoltar>
        <p className="text-sm text-red-600">{erro ?? 'Exercício não encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={() => navigate('/atividades')}>Voltar</BotaoVoltar>
      </div>

      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <FormularioExercicio
            titulo="Editar exercício"
            descricaoPagina="Atualize os dados da orientação funcional."
            labelSalvar="Salvar alterações"
            valoresIniciais={valores}
            salvando={salvando}
            onSubmit={handleSubmit}
            onCancelar={() => navigate('/atividades')}
          />
        </div>
      </main>
    </div>
  )
}
