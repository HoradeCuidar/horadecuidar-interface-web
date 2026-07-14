import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

type TabsVariant = 'underline' | 'pill'

type TabsContextValue = {
  value: string
  onValueChange: (value: string) => void
  variant: TabsVariant
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Componentes de aba devem ser usados dentro de <Tabs>.')
  }
  return context
}

type TabsProps = {
  value: string
  onValueChange: (value: string) => void
  variant?: TabsVariant
  children: ReactNode
  className?: string
}

export function Tabs({
  value,
  onValueChange,
  variant = 'underline',
  children,
  className,
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange, variant }}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

type TabsListProps = HTMLAttributes<HTMLDivElement>

export function TabsList({ className, children, ...props }: TabsListProps) {
  const { variant } = useTabsContext()

  if (variant === 'pill') {
    return (
      <div
        role="tablist"
        className={cn(
          'flex w-max rounded-full border border-[#CCDDFF] bg-[#E6EEFF] p-1',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={cn('border-b border-zinc-200', className)} {...props}>
      <nav role="tablist" className="flex gap-6 overflow-x-auto">
        {children}
      </nav>
    </div>
  )
}

type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange, variant } = useTabsContext()
  const isActive = activeValue === value

  if (variant === 'pill') {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        className={cn(
          'rounded-full px-6 py-1.5 text-xs font-semibold transition-all duration-200',
          isActive
            ? 'border border-brand-200 bg-white text-brand-700 shadow-sm'
            : 'border border-transparent text-brand-600 hover:text-brand-800',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={cn(
        'shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors',
        isActive
          ? 'border-brand-600 text-brand-600'
          : 'border-transparent text-zinc-500 hover:text-zinc-700',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const { value: activeValue } = useTabsContext()

  if (activeValue !== value) return null

  return (
    <div role="tabpanel" className={className} {...props}>
      {children}
    </div>
  )
}
