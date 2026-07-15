import { FiFileText, FiUsers } from 'react-icons/fi'

type CardEstatisticaProps = {
  valor: string | number
  rotulo: string
  icon: React.ReactNode
}

function CardEstatistica({ valor, rotulo, icon }: CardEstatisticaProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-heading text-lg font-bold text-text sm:text-xl">{valor}</p>
        <p className="text-xs text-text-muted">{rotulo}</p>
      </div>
    </div>
  )
}

type PainelInfoPrescricaoProps = {
  participantesAtivos?: number
  prescricoesMes?: number
}

export function PainelInfoPrescricao({
  participantesAtivos = 0,
  prescricoesMes = 0,
}: PainelInfoPrescricaoProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col justify-center gap-4 bg-brand-50 px-5 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:max-w-[17.5rem] lg:py-10">
      <h1 className="font-heading text-xl font-bold leading-tight text-brand-600 sm:text-2xl">
        Prescrição de
        <br className="hidden sm:block" />
        {' '}Medicamentos
      </h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        <CardEstatistica
          valor={participantesAtivos}
          rotulo="Participantes ativos"
          icon={<FiUsers className="size-5" aria-hidden />}
        />
        <CardEstatistica
          valor={prescricoesMes}
          rotulo="Prescrições este mês"
          icon={<FiFileText className="size-5" aria-hidden />}
        />
      </div>
    </aside>
  )
}
