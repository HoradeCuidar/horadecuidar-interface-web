import {
  CheckCircle2,
  CircleDashed,
  Percent,
  Pill,
  Utensils,
  XCircle,
} from 'lucide-react'
import type { ResumoAdesaoMedicamento, ResumoAdesaoNutricional } from '@/services'
import { CartaoMetrica } from './CartaoMetrica'
import { formatarPercentual, nivelAdesao } from './relatorioAdesao.utils'

function ResumoAdesao({
  dados,
  nutricional = false,
}: {
  dados: ResumoAdesaoMedicamento | ResumoAdesaoNutricional
  nutricional?: boolean
}) {
  const nivel = nivelAdesao(dados.percentual)
  const tomBadge =
    nivel.tom === 'sucesso'
      ? 'verde'
      : nivel.tom === 'alerta'
        ? 'laranja'
        : nivel.tom === 'critico'
          ? 'vermelho'
          : 'neutro'

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      aria-label={
        nutricional
          ? 'Resumo de adesão nutricional'
          : 'Resumo de adesão a medicamentos'
      }
    >
      <CartaoMetrica
        titulo={nutricional ? 'Refeições esperadas' : 'Doses esperadas'}
        valor={dados.esperado.toLocaleString('pt-BR')}
        Icone={nutricional ? Utensils : Pill}
        tom="azul"
        rodape={`${formatarDataCurta(dados.dataInicial)} – ${formatarDataCurta(dados.dataFinal)}`}
      />
      <CartaoMetrica
        titulo="Realizadas"
        valor={dados.realizado.toLocaleString('pt-BR')}
        Icone={CheckCircle2}
        tom="verde"
        rodape={
          dados.esperado > 0
            ? `${formatarPercentual((dados.realizado / dados.esperado) * 100)} do esperado`
            : undefined
        }
      />
      <CartaoMetrica
        titulo="Não realizadas"
        valor={dados.naoRealizado.toLocaleString('pt-BR')}
        Icone={XCircle}
        tom="vermelho"
      />
      <CartaoMetrica
        titulo="Sem registro"
        valor={dados.semRegistro.toLocaleString('pt-BR')}
        Icone={CircleDashed}
        tom="laranja"
      />
      <CartaoMetrica
        titulo="Adesão geral"
        valor={formatarPercentual(dados.percentual)}
        Icone={Percent}
        tom={tomBadge}
        badge={{ rotulo: nivel.rotulo, tom: tomBadge }}
      />
    </section>
  )
}

function formatarDataCurta(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}`
}

export function ResumoMedicamentos({
  dados,
}: {
  dados: ResumoAdesaoMedicamento
}) {
  return <ResumoAdesao dados={dados} />
}

export function ResumoNutricional({
  dados,
}: {
  dados: ResumoAdesaoNutricional
}) {
  return <ResumoAdesao dados={dados} nutricional />
}
