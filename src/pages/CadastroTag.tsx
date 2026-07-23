import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { FormularioTag } from '@/components/TagsFuncionais'
import { tagFuncionalService } from '@/services'
import type { TagFuncionalCreate } from '@/services/tagFuncional'

export function CadastroTag() {
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(dados: TagFuncionalCreate) {
    setSalvando(true)
    try {
      await tagFuncionalService.criar(dados)
      toast.success('Tag cadastrada com sucesso.')
      navigate('/atividades/tags')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao cadastrar tag.'
      )
    } finally {
      setSalvando(false)
    }
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
            titulo="Nova tag"
            descricaoPagina="Cadastre uma tag para classificar exercícios do catálogo."
            labelSalvar="Salvar tag"
            salvando={salvando}
            onSubmit={handleSubmit}
            onCancelar={() => navigate('/atividades/tags')}
          />
        </div>
      </main>
    </div>
  )
}
