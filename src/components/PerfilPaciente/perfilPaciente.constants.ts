import type { AbaPerfilConfig } from './perfilPaciente.types'

export const ABAS_PERFIL_PACIENTE: AbaPerfilConfig[] = [
  { id: 'dados', label: 'Dados do Participante' },
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'alimentacao', label: 'Alimentação' },
]

export const CORES_BADGE_DOENCA = [
  'bg-brand-100 text-brand-700 border-brand-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-purple-100 text-purple-700 border-purple-200',
] as const
