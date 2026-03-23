"use client"

import { PatternsPreviewView } from "../components/patterns-preview-view"
import type { Pattern } from "../types"

interface CategoryPageContentProps {
  patterns: Pattern[]
}

/**
 * Client wrapper for the pattern grid. The page stays fully static while
 * `?search=` filtering runs in `PatternsGrid` on the client.
 */
export function CategoryPageContent({ patterns }: CategoryPageContentProps) {
  return <PatternsPreviewView patterns={patterns} />
}
