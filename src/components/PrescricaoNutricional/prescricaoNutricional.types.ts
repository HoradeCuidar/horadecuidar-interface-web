import type { UnidadeDeMedida } from '@/services/prescricaoNutricional.types'

export type AlimentoForm = {
  id: string
  descricao: string
  quantidade: string
  unidade: UnidadeDeMedida | ''
  observacao: string
}

export type OpcaoRefeicaoForm = {
  id: string
  ordem: string
  descricao: string
  alimentos: AlimentoForm[]
}

export type RefeicaoForm = {
  id: string
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
  }
}

export function criarOpcaoVazia(ordem = 1): OpcaoRefeicaoForm {
  return {
    id: novoId(),
    ordem: String(ordem),
    descricao: '',
    alimentos: [criarAlimentoVazio()],
  }
}

export function criarRefeicaoVazia(ordem = 1): RefeicaoForm {
  return {
    id: novoId(),
    nome: '',
    ordem: String(ordem),
    observacoes: '',
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
