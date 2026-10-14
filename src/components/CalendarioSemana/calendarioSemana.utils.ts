import type {
  ChipCalendario,
  DetalheDiarioAdesao,
  DiaCalendario,
  RegistroDiaOrientacao,
  RegistroDiaRealizacao,
  StatusDiaCalendario,
} from './calendarioSemana.types'

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'] as const

export function periodoUltimos7Dias(referencia = new Date()) {
  const fim = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate()
  )
  const inicio = new Date(fim)
  inicio.setDate(fim.getDate() - 6)
  return {
    dataInicial: chaveData(inicio),
    dataFinal: chaveData(fim),
  }
}

export function chaveData(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseDataIso(iso: string): Date | null {
  if (/^\d{4}-\d{2}-\d{2}/.test(iso)) {
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
    if (!y || !m || !d) return null
    return new Date(y, m - 1, d)
  }
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

function base7Dias(referencia = new Date()): DiaCalendario[] {
  const hoje = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate()
  )
  const dias: DiaCalendario[] = []
  for (let i = 6; i >= 0; i--) {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() - i)
    const chave = chaveData(data)
    const ehHoje = chave === chaveData(hoje)
    dias.push({
      chave,
      data,
      rotuloDia: ehHoje ? 'HOJE' : DIAS_SEMANA[data.getDay()],
      rotuloData: data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      }),
      ehHoje,
      status: ehHoje ? 'hoje_vazio' : 'sem_registro',
      qtdRegistros: 0,
    })
  }
  return dias
}

function statusAdesaoDia(item: DetalheDiarioAdesao): StatusDiaCalendario {
  if (item.esperado <= 0) return 'sem_registro'
  if (item.realizado >= item.esperado) return 'realizado'
  if (item.realizado > 0) return 'parcial'
  if (item.naoRealizado > 0) return 'nao_realizado'
  return 'sem_registro'
}

export function montarCalendarioDeAdesaoDiaria(
  detalhes: DetalheDiarioAdesao[],
  referencia = new Date()
): DiaCalendario[] {
  const porDia = new Map<string, DetalheDiarioAdesao>()
  for (const item of detalhes) {
    const chave = item.data.slice(0, 10)
    const atual = porDia.get(chave)
    if (!atual) {
      porDia.set(chave, { ...item, data: chave })
      continue
    }
    porDia.set(chave, {
      data: chave,
      esperado: atual.esperado + item.esperado,
      realizado: atual.realizado + item.realizado,
      naoRealizado: atual.naoRealizado + item.naoRealizado,
      semRegistro: atual.semRegistro + item.semRegistro,
      percentualAdesao: null,
    })
  }

  return base7Dias(referencia).map((dia) => {
    const item = porDia.get(dia.chave)
    if (!item) return dia
    const status = statusAdesaoDia(item)
    return {
      ...dia,
      status: dia.ehHoje && status === 'sem_registro' ? 'hoje_vazio' : status,
      subtitulo:
        item.esperado > 0
          ? `${item.realizado}/${item.esperado}`
          : undefined,
      qtdRegistros: item.realizado,
    }
  })
}

export function montarCalendarioDeRealizacoes(
  registros: RegistroDiaRealizacao[],
  referencia = new Date()
): DiaCalendario[] {
  const porDia = new Map<
    string,
    { status: 'REALIZADO' | 'PARCIALMENTE_REALIZADO'; horario: string; duracao: number; qtd: number }
  >()

  for (const reg of registros) {
    const dt = parseDataIso(reg.dataRegistro)
    if (!dt) continue
    const chave = chaveData(dt)
    const horario = new Date(reg.dataRegistro).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const atual = porDia.get(chave)
    const prioridade = reg.status === 'REALIZADO' ? 2 : 1
    const prioridadeAtual = atual?.status === 'REALIZADO' ? 2 : 1
    if (!atual || prioridade >= prioridadeAtual) {
      porDia.set(chave, {
        status: reg.status,
        horario,
        duracao: (atual?.duracao ?? 0) + (reg.duracaoRealizadaMinutos ?? 0),
        qtd: (atual?.qtd ?? 0) + 1,
      })
    } else {
      porDia.set(chave, {
        ...atual,
        duracao: atual.duracao + (reg.duracaoRealizadaMinutos ?? 0),
        qtd: atual.qtd + 1,
      })
    }
  }

  return base7Dias(referencia).map((dia) => {
    const info = porDia.get(dia.chave)
    if (!info) return dia
    return {
      ...dia,
      status:
        info.status === 'REALIZADO' ? 'realizado' : 'parcial',
      subtitulo: info.horario,
      duracaoMinutos: info.duracao || undefined,
      qtdRegistros: info.qtd,
    }
  })
}

export function montarCalendarioDeOrientacoes(
  registros: RegistroDiaOrientacao[],
  referencia = new Date()
): DiaCalendario[] {
  return montarCalendarioDeRealizacoes(
    registros.map((r) => ({
      dataRegistro: r.data.length <= 10 ? `${r.data}T12:00:00` : r.data,
      status: r.status,
      duracaoRealizadaMinutos: r.duracao,
    })),
    referencia
  )
}

export function resumoCalendario(dias: DiaCalendario[]) {
  const ativos = dias.filter(
    (d) => d.status === 'realizado' || d.status === 'parcial'
  ).length
  const duracoes = dias
    .map((d) => d.duracaoMinutos)
    .filter((n): n is number => n != null && n > 0)
  const tempoMedio =
    duracoes.length > 0
      ? Math.round(duracoes.reduce((a, b) => a + b, 0) / duracoes.length)
      : null
  const pct = Math.round((ativos / 7) * 100)
  return { ativos, tempoMedio, pct }
}

export function chipsPadraoAdesao(dias: DiaCalendario[]): ChipCalendario[] {
  const { ativos } = resumoCalendario(dias)
  return [
    {
      rotulo: `${ativos} de 7 dias com registro no app`,
      tom: 'sucesso',
    },
    {
      rotulo: 'Resumo visual — não substitui a adesão oficial',
      tom: 'neutro',
    },
  ]
}

export function chipsPadraoRealizacao(dias: DiaCalendario[]): ChipCalendario[] {
  const { ativos, tempoMedio } = resumoCalendario(dias)
  return [
    {
      rotulo: `${ativos} de 7 dias com registro no app`,
      tom: 'sucesso',
    },
    {
      rotulo:
        tempoMedio != null
          ? `Tempo médio: ${tempoMedio} min/sessão`
          : 'Tempo médio: —',
      tom: 'brand',
    },
    {
      rotulo: 'Resumo visual — não substitui a adesão oficial',
      tom: 'neutro',
    },
  ]
}
