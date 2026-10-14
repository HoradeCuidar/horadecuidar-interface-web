import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { usePrescricaoNutricionalForm } from '@/hooks/usePrescricaoNutricionalForm'
import { FormularioPrescricaoNutricional } from '@/components/PrescricaoNutricional'
import { prescricaoNutricionalService } from '@/services'
import { validarPrescricaoNutricionalForm } from '@/services/prescricaoNutricional.mappers'

export function CadastroPrescricaoNutricional() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { paciente, loading, erro } = usePerfilPaciente(id)
  const [salvando, setSalvando] = useState(false)
  const formState = usePrescricaoNutricionalForm()

  useEffect(() => {
    if (paciente?.nome) {
      formState.handleChangeCampo('nomeParticipante', paciente.nome)
    }
  }, [paciente?.nome])

  function voltarParaPerfil() {
    navigate(`/pacientes/${id}`, { state: { aba: 'alimentacao' } })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const erroValidacao = validarPrescricaoNutricionalForm(formState.form)
    if (erroValidacao) {
      toast.error(erroValidacao)
      return
    }

    if (!id) {
      toast.error('Participante inválido.')
      return
    }

    setSalvando(true)
    try {
      await prescricaoNutricionalService.criar(Number(id), formState.form)
      toast.success('Prescrição nutricional salva com sucesso.')
      voltarParaPerfil()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar a prescrição.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-text-muted">Carregando...</p>
      </div>
    )
  }

  if (erro || !paciente) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar onClick={() => navigate('/pacientes')}>Voltar</BotaoVoltar>
        <p className="text-sm text-error-500">
          {erro ?? 'Participante não encontrado.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltarParaPerfil}>
          Voltar para o perfil de {paciente.nome}
        </BotaoVoltar>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <FormularioPrescricaoNutricional
            form={formState.form}
            onChangeCampo={formState.handleChangeCampo}
            onChangeRefeicao={formState.handleChangeRefeicao}
            onChangeOpcao={formState.handleChangeOpcao}
            onChangeAlimento={formState.handleChangeAlimento}
            onAdicionarRefeicao={formState.handleAdicionarRefeicao}
            onRemoverRefeicao={formState.handleRemoverRefeicao}
            onAdicionarOpcao={formState.handleAdicionarOpcao}
            onRemoverOpcao={formState.handleRemoverOpcao}
            onAdicionarAlimento={formState.handleAdicionarAlimento}
            onRemoverAlimento={formState.handleRemoverAlimento}
            onSubmit={handleSubmit}
            onCancelar={voltarParaPerfil}
            salvando={salvando}
            modo="criar"
          />
        </div>
      </div>
    </div>
  )
}
