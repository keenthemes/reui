"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Spinner } from "@/components/ui/spinner"
import { Frame, FrameContent, FrameFooter } from "@/components/custom/frame"

interface ComponentCardContainerProps {
  children: React.ReactNode
  footer: React.ReactNode
  className?: string
  isFullWidth?: boolean
}

export function ComponentName({ name }: { name: string }) {
  return (
    <div
      className="bg-site-muted/50 text-site-muted-foreground hover:bg-site-muted hover:text-site-foreground site-rounded-md flex h-7 items-center gap-1.5 px-2 text-[10px] font-medium transition-all select-all"
      title="Component name"
    >
      {name}
    </div>
  )
}

export function ComponentCardContainer({
  children,
  footer,
  className,
  isFullWidth,
}: ComponentCardContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isIntersecting = useIntersectionObserver(containerRef, {
    rootMargin: "800px",
    threshold: 0,
    freezeOnceVisible: true,
  })
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false)

  React.useEffect(() => {
    if (isIntersecting && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  }, [hasBeenVisible, isIntersecting])

  return (
    <Frame
      ref={containerRef}
      // content-visibility: auto defers off-screen rendering (vercel-react-best-practices: rendering-content-visibility)
      // contain-intrinsic-size provides estimated height to prevent layout shift
      className={cn(
        "[contain-intrinsic-size:0_352px] [content-visibility:auto]",
        isFullWidth && "md:col-span-2",
        className
      )}
    >
      <FrameContent
        className={cn(
          "bg-site-background flex min-h-44 min-w-0 flex-1 flex-col flex-wrap items-center justify-center overflow-x-auto p-6 font-sans **:data-[slot=preview]:mx-auto **:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%] lg:px-8 lg:py-10"
        )}
      >
        {hasBeenVisible ? (
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <Spinner className="text-site-muted-foreground/40 size-4" />
              </div>
            }
          >
            {children}
          </React.Suspense>
        ) : (
          <div className="flex h-44 w-full items-center justify-center">
            <Spinner className="text-site-muted-foreground/10 size-4" />
          </div>
        )}
      </FrameContent>
      <FrameFooter className="flex-row items-center gap-3 px-2 py-1.5">
        {footer}
      </FrameFooter>
    </Frame>
  )
}
