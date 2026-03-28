// Description: Separator with centered text label
// Order: 5

import { Separator } from "@/registry/bases/base/ui/separator"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-6">
      <div className="relative">
        <Separator />
        <span className="bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
          or continue with
        </span>
      </div>
    </div>
  )
}
