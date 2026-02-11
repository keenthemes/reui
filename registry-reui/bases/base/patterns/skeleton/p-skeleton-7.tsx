// Description: Skeleton loader for a list with actions
// Order: 7
// GridSize: 1

import { Separator } from "@/registry/bases/base/ui/separator"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      {/* Skeleton pattern */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between pb-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <Separator className="opacity-60" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-border/60 flex items-center gap-3 border-b py-3 last:border-b-0"
          >
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
