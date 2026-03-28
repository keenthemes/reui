"use client"

import { useEffect } from "react"

type PreviewShortcutForwarderProps = {
  forwardType: string
  keys: readonly string[]
  requireModifier?: boolean
}

function isEditableTarget(target: EventTarget | null) {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function PreviewShortcutForwarder({
  forwardType,
  keys,
  requireModifier = false,
}: PreviewShortcutForwarderProps) {
  useEffect(() => {
    const normalizedKeys = new Set(keys.map((key) => key.toLowerCase()))

    const handleKeydown = (event: KeyboardEvent) => {
      const hasModifier = event.metaKey || event.ctrlKey

      if (!normalizedKeys.has(event.key.toLowerCase())) {
        return
      }

      if (requireModifier ? !hasModifier : hasModifier) {
        return
      }

      if (isEditableTarget(event.target)) {
        return
      }

      event.preventDefault()

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: forwardType,
            key: event.key,
          },
          window.location.origin
        )
      }
    }

    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [forwardType, keys, requireModifier])

  return null
}
