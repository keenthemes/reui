"use client"

import { PreviewShortcutForwarder } from "@/components/preview-shortcut-forwarder"

export const COMPONENT_SIDEBAR_FORWARD_TYPE = "component-sidebar-forward"

const PATTERNS_SIDEBAR_KEYS = ["p"] as const

export function ComponentSidebarScript() {
  return (
    <PreviewShortcutForwarder
      forwardType={COMPONENT_SIDEBAR_FORWARD_TYPE}
      keys={PATTERNS_SIDEBAR_KEYS}
    />
  )
}
