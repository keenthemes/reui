import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-site-muted text-site-muted-foreground site-rounded-sm font-site-sans pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 px-1 text-xs font-medium select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-site-background/20 [[data-slot=tooltip-content]_&]:text-site-background dark:[[data-slot=tooltip-content]_&]:bg-site-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
