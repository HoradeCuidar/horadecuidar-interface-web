import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { FormularioExercicio } from '@/components/OrientacoesFuncionais'
import { orientacaoFuncionalService } from '@/services'
import type { OrientacaoFuncionalRequest } from '@/services/orientacaoFuncional.types'

export function CadastroAtividade() {
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(
    dados: OrientacaoFuncionalRequest,
    imagem: File | null
  ) {
    setSalvando(true)
    try {
      await orientacaoFuncionalService.criar(dados, imagem)
      toast.success('Exercício cadastrado com sucesso.')
      navigate('/atividades')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao cadastrar exercício.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={() => navigate('/atividades')}>Voltar</BotaoVoltar>
      </div>

      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <FormularioExercicio
            titulo="Novo exercício"
            descricaoPagina="Cadastre uma orientação funcional no catálogo global."
            labelSalvar="Salvar exercício"
            salvando={salvando}
            onSubmit={handleSubmit}
            onCancelar={() => navigate('/atividades')}
          />
        </div>
      </main>
    </div>
  )
}
