// Description: Large progress.
// Order: 3

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/registry/bases/base/ui/progress"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Progress value={70} className="**:data-[slot=progress-track]:h-3">
        <ProgressLabel>Large progress</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
