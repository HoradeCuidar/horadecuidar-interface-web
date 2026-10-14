import type { IconType } from 'react-icons'

export type AbaPerfil =
  | 'dados'
  | 'medicamentos'
  | 'avaliacao'
  | 'realizacoes'
  | 'alimentacao'
  | 'exames'

export type AbaPerfilConfig = {
  id: AbaPerfil
  label: string
  Icone: IconType
}
