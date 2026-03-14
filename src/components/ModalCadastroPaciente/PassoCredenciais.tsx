import { Input } from '@/components'

type PassoCredenciaisProps = {
  username: string
  setUsername: (v: string) => void
  senha: string
  setSenha: (v: string) => void
}

export function PassoCredenciais({
  username,
  setUsername,
  senha,
  setSenha,
}: PassoCredenciaisProps) {
  return (
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
  )
}
