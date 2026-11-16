import type { UnidadeDeMedida } from '@/services/prescricaoNutricional.types'

export type SubstituicaoForm = {
  id: string
  persistedId?: number
  ordem: string
  descricao: string
  quantidade: string
  unidade: UnidadeDeMedida | ''
  medidaCaseira: string
  observacao: string
}

export type AlimentoForm = {
  id: string
  persistedId?: number
  medidaCaseira: string
  substituicoes: SubstituicaoForm[]
  descricao: string
  quantidade: string
  unidade: UnidadeDeMedida | ''
  observacao: string
}

export type OpcaoRefeicaoForm = {
  id: string
  persistedId?: number
  orientacoesPreparo: string
  ordem: string
  descricao: string
  alimentos: AlimentoForm[]
}

export type RefeicaoForm = {
  id: string
  persistedId?: number
  horario: string
  nome: string
  ordem: string
  observacoes: string
  opcoes: OpcaoRefeicaoForm[]
}

export type PrescricaoNutricionalFormData = {
  nomeParticipante: string
  dataInicio: string
  dataFim: string
  observacoes: string
  refeicoes: RefeicaoForm[]
}

function novoId(): string {
  return crypto.randomUUID()
}

export function criarAlimentoVazio(): AlimentoForm {
  return {
    id: novoId(),
    descricao: '',
    quantidade: '',
    unidade: '',
    observacao: '',
    medidaCaseira: '',
    substituicoes: [],
  }
}

export function criarOpcaoVazia(ordem = 1): OpcaoRefeicaoForm {
  return {
    id: novoId(),
    ordem: String(ordem),
    descricao: '',
    orientacoesPreparo: '',
    alimentos: [criarAlimentoVazio()],
  }
}

export function criarRefeicaoVazia(ordem = 1): RefeicaoForm {
  return {
    id: novoId(),
    nome: '',
    ordem: String(ordem),
    observacoes: '',
    horario: '',
    opcoes: [criarOpcaoVazia()],
  }
}

export function criarFormularioVazio(): PrescricaoNutricionalFormData {
  return {
    nomeParticipante: '',
    dataInicio: '',
    dataFim: '',
    observacoes: '',
    refeicoes: [criarRefeicaoVazia()],
  }
}

export function criarSubstituicaoVazia(ordem: number): SubstituicaoForm {
  return { id: novoId(), ordem: String(ordem), descricao: '', quantidade: '', unidade: '', medidaCaseira: '', observacao: '' }
}
