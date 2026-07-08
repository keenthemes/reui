"use client"

import * as React from "react"
import { atom, useAtom } from "jotai"

/**
 * Port of the upstream shadcn `use-open-preset` hook.
 *
 * Owns the shared open/close state for the Open-Preset dialog (Jotai
 * atom) and the `O` keyboard shortcut that opens it from anywhere.
 *
 * - `useOpenPreset()` → `{ open, setOpen }` for the dialog itself.
 * - `useOpenPresetTrigger()` → `{ openPreset }` for buttons that only
 *    need to open the dialog (e.g. the customizer footer).
 *
 * Keyboard: a plain `O` keypress opens the dialog (matches upstream).
 * Ignored when focus is inside editable elements.
 */

const openPresetOpenAtom = atom(false)

export const OPEN_PRESET_FORWARD_TYPE = "open-preset-forward"

function isEditableTarget(target: EventTarget | null) {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function useOpenPreset() {
  const [open, setOpen] = useAtom(openPresetOpenAtom)

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
    },
    [setOpen]
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === "o" &&
        !e.shiftKey &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        if (isEditableTarget(e.target)) return
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  return {
    open,
    setOpen: handleOpenChange,
  }
}

export function useOpenPresetTrigger() {
  const [, setOpen] = useAtom(openPresetOpenAtom)

  const openPreset = React.useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return { openPreset }
}
