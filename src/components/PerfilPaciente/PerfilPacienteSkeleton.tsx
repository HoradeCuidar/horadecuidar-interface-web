import { Skeleton } from '@/components'

export function PerfilPacienteSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <Skeleton className="h-4 w-64 rounded-md" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-11 w-full max-w-3xl rounded-lg" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  )
}
