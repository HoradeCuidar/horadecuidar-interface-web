import { Skeleton } from '@/components'

export function ModalEditarPacienteSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-36 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Skeleton className="h-3.5 w-14 mb-2" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-3.5 w-16 mb-2" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-3.5 w-32 mb-2" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-3.5 w-16 mb-2" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="sm:col-span-2">
          <Skeleton className="h-3.5 w-12 mb-2" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
