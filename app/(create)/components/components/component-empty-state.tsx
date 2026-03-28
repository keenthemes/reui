import { cn } from "@/lib/utils"

interface ComponentEmptyStateProps {
  message: string
  className?: string
}

export function ComponentEmptyState({
  message,
  className,
}: ComponentEmptyStateProps) {
  return (
    <div className={cn("py-12 text-center", className)}>
      <p className="text-site-muted-foreground">{message}</p>
    </div>
  )
}
