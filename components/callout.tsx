import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Callout({
  title,
  children,
  icon,
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode
  variant?: "default" | "info" | "warning"
}) {
  return (
    <Alert
      data-variant={variant}
      className={cn(
        "bg-site-background text-site-foreground border-site-border mt-6 w-auto border md:-mx-1",
        className
      )}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-site-card-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  )
}
