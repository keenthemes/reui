// Description: Vertical separator groups related menu items.
// Order: 3

import { Separator } from "@/registry/bases/base/ui/separator"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium">Settings</span>
          <span className="text-muted-foreground text-xs">
            Manage preferences
          </span>
        </div>
        <Separator orientation="vertical" className="h-8 [&]:self-auto!" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Account</span>
          <span className="text-muted-foreground text-xs">
            Profile & security
          </span>
        </div>
        <Separator orientation="vertical" className="h-8 [&]:self-auto!" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Help</span>
          <span className="text-muted-foreground text-xs">Support & docs</span>
        </div>
      </div>
    </div>
  )
}
