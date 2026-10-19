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
  resumo: string | null
  categoria: CategoriaOrientacao | null
  duracaoEstimada: number | null
  materiais: string | null
  status: 'RASCUNHO' | 'PUBLICADA' | 'INATIVA'
  revisadoPorId: number | null
  publicadoEm: string | null
  cuidadosRevisados: boolean
  passos: PassoOrientacao[]
  cuidados: CuidadoOrientacao[]
  midias: MidiaOrientacao[]
  tags: TagFuncional[]
  dataCriacao: string
  dataAtualizacao: string | null
}

export type OrientacaoFuncionalRequest = {
  nome: string
  descricao: string | null
  finalidade: string | null
  tagsIds: number[]
  resumo: string | null
  categoriaId: number | null
  duracaoEstimada: number | null
  materiais: string | null
  passos: PassoOrientacao[]
  cuidados: CuidadoOrientacao[]
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

export type CategoriaOrientacao = { id: number; nome: string; ativo: boolean }
export type PassoOrientacao = { id: number | null; instrucao: string }
export type TipoCuidado = 'PRECAUCAO' | 'NAO_REALIZAR' | 'SINAL_DE_ALERTA'
export type CuidadoOrientacao = { tipo: TipoCuidado; texto: string }
export type MidiaOrientacao = {
  id: number; passoId: number | null; ordem: number; url: string
  legenda: string | null; textoAlternativo: string | null; capa: boolean
}
export type MidiaRequest = Omit<MidiaOrientacao, 'id' | 'url'>
export type HistoricoOrientacao = {
  id: number; autorId: number; dataAlteracao: string; acao: string; conteudoAnterior: string
}
