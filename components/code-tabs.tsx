"use client"

import * as React from "react"

import { DEFAULT_CONFIG, useConfig } from "@/hooks/use-config"
import { Tabs } from "@/components/ui/tabs"

export function CodeTabs({ children }: React.ComponentProps<typeof Tabs>) {
  const [config, setConfig] = useConfig()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // localStorage-backed config differs from DEFAULT_CONFIG on the client; keep
  // the first client paint aligned with SSR to avoid Radix Tabs hydration errors.
  const installationType = mounted
    ? (config.installationType ?? DEFAULT_CONFIG.installationType)
    : DEFAULT_CONFIG.installationType

  return (
    <Tabs
      value={installationType}
      onValueChange={(value) =>
        setConfig({ ...config, installationType: value as "cli" | "manual" })
      }
      className="relative mt-6 w-full"
    >
      {children}
    </Tabs>
  )
}
