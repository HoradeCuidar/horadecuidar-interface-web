type AvatarProps = {
  name: string
  src?: string | null
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function Avatar({ name, src, className = '' }: AvatarProps) {
  const initials = getInitials(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`size-12 shrink-0 rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-300 text-lg font-bold text-white ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  )
}
