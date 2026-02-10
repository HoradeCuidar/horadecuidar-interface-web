import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  illustration?: ReactNode
  children?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  illustration,
  children,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[45vh] flex-1 flex-col items-center justify-center py-8 text-center ${className}`}
      role="status"
      aria-label={title}
    >
      {illustration && (
        <div className="mb-4 flex justify-center text-brand-200 [&_svg]:max-h-[16rem] [&_svg]:w-auto [&_img]:max-h-[16rem] [&_img]:w-auto">
          {illustration}
        </div>
      )}
      <h2 className="font-heading text-sm font-semibold text-text">{title}</h2>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs text-text-muted">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
