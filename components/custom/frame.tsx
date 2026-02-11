import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  url?: string
}

export const Frame = React.forwardRef<HTMLDivElement, FrameProps>(
  ({ children, url, className, ...props }, ref) => {
    const outerClasses = cn(
      "bg-background relative border border-border/80 flex flex-col overflow-hidden rounded-2xl p-0.5 shadow-sm shadow-black/5",
      className
    )

    if (url) {
      return (
        <Link
          href={url}
          ref={ref as any}
          className={cn(
            outerClasses,
            "hover:ring-foreground/10 transition-all hover:shadow-lg"
          )}
        >
          {children}
        </Link>
      )
    }

    return (
      <div ref={ref} className={outerClasses} {...props}>
        {children}
      </div>
    )
  }
)
Frame.displayName = "Frame"

export function FrameContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-border relative overflow-hidden rounded-xl border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function FrameFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 p-3", className)} {...props}>
      {children}
    </div>
  )
}
