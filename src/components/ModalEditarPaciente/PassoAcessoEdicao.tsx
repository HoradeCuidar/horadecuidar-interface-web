import { Input } from '@/components'

type PassoAcessoEdicaoProps = {
  username: string
}

export function PassoAcessoEdicao({ username }: PassoAcessoEdicaoProps) {
  return (
    <section className="max-w-md space-y-4">
      <Input
        size="compact"
        label="Username"
        value={username}
        readOnly
        disabled
      />
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-400">
        A senha do paciente não pode ser editada aqui. Se o paciente esquecer a senha, ele deve utilizar a ferramenta de recuperação de senha.
      </div>
    </section>
  )
}
