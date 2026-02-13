import * as React from "react"
import { notFound } from "next/navigation"

import {
  getCategoryNames,
  getPatternsByCategory,
  isValidCategory,
} from "@/lib/registry"
import { normalizeSlug } from "@/lib/utils"
import { BASES } from "@/registry/config"
import { PatternsGrid } from "@/app/(create)/patterns/components/patterns-grid"

// Fully static — search filtering happens client-side in PatternsGrid
export const dynamic = "force-static"
export const revalidate = false

// Pre-render all base × category combinations
export function generateStaticParams() {
  const params: { base: string; category: string }[] = []
  for (const base of BASES) {
    for (const cat of getCategoryNames()) {
      params.push({ base: (base as any).name, category: normalizeSlug(cat) })
    }
  }
  return params
}

export default async function PatternsPreviewPage({
  params,
}: {
  params: Promise<{ base: string; category: string }>
}) {
  const { base: baseName, category } = await params
  const base = BASES.find((b: any) => b.name === baseName)

  if (!base) {
    return notFound()
  }

  const normalized = normalizeSlug(category)

  if (!isValidCategory(normalized)) {
    return notFound()
  }

  // Pass ALL patterns for this category — client-side filtering via PatternsGrid
  const patterns = getPatternsByCategory(normalized)

  return <PatternsGrid patterns={patterns} base={(base as any).name} isIframe />
}
