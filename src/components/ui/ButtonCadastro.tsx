import { FiPlus } from 'react-icons/fi'

type ButtonCadastroProps = {
  label: string
  onClick: () => void
  type?: 'button' | 'submit'
  className?: string
}

export function ButtonCadastro({
  label,
  onClick,
  type = 'button',
  className = '',
}: ButtonCadastroProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-2xl bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 sm:text-sm [&_svg]:size-3.5 [&_svg]:shrink-0 ${className}`}
      aria-label={label}
    >
      <FiPlus aria-hidden />
      <span>{label}</span>
    </button>
  )
}
