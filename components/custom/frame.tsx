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
      "bg-site-background border-site-border/80 relative flex flex-col overflow-hidden rounded-[16px] border p-0.5 shadow-sm shadow-black/5",
      className
    )

    if (url) {
      return (
        <Link
          href={url}
          ref={ref as any}
          className={cn(
            outerClasses,
            "hover:ring-site-foreground/10 transition-all hover:shadow-lg"
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
        "border-site-border site-rounded-xl relative overflow-hidden border",
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
    <div
      className={cn("font-site-sans flex flex-col gap-1 p-3", className)}
      {...props}
    >
      {children}
    </div>
  )
}
