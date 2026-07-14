import { Skeleton } from '@/components'

export function PerfilPacienteSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-8 pt-8">
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-10 w-96" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}
