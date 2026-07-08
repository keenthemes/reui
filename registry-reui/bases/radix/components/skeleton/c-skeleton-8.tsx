import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/bases/radix/ui/card"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <Skeleton className="aspect-video w-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardFooter>
    </Card>
  )
}
