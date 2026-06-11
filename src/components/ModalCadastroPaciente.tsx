import { useState, useEffect } from 'react'
import {
  Modal,
  Steps,
  Input,
  BotaoCancelar,
  BotaoSalvar,
  BotaoVoltar,
  ModalConfirmacaoExcluirDoenca,
} from '@/components'
import { doencaService } from '@/services/doenca'
import { toast } from 'sonner'
import { PassoDadosGerais } from './ModalCadastroPaciente/PassoDadosGerais'
import { PassoEndereco } from './ModalCadastroPaciente/PassoEndereco'
import { PassoDoencas } from './ModalCadastroPaciente/PassoDoencas'
import { PassoCredenciais } from './ModalCadastroPaciente/PassoCredenciais'

type ModalCadastroPacienteProps = {
  aberto: boolean
  onFechar: () => void
  onSubmit?: (dados: Record<string, unknown>) => void | Promise<void>
}

const passos = [
  { id: 'dados-gerais', label: 'Dados gerais' },
  { id: 'endereco', label: 'Endereço' },
  { id: 'doencas', label: 'Doenças e observações' },
  { id: 'credenciais', label: 'Credenciais' },
] as const

export function ModalCadastroPaciente({ aberto, onFechar, onSubmit }: ModalCadastroPacienteProps) {
  const [stepId, setStepId] = useState<string>(passos[0]?.id ?? 'dados-gerais')
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [genero, setGenero] = useState('')
  const [email, setEmail] = useState('')
  const [rua, setRua] = useState('')
  const [bairro, setBairro] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [numeroCasa, setNumeroCasa] = useState('')
  const [doencasLista, setDoencasLista] = useState<{ value: string; label: string }[]>([])
  const [doencaId, setDoencaId] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [modalCadastrarDoencaAberto, setModalCadastrarDoencaAberto] = useState(false)
  const [novaDoencaNome, setNovaDoencaNome] = useState('')
  const [modalExcluirDoencaAberto, setModalExcluirDoencaAberto] = useState(false)
  const [doencaExcluindoId, setDoencaExcluindoId] = useState('')
  const [modalEditarDoencaAberto, setModalEditarDoencaAberto] = useState(false)
  const [doencaEditandoId, setDoencaEditandoId] = useState('')
  const [doencaEditandoNome, setDoencaEditandoNome] = useState('')
  const [doencaEditandoNomeOriginal, setDoencaEditandoNomeOriginal] = useState('')
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  const currentIndex = passos.findIndex((p) => p.id === stepId)
  const isLastStep = currentIndex === passos.length - 1

  useEffect(() => {
    if (!aberto) return
    doencaService
      .listar()
      .then((lista) =>
        setDoencasLista(lista.map((d) => ({ value: String(d.id), label: d.nome })))
      )
      .catch(() => setDoencasLista([]))
  }, [aberto])

  function handleLimpar() {
    setStepId(passos[0]?.id ?? 'dados-gerais')
    setNome('')
    setDataNascimento('')
    setTelefone('')
    setGenero('')
    setEmail('')
    setRua('')
    setBairro('')
    setEstado('')
    setCidade('')
    setNumeroCasa('')
    setDoencasLista([])
    setDoencaId('')
    setObservacoes('')
    setModalCadastrarDoencaAberto(false)
    setNovaDoencaNome('')
    setModalExcluirDoencaAberto(false)
    setDoencaExcluindoId('')
    setModalEditarDoencaAberto(false)
    setDoencaEditandoId('')
    setDoencaEditandoNome('')
    setDoencaEditandoNomeOriginal('')
    setUsername('')
    setSenha('')
  }

  function irParaProximoPasso() {
    const next = passos[currentIndex + 1]
    if (next) setStepId(next.id)
  }

  function irParaPassoAnterior() {
    const prev = passos[currentIndex - 1]
    if (prev) setStepId(prev.id)
  }

  async function handleCadastrarDoenca() {
    const nomeTrim = novaDoencaNome.trim()
    if (!nomeTrim) return
    try {
      const criada = await doencaService.cadastrar(nomeTrim)
      const lista = await doencaService.listar()
      setDoencasLista(lista.map((d) => ({ value: String(d.id), label: d.nome })))
      setDoencaId(String(criada.id))
      setNovaDoencaNome('')
      setModalCadastrarDoencaAberto(false)
      toast.success('Doença cadastrada.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao cadastrar doença.')
    }
  }

  async function handleExcluirDoenca() {
    if (!doencaExcluindoId) return
    try {
      await doencaService.deletar(Number(doencaExcluindoId))
      const lista = await doencaService.listar()
      setDoencasLista(lista.map((d) => ({ value: String(d.id), label: d.nome })))
      if (doencaId === doencaExcluindoId) {
        setDoencaId('') // Reset selected if it was deleted
      }
      toast.success('Doença excluída com sucesso.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao excluir doença.')
      throw e
    }
  }

  async function handleEditarDoenca() {
    const nomeTrim = doencaEditandoNome.trim()
    if (!nomeTrim || !doencaEditandoId) return

    if (nomeTrim === doencaEditandoNomeOriginal) {
      setModalEditarDoencaAberto(false)
      setDoencaEditandoId('')
      setDoencaEditandoNome('')
      setDoencaEditandoNomeOriginal('')
      return
    }

    try {
      await doencaService.editar(Number(doencaEditandoId), nomeTrim)
      const lista = await doencaService.listar()
      setDoencasLista(lista.map((d) => ({ value: String(d.id), label: d.nome })))
      setModalEditarDoencaAberto(false)
      setDoencaEditandoId('')
      setDoencaEditandoNome('')
      setDoencaEditandoNomeOriginal('')
      toast.success('Doença editada com sucesso.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao editar doença.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLastStep) {
      irParaProximoPasso()
      return
    }
    const payload: Record<string, unknown> = {
      nome,
      dataNascimento,
      telefone,
      genero,
      email,
      rua,
      bairro,
      estado,
      cidade,
      numeroCasa,
      doencaId,
      observacoes,
      username,
      senha,
    }
    try {
      await onSubmit?.(payload)
      handleLimpar()
      onFechar()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao cadastrar paciente.')
    }
  }

  return (
    <>
      <Modal
        aberto={aberto}
        onFechar={() => {
          handleLimpar()
          onFechar()
        }}
        titulo="Cadastrar Paciente"
        largura="md"
        headerTone="blue"
        footer={
          <>
            <BotaoCancelar
              onClick={() => {
                handleLimpar()
                onFechar()
              }}
            />
            <BotaoVoltar onClick={irParaPassoAnterior} disabled={currentIndex === 0}>
              Voltar
            </BotaoVoltar>
            <BotaoSalvar form="form-cadastro-paciente">
              {isLastStep ? 'Cadastrar' : 'Próximo'}
            </BotaoSalvar>
          </>
        }
      >
        <form id="form-cadastro-paciente" onSubmit={handleSubmit} className="space-y-4">
          <Steps steps={[...passos]} currentStepId={stepId} />
          <div className="mt-8">
            {stepId === 'dados-gerais' && (
              <PassoDadosGerais
                nome={nome}
                setNome={setNome}
                dataNascimento={dataNascimento}
                setDataNascimento={setDataNascimento}
                telefone={telefone}
                setTelefone={setTelefone}
                genero={genero}
                setGenero={setGenero}
                email={email}
                setEmail={setEmail}
              />
            )}
            {stepId === 'endereco' && (
              <PassoEndereco
                rua={rua}
                setRua={setRua}
                numeroCasa={numeroCasa}
                setNumeroCasa={setNumeroCasa}
                bairro={bairro}
                setBairro={setBairro}
                estado={estado}
                setEstado={setEstado}
                cidade={cidade}
                setCidade={setCidade}
              />
            )}
            {stepId === 'doencas' && (
              <PassoDoencas
                doencasLista={doencasLista}
                doencaId={doencaId}
                setDoencaId={setDoencaId}
                onAbrirModalCadastrarDoenca={() => setModalCadastrarDoencaAberto(true)}
                onDeleteDoenca={(id) => {
                  setDoencaExcluindoId(id)
                  setModalExcluirDoencaAberto(true)
                }}
                onEditDoenca={(id, nome) => {
                  setDoencaEditandoId(id)
                  setDoencaEditandoNome(nome)
                  setDoencaEditandoNomeOriginal(nome)
                  setModalEditarDoencaAberto(true)
                }}
                observacoes={observacoes}
                setObservacoes={setObservacoes}
              />
            )}
            {stepId === 'credenciais' && (
              <PassoCredenciais
                username={username}
                setUsername={setUsername}
                senha={senha}
                setSenha={setSenha}
              />
            )}
          </div>
        </form>
      </Modal>

      <Modal
        aberto={modalCadastrarDoencaAberto}
        onFechar={() => {
          setModalCadastrarDoencaAberto(false)
          setNovaDoencaNome('')
        }}
        titulo="Cadastrar Doença"
        largura="sm"
        footer={
          <>
            <BotaoCancelar
              onClick={() => {
                setModalCadastrarDoencaAberto(false)
                setNovaDoencaNome('')
              }}
            />
            <button
              type="button"
              onClick={handleCadastrarDoenca}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Confirmar
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <Input
            size="compact"
            label="Doença"
            placeholder="Insira o nome da doença"
            value={novaDoencaNome}
            onChange={(e) => setNovaDoencaNome(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCadastrarDoenca()
              }
            }}
          />
        </div>
      </Modal>

      <ModalConfirmacaoExcluirDoenca
        aberto={modalExcluirDoencaAberto}
        onFechar={() => {
          setModalExcluirDoencaAberto(false)
          setDoencaExcluindoId('')
        }}
        onConfirmar={handleExcluirDoenca}
      />

      <Modal
        aberto={modalEditarDoencaAberto}
        onFechar={() => {
          setModalEditarDoencaAberto(false)
          setDoencaEditandoId('')
          setDoencaEditandoNome('')
          setDoencaEditandoNomeOriginal('')
        }}
        titulo="Editar Doença"
        largura="sm"
        footer={
          <>
            <BotaoCancelar
              onClick={() => {
                setModalEditarDoencaAberto(false)
                setDoencaEditandoId('')
                setDoencaEditandoNome('')
                setDoencaEditandoNomeOriginal('')
              }}
            />
            <button
              type="button"
              onClick={handleEditarDoenca}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Confirmar
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <Input
            size="compact"
            label="Doença"
            placeholder="Insira o nome da doença"
            value={doencaEditandoNome}
            onChange={(e) => setDoencaEditandoNome(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleEditarDoenca()
              }
            }}
          />
        </div>
      </Modal>
    </>
  )
}
