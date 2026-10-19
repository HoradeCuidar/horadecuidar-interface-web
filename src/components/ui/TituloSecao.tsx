type TituloSecaoProps = {
  children: React.ReactNode
  className?: string
}

export function TituloSecao({ children, className = '' }: TituloSecaoProps) {
  return (
    <h3
      className={`w-fit rounded-full bg-brand-500 px-2.5 py-1.5 text-xs font-semibold text-white ${className}`}
    >
      {children}
    </h3>
  )
}
