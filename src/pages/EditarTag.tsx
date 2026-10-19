import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar, Skeleton } from '@/components'
import {
  FormularioTag,
  type ValoresFormTag,
} from '@/components/TagsFuncionais'
import { tagFuncionalService } from '@/services'
import type { TagFuncionalCreate } from '@/services/tagFuncional'

export function EditarTag() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [valores, setValores] = useState<ValoresFormTag | null>(null)

  useEffect(() => {
    const tagId = Number(id)
    if (!id || Number.isNaN(tagId)) {
      setErro('Tag inválida.')
      setCarregando(false)
      return
    }

    let ativo = true
    setCarregando(true)
    setErro(null)

    tagFuncionalService
      .buscarPorId(tagId)
      .then((tag) => {
        if (!ativo) return
        setValores({
          nome: tag.nome,
          descricao: tag.descricao ?? '',
        })
      })
      .catch((err) => {
        if (!ativo) return
        setErro(err instanceof Error ? err.message : 'Erro ao carregar tag.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  async function handleSubmit(dados: TagFuncionalCreate) {
    const tagId = Number(id)
    if (Number.isNaN(tagId)) return

    setSalvando(true)
    try {
      await tagFuncionalService.atualizar(tagId, dados)
      toast.success('Tag atualizada com sucesso.')
      navigate('/atividades/tags')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao atualizar tag.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="mx-auto h-72 w-full max-w-2xl rounded-xl" />
      </div>
    )
  }

  if (erro || !valores) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={() => navigate('/atividades/tags')}>
          Voltar
        </BotaoVoltar>
        <p className="text-sm text-red-600">{erro ?? 'Tag não encontrada.'}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={() => navigate('/atividades/tags')}>
          Voltar
        </BotaoVoltar>
      </div>

      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <FormularioTag
            titulo="Editar tag"
            descricaoPagina="Atualize os dados da tag funcional."
            labelSalvar="Salvar alterações"
            valoresIniciais={valores}
            salvando={salvando}
            onSubmit={handleSubmit}
            onCancelar={() => navigate('/atividades/tags')}
          />
        </div>
      </main>
    </div>
  )
}
