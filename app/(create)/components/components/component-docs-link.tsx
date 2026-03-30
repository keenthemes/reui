"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpenTextIcon } from "lucide-react"

import { isCanonicalComponentDoc } from "@/lib/seo"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ComponentDocsLink({ slug }: { slug: string }) {
  const [mounted, setMounted] = React.useState(false)
  const [params] = useDesignSystemSearchParams()
  const [config] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!isCanonicalComponentDoc(slug)) {
    return null
  }

  const base = mounted
    ? (params.base ?? config.base ?? "base")
    : (params.base ?? "base")
  const docsHref = `/docs/components/${base === "radix" ? "radix" : "base"}/${slug}`

  return (
    <Button variant="outline" size="sm" asChild className="shrink-0">
      <Link href={docsHref}>
        <BookOpenTextIcon className="size-3.5 opacity-60" />
        View docs
      </Link>
    </Button>
  )
}
