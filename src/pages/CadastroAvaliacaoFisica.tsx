import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { FormularioAvaliacaoFisica } from '@/components/AvaliacaoFisica'
import { avaliacaoFisicaService } from '@/services'
import type { AvaliacaoFisicaRequest } from '@/services/avaliacaoFisica.types'

export function CadastroAvaliacaoFisica() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)
  const pacienteId = Number(id)

  function voltar() {
    navigate(`/pacientes/${id}`, { state: { aba: 'avaliacao' } })
  }

  if (!id || Number.isNaN(pacienteId)) {
    return (
      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <p className="text-sm text-red-600">Paciente inválido.</p>
      </div>
    )
  }

  async function handleSubmit(dados: AvaliacaoFisicaRequest) {
    setSalvando(true)
    try {
      await avaliacaoFisicaService.criar(pacienteId, dados)
      toast.success('Avaliação física cadastrada com sucesso.')
      voltar()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao cadastrar avaliação.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltar}>Voltar</BotaoVoltar>
      </div>
      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <FormularioAvaliacaoFisica
            titulo="Nova avaliação física"
            descricaoPagina="Registre os dados da avaliação física do participante."
            labelSalvar="Salvar avaliação"
            salvando={salvando}
            onSubmit={handleSubmit}
            onCancelar={voltar}
          />
        </div>
      </main>
    </div>
  )
}
