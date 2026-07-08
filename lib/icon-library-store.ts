"use client"

import * as React from "react"

import { CONFIG_STORAGE_KEY, DEFAULT_CONFIG } from "@/lib/preferences"
import type { IconLibraryName } from "@/registry/config"

/**
 * Browser-storage-backed icon-library state.
 *
 * Reads `iconLibrary` directly from the `config` localStorage entry that
 * `useConfig` writes through. Avoids depending on:
 *   - jotai's `useAtom` / `atomWithStorage` (so the hook can be safely
 *     bundled inside a workspace package without creating a separate
 *     jotai store)
 *   - `nuqs` / `useDesignSystemSearchParams` (same reason — separate
 *     `NuqsAdapterContext` per bundle would never resolve)
 *   - React Context (each bundled copy would create its own context
 *     instance with no Provider)
 *
 * Reactivity:
 *   - Cross-tab updates fire the standard `storage` event
 *   - Same-tab updates fire a custom `reui:icon-library-changed` event;
 *     `setIconLibrary()` (and any code that mutates the config) should
 *     dispatch it after writing to keep IconPlaceholder consumers in
 *     sync without round-tripping through React state owned elsewhere.
 */
export const ICON_LIBRARY_CHANGED_EVENT = "reui:icon-library-changed"

function isIconLibraryName(value: unknown): value is IconLibraryName {
  return (
    value === "lucide" ||
    value === "tabler" ||
    value === "hugeicons" ||
    value === "phosphor" ||
    value === "remixicon"
  )
}

function readFromStorage(): IconLibraryName {
  if (typeof window === "undefined") return DEFAULT_CONFIG.iconLibrary
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG.iconLibrary
    const parsed = JSON.parse(raw) as Partial<{ iconLibrary: unknown }>
    if (isIconLibraryName(parsed.iconLibrary)) return parsed.iconLibrary
    return DEFAULT_CONFIG.iconLibrary
  } catch {
    return DEFAULT_CONFIG.iconLibrary
  }
}

/**
 * Read the current icon library from browser storage. SSR-safe — returns
 * the default on the server and rehydrates from storage after mount.
 */
export function useIconLibrary(): IconLibraryName {
  // Start with the SSR-safe default; subscribe after mount so the value
  // reflects whatever the user previously chose without causing a
  // hydration mismatch warning.
  const [value, setValue] = React.useState<IconLibraryName>(
    DEFAULT_CONFIG.iconLibrary
  )

  React.useEffect(() => {
    setValue(readFromStorage())

    const refresh = () => setValue(readFromStorage())

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONFIG_STORAGE_KEY) refresh()
    }
    const handleCustom = () => refresh()

    window.addEventListener("storage", handleStorage)
    window.addEventListener(ICON_LIBRARY_CHANGED_EVENT, handleCustom)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(ICON_LIBRARY_CHANGED_EVENT, handleCustom)
    }
  }, [])

  return value
}

/**
 * Write the icon library to localStorage + cookie and notify same-tab
 * subscribers. Used by the design-system bar and the iframe Provider so
 * any IconPlaceholder rendered after the change picks up the new value.
 */
export function notifyIconLibraryChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(ICON_LIBRARY_CHANGED_EVENT))
}
