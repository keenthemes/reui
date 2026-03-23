"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-site-input dark:bg-site-input/30 data-[state=checked]:bg-site-primary data-[state=checked]:text-site-primary-foreground dark:data-[state=checked]:bg-site-primary data-[state=checked]:border-site-primary focus-visible:border-site-ring focus-visible:ring-site-ring/50 aria-invalid:ring-site-destructive/20 dark:aria-invalid:ring-site-destructive/40 aria-invalid:border-site-destructive site-rounded-sm size-4 shrink-0 border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
