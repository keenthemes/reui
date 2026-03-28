// Description: Skeleton loader for a data table.
// Order: 5
// GridSize: 1

import { Skeleton } from "@/registry/bases/base/ui/skeleton"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <div className="flex gap-4 border-b pb-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
