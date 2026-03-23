import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-site-foreground placeholder:text-site-muted-foreground selection:bg-site-primary selection:text-site-primary-foreground dark:bg-site-input/30 border-site-input site-rounded-md h-9 w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-site-ring focus-visible:ring-site-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-site-destructive/20 dark:aria-invalid:ring-site-destructive/40 aria-invalid:border-site-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
