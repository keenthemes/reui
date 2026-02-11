import * as React from "react"
import { notFound } from "next/navigation"
import { SearchParams } from "nuqs/server"

import { searchParamsCache } from "@/lib/nuqs-server"
import {
  filterPatterns,
  getCategoryNames,
  getPatternsByCategory,
  isValidCategory,
} from "@/lib/registry"
import { normalizeSlug } from "@/lib/utils"
import { BASES } from "@/registry/config"
import { PatternsGrid } from "@/app/(create)/patterns/components/patterns-grid"

export const revalidate = false // Cache forever until next build/deploy
export const dynamicParams = true

export default async function PatternsPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{
    base: string
    category: string
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

  const normalized = normalizeSlug(paramBag.category)

  if (!isValidCategory(normalized)) {
    return notFound()
  }

  let patterns = getPatternsByCategory(normalized)

  if (searchQuery) {
    patterns = filterPatterns(patterns, [normalized], searchQuery)
  }

  return <PatternsGrid patterns={patterns} base={(base as any).name} isIframe />
}
