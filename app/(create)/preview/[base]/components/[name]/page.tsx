import { cacheLife } from "next/cache"
import { notFound } from "next/navigation"

import { getComponentByNameServer } from "@/lib/components-browse.server"
import { BASES } from "@/registry/config"

import { ComponentWorkbenchPanel } from "./component-workbench-panel"

type WorkbenchMode = "preview" | "code"

function normalizeWorkbenchMode(
  view: string | string[] | undefined
): WorkbenchMode {
  return view === "code" ? "code" : "preview"
}

/**
 * Cache per-(base, name) component resolution with 'use cache' +
 * cacheLife("max") so each rendered preview is reused across requests.
 */
async function loadComponentWorkbenchData(baseName: string, name: string) {
  "use cache"
  cacheLife("max")

  const base = BASES.find((candidate: any) => candidate.name === baseName)
  if (!base) {
    return { ok: false as const }
  }

  const component = getComponentByNameServer(name, (base as any).name)
  if (!component) {
    return { ok: false as const }
  }

  return { ok: true as const, base: (base as any).name as string, component }
}

export default async function ComponentWorkbenchPage({
  params,
  searchParams,
}: {
  params: Promise<{ base: string; name: string }>
  searchParams: Promise<{ view?: string | string[] }>
}) {
  const [{ base: baseName, name }, rawSearchParams] = await Promise.all([
    params,
    searchParams,
  ])

  const resolved = await loadComponentWorkbenchData(baseName, name)
  if (!resolved.ok) {
    return notFound()
  }

  return (
    <ComponentWorkbenchPanel
      component={resolved.component}
      base={resolved.base}
      initialMode={normalizeWorkbenchMode(rawSearchParams.view)}
    />
  )
}
