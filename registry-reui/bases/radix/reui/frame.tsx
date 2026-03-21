import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"

/**
 * CSS variable architecture for FramePanel theming:
 *
 * The Frame parent sets --frame-panel-bg and --frame-panel-border-color.
 * FramePanel consumes them directly via bg-(--frame-panel-bg) and
 * border-(--frame-panel-border-color). This means:
 *
 *   - variant="inverse" overrides those vars on Frame → all panels pick it up
 *   - <FramePanel className="bg-blue-50"> adds a direct utility on the element
 *     which wins over bg-(--frame-panel-bg) by Tailwind source order — no
 *     :not() or !important needed
 */
const frameVariants = cva(
  [
    "relative flex flex-col bg-muted/50 gap-0.75 p-0.75 rounded-(--frame-radius)",
    "style-vega:[--frame-radius:var(--radius-xl)] style-nova:[--frame-radius:var(--radius-xl)]",
    "style-lyra:[--frame-radius:var(--radius-none)] style-maia:[--frame-radius:var(--radius-2xl)] style-mira:[--frame-radius:var(--radius-lg)]",
    // Default panel token values — overridden per-variant below
    "[--frame-panel-bg:var(--color-card)] [--frame-panel-border-color:var(--color-border)] [--frame-border-color:var(--color-border)]",
  ],
  {
    variants: {
      variant: {
        default: "border border-[var(--frame-border-color)] bg-clip-padding",
        inverse:
          "[--frame-panel-bg:color-mix(in_oklch,var(--color-muted)_40%,transparent)] border border-[var(--frame-border-color)] bg-background bg-clip-padding",
        ghost: "",
      },
      spacing: {
        xs: "[--frame-panel-p:--spacing(2)] [--frame-panel-header-px:--spacing(2)] [--frame-panel-header-py:--spacing(1)] [--frame-panel-footer-px:--spacing(2)] [--frame-panel-footer-py:--spacing(1)]",
        sm: "[--frame-panel-p:--spacing(3)] [--frame-panel-header-px:--spacing(3)] [--frame-panel-header-py:--spacing(2)] [--frame-panel-footer-px:--spacing(3)] [--frame-panel-footer-py:--spacing(2)]",
        default:
          "[--frame-panel-p:--spacing(4)] [--frame-panel-header-px:--spacing(4)] [--frame-panel-header-py:--spacing(3)] [--frame-panel-footer-px:--spacing(4)] [--frame-panel-footer-py:--spacing(3)]",
        lg: "[--frame-panel-p:--spacing(5)] [--frame-panel-header-px:--spacing(5)] [--frame-panel-header-py:--spacing(4)] [--frame-panel-footer-px:--spacing(5)] [--frame-panel-footer-py:--spacing(4)]",
      },
      stacked: {
        true: [
          "gap-0 *:has-[+[data-slot=frame-panel]]:rounded-b-none",
          "*:has-[+[data-slot=frame-panel]]:before:hidden",
          "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:rounded-t-none",
          "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:border-t-0",
          // No FrameHeader present: first panel sits flush against the outer frame border
          "[&:not(:has([data-slot=frame-panel-header]))_[data-slot=frame-panel]:is(:first-child)]:border-t-0",
        ],
        false: [
          "data-[spacing=sm]:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-0.5",
          "data-[spacing=default]:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1",
          "data-[spacing=lg]:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-2",
        ],
      },
      dense: {
        // Positional rules must stay as parent selectors — cannot be expressed via CSS vars
        true: "p-0 gap-0 border-[var(--frame-border-color)] [&_[data-slot=frame-panel]]:-mx-px [&_[data-slot=frame-panel]]:before:hidden [&_[data-slot=frame-panel]:last-child]:-mb-px",
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

function FramePanel({
  className,
  fit,
  ...props
}: React.ComponentProps<"div"> & { fit?: boolean }) {
  return (
    <div
      className={cn(
        // bg-(--frame-panel-bg) and border-(--frame-panel-border-color) consume the
        // CSS vars set by the Frame parent. Any explicit bg-* or border-* class passed
        // via className overrides these by Tailwind source order — no ! needed.
        "relative grow overflow-hidden rounded-(--frame-radius) border border-(--frame-panel-border-color) bg-(--frame-panel-bg) bg-clip-padding shadow-xs",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--frame-radius)-1px)] before:shadow-black/5",
        "dark:bg-clip-border dark:before:shadow-white/5",
        "p-(--frame-panel-p)",
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
      className={cn(
        "flex flex-col px-(--frame-panel-header-px) py-(--frame-panel-header-py)",
        className
      )}
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
      className={cn(
        "flex flex-col gap-1 px-(--frame-panel-footer-px) py-(--frame-panel-footer-py)",
        className
      )}
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
