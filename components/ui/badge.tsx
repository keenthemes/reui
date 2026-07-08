import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center site-rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-site-ring focus-visible:ring-site-ring/50 focus-visible:ring-[3px] aria-invalid:ring-site-destructive/20 dark:aria-invalid:ring-site-destructive/40 aria-invalid:border-site-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-site-primary text-site-primary-foreground [a&]:hover:bg-site-primary/90",
        secondary:
          "border-transparent bg-site-secondary text-site-secondary-foreground [a&]:hover:bg-site-secondary/90",
        destructive:
          "border-transparent bg-site-destructive text-site-destructive-foreground [a&]:hover:bg-site-destructive/90 focus-visible:ring-site-destructive/20 dark:focus-visible:ring-site-destructive/40 dark:bg-site-destructive/60",
        outline:
          "text-site-foreground [a&]:hover:bg-site-accent [a&]:hover:text-site-accent-foreground",
        success: "border-transparent bg-green-600 text-white dark:bg-green-500",
        "success-light":
          "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        warning: "border-transparent bg-amber-500 text-white dark:bg-amber-500",
        "warning-light":
          "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        info: "border-transparent bg-blue-600 text-white dark:bg-blue-500",
        "info-light":
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "destructive-light":
          "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
