import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { usePrescricaoNutricionalForm } from '@/hooks/usePrescricaoNutricionalForm'
import { FormularioPrescricaoNutricional } from '@/components/PrescricaoNutricional'
import { prescricaoNutricionalService } from '@/services'
import { modeloNutricionalService } from '@/services/modeloNutricional'
import {
  copiarPrescricaoNutricionalParaNova,
  validarPrescricaoNutricionalForm,
} from '@/services/prescricaoNutricional.mappers'

export function CadastroPrescricaoNutricional() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const baseId = searchParams.get('base')
  const modeloId = searchParams.get('modelo')
  const navigate = useNavigate()
  const { paciente, loading, erro } = usePerfilPaciente(id)
  const [salvando, setSalvando] = useState(false)
  const [carregandoBase, setCarregandoBase] = useState(Boolean(baseId || modeloId))
  const [erroBase, setErroBase] = useState('')
  const [nomeModelo, setNomeModelo] = useState('')
  const [versaoModelo, setVersaoModelo] = useState<number | null>(null)
  const formState = usePrescricaoNutricionalForm()
  const { handleChangeCampo, setFormCompleto } = formState

  useEffect(() => {
    if (paciente?.nome) {
      handleChangeCampo('nomeParticipante', paciente.nome)
    }
  }, [paciente?.nome, handleChangeCampo])

  useEffect(() => {
    if ((!baseId && !modeloId) || !id || !paciente?.nome) return
    const numeroBase = Number(modeloId || baseId)
    if (!Number.isInteger(numeroBase) || numeroBase <= 0) {
      setErroBase('A origem usada como base é inválida.')
      setCarregandoBase(false)
      return
    }
    let ativo = true
    setCarregandoBase(true)
    const carregar = async () => {
      if (modeloId) {
        const modelo = await modeloNutricionalService.buscar(numeroBase)
        return {
          nome: modelo.nome,
          versao: modelo.versao,
          prescricao: {
            id: modelo.id, pacienteId: Number(id), profissionalId: modelo.criadoPorId,
            dataInicio: '', dataFim: '', status: '', observacoes: '',
            refeicoes: modelo.refeicoes,
          },
        }
      }
      const prescricao = await prescricaoNutricionalService.buscarPorId(numeroBase)
      if (prescricao.pacienteId !== Number(id)) {
        throw new Error('A prescrição de origem não pertence a este participante.')
      }
      return { nome: '', versao: null, prescricao }
    }
    void carregar()
      .then((origem) => {
        if (!ativo) return
        setNomeModelo(origem.nome)
        setVersaoModelo(origem.versao)
        setFormCompleto(copiarPrescricaoNutricionalParaNova(origem.prescricao, paciente.nome))
      })
      .catch((falha) => {
        if (ativo) setErroBase(falha instanceof Error ? falha.message : 'Não foi possível carregar a prescrição de origem.')
      })
      .finally(() => { if (ativo) setCarregandoBase(false) })
    return () => { ativo = false }
  }, [baseId, modeloId, id, paciente?.nome, setFormCompleto])

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
      await prescricaoNutricionalService.criar(
        Number(id), formState.form,
        modeloId && versaoModelo !== null
          ? { id: Number(modeloId), versao: versaoModelo }
          : undefined
      )
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

  if (loading || carregandoBase) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-text-muted">Carregando plano alimentar...</p>
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

  if (erroBase) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar onClick={voltarParaPerfil}>Voltar</BotaoVoltar>
        <p role="alert" className="text-sm text-error-500">{erroBase}</p>
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
          {baseId || modeloId ? (
            <p className="mb-3 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">
              Base: {modeloId ? `modelo ${nomeModelo}` : `prescrição #${baseId}`}.
              Esta é uma cópia independente; informe as datas e ajuste o plano antes de salvar.
            </p>
          ) : null}
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
