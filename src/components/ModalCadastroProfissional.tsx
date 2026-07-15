import { useState } from 'react'
import { toast } from 'sonner'
import {
  Modal,
  Steps,
  BotaoCancelar,
  BotaoSalvar,
  BotaoVoltar,
} from '@/components'
import { PassoDadosGerais } from './ModalCadastroPaciente/PassoDadosGerais'
import { PassoEndereco } from './ModalCadastroPaciente/PassoEndereco'
import { PassoCredenciais } from './ModalCadastroPaciente/PassoCredenciais'

type ModalCadastroProfissionalProps = {
  aberto: boolean
  onFechar: () => void
  onSubmit?: (dados: Record<string, string>) => void | Promise<void>
}

const passos = [
  { id: 'dados-gerais', label: 'Dados gerais' },
  { id: 'endereco', label: 'Endereço' },
  { id: 'credenciais', label: 'Credenciais' },
] as const

export function ModalCadastroProfissional({
  aberto,
  onFechar,
  onSubmit,
}: ModalCadastroProfissionalProps) {
  const [stepId, setStepId] = useState<string>(passos[0].id)
  const [nome, setNome] = useState('')
  const [genero, setGenero] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [rua, setRua] = useState('')
  const [numeroCasa, setNumeroCasa] = useState('')
  const [bairro, setBairro] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  const currentIndex = passos.findIndex((p) => p.id === stepId)
  const isLastStep = currentIndex === passos.length - 1

  function handleLimpar() {
    setStepId(passos[0].id)
    setNome('')
    setGenero('')
    setTelefone('')
    setDataNascimento('')
    setEmail('')
    setRua('')
    setNumeroCasa('')
    setBairro('')
    setEstado('')
    setCidade('')
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLastStep) {
      irParaProximoPasso()
      return
    }

    try {
      await onSubmit?.({
        nome,
        genero,
        telefone,
        dataNascimento,
        email,
        rua,
        numeroCasa,
        bairro,
        estado,
        cidade,
        username,
        senha,
      })
      handleLimpar()
      onFechar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao cadastrar profissional.')
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={() => {
        handleLimpar()
        onFechar()
      }}
      titulo="Cadastrar Profissional da Saúde"
      largura="md"
      headerTone="blue"
      showCloseButton
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
          <BotaoSalvar form="form-cadastro-profissional">
            {isLastStep ? 'Cadastrar' : 'Próximo'}
          </BotaoSalvar>
        </>
      }
    >
      <form
        id="form-cadastro-profissional"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
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
  )
}
