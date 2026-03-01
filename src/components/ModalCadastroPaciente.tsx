import { useState } from 'react'
import {
  Modal,
  Steps,
  Input,
  Select,
  MaskedInput,
  BotaoCancelar,
  BotaoSalvar,
  BotaoVoltar,
} from '@/components'


type ModalCadastroPacienteProps = {
  aberto: boolean
  onFechar: () => void
  onSubmit?: (dados: Record<string, unknown>) => void | Promise<void>
}

const opcoesGenero = [
  { value: 'F', label: 'Feminino' },
  { value: 'M', label: 'Masculino' },
  { value: 'N', label: 'Não binário' },
  { value: 'O', label: 'Outro' },
]

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

  const [doencasTexto, setDoencasTexto] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  const currentIndex = passos.findIndex((p) => p.id === stepId)
  const isLastStep = currentIndex === passos.length - 1

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

    setDoencasTexto('')
    setObservacoes('')

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
      doencasTexto,
      observacoes,
      username,
      senha,
    }

    try {
      await onSubmit?.(payload)
      handleLimpar()
      onFechar()
    } catch {}
  }

  return (
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

        {stepId === 'dados-gerais' && (
          <section className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-3">
              <Input
                label="Nome"
                placeholder="Digite o nome..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <MaskedInput
                label="Telefone"
                mask="(00) 0 0000-0000"
                value={telefone}
                onAccept={(v) => setTelefone(v ?? '')}
                placeholder="(XX) X XXXX-XXXX"
              />

              <MaskedInput
                label="Data de nascimento"
                mask="00/00/0000"
                value={dataNascimento}
                onAccept={(v) => setDataNascimento(v ?? '')}
                placeholder="dd/mm/yyyy"
              />

              <Select
                label="Gênero"
                options={opcoesGenero}
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />

              <Input
                label="E-mail"
                type="email"
                placeholder="Digite o e-mail..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          </section>
        )}

        {stepId === 'endereco' && (
          <section className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-3">
              <Input
                label="Rua"
                placeholder="Digite a rua..."
                value={rua}
                onChange={(e) => setRua(e.target.value)}
              />

              <Input
                label="Nº da casa"
                placeholder="XXXX"
                value={numeroCasa}
                onChange={(e) => setNumeroCasa(e.target.value)}
              />

              <Input
                label="Bairro"
                placeholder="Digite o bairro..."
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />

              <Input
                label="Estado"
                placeholder="UF (2 letras)"
                value={estado}
                onChange={(e) => setEstado(e.target.value.slice(0, 2).toUpperCase())}
                maxLength={2}
              />

              <Input
                label="Cidade"
                placeholder="Digite a cidade..."
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          </section>
        )}

        {stepId === 'doencas' && (
          <section className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                label="Doença (temporário)"
                placeholder="Será substituído por um seletor de doenças"
                value={doencasTexto}
                onChange={(e) => setDoencasTexto(e.target.value)}
              />

              <Input
                label="Observações clínicas"
                placeholder="Digite as observações"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </section>
        )}

        {stepId === 'credenciais' && (
          <section className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                label="Username"
                placeholder="Digite seu username"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="Mín. 8 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                minLength={8}
              />
            </div>
          </section>
        )}
      </form>
    </Modal>
  )
}