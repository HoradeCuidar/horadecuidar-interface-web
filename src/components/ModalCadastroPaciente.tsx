import { useState, useRef, useEffect } from 'react'
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
import { toast } from 'sonner'


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

  const [doencasLista, setDoencasLista] = useState<{ value: string; label: string }[]>([])
  const [doencaId, setDoencaId] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [modalCadastrarDoencaAberto, setModalCadastrarDoencaAberto] = useState(false)
  const [novaDoencaNome, setNovaDoencaNome] = useState('')
  const [selectDoencaAberto, setSelectDoencaAberto] = useState(false)
  const selectDoencaRef = useRef<HTMLDivElement>(null)

  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  const currentIndex = passos.findIndex((p) => p.id === stepId)
  const isLastStep = currentIndex === passos.length - 1

  const doencaSelecionada = doencasLista.find((d) => d.value === doencaId)

  useEffect(() => {
    if (!selectDoencaAberto) return
    function handleClickFora(e: MouseEvent) {
      if (selectDoencaRef.current && !selectDoencaRef.current.contains(e.target as Node)) {
        setSelectDoencaAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [selectDoencaAberto])

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

    setDoencaId('')
    setObservacoes('')
    setModalCadastrarDoencaAberto(false)
    setNovaDoencaNome('')
    setSelectDoencaAberto(false)

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

  function handleCadastrarDoenca() {
    const nomeTrim = novaDoencaNome.trim()
    if (!nomeTrim) return
    const id = `temp-${Date.now()}`
    const nova = { value: id, label: nomeTrim }
    setDoencasLista((prev) => [...prev, nova])
    setDoencaId(id)
    setNovaDoencaNome('')
    setModalCadastrarDoencaAberto(false)
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
      toast.error(e instanceof Error ? e.message : "Erro ao cadastrar paciente.")
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
          <section className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-3">
              <Input
                size="compact"
                label="Nome"
                placeholder="Digite o nome..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <MaskedInput
                size="compact"
                label="Telefone"
                mask="(00) 0 0000-0000"
                value={telefone}
                onAccept={(v) => setTelefone(v ?? '')}
                placeholder="(XX) X XXXX-XXXX"
              />

              <MaskedInput
                size="compact"
                label="Data de nascimento"
                mask="00/00/0000"
                value={dataNascimento}
                onAccept={(v) => setDataNascimento(v ?? '')}
                placeholder="dd/mm/yyyy"
              />

              <Select
                size="compact"
                label="Gênero"
                options={opcoesGenero}
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />

              <Input
                size="compact"
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
                size="compact"
                label="Rua"
                placeholder="Digite a rua..."
                value={rua}
                onChange={(e) => setRua(e.target.value)}
              />

              <Input
                size="compact"
                label="Nº da casa"
                placeholder="XXXX"
                value={numeroCasa}
                onChange={(e) => setNumeroCasa(e.target.value)}
              />

              <Input
                size="compact"
                label="Bairro"
                placeholder="Digite o bairro..."
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />

              <Input
                size="compact"
                label="Estado"
                placeholder="UF (2 letras)"
                value={estado}
                onChange={(e) => setEstado(e.target.value.slice(0, 2).toUpperCase())}
                maxLength={2}
              />

              <Input
                size="compact"
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
              <div className="relative flex flex-col gap-1.5 sm:col-span-2" ref={selectDoencaRef}>
                <label className="block text-left text-sm font-medium text-text">
                  Doença
                </label>
                <button
                  type="button"
                  onClick={() => setSelectDoencaAberto((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg bg-surface-100 px-3.5 py-2.5 text-left text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-expanded={selectDoencaAberto}
                  aria-haspopup="listbox"
                  aria-label="Selecione uma doença"
                >
                  <span className={doencaId ? '' : 'text-text-muted'}>
                    {doencaSelecionada?.label ?? 'Selecione uma doença'}
                  </span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${selectDoencaAberto ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {selectDoencaAberto && (
                  <div
                    className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-lg border border-surface-200 bg-white py-1 shadow-lg"
                    role="listbox"
                  >
                    <div className="border-b border-surface-100 px-2 pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setModalCadastrarDoencaAberto(true)
                          setSelectDoencaAberto(false)
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
                      >
                        <span>+</span>
                        Adicionar doença
                      </button>
                    </div>
                    <ul className="max-h-40 overflow-auto py-1">
                      {doencasLista.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-text-muted">
                          Nenhuma doença cadastrada
                        </li>
                      ) : (
                        doencasLista.map((d) => (
                          <li key={d.value}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={doencaId === d.value}
                              onClick={() => {
                                setDoencaId(d.value)
                                setSelectDoencaAberto(false)
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-surface-100 ${
                                doencaId === d.value ? 'bg-surface-100 font-medium' : ''
                              }`}
                            >
                              {d.label}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <Input
                size="compact"
                label="Observações clínicas"
                placeholder="Digite as observações"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          </section>
        )}

        {stepId === 'credenciais' && (
          <section className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                size="compact"
                label="Username"
                placeholder="Digite seu username"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              />

              <Input
                size="compact"
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
    </>
  )
}