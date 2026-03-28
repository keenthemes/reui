"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { getComponent, hasComponent } from "@/lib/registry"
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

export function ComponentRenderer({
  name,
  base = "base",
}: {
  name: string
  base?: string
}) {
  const [key, setKey] = React.useState(0)
  const [isReloading, setIsReloading] = React.useState(false)

  React.useEffect(() => {
    const handleReload = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail && detail.name === name) {
        setIsReloading(true)
        setKey((k) => k + 1)
        // Add a small delay to make the reload feel substantive and show the spinner
        setTimeout(() => setIsReloading(false), 200)
      }
    }
    window.addEventListener("component-preview-reload", handleReload)
    return () =>
      window.removeEventListener("component-preview-reload", handleReload)
  }, [name])

  if (isReloading) {
    return (
      <div className="flex h-full min-h-20 items-center justify-center">
        <Spinner className="text-site-muted-foreground/40" />
      </div>
    )
  }

  // Get component using lazy loader (component created on-demand)
  const Component = getComponent(base, name)

  if (!Component) {
    return (
      <div className="text-site-muted-foreground flex items-center justify-center p-6 text-sm">
        Component {name} not found in {base}
      </div>
    )
  }

  return <Component key={key} />
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
  }, [isIntersecting, hasBeenVisible])

  return (
    <Frame
      ref={containerRef}
      // content-visibility: auto defers off-screen rendering (vercel-react-best-practices: rendering-content-visibility)
      // contain-intrinsic-size provides estimated height to prevent layout shift
      className={cn(
        "[contain-intrinsic-size:0_400px] [content-visibility:auto]",
        isFullWidth && "md:col-span-2",
        className
      )}
    >
      <FrameContent
        className={cn(
          "bg-site-background flex min-h-50 min-w-0 flex-1 flex-col flex-wrap items-center justify-center overflow-x-auto p-6 font-sans **:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%] lg:px-8 lg:py-12"
        )}
      >
        {hasBeenVisible ? (
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center py-10">
                <Loader2Icon className="text-site-muted-foreground/40 size-6 animate-spin" />
              </div>
            }
          >
            {children}
          </React.Suspense>
        ) : (
          <div className="flex h-50 w-full items-center justify-center">
            <Loader2Icon className="text-site-muted-foreground/10 size-5 animate-spin" />
          </div>
        )}
      </FrameContent>
      <FrameFooter className="flex-row items-center gap-3 px-2 py-1.5">
        {footer}
      </FrameFooter>
    </Frame>
  )
}
