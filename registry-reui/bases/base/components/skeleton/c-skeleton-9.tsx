// Description: Skeleton loader for a full profile page
// Order: 9
// GridSize: 1

import { Card, CardContent, CardHeader } from "@/registry/bases/base/ui/card"
import { Separator } from "@/registry/bases/base/ui/separator"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-6">
      {/* Profile header */}
      <Card>
        <CardHeader className="items-center gap-3">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="flex justify-center gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Details section */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          <Skeleton className="h-4 w-24" />
          <Separator />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
