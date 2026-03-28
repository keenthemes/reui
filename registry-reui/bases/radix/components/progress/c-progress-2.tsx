// Description: Small progress.
// Order: 2

import { Progress } from "@/registry/bases/radix/ui/progress"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="cn-progress-label text-sm font-medium">
          Small progress
        </span>
        <span className="cn-progress-value text-muted-foreground text-sm">
          30%
        </span>
      </div>
      <Progress value={30} className="h-1" />
    </div>
  )
}
