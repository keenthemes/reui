// Description: Animated hamburger / close toggle button
// Order: 43

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [open, setOpen] = useState(false)

  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
    >
      <span className="relative flex size-4 items-center justify-center">
        <IconPlaceholder
          lucide="MenuIcon"
          tabler="IconMenu2"
          hugeicons="Menu01Icon"
          phosphor="ListIcon"
          remixicon="RiMenuLine"
          aria-hidden="true"
          className={cn(
            "absolute size-4 transition-all duration-200",
            open
              ? "scale-75 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          )}
        />
        <IconPlaceholder
          lucide="XIcon"
          tabler="IconX"
          hugeicons="MultiplicationSignIcon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          aria-hidden="true"
          className={cn(
            "absolute size-4 transition-all duration-200",
            open
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 -rotate-90 opacity-0"
          )}
        />
      </span>
    </Button>
  )
}
