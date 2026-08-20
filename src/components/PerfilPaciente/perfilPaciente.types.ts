export type AbaPerfil =
  | 'dados'
  | 'medicamentos'
  | 'avaliacao'
  | 'realizacoes'
  | 'alimentacao'

export type AbaPerfilConfig = {
  id: AbaPerfil
  label: string
}
