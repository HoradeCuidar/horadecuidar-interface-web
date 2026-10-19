export type MedicamentoForm = {
  id: string
  nome: string
  dosagem: string
  unidadeDosagem: string
  viaAdministracao: string
  frequenciaVezes: string
  frequenciaIntervalo: string
  frequenciaUnidade: string
  observacao: string
}

export type PrescricaoFormData = {
  nomeParticipante: string
  dataInicio: string
  dataTermino: string
  observacaoGeral: string
  medicamentos: MedicamentoForm[]
}

export function criarMedicamentoVazio(): MedicamentoForm {
  return {
    id: crypto.randomUUID(),
    nome: '',
    dosagem: '',
    unidadeDosagem: '',
    viaAdministracao: '',
    frequenciaVezes: '1',
    frequenciaIntervalo: '1',
    frequenciaUnidade: '',
    observacao: '',
  }
}

export const OPCOES_UNIDADE_DOSAGEM = [
  { value: 'MG', label: 'mg' },
  { value: 'G', label: 'g' },
  { value: 'ML', label: 'ml' },
  { value: 'GOTAS', label: 'gotas' },
  { value: 'COMPRIMIDO', label: 'comprimido' },
  { value: 'CAPSULA', label: 'cápsula' },
  { value: 'DRAGEA', label: 'drágea' },
  { value: 'COLHER_CHA', label: 'colher de chá' },
  { value: 'COLHER_SOPA', label: 'colher de sopa' },
]

export const OPCOES_VIA_ADMINISTRACAO = [
  { value: 'ORAL', label: 'Oral' },
  { value: 'SUBLINGUAL', label: 'Sublingual' },
  { value: 'TOPICA', label: 'Tópica' },
  { value: 'OFTALMICA', label: 'Oftálmica' },
  { value: 'NASAL', label: 'Nasal' },
  { value: 'INALATORIA', label: 'Inalatória' },
  { value: 'RETAL', label: 'Retal' },
  { value: 'INJETAVEL', label: 'Injetável' },
]

export const OPCOES_UNIDADE_FREQUENCIA = [
  { value: 'HORA', label: 'hora(s)' },
  { value: 'DIA', label: 'dia(s)' },
  { value: 'SEMANA', label: 'semana(s)' },
  { value: 'MES', label: 'mês(es)' },
]
