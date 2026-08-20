"use client"

import * as React from "react"

import {
  DOCS_FRAME_DESIGN_KEYS,
  resolveComponentPreviewFrameHeight,
  shouldFrameComponentPreview,
} from "@/lib/component-preview-frame"
import { ComponentPreviewFrame } from "@/components/component-preview-frame"
import { DocsComponentLivePreview } from "@/components/docs-component-live-preview"

/**
 * The preview slot inside a docs `<ComponentPreview>`: an iframe for the
 * heavy categories, the existing inline preview for everything else.
 *
 * Both docs render paths use this (the server component and the client
 * style-switch fallback in docs-mdx-components.client.tsx), so the two cannot
 * drift.
 */
export function DocsComponentPreviewSlot({
  name,
  base,
  category,
  title,
  previewHeight,
  metaPreviewHeight,
}: {
  name: string
  base: string
  category?: string | null
  title?: string
  /** Authored at the call site (the MDX prop). Wins over the manifest. */
  previewHeight?: string | number
  /** The example's `previewHeight` from the component manifest. */
  metaPreviewHeight?: string | number
}) {
  const inline = (
    <DocsComponentLivePreview name={name} base={base} category={category} />
  )

  if (!shouldFrameComponentPreview(category, "docs")) {
    return inline
  }

  return (
    <ComponentPreviewFrame
      name={name}
      base={base}
      title={title || name}
      height={resolveComponentPreviewFrameHeight({
        category,
        previewHeight,
        metaPreviewHeight,
      })}
      // Docs applies only the style class and the two font variables to its
      // own document, so seeding the full design set here would render a
      // preview in colors and radii the surrounding page never applied.
      designKeys={DOCS_FRAME_DESIGN_KEYS}
      slot="docs-preview-frame"
      fallback={inline}
    />
  )
}
