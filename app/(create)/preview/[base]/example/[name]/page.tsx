import { cacheLife } from "next/cache"
import { notFound } from "next/navigation"

import { getComponentByNameServer } from "@/lib/components-browse.server"
import { filterAvailableBases } from "@/lib/registry-bases"
import { BASES } from "@/registry/config"

import { ComponentExampleFrame } from "./component-example-frame"

// Same reasoning as the layout's `instant` export, and it has to be repeated
// here: validation takes the first explicit config walking down, so opting the
// layout out leaves this segment unrendered and unvalidated rather than
// inheriting the decision.
export const instant = false

/**
 * Cache per-(base, name) resolution, matching the sibling preview routes which
 * all use 'use cache' + cacheLife("max").
 */
async function loadComponentExample(baseName: string, name: string) {
  "use cache"
  cacheLife("max")

  // `BASES` is loosely typed, so `filterAvailableBases` infers an opaque
  // element type. One narrowing cast here keeps the rest of this function
  // typed, rather than the `any` casts the sibling preview routes use.
  const bases = filterAvailableBases(BASES) as ReadonlyArray<{ name: string }>
  const base = bases.find((candidate) => candidate.name === baseName)
  if (!base) {
    return { ok: false as const }
  }

  const component = getComponentByNameServer(name, base.name)
  if (!component) {
    return { ok: false as const }
  }

  return {
    ok: true as const,
    base: base.name,
    name: component.name,
    category: component.primaryCategory,
  }
}

export default async function ComponentExamplePreviewPage({
  params,
}: {
  params: Promise<{ base: string; name: string }>
}) {
  const { base: baseName, name } = await params

  const resolved = await loadComponentExample(baseName, name)
  if (!resolved.ok) {
    return notFound()
  }

  return (
    <ComponentExampleFrame
      base={resolved.base}
      name={resolved.name}
      category={resolved.category}
    />
  )
}
