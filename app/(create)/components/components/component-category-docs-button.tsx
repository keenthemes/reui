"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpenTextIcon } from "lucide-react"

import { CONFIG_STORAGE_KEY } from "@/lib/preferences"
import { DEFAULT_CONFIG, useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"

export function ComponentCategoryDocsButton({
  category,
}: {
  category: string
}) {
  const [config] = useConfig()
  const [resolvedBase, setResolvedBase] = React.useState<"base" | "radix">(
    DEFAULT_CONFIG.base === "radix" ? "radix" : "base"
  )

  React.useEffect(() => {
    const nextBase = config.base === "radix" ? "radix" : "base"
    setResolvedBase(nextBase)

    try {
      const storedConfig = window.localStorage.getItem(CONFIG_STORAGE_KEY)

      if (!storedConfig) {
        return
      }

      const parsed = JSON.parse(storedConfig) as { base?: string }
      if (parsed.base === "radix" || parsed.base === "base") {
        setResolvedBase(parsed.base)
      }
    } catch {
      // Keep the current resolved base when storage is unavailable or invalid.
    }
  }, [config.base])

  const href = React.useMemo(
    () => `/docs/components/${resolvedBase}/${category}`,
    [resolvedBase, category]
  )

  return (
    <Button variant="outline" size="sm" asChild className="shrink-0">
      <Link href={href} prefetch={false}>
        <BookOpenTextIcon className="size-3.5 opacity-60" />
        View docs
      </Link>
    </Button>
  )
}
