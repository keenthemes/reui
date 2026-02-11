// Description: Horizontal separator for content sections.
// Order: 1

import { Separator } from "@/registry/bases/base/ui/separator"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2 text-sm">
      <div className="flex flex-col gap-1">
        <div className="text-sm leading-none font-medium">Design System</div>
        <div className="text-muted-foreground text-xs">
          The Foundation for your UI.
        </div>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        A set of beautifully designed components that you can customize, extend,
        and build on.
      </div>
    </div>
  )
}
