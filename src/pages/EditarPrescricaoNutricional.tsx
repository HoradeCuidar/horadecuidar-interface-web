import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { usePrescricaoNutricionalForm } from '@/hooks/usePrescricaoNutricionalForm'
import { FormularioPrescricaoNutricional } from '@/components/PrescricaoNutricional'
import { prescricaoNutricionalService } from '@/services'
import {
  responseToPrescricaoNutricionalForm,
  validarPrescricaoNutricionalForm,
} from '@/services/prescricaoNutricional.mappers'

export function EditarPrescricaoNutricional() {
  const { id, prescricaoId } = useParams<{
    id: string
    prescricaoId: string
  }>()
  const navigate = useNavigate()
  const { paciente, loading: loadingPaciente, erro: erroPaciente } =
    usePerfilPaciente(id)
  const formState = usePrescricaoNutricionalForm()
  const { setFormCompleto } = formState
  const [carregando, setCarregando] = useState(true)
  const [erroCarregar, setErroCarregar] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  function voltarParaPerfil() {
    navigate(`/pacientes/${id}`, { state: { aba: 'alimentacao' } })
  }

  useEffect(() => {
    if (!id || !prescricaoId || loadingPaciente) return
    if (erroPaciente || !paciente) {
      setCarregando(false)
      return
    }

    let ativo = true
    setCarregando(true)
    setErroCarregar(null)

    void prescricaoNutricionalService
      .buscarPorId(Number(prescricaoId))
      .then((dto) => {
        if (!ativo) return
        setFormCompleto(
          responseToPrescricaoNutricionalForm(dto, paciente.nome)
        )
      })
      .catch((err) => {
        if (!ativo) return
        setErroCarregar(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar a prescrição nutricional.'
        )
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id, prescricaoId, paciente, loadingPaciente, erroPaciente, setFormCompleto])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const erroValidacao = validarPrescricaoNutricionalForm(formState.form)
    if (erroValidacao) {
      toast.error(erroValidacao)
      return
    }

    if (!prescricaoId) {
      toast.error('Prescrição inválida.')
      return
    }

    setSalvando(true)
    try {
      await prescricaoNutricionalService.editar(
        Number(prescricaoId),
        formState.form
      )
      toast.success('Prescrição nutricional atualizada com sucesso.')
      voltarParaPerfil()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar as alterações.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (loadingPaciente || carregando) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-text-muted">Carregando...</p>
      </div>
    )
  }

  if (erroPaciente || !paciente) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar onClick={() => navigate('/pacientes')}>Voltar</BotaoVoltar>
        <p className="text-sm text-error-500">
          {erroPaciente ?? 'Participante não encontrado.'}
        </p>
      </div>
    )
  }

  if (erroCarregar) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar onClick={voltarParaPerfil}>Voltar</BotaoVoltar>
        <p className="text-sm text-error-500">{erroCarregar}</p>
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
            modo="editar"
          />
        </div>
      </div>
    </div>
  )
}
