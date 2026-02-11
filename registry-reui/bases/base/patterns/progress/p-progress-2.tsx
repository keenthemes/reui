// Description: Small progress.
// Order: 2

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/registry/bases/base/ui/progress"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Progress value={30} className="**:data-[slot=progress-track]:h-1">
        <ProgressLabel>Small progress</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
