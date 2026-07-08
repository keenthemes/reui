import "server-only"

import { devCached } from "@/lib/dev-cache"
import { source } from "@/lib/source"

export function getDocsPageTree() {
  return devCached("docs-page-tree", () => source.getPageTree())
}
