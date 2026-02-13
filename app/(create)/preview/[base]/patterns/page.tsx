import * as React from "react"
import { notFound } from "next/navigation"

import { searchPatterns } from "@/lib/registry"
import { BASES } from "@/registry/config"
import { PatternsGrid } from "@/app/(create)/patterns/components/patterns-grid"

// Fully static — search filtering happens client-side in PatternsGrid
export const dynamic = "force-static"
export const revalidate = false

// Pre-render for each base (radix, base)
export function generateStaticParams() {
  return BASES.map((b: any) => ({ base: b.name }))
}

export default async function PatternsSearchPreviewPage({
  params,
}: {
  params: Promise<{ base: string }>
}) {
  const { base: baseName } = await params
  const base = BASES.find((b: any) => b.name === baseName)

  if (!base) {
    return notFound()
  }

  // Pass ALL patterns — client-side filtering via PatternsGrid
  const patterns = searchPatterns("")

  return <PatternsGrid patterns={patterns} base={(base as any).name} isIframe />
}
