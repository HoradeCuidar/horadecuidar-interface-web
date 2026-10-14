type FormSecaoNutricionalProps = {
  titulo: string
  icone: React.ReactNode
  children: React.ReactNode
  acao?: React.ReactNode
}

export function FormSecaoNutricional({
  titulo,
  icone,
  children,
  acao,
}: FormSecaoNutricionalProps) {
  return (
    <section className="border-l-4 border-brand-600 pl-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            {icone}
          </span>
          <h2 className="font-heading text-base font-bold tracking-tight text-text">
            {titulo}
          </h2>
        </div>
        {acao}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}
