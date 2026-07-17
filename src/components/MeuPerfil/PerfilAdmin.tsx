import { CabecalhoPerfil } from './CabecalhoPerfil'
import { CampoDado } from './CampoDado'
import { ROLE_LABEL, valorOuTraco } from './meuPerfil.helpers'
import type { Role } from '@/types/auth'

type PerfilAdminProps = {
  userId: number
  username: string
  role: Role
  fotoUrl: string | null
  onFotoAtualizada: (url: string) => void
}

export function PerfilAdmin({
  userId,
  username,
  role,
  fotoUrl,
  onFotoAtualizada,
}: PerfilAdminProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <CabecalhoPerfil
        nome={username}
        subtitulo={`@${username}`}
        badge={ROLE_LABEL[role]}
        fotoUrl={fotoUrl}
        onFotoAtualizada={onFotoAtualizada}
      />

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <dl className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
          <CampoDado label="Username" valor={valorOuTraco(username)} />
          <CampoDado label="Perfil" valor={ROLE_LABEL[role]} />
          <CampoDado label="ID" valor={String(userId)} />
        </dl>
      </div>
    </section>
  )
}
