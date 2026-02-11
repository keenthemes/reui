import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"

const frameVariants = cva(
  "relative flex flex-col bg-muted/50 gap-0.75 p-0.75 rounded-(--frame-radius) style-vega:[--frame-radius:var(--radius-lg)] style-nova:[--frame-radius:var(--radius-lg)] style-lyra:[--frame-radius:var(--radius-none)] style-maia:[--frame-radius:var(--radius-2xl)] style-mira:[--frame-radius:var(--radius-md)]",
  {
    variants: {
      variant: {
        default: "border border-border/50 bg-clip-padding",
        ghost: "",
      },
      spacing: {
        xs: "[&_[data-slot=frame-panel]]:p-2 [&_[data-slot=frame-panel-header]]:px-2 [&_[data-slot=frame-panel-header]]:py-1 [&_[data-slot=frame-panel-footer]]:px-2 [&_[data-slot=frame-panel-footer]]:py-1",
        sm: "[&_[data-slot=frame-panel]]:p-3 [&_[data-slot=frame-panel-header]]:px-3 [&_[data-slot=frame-panel-header]]:py-2 [&_[data-slot=frame-panel-footer]]:px-3 [&_[data-slot=frame-panel-footer]]:py-2",
        default:
          "[&_[data-slot=frame-panel]]:p-4 [&_[data-slot=frame-panel-header]]:px-4 [&_[data-slot=frame-panel-header]]:py-3 [&_[data-slot=frame-panel-footer]]:px-4 [&_[data-slot=frame-panel-footer]]:py-3",
        lg: "[&_[data-slot=frame-panel]]:p-5 [&_[data-slot=frame-panel-header]]:px-5 [&_[data-slot=frame-panel-header]]:py-4 [&_[data-slot=frame-panel-footer]]:px-5 [&_[data-slot=frame-panel-footer]]:py-4",
      },
      stacked: {
        true: [
          "gap-0 *:has-[+[data-slot=frame-panel]]:rounded-b-none",
          "*:has-[+[data-slot=frame-panel]]:before:hidden",
          "dark:*:has-[+[data-slot=frame-panel]]:before:block",
          "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:rounded-t-none",
          "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:border-t-0",
          "dark:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:before:hidden",
        ],
        false: [
          "data-[spacing=sm]:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-0.5",
          "data-[spacing=default]:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1",
          "data-[spacing=lg]:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-2",
        ],
      },
      dense: {
        true: "p-0 border-border [&_[data-slot=frame-panel]]:-mx-px [&_[data-slot=frame-panel]]:before:hidden [&_[data-slot=frame-panel]:last-child]:-mb-px",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
      stacked: false,
      dense: false,
    },
  }
)

function Frame({
  className,
  variant,
  spacing,
  stacked,
  dense,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof frameVariants>) {
  return (
    <div
      className={cn(
        frameVariants({ variant, spacing, stacked, dense }),
        className
      )}
      data-slot="frame"
      data-spacing={spacing}
      {...props}
    />
  )
}

function FramePanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background relative rounded-(--frame-radius) border bg-clip-padding shadow-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--frame-radius)-1px)] before:shadow-black/5 dark:bg-clip-border dark:before:shadow-white/5",
        className
      )}
      data-slot="frame-panel"
      {...props}
    />
  )
}

function FrameHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn("flex flex-col", className)}
      data-slot="frame-panel-header"
      {...props}
    />
  )
}

function FrameTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm font-semibold", className)}
      data-slot="frame-panel-title"
      {...props}
    />
  )
}

function FrameDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="frame-panel-description"
      {...props}
    />
  )
}

function FrameFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      className={cn("flex flex-col gap-1", className)}
      data-slot="frame-panel-footer"
      {...props}
    />
  )
}

export {
  Frame,
  FramePanel,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FrameFooter,
  frameVariants,
}
