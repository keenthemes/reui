// Description: Inline loading text with spinner
// Order: 9

import { Spinner } from "@/registry/bases/base/ui/spinner"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <div className="flex items-center gap-2">
        <Spinner className="size-3.5" />
        <span className="text-muted-foreground text-sm">
          Checking availability...
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner className="text-success size-3.5" />
        <span className="text-sm">
          <span className="text-success font-medium">Connected</span>
          <span className="text-muted-foreground"> — syncing data</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner className="text-warning size-3.5" />
        <span className="text-sm">
          <span className="text-warning font-medium">Reconnecting</span>
          <span className="text-muted-foreground"> — attempt 3 of 5</span>
        </span>
      </div>
    </div>
  )
}
