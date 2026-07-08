import { cn } from "@/lib/utils"

/**
 * The small uppercase mono label that sits above section titles (eyebrow).
 * Single source of truth for its size and tracking so every section across the
 * site reads consistently. Kept intentionally small and lightly tracked.
 */
export function SectionLabel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "text-site-muted-foreground font-site-mono text-xs font-medium tracking-[0.12em] uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}
