import type { Role } from '@/types/auth'

export type TagFuncional = {
  id: number
  nome: string
  descricao: string | null
}

export type ProfissionalResponsavel = {
  id: number
  nome: string
  username: string
  dataDeNascimento: string | null
  role: Role
  status: string | null
  telefone: string | null
  rua: string | null
  bairro: string | null
  estado: string | null
  cidade: string | null
  numeroDaCasa: string | null
  genero: string | null
  email: string | null
  fotoDePerfil: string | null
}

export type OrientacaoFuncionalResponse = {
  id: number
  responsavel: ProfissionalResponsavel
  nome: string
  descricao: string | null
  finalidade: string | null
  urlImagem: string | null
  ativo: boolean
  tags: TagFuncional[]
  dataCriacao: string
  dataAtualizacao: string | null
}

export type OrientacaoFuncionalRequest = {
  nome: string
  descricao: string | null
  finalidade: string | null
  tagsIds: number[]
}

export type SpringPage<T> = {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}
