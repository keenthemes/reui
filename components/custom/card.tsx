import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function Card({
  children,
  className,
  url,
}: {
  children: React.ReactNode
  className?: string
  url?: string
}) {
  const outerClasses = cn(
    "relative flex items-stretch overflow-hidden rounded-2xl border border-border/60 p-0.5 bg-background/60 dark:bg-background/20",
    url &&
      "transition-all hover:-translate-y-1 hover:shadow-md break-inside-avoid"
  )

  const innerContent = (
    <div
      className={cn(
        "border-border/60 bg-background dark:bg-background/30 relative flex w-full flex-col gap-6 rounded-xl border bg-clip-padding p-6 shadow-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(1rem-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
        className
      )}
    >
      {children}
    </div>
  )

  if (url) {
    return (
      <Link href={url} className={outerClasses}>
        {innerContent}
      </Link>
    )
  }

  return <div className={outerClasses}>{innerContent}</div>
}
