import { cn } from "@/lib/utils"

const STRIPE_CLASS =
  "bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)]"

const MASK_VARIANTS = {
  default:
    "mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]",
  separator:
    "mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_50%,transparent_100%)]",
} as const

export interface SectionBackdropProps {
  variant?: keyof typeof MASK_VARIANTS
  opacity?: number
  className?: string
}

/**
 * Diagonal stripe background for hero sections (matches reui.io hero-block).
 */
export function SectionBackdrop({
  variant = "default",
  opacity = variant === "separator" ? 0.06 : 0.03,
  className,
}: SectionBackdropProps) {
  const inset =
    variant === "separator" ? "inset-0" : "-inset-x-6 inset-y-0"

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-0",
        inset,
        STRIPE_CLASS,
        MASK_VARIANTS[variant],
        className
      )}
      style={{ opacity }}
      aria-hidden
    />
  )
}
