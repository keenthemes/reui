// Description: Skeleton loader for chat messages
// Order: 10
// GridSize: 1

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent>
        {/* Incoming message */}
        <div className="flex items-start gap-2.5">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-16 w-48 rounded-lg rounded-tl-none" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex items-start justify-end gap-2.5">
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-10 w-40 rounded-lg rounded-tr-none" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        </div>

        {/* Incoming message */}
        <div className="flex items-start gap-2.5">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-24 w-56 rounded-lg rounded-tl-none" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        </div>

        {/* Input area */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
