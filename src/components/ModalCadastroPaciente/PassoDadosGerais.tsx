import { Input, Select, MaskedInput } from '@/components'
import { opcoesGenero } from '@/constants/opcoesGenero'

type PassoDadosGeraisProps = {
  nome: string
  setNome: (v: string) => void
  dataNascimento: string
  setDataNascimento: (v: string) => void
  telefone: string
  setTelefone: (v: string) => void
  genero: string
  setGenero: (v: string) => void
  email: string
  setEmail: (v: string) => void
}

export function PassoDadosGerais({
  nome,
  setNome,
  dataNascimento,
  setDataNascimento,
  telefone,
  setTelefone,
  genero,
  setGenero,
  email,
  setEmail,
}: PassoDadosGeraisProps) {
  return (
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
          options={[...opcoesGenero]}
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
  )
}
