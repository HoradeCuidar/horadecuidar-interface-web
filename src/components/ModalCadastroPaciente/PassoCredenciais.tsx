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
          label="Nome de usuário *"
          placeholder="Ex.: antonietaa"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
        />
        <Input
          size="compact"
          label="Senha *"
          type="password"
          placeholder="Digite pelo menos 8 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          minLength={8}
          success={senha.length >= 8}
        />
      </div>
      <p className="text-xs text-text-muted">A senha precisa ter apenas 8 caracteres ou mais. Letras, números e símbolos são opcionais.</p>
    </section>
  )
}
