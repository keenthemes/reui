import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Frame, FramePanel } from "@/components/reui/frame"

export function Card({
  children,
  className,
  outerClassName,
  url,
}: {
  children: React.ReactNode
  className?: string
  outerClassName?: string
  url?: string
}) {
  const innerContent = (
    <FramePanel
      className={cn("relative flex w-full flex-col gap-6", className)}
    >
      {children}
    </FramePanel>
  )

  if (url) {
    return (
      <Link
        href={url}
        className={cn(
          "relative flex break-inside-avoid items-stretch transition-all hover:-translate-y-1 hover:shadow-md",
          outerClassName
        )}
      >
        <Frame className="h-full w-full">{innerContent}</Frame>
      </Link>
    )
  }

  // `break-inside-avoid` so a Card never gets split across a CSS-columns
  // boundary (e.g. the masonry-style layout used by the home page Wall
  // of Love grid). Outside a multi-column context the property is a
  // no-op, so it's safe to apply by default — matches the URL'd branch
  // above which already opts in via the explicit class. Without it,
  // testimonial cards near a column break get visually clipped at the
  // top / bottom with their twin half rendered into the next column.
  return (
    <Frame className={cn("break-inside-avoid", outerClassName)}>
      {innerContent}
    </Frame>
  )
}
