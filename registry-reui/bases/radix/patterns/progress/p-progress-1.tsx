// Description: Basic progress.
// Order: 1

import { Progress } from "@/registry/bases/radix/ui/progress"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="cn-progress-label text-sm font-medium">
          Upload progress
        </span>
        <span className="cn-progress-value text-muted-foreground text-sm">
          56%
        </span>
      </div>
      <Progress value={56} />
    </div>
  )
}
