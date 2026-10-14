import { Activity, Clock, Target } from 'lucide-react'
import type { ResumoOrientacaoFuncional } from '@/services'
import { CartaoMetrica } from './CartaoMetrica'
import { formatarDuracaoMinutos } from './relatorioAdesao.utils'

export function ResumoOrientacoes({
  dados,
}: {
  dados: ResumoOrientacaoFuncional
}) {
  const tempoMedio =
    dados.quantidade > 0
      ? Math.round(dados.tempoRealizacao / dados.quantidade)
      : null

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Resumo de orientações funcionais"
    >
      <CartaoMetrica
        titulo="Realizações no período"
        valor={dados.quantidade.toLocaleString('pt-BR')}
        Icone={Activity}
        tom="azul"
        rodape={
          dados.quantidade === 0
            ? 'Nenhuma execução confirmada no intervalo'
            : `${dados.quantidade === 1 ? '1 execução confirmada' : `${dados.quantidade} execuções confirmadas`}`
        }
      />
      <CartaoMetrica
        titulo="Tempo total ativo"
        valor={formatarDuracaoMinutos(dados.tempoRealizacao)}
        Icone={Clock}
        tom="verde"
        rodape={
          tempoMedio != null
            ? `Média de ${formatarDuracaoMinutos(tempoMedio)} por sessão`
            : 'Sem sessões para calcular média'
        }
      />
      <CartaoMetrica
        titulo="Período analisado"
        valor={rotuloPeriodoCurto(dados.dataInicial, dados.dataFinal)}
        Icone={Target}
        tom="neutro"
        rodape={`${formatarDataBrLocal(dados.dataInicial)} – ${formatarDataBrLocal(dados.dataFinal)}`}
      />
    </section>
  )
}

function formatarDataBrLocal(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

function rotuloPeriodoCurto(inicio: string, fim: string): string {
  const a = new Date(`${inicio.slice(0, 10)}T12:00:00`)
  const b = new Date(`${fim.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return '—'
  const dias =
    Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return `${dias} ${dias === 1 ? 'dia' : 'dias'}`
}
