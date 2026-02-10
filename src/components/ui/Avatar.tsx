type AvatarProps = {
  name: string
  className?: string
}

export function Avatar({ name, className = '' }: AvatarProps) {
  const letter = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-300 text-lg font-bold text-white ${className}`}
      aria-hidden
    >
      {letter}
    </div>
  )
}
