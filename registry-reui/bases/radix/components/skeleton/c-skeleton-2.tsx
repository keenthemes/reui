import { Card, CardContent, CardHeader } from "@/registry/bases/radix/ui/card"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full rounded-md" />
      </CardContent>
    </Card>
  )
}
