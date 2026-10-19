import { FiShield, FiUser } from 'react-icons/fi'
import { CabecalhoPerfil } from './CabecalhoPerfil'
import { CampoDado } from './CampoDado'
import { SecaoPerfil } from './SecaoPerfil'
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
    <div className="space-y-5">
      <CabecalhoPerfil
        nome={username}
        username={username}
        badge={ROLE_LABEL[role]}
        idLabel={`ID: #${userId}`}
        fotoUrl={fotoUrl}
        onFotoAtualizada={onFotoAtualizada}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SecaoPerfil
          titulo="Dados da conta"
          subtitulo="Informações disponíveis para administradores"
          icone={<FiUser className="size-5" aria-hidden />}
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            <CampoDado label="Nome de usuário" valor={valorOuTraco(username)} />
            <CampoDado label="Perfil" valor={ROLE_LABEL[role]} />
            <CampoDado
              label="Identificador"
              valor={`#${userId}`}
              className="sm:col-span-2"
            />
          </dl>
        </SecaoPerfil>

        <SecaoPerfil
          titulo="Acesso"
          subtitulo="Escopo deste módulo web"
          icone={<FiShield className="size-5" aria-hidden />}
        >
          <dl className="space-y-3">
            <CampoDado
              label="Permissão"
              valor="Administrador"
              dica="Gestão de profissionais e visão geral do sistema"
            />
            <CampoDado
              label="Edição de dados pessoais"
              valor="Indisponível"
              dica="Contas administrativas não possuem endpoint de autoedição"
            />
          </dl>
        </SecaoPerfil>
      </div>
    </div>
  )
}
