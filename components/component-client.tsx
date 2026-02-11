"use client"

import { Suspense, useMemo } from "react"

import { getRegistryComponent } from "@/lib/registry"
import { Spinner } from "@/components/ui/spinner"

export function ComponentClient({
  name,
  styleName,
}: {
  name: string
  styleName: string
}) {
  const Component = useMemo(
    () => getRegistryComponent(name, styleName),
    [name, styleName]
  )

  if (!Component) {
    return null
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-4">
          <Spinner className="size-4 opacity-60" />
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}
