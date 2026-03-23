"use client"

import type { Pattern } from "../types"
import { PatternsGrid } from "./patterns-grid"

interface PatternsPreviewViewProps {
  patterns: Pattern[]
}

export function PatternsPreviewView({ patterns }: PatternsPreviewViewProps) {
  return (
    <div className="theme-container w-full" data-slot="patterns-preview">
      <PatternsGrid patterns={patterns} />
    </div>
  )
}
