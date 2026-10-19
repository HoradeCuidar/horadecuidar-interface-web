import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import {
  FormularioPrescricao,
  criarMedicamentoVazio,
  type MedicamentoForm,
  type PrescricaoFormData,
} from '@/components/PrescricaoMedicamentos'
import { prescricaoMedicamentoService } from '@/services'
import { validarPrescricaoForm } from '@/services/prescricaoMedicamento.mappers'

export function CadastroPrescricaoMedicamentos() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { paciente, loading, erro } = usePerfilPaciente(id)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState<PrescricaoFormData>({
    nomeParticipante: '',
    dataInicio: '',
    dataTermino: '',
    observacaoGeral: '',
    medicamentos: [criarMedicamentoVazio()],
  })

  useEffect(() => {
    if (paciente?.nome) {
      setForm((prev) => ({ ...prev, nomeParticipante: paciente.nome }))
    }
  }, [paciente?.nome])

  function voltarParaPerfil() {
    navigate(`/pacientes/${id}`, { state: { aba: 'medicamentos' } })
  }

  function handleChangeCampo<K extends keyof Omit<PrescricaoFormData, 'medicamentos'>>(
    campo: K,
    valor: PrescricaoFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function handleChangeMedicamento(
    medId: string,
    campo: keyof MedicamentoForm,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((m) =>
        m.id === medId ? { ...m, [campo]: valor } : m
      ),
    }))
  }

  function handleAdicionarMedicamento() {
    setForm((prev) => ({
      ...prev,
      medicamentos: [...prev.medicamentos, criarMedicamentoVazio()],
    }))
  }

  function handleRemoverMedicamento(medId: string) {
    setForm((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((m) => m.id !== medId),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const erroValidacao = validarPrescricaoForm(form)
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
      await prescricaoMedicamentoService.criar(Number(id), form)
      toast.success('Prescrição salva com sucesso.')
      voltarParaPerfil()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar a prescrição.')
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
        <p className="text-sm text-red-600">{erro ?? 'Participante não encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltarParaPerfil}>Voltar</BotaoVoltar>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <FormularioPrescricao
            form={form}
            onChangeCampo={handleChangeCampo}
            onChangeMedicamento={handleChangeMedicamento}
            onAdicionarMedicamento={handleAdicionarMedicamento}
            onRemoverMedicamento={handleRemoverMedicamento}
            onSubmit={handleSubmit}
            onCancelar={voltarParaPerfil}
            salvando={salvando}
          />
        </div>
      </div>
    </div>
  )
}
