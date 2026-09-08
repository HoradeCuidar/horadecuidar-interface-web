import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { doencaService } from '@/services/doenca'
import { pacienteService } from '@/services/paciente'
import {
  FORM_EDITAR_PACIENTE_INICIAL,
  detalhesToForm,
  formTemAlteracoes,
  type FormEditarPaciente,
} from '@/services/paciente.mappers'

const PASSOS_EDICAO = [
  { id: 'dados-gerais', label: 'Dados gerais' },
  { id: 'endereco', label: 'Endereço' },
  { id: 'doencas', label: 'Doenças e observações' },
  { id: 'acesso', label: 'Credenciais' },
] as const

type PassoEdicaoId = (typeof PASSOS_EDICAO)[number]['id']

type UseEditarPacienteParams = {
  aberto: boolean
  pacienteId: number | null
  onFechar: () => void
  onSucesso: () => void
}

type DoencasModalState = {
  cadastrarAberto: boolean
  novaDoencaNome: string
  excluirAberto: boolean
  excluindoId: string
  editarAberto: boolean
  editandoId: string
  editandoNome: string
  editandoNomeOriginal: string
}

const DOENCAS_MODAL_INICIAL: DoencasModalState = {
  cadastrarAberto: false,
  novaDoencaNome: '',
  excluirAberto: false,
  excluindoId: '',
  editarAberto: false,
  editandoId: '',
  editandoNome: '',
  editandoNomeOriginal: '',
}

export function useEditarPaciente({
  aberto,
  pacienteId,
  onFechar,
  onSucesso,
}: UseEditarPacienteParams) {
  const [stepId, setStepId] = useState<PassoEdicaoId>('dados-gerais')
  const [form, setForm] = useState<FormEditarPaciente>(FORM_EDITAR_PACIENTE_INICIAL)
  const [dadosIniciais, setDadosIniciais] = useState<FormEditarPaciente | null>(null)
  const [nomeOriginal, setNomeOriginal] = useState('')
  const [doencasLista, setDoencasLista] = useState<{ value: string; label: string }[]>([])
  const [doencasModal, setDoencasModal] = useState<DoencasModalState>(DOENCAS_MODAL_INICIAL)
  const [loading, setLoading] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const currentIndex = PASSOS_EDICAO.findIndex((p) => p.id === stepId)
  const isLastStep = currentIndex === PASSOS_EDICAO.length - 1

  const setCampo = useCallback(
    <Campo extends keyof FormEditarPaciente>(campo: Campo) => (valor: FormEditarPaciente[Campo]) => {
      setForm((prev) => ({ ...prev, [campo]: valor }))
    },
    [],
  )

  const handleLimpar = useCallback(() => {
    setStepId('dados-gerais')
    setForm(FORM_EDITAR_PACIENTE_INICIAL)
    setDadosIniciais(null)
    setNomeOriginal('')
    setDoencasLista([])
    setDoencasModal(DOENCAS_MODAL_INICIAL)
  }, [])

  const recarregarDoencas = useCallback(async () => {
    const lista = await doencaService.listar()
    setDoencasLista(lista.map((d) => ({ value: String(d.id), label: d.nome })))
  }, [])

  useEffect(() => {
    if (!aberto || !pacienteId) return

    let cancelado = false
    const id = pacienteId

    async function carregar() {
      setLoading(true)
      try {
        const [detalhes] = await Promise.all([
          pacienteService.buscarPorId(id),
          recarregarDoencas(),
        ])

        if (cancelado) return

        const formCarregado = detalhesToForm(detalhes)
        setNomeOriginal(detalhes.nome ?? '')
        setForm(formCarregado)
        setDadosIniciais(formCarregado)
        setStepId('dados-gerais')
      } catch (err) {
        if (!cancelado) {
          toast.error(err instanceof Error ? err.message : 'Erro inesperado.')
          onFechar()
        }
      } finally {
        if (!cancelado) setLoading(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [aberto, pacienteId, recarregarDoencas])

  function irParaProximoPasso() {
    const next = PASSOS_EDICAO[currentIndex + 1]
    if (next) setStepId(next.id)
  }

  function irParaPassoAnterior() {
    const prev = PASSOS_EDICAO[currentIndex - 1]
    if (prev) setStepId(prev.id)
  }

  async function handleCadastrarDoenca() {
    const nomeTrim = doencasModal.novaDoencaNome.trim()
    if (!nomeTrim) return

    try {
      const criada = await doencaService.cadastrar(nomeTrim)
      await recarregarDoencas()
      setForm((prev) => ({
        ...prev,
        doencaIds: prev.doencaIds.includes(String(criada.id))
          ? prev.doencaIds
          : [...prev.doencaIds, String(criada.id)],
      }))
      setDoencasModal((prev) => ({ ...prev, cadastrarAberto: false, novaDoencaNome: '' }))
      toast.success('Doença cadastrada.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro inesperado.')
    }
  }

  async function handleExcluirDoenca() {
    if (!doencasModal.excluindoId) return

    try {
      await doencaService.deletar(Number(doencasModal.excluindoId))
      await recarregarDoencas()
      setForm((prev) => ({
        ...prev,
        doencaIds: prev.doencaIds.filter((id) => id !== doencasModal.excluindoId),
      }))
      setDoencasModal((prev) => ({ ...prev, excluirAberto: false, excluindoId: '' }))
      toast.success('Doença excluída com sucesso.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro inesperado.')
      throw err
    }
  }

  async function handleEditarDoenca() {
    const nomeTrim = doencasModal.editandoNome.trim()
    if (!nomeTrim || !doencasModal.editandoId) return

    if (nomeTrim === doencasModal.editandoNomeOriginal) {
      setDoencasModal((prev) => ({
        ...prev,
        editarAberto: false,
        editandoId: '',
        editandoNome: '',
        editandoNomeOriginal: '',
      }))
      return
    }

    try {
      await doencaService.editar(Number(doencasModal.editandoId), nomeTrim)
      await recarregarDoencas()
      setDoencasModal((prev) => ({
        ...prev,
        editarAberto: false,
        editandoId: '',
        editandoNome: '',
        editandoNomeOriginal: '',
      }))
      toast.success('Doença editada com sucesso.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro inesperado.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isLastStep) {
      irParaProximoPasso()
      return
    }

    if (!pacienteId) return

    if (!formTemAlteracoes(form, dadosIniciais)) {
      toast.info('Nenhuma alteração foi realizada.')
      onFechar()
      return
    }

    setSalvando(true)
    try {
      await pacienteService.editar(pacienteId, form)
      toast.success('Paciente editado com sucesso.')
      handleLimpar()
      onSucesso()
      onFechar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally {
      setSalvando(false)
    }
  }

  function handleFechar() {
    handleLimpar()
    onFechar()
  }

  return {
    passos: PASSOS_EDICAO,
    stepId,
    setStepId,
    form,
    setCampo,
    nomeOriginal,
    doencasLista,
    doencasModal,
    setDoencasModal,
    loading,
    salvando,
    currentIndex,
    isLastStep,
    handleLimpar,
    handleFechar,
    handleSubmit,
    irParaPassoAnterior,
    handleCadastrarDoenca,
    handleExcluirDoenca,
    handleEditarDoenca,
  }
}
