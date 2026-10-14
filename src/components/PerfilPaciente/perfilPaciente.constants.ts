import {
  FiActivity,
  FiClipboard,
  FiFileText,
  FiUser,
} from 'react-icons/fi'
import { BiCapsule } from 'react-icons/bi'
import { MdRestaurant } from 'react-icons/md'
import type { AbaPerfilConfig } from './perfilPaciente.types'

export const ABAS_PERFIL_PACIENTE: AbaPerfilConfig[] = [
  { id: 'dados', label: 'Dados do Participante', Icone: FiUser },
  { id: 'medicamentos', label: 'Medicamentos', Icone: BiCapsule },
  { id: 'avaliacao', label: 'Avaliação física', Icone: FiActivity },
  { id: 'realizacoes', label: 'Realizações', Icone: FiClipboard },
  { id: 'alimentacao', label: 'Alimentação', Icone: MdRestaurant },
  { id: 'exames', label: 'Exames', Icone: FiFileText },
]

export const CORES_BADGE_DOENCA = [
  {
    badge: 'bg-brand-50 text-brand-800 border-brand-100',
    dot: 'bg-brand-600',
  },
  {
    badge: 'bg-amber-50 text-amber-800 border-amber-100',
    dot: 'bg-amber-500',
  },
  {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    dot: 'bg-emerald-500',
  },
  {
    badge: 'bg-sky-50 text-sky-800 border-sky-100',
    dot: 'bg-sky-500',
  },
] as const
