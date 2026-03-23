import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-site-accent site-rounded-md animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
