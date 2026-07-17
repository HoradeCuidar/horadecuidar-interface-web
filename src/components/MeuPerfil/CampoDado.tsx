type CampoDadoProps = {
  label: string
  valor: string
  className?: string
}

export function CampoDado({ label, valor, className = '' }: CampoDadoProps) {
  return (
    <div className={`flex flex-col gap-0.5 py-2.5 ${className}`}>
      <dt className="text-xs font-medium text-zinc-500">{label}</dt>
      <dd className="text-sm font-medium text-zinc-800 break-words">{valor}</dd>
    </div>
  )
}
