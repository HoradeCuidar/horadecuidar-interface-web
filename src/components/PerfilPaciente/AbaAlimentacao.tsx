import { EmptyState, ButtonCadastro } from '@/components'
import emptyMedicamentosSvg from '@/assets/empty-medicamentos.svg'

type AbaAlimentacaoProps = {
  onNovaPrescricao: () => void
}

export function AbaAlimentacao({ onNovaPrescricao }: AbaAlimentacaoProps) {
  return (
    <EmptyState
      illustration={
        <img
          src={emptyMedicamentosSvg}
          alt=""
          className="mx-auto max-h-[14rem] w-auto sm:max-h-[20rem]"
        />
      }
      title="Nenhuma prescrição nutricional listada!"
      description="Cadastre um plano alimentar para este participante. A listagem e o histórico aparecerão aqui quando o back expor os endpoints de consulta."
      className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-card"
    >
      <ButtonCadastro
        label="Nova prescrição nutricional"
        onClick={onNovaPrescricao}
      />
    </EmptyState>
  )
}
