import { cn } from "@/lib/utils"

interface PatternsEmptyStateProps {
  message: string
  className?: string
}

export function PatternsEmptyState({
  message,
  className,
}: PatternsEmptyStateProps) {
  return (
    <div className={cn("py-12 text-center", className)}>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
