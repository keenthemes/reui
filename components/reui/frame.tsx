import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const frameVariants = cva(
  [
    "relative flex flex-col gap-(--frame-gap) rounded-(--frame-radius) p-(--frame-padding)",
    "[--frame-radius:var(--radius-xl)] [--frame-border-radius:calc(var(--frame-radius)-1px)]",
    "[--frame-gap:--spacing(0.75)] [--frame-padding:--spacing(0.5)]",
    "[--frame-panel-px:--spacing(6)] [--frame-panel-py:--spacing(6)]",
    "[--frame-panel-header-px:--spacing(4)] [--frame-panel-header-py:--spacing(3)]",
    "[--frame-panel-footer-px:--spacing(4)] [--frame-panel-footer-py:--spacing(3)]",
  ],
  {
    variants: {
      variant: {
        default:
          "border border-site-border/60 bg-site-background/60 dark:bg-site-background/20 [--frame-panel-bg:var(--color-site-background)] [--frame-panel-border-color:var(--color-site-border)]",
        inverse:
          "border border-site-border/60 bg-site-background dark:bg-site-background/30 [--frame-panel-bg:color-mix(in_oklch,var(--color-site-muted)_45%,transparent)] [--frame-panel-border-color:var(--color-site-border)]",
        ghost:
          "bg-transparent p-0 [--frame-panel-bg:transparent] [--frame-panel-border-color:transparent]",
      },
      spacing: {
        xs: "[--frame-padding:--spacing(0.5)] [--frame-gap:--spacing(0.5)] [--frame-panel-px:--spacing(3)] [--frame-panel-py:--spacing(3)] [--frame-panel-header-px:--spacing(3)] [--frame-panel-header-py:--spacing(2)] [--frame-panel-footer-px:--spacing(3)] [--frame-panel-footer-py:--spacing(2)]",
        sm: "[--frame-padding:--spacing(0.5)] [--frame-gap:--spacing(0.75)] [--frame-panel-px:--spacing(4)] [--frame-panel-py:--spacing(4)] [--frame-panel-header-px:--spacing(4)] [--frame-panel-header-py:--spacing(2.5)] [--frame-panel-footer-px:--spacing(4)] [--frame-panel-footer-py:--spacing(2.5)]",
        default:
          "[--frame-padding:--spacing(0.5)] [--frame-gap:--spacing(0.75)] [--frame-panel-px:--spacing(6)] [--frame-panel-py:--spacing(6)] [--frame-panel-header-px:--spacing(4)] [--frame-panel-header-py:--spacing(3)] [--frame-panel-footer-px:--spacing(4)] [--frame-panel-footer-py:--spacing(3)]",
        lg: "[--frame-padding:--spacing(0.75)] [--frame-gap:--spacing(1)] [--frame-panel-px:--spacing(8)] [--frame-panel-py:--spacing(8)] [--frame-panel-header-px:--spacing(5)] [--frame-panel-header-py:--spacing(4)] [--frame-panel-footer-px:--spacing(5)] [--frame-panel-footer-py:--spacing(4)]",
      },
      stacked: {
        true: "gap-0 *:has-[+[data-slot=frame-panel]]:rounded-b-none *:has-[+[data-slot=frame-panel]]:before:hidden *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:rounded-t-none *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:border-t-0",
        false: "",
      },
      dense: {
        true: "gap-0 p-0 [&_[data-slot=frame-panel]]:-mx-px [&_[data-slot=frame-panel]]:before:hidden [&_[data-slot=frame-panel]:last-child]:-mb-px [&:not(:has([data-slot=frame-panel-header]))_[data-slot=frame-panel]:is(:first-child)]:-mt-px",
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
      data-slot="frame"
      data-spacing={spacing ?? "default"}
      className={cn(
        frameVariants({ variant, spacing, stacked, dense }),
        className
      )}
      {...props}
    />
  )
}

function FramePanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="frame-panel"
      className={cn(
        "relative grow overflow-hidden rounded-(--frame-radius) border border-(--frame-panel-border-color) bg-(--frame-panel-bg) bg-clip-padding px-(--frame-panel-px) py-(--frame-panel-py) shadow-xs",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[var(--frame-border-radius)] before:shadow-[0_1px_--theme(--color-black/4%)]",
        "dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
        className
      )}
      {...props}
    />
  )
}

function FrameHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="frame-panel-header"
      className={cn(
        "flex flex-col gap-1 px-(--frame-panel-header-px) py-(--frame-panel-header-py)",
        className
      )}
      {...props}
    />
  )
}

function FrameTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="frame-panel-title"
      className={cn("text-site-foreground text-sm font-semibold", className)}
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
      data-slot="frame-panel-description"
      className={cn("text-site-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FrameFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="frame-panel-footer"
      className={cn(
        "flex flex-col gap-2 px-(--frame-panel-footer-px) py-(--frame-panel-footer-py)",
        className
      )}
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
