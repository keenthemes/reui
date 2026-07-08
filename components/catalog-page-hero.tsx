import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface CatalogPageHeroProps {
  badge?: string
  title: ReactNode
  count?: ReactNode
  description?: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
  titleId?: string
  /**
   * Text alignment. The components catalog uses the default left-aligned
   * layout; `"center"` centers the whole stack.
   */
  align?: "left" | "center"
  className?: string
}

export function CatalogPageHero({
  badge,
  title,
  count,
  description,
  subtitle,
  children,
  titleId = "catalog-page-title",
  align = "left",
  className,
}: CatalogPageHeroProps) {
  const body = description ?? subtitle
  const centered = align === "center"

  return (
    <section
      className={cn("container-wrapper", className)}
      aria-labelledby={titleId}
    >
      <div
        className={cn(
          "container",
          centered
            ? "py-12 text-center sm:py-16 lg:py-20"
            : "py-7 sm:py-8 lg:py-9"
        )}
      >
        {badge ? (
          <p className="font-site-mono text-site-muted-foreground mb-3 text-xs leading-4 font-normal tracking-widest uppercase">
            {badge}
          </p>
        ) : null}
        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            centered && "justify-center"
          )}
        >
          <h1
            id={titleId}
            className={cn(
              "text-site-foreground max-w-5xl min-w-0 text-2xl font-bold text-balance sm:text-3xl lg:text-4xl",
              centered && "mx-auto"
            )}
          >
            {title}
          </h1>
          {count != null ? (
            <Badge
              variant="outline"
              className="!site-rounded-full rounded-full px-2.5 py-0.5 text-xs tabular-nums"
            >
              {count}
            </Badge>
          ) : null}
        </div>
        {body ? (
          <div
            className={cn(
              "text-site-muted-foreground mt-5 text-base leading-7 text-pretty sm:text-lg sm:leading-8",
              centered ? "mx-auto max-w-3xl" : "max-w-4xl"
            )}
          >
            {body}
          </div>
        ) : null}
        {children ? (
          <div className={cn("mt-8", centered && "flex justify-center")}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}
