import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-site-input placeholder:text-site-muted-foreground focus-visible:border-site-ring focus-visible:ring-site-ring/50 aria-invalid:ring-site-destructive/20 dark:aria-invalid:ring-site-destructive/40 aria-invalid:border-site-destructive dark:bg-site-input/30 site-rounded-md flex field-sizing-content min-h-16 w-full border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
