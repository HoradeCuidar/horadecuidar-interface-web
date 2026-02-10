import { useState } from 'react'
import { Modal, TituloSecao, Input, Select, MaskedInput, BotaoCancelar, BotaoSalvar } from '@/components'

type ModalCadastroProfissionalProps = {
  aberto: boolean
  onFechar: () => void
  onSubmit?: (dados: Record<string, string>) => void | Promise<void>
}

const opcoesGenero = [
  { value: 'F', label: 'Feminino' },
  { value: 'M', label: 'Masculino' },
  { value: 'N', label: 'Não binário' },
  { value: 'O', label: 'Outro' },
]

export function ModalCadastroProfissional({
  aberto,
  onFechar,
  onSubmit,
}: ModalCadastroProfissionalProps) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
    } catch {
      // Erro 
    }
  }

  function handleLimpar() {
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

  return (
    <Modal
      aberto={aberto}
      onFechar={() => {
        handleLimpar()
        onFechar()
      }}
      titulo="Cadastrar Profissional da Saúde"
      footer={
        <>
          <BotaoCancelar
            onClick={() => {
              handleLimpar()
              onFechar()
            }}
          />
          <BotaoSalvar form="form-cadastro-profissional">
            Cadastrar
          </BotaoSalvar>
        </>
      }
    >
      <form
        id="form-cadastro-profissional"
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <section className="space-y-1.5">
          <TituloSecao>Informações gerais</TituloSecao>
          <div className="grid gap-1.5 sm:grid-cols-3">
            <Input
              size="compact"
              label="Nome"
              placeholder="Digite o nome..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Select
              size="compact"
              label="Gênero"
              options={opcoesGenero}
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
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
        </section>

        <section className="space-y-1.5">
          <TituloSecao>Endereço</TituloSecao>
          <div className="grid gap-1.5 sm:grid-cols-3">
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
              placeholder="Digite sua cidade..."
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section className="space-y-1.5">
          <TituloSecao>Credenciais de acesso</TituloSecao>
          <div className="grid gap-1.5 sm:grid-cols-3">
            <Input
              size="compact"
              label="Username"
              placeholder="Sem espaços (letras, números, . _ -)"
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
      </form>
    </Modal>
  )
}
