import { ShieldCheck, Ban, TriangleAlert } from 'lucide-react'
import type { TipoCuidado } from '@/services/orientacaoFuncional.types'

export const GRUPOS_CUIDADO = [
  { tipo: 'PRECAUCAO' as TipoCuidado, titulo: 'Precauções', descricao: 'Cuidados e adaptações durante a execução.', Icone: ShieldCheck, cor: 'border-blue-200 bg-blue-50/50 text-blue-700' },
  { tipo: 'NAO_REALIZAR' as TipoCuidado, titulo: 'Quando não realizar', descricao: 'Situações em que a orientação não deve ser seguida sem avaliação individual.', Icone: Ban, cor: 'border-amber-200 bg-amber-50/50 text-amber-700' },
  { tipo: 'SINAL_DE_ALERTA' as TipoCuidado, titulo: 'Sinais de alerta', descricao: 'Sinais para interromper a atividade e seguir a orientação da equipe.', Icone: TriangleAlert, cor: 'border-red-200 bg-red-50/50 text-red-600' },
]
