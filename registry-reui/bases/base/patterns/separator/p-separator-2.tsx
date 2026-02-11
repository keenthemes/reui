// Description: Vertical separator for inline elements.
// Order: 2

import { Separator } from "@/registry/bases/base/ui/separator"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
