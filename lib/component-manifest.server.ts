import "server-only"

import fs from "node:fs"

import { filterComponentManifest } from "@/lib/catalog-subset"
import { devCached } from "@/lib/dev-cache"
import { projectPath } from "@/lib/dev-cache.server"

export interface RawComponentManifestItem {
  name: string
  title?: string
  description?: string
  categories?: string[]
  meta?: {
    className?: string
    colSpan?: number
    gridSize?: 1 | 2
    order?: number
    previewHeight?: string
  }
}

function getComponentShardDir(base: string) {
  return projectPath("registry-reui", "_meta", "components", "bases", base)
}

export function getRawComponentManifest(
  base: string = "base"
): RawComponentManifestItem[] {
  return devCached(`component-manifest-raw:${base}`, () => {
    const shardDir = getComponentShardDir(base)

    try {
      if (!fs.existsSync(shardDir)) {
        return []
      }

      return fs
        .readdirSync(shardDir)
        .filter((file) => file.endsWith(".json"))
        .sort((a, b) => a.localeCompare(b))
        .flatMap((file) => {
          const raw = fs.readFileSync(`${shardDir}/${file}`, "utf-8")
          const mod = JSON.parse(raw) as { items?: RawComponentManifestItem[] }
          return Array.isArray(mod.items) ? mod.items : []
        })
    } catch (error) {
      console.error(
        `Failed to load component manifest shards for ${base}`,
        error
      )
      return []
    }
  })
}

export function getFilteredComponentManifest(
  base: string = "base"
): RawComponentManifestItem[] {
  return devCached(`component-manifest:${base}`, () =>
    filterComponentManifest(getRawComponentManifest(base))
  )
}
