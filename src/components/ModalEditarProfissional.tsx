import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Modal,
  Steps,
  Input,
  Select,
  MaskedInput,
  BotaoCancelar,
  BotaoVoltar,
  BotaoSalvar,
  Skeleton,
} from '@/components'
import { opcoesGenero } from '@/constants/opcoesGenero'
import { profissionalService } from '@/services'

type ModalEditarProfissionalProps = {
  aberto: boolean
  onFechar: () => void
  profissionalId: number | null
  onSucesso: () => void
}

const PASSOS_EDICAO = [
  { id: 'dados', label: 'Dados' },
  { id: 'endereco', label: 'Endereço' },
  { id: 'acesso', label: 'Acesso' },
] as const

type PassoEdicaoId = (typeof PASSOS_EDICAO)[number]['id']

function apiDateToForm(apiDate: string): string {
  if (!apiDate) return ''
  const parts = apiDate.split('-')
  if (parts.length !== 3) return apiDate
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

function apiToFormGenero(g?: string): string {
  if (!g) return ''
  const upper = g.toUpperCase()
  if (upper === 'FEMININO' || upper === 'F') return 'F'
  if (upper === 'MASCULINO' || upper === 'M') return 'M'
  if (upper === 'NAO_BINARIO' || upper === 'N') return 'N'
  if (upper === 'OUTRO' || upper === 'O') return 'O'
  return g
}

export function ModalEditarProfissional({
  aberto,
  onFechar,
  profissionalId,
  onSucesso,
}: ModalEditarProfissionalProps) {
  const [stepId, setStepId] = useState<PassoEdicaoId>('dados')
  const [nomeOriginal, setNomeOriginal] = useState('')
  const currentIndex = PASSOS_EDICAO.findIndex((p) => p.id === stepId)
  const isLastStep = currentIndex === PASSOS_EDICAO.length - 1

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

  const [dadosIniciais, setDadosIniciais] = useState<Record<string, string> | null>(null)

  const [loading, setLoading] = useState(false)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!aberto || !profissionalId) return

    const id = profissionalId

    async function carregarDetalhes() {
      setLoading(true)
      try {
        const p = await profissionalService.buscarPorId(id)
        const parsedGenero = apiToFormGenero(p.genero)
        setNomeOriginal(p.nome ?? '')
        setNome(p.nome ?? '')
        setGenero(parsedGenero)
        setTelefone(p.telefone ? p.telefone.replace(/\D/g, '') : '')
        setDataNascimento(p.dataNascimento ? apiDateToForm(p.dataNascimento) : '')
        setEmail(p.email ?? '')
        setRua(p.rua ?? '')
        setNumeroCasa(p.numeroDaCasa ?? '')
        setBairro(p.bairro ?? '')
        setEstado(p.estado ?? '')
        setCidade(p.cidade ?? '')
        setUsername((p as any).username ?? '')
        setDadosIniciais({
          nome: p.nome ?? '',
          genero: parsedGenero,
          telefone: p.telefone ? p.telefone.replace(/\D/g, '') : '',
          dataNascimento: p.dataNascimento ? apiDateToForm(p.dataNascimento) : '',
          email: p.email ?? '',
          rua: p.rua ?? '',
          numeroCasa: p.numeroDaCasa ?? '',
          bairro: p.bairro ?? '',
          estado: p.estado ?? '',
          cidade: p.cidade ?? '',
          username: (p as any).username ?? '',
        })
        setStepId('dados')
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Erro ao buscar detalhes do profissional.')
        onFechar()
      } finally {
        setLoading(false)
      }
    }

    carregarDetalhes()
  }, [aberto, profissionalId])

  function handleLimpar() {
    setNomeOriginal('')
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
    setDadosIniciais(null)
    setStepId('dados')
  }

  function irParaProximoPasso() {
    const next = PASSOS_EDICAO[currentIndex + 1]
    if (next) setStepId(next.id)
  }

  function irParaPassoAnterior() {
    const prev = PASSOS_EDICAO[currentIndex - 1]
    if (prev) setStepId(prev.id)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLastStep) {
      irParaProximoPasso()
      return
    }

    if (!profissionalId) return

    const normalizeDigits = (val?: string) => (val ?? '').replace(/\D/g, '')
    const trimVal = (val?: string) => (val ?? '').trim()

    const temAlteracoes =
      trimVal(nome) !== trimVal(dadosIniciais?.nome) ||
      trimVal(genero) !== trimVal(dadosIniciais?.genero) ||
      normalizeDigits(telefone) !== normalizeDigits(dadosIniciais?.telefone) ||
      normalizeDigits(dataNascimento) !== normalizeDigits(dadosIniciais?.dataNascimento) ||
      trimVal(email) !== trimVal(dadosIniciais?.email) ||
      trimVal(rua) !== trimVal(dadosIniciais?.rua) ||
      trimVal(numeroCasa) !== trimVal(dadosIniciais?.numeroCasa) ||
      trimVal(bairro) !== trimVal(dadosIniciais?.bairro) ||
      trimVal(estado) !== trimVal(dadosIniciais?.estado) ||
      trimVal(cidade) !== trimVal(dadosIniciais?.cidade) ||
      trimVal(username) !== trimVal(dadosIniciais?.username)

    if (!temAlteracoes) {
      toast.info('Nenhuma alteração foi realizada.')
      onFechar()
      return
    }

    setSalvando(true)
    try {
      await profissionalService.editar(profissionalId, {
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
      })
      toast.success('Profissional editado com sucesso.')
      handleLimpar()
      onSucesso()
      onFechar()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao salvar alterações.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={() => {
        handleLimpar()
        onFechar()
      }}
      titulo="Editar Profissional de saúde"
      subtitulo={nomeOriginal}
      largura="md"
      headerTone="blue"
      showCloseButton={true}
      footer={
        <>
          <BotaoCancelar
            onClick={() => {
              handleLimpar()
              onFechar()
            }}
          />
          <BotaoVoltar onClick={irParaPassoAnterior} disabled={currentIndex === 0 || loading}>
            Voltar
          </BotaoVoltar>
          <BotaoSalvar form="form-edicao-profissional" disabled={salvando || loading}>
            {isLastStep ? (salvando ? 'Salvando...' : 'Salvar Alterações') : 'Próximo'}
          </BotaoSalvar>
        </>
      }
    >
      {loading ? (
        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Skeleton className="h-3.5 w-14 mb-2" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-3.5 w-16 mb-2" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-3.5 w-16 mb-2" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-3.5 w-32 mb-2" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="sm:col-span-2">
              <Skeleton className="h-3.5 w-12 mb-2" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <form id="form-edicao-profissional" onSubmit={handleSubmit} className="space-y-4">
          <Steps steps={[...PASSOS_EDICAO]} currentStepId={stepId} />

          <div className="mt-8">
            {stepId === 'dados' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  size="compact"
                  label="Nome"
                  placeholder="Insira o nome..."
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
                <Select
                  size="compact"
                  label="Gênero"
                  options={[...opcoesGenero]}
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                />
                <MaskedInput
                  size="compact"
                  label="Data de nascimento"
                  mask="00/00/0000"
                  value={dataNascimento}
                  onAccept={(v) => setDataNascimento(v ?? '')}
                  placeholder="dd/mm/yyyy"
                />
                <Input
                  size="compact"
                  label="E-mail"
                  type="email"
                  placeholder="Digite seu e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sm:col-span-2"
                />
              </div>
            )}

            {stepId === 'endereco' && (
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  size="compact"
                  label="Rua"
                  placeholder="Digite a rua..."
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="sm:col-span-2"
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
                  placeholder="UF"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value.slice(0, 2).toUpperCase())}
                  maxLength={2}
                />
                <Input
                  size="compact"
                  label="Cidade"
                  placeholder="Digite sua cidade..."
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
            )}

            {stepId === 'acesso' && (
              <div className="max-w-md space-y-4">
                <Input
                  size="compact"
                  label="Username"
                  placeholder="Sem espaços (letras, números, . _ -)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                />
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-400">
                  A senha do profissional da saúde não pode ser editada. Se o profissional esquecer a senha, ele deve utilizar a ferramenta de recuperação de senha.
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </Modal>
  )
}
