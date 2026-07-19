import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import {
  FormularioPrescricaoExercicio,
  criarExercicioVazio,
  type ExercicioForm,
  type PrescricaoExercicioFormData,
} from '@/components/PrescricaoExercicios'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import {
  prescricaoExercicioService,
  validarPrescricaoExercicioForm,
} from '@/services'

export function CadastroPrescricaoExercicios() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { paciente, loading, erro } = usePerfilPaciente(id)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState<PrescricaoExercicioFormData>({
    nomeParticipante: '',
    dataInicio: '',
    dataFim: '',
    observacao: '',
    exercicios: [criarExercicioVazio()],
  })

  useEffect(() => {
    if (paciente?.nome) {
      setForm((prev) => ({ ...prev, nomeParticipante: paciente.nome }))
    }
  }, [paciente?.nome])

  function voltarParaPerfil() {
    navigate(`/pacientes/${id}`, { state: { aba: 'exercicios' } })
  }

  function handleChangeCampo<
    K extends keyof Omit<PrescricaoExercicioFormData, 'exercicios'>,
  >(campo: K, valor: PrescricaoExercicioFormData[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function handleChangeExercicio(
    exercicioId: string,
    campo: keyof ExercicioForm,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      exercicios: prev.exercicios.map((item) =>
        item.id === exercicioId ? { ...item, [campo]: valor } : item
      ),
    }))
  }

  function handleAdicionarExercicio() {
    setForm((prev) => ({
      ...prev,
      exercicios: [...prev.exercicios, criarExercicioVazio()],
    }))
  }

  function handleRemoverExercicio(exercicioId: string) {
    setForm((prev) => ({
      ...prev,
      exercicios: prev.exercicios.filter((item) => item.id !== exercicioId),
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const erroValidacao = validarPrescricaoExercicioForm(form)
    if (erroValidacao) {
      toast.error(erroValidacao)
      return
    }
    if (!id) {
      toast.error('Paciente inválido.')
      return
    }

    setSalvando(true)
    try {
      await prescricaoExercicioService.criar(Number(id), form)
      toast.success('Prescrição de exercícios salva com sucesso.')
      voltarParaPerfil()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar a prescrição de exercícios.'
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
        <p className="text-sm text-red-600">
          {erro ?? 'Paciente não encontrado.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltarParaPerfil}>Voltar</BotaoVoltar>
      </div>
      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <FormularioPrescricaoExercicio
            form={form}
            onChangeCampo={handleChangeCampo}
            onChangeExercicio={handleChangeExercicio}
            onAdicionarExercicio={handleAdicionarExercicio}
            onRemoverExercicio={handleRemoverExercicio}
            onSubmit={handleSubmit}
            onCancelar={voltarParaPerfil}
            salvando={salvando}
          />
        </div>
      </main>
    </div>
  )
}
