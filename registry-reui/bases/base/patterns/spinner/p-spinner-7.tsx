// Description: Overlay loading spinner
// Order: 7

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { Spinner } from "@/registry/bases/base/ui/spinner"

export default function Pattern() {
  return (
    <div className="w-full max-w-xs overflow-hidden">
      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Report</CardTitle>
          <CardDescription>Revenue and growth metrics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Revenue</span>
            <span className="font-medium">$12,450</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Growth</span>
            <span className="font-medium">+18.2%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Users</span>
            <span className="font-medium">1,248</span>
          </div>
        </CardContent>
      </Card>

      {/* Overlay */}
      <Card className="bg-background/80 absolute inset-0 z-10 backdrop-blur-xs">
        <CardContent className="flex grow flex-col items-center justify-center gap-2">
          <Spinner className="size-5 opacity-60" />
          <span className="text-muted-foreground text-sm">
            Refreshing data...
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
