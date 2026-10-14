import type { RegistroRealizacaoFuncional } from '@/services/realizacaoFuncional.types'

function isoDiasAtras(dias: number, hora: string): string {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  const [h, m] = hora.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${mo}-${day}T${hh}:${mm}:00`
}

export const REALIZACOES_MOCK: RegistroRealizacaoFuncional[] = [
  {
    id: 9001,
    orientacaoFuncionalId: 11,
    nomeOrientacao: 'Alongamento cervical',
    status: 'REALIZADO',
    duracaoRealizadaMinutos: 15,
    sensacaoFinal: 'DE_BOA',
    observacao:
      'Me senti bem, sem dor no ombro. Consegui completar a série sem pausas longas.',
    dataRegistro: isoDiasAtras(0, '08:42'),
  },
  {
    id: 9002,
    orientacaoFuncionalId: 12,
    nomeOrientacao: 'Caminhada leve',
    status: 'PARCIALMENTE_REALIZADO',
    duracaoRealizadaMinutos: 20,
    sensacaoFinal: 'ARRASTADO',
    observacao:
      'Comecei bem, mas precisei reduzir o ritmo após 12 minutos por cansaço nas pernas.',
    dataRegistro: isoDiasAtras(1, '17:15'),
  },
  {
    id: 9003,
    orientacaoFuncionalId: 13,
    nomeOrientacao: 'Equilíbrio em apoio unipodal',
    status: 'REALIZADO',
    duracaoRealizadaMinutos: 10,
    sensacaoFinal: 'ME_SUPEREI',
    observacao: null,
    dataRegistro: isoDiasAtras(2, '09:05'),
  },
  {
    id: 9004,
    orientacaoFuncionalId: 14,
    nomeOrientacao: 'Fortalecimento de membros superiores',
    status: 'REALIZADO',
    duracaoRealizadaMinutos: 25,
    sensacaoFinal: 'BEM_FORTE',
    observacao: 'Usei elástico médio. Sem dor articular no final.',
    dataRegistro: isoDiasAtras(4, '19:30'),
  },
  {
    id: 9005,
    orientacaoFuncionalId: 12,
    nomeOrientacao: 'Caminhada leve',
    status: 'REALIZADO',
    duracaoRealizadaMinutos: 30,
    sensacaoFinal: 'DE_BOA',
    observacao: null,
    dataRegistro: isoDiasAtras(5, '07:50'),
  },
]
