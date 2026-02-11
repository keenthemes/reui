import * as React from "react"
import { notFound } from "next/navigation"
import { SearchParams } from "nuqs/server"

import { searchParamsCache } from "@/lib/nuqs-server"
import { searchPatterns } from "@/lib/registry"
import { BASES } from "@/registry/config"
import { PatternsGrid } from "@/app/(create)/patterns/components/patterns-grid"

export const revalidate = 86400 // 24 hours - content only changes on deploy
export const dynamicParams = true

export default async function PatternsSearchPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{
    base: string
  }>
  searchParams: Promise<SearchParams>
}) {
  const paramBag = await params
  const base = BASES.find((b: any) => b.name === paramBag.base)

  if (!base) {
    return notFound()
  }

  const parsed = await searchParamsCache.parse(searchParams)
  const searchQuery = parsed.search

  const patterns = searchPatterns(searchQuery || "")

  return <PatternsGrid patterns={patterns} base={(base as any).name} isIframe />
}
