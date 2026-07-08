"use client"

import * as React from "react"

import { getComponentPreviewComponent } from "@/lib/component-preview-loader"
import { Spinner } from "@/components/ui/spinner"

export function ComponentLivePreviewRuntime({
  name,
  base = "base",
  category,
}: {
  name: string
  base?: string
  category?: string
}) {
  const [key, setKey] = React.useState(0)
  const [isReloading, setIsReloading] = React.useState(false)

  React.useEffect(() => {
    const handleReload = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail && detail.name === name) {
        setIsReloading(true)
        setKey((currentKey) => currentKey + 1)
        setTimeout(() => setIsReloading(false), 200)
      }
    }

    window.addEventListener("component-reload", handleReload)
    return () => window.removeEventListener("component-reload", handleReload)
  }, [name])

  if (isReloading) {
    return (
      <div className="flex h-full min-h-20 items-center justify-center">
        <Spinner className="text-site-muted-foreground/40 size-4" />
      </div>
    )
  }

  const Component = getComponentPreviewComponent(base, name, category)

  if (!Component) {
    return (
      <div className="text-site-muted-foreground flex items-center justify-center p-6 text-sm">
        Component {name} not found in {base}
      </div>
    )
  }

  return <Component key={key} />
}
