import { cn } from "@/lib/utils"

export function Heading({
  badge,
  title,
  description,
  className,
}: {
  badge: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("mb-12 flex flex-col gap-3.5", className)}>
      <h2 className="max-w-3xl text-3xl font-bold lg:text-4xl">{title}</h2>
      <p className="text-site-muted-foreground max-w-3xl text-lg leading-relaxed">
        {description}
      </p>
    </div>
  )
}
