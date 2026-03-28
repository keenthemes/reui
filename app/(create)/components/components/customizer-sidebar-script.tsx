"use client"

import { PreviewShortcutForwarder } from "@/components/preview-shortcut-forwarder"

export const CUSTOMIZER_FORWARD_TYPE = "customizer-forward"

const CUSTOMIZER_KEYS = ["c"] as const

export function CustomizerSidebarScript() {
  return (
    <PreviewShortcutForwarder
      forwardType={CUSTOMIZER_FORWARD_TYPE}
      keys={CUSTOMIZER_KEYS}
    />
  )
}
