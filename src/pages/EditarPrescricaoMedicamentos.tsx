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
import {
  responseToForm,
  validarPrescricaoForm,
} from '@/services/prescricaoMedicamento.mappers'

export function EditarPrescricaoMedicamentos() {
  const { id, prescricaoId } = useParams<{ id: string; prescricaoId: string }>()
  const navigate = useNavigate()
  const { paciente, loading: loadingPaciente, erro: erroPaciente } = usePerfilPaciente(id)
  const [carregando, setCarregando] = useState(true)
  const [erroCarregar, setErroCarregar] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState<PrescricaoFormData>({
    nomeParticipante: '',
    dataInicio: '',
    dataTermino: '',
    observacaoGeral: '',
    medicamentos: [criarMedicamentoVazio()],
  })

  function voltarParaPerfil() {
    navigate(`/pacientes/${id}`, { state: { aba: 'medicamentos' } })
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

    prescricaoMedicamentoService
      .buscarPorId(Number(id), prescricaoId)
      .then((dto) => {
        if (!ativo) return
        setForm(responseToForm(dto, paciente.nome))
      })
      .catch((err) => {
        if (!ativo) return
        setErroCarregar(
          err instanceof Error ? err.message : 'Erro ao carregar prescricao.'
        )
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id, prescricaoId, paciente, loadingPaciente, erroPaciente])

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
    if (!id || !prescricaoId) {
      toast.error('Dados invalidos.')
      return
    }

    setSalvando(true)
    try {
      await prescricaoMedicamentoService.atualizar(Number(id), prescricaoId, form)
      toast.success('Prescrição atualizada com sucesso.')
      voltarParaPerfil()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar a prescrição.')
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
        <p className="text-sm text-red-600">{erroPaciente ?? 'Paciente nao encontrado.'}</p>
      </div>
    )
  }

  if (erroCarregar) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar onClick={voltarParaPerfil}>Voltar</BotaoVoltar>
        <p className="text-sm text-red-600">{erroCarregar}</p>
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
            titulo="Editar Prescrição de Medicamentos"
            subtitulo="Atualize os dados abaixo"
            labelSalvar="Salvar alterações"
          />
        </div>
      </div>
    </div>
  )
}
