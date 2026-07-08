import { useAtom } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"

import {
  BLOCKS_STATE_STORAGE_KEY,
  COMPONENTS_STATE_STORAGE_KEY,
  CONFIG_STORAGE_KEY,
  DEFAULT_BLOCKS_STATE,
  DEFAULT_COMPONENTS_STATE,
  DEFAULT_CONFIG,
  getPreferenceCookieName,
  PATTERNS_STATE_COOKIE_NAME,
  PATTERNS_STATE_STORAGE_KEY,
  PREFERENCE_COOKIE_MAX_AGE,
  type BlockGridMode,
  type BlocksState,
  type ComponentGridMode,
  type ComponentsLayoutState,
  type Config,
  type IconStyleName,
  type IconTypeName,
} from "@/lib/preferences"

export {
  type BlockGridMode,
  DEFAULT_CONFIG,
  type BlocksState,
  type ComponentsLayoutState,
  type Config,
  type IconStyleName,
  type IconTypeName,
  type ComponentGridMode,
}

export type { PatternGridMode } from "@/lib/preferences"

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null
  }

  const cookiePrefix = `${name}=`

  for (const cookie of document.cookie.split(";")) {
    const normalizedCookie = cookie.trim()

    if (normalizedCookie.startsWith(cookiePrefix)) {
      return decodeURIComponent(normalizedCookie.slice(cookiePrefix.length))
    }
  }

  return null
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${PREFERENCE_COOKIE_MAX_AGE}; samesite=lax`
}

function getLegacyPatternsValue() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    return window.localStorage.getItem(BLOCKS_STATE_STORAGE_KEY)
  } catch {
    return null
  }
}

const preferenceStringStorage = {
  getItem(key: string) {
    if (typeof window === "undefined") {
      return null
    }

    const cookieName = getPreferenceCookieName(key)
    let cookieValue = readCookie(cookieName)
    if (cookieValue === null && key === COMPONENTS_STATE_STORAGE_KEY) {
      cookieValue = readCookie(PATTERNS_STATE_COOKIE_NAME)
    }

    if (cookieValue !== null) {
      return cookieValue
    }

    try {
      const localValue = window.localStorage.getItem(key)

      if (localValue !== null) {
        writeCookie(cookieName, localValue)
        return localValue
      }
    } catch {
      // Ignore localStorage errors and continue to migration fallback.
    }

    if (key === COMPONENTS_STATE_STORAGE_KEY) {
      const fromLegacyPatterns = window.localStorage.getItem(
        PATTERNS_STATE_STORAGE_KEY
      )
      if (fromLegacyPatterns !== null) {
        try {
          window.localStorage.setItem(key, fromLegacyPatterns)
        } catch {
          // Ignore storage failures during migration.
        }
        writeCookie(cookieName, fromLegacyPatterns)
        return fromLegacyPatterns
      }

      const legacyValue = getLegacyPatternsValue()

      if (legacyValue !== null) {
        try {
          window.localStorage.setItem(key, legacyValue)
        } catch {
          // Ignore storage failures during migration.
        }

        writeCookie(cookieName, legacyValue)
        return legacyValue
      }
    }

    return null
  },
  setItem(key: string, value: string) {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        // Ignore storage failures in private or unsupported contexts.
      }
    }

    writeCookie(getPreferenceCookieName(key), value)
  },
  removeItem(key: string) {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Ignore storage failures in private or unsupported contexts.
      }
    }

    if (typeof document !== "undefined") {
      document.cookie = `${getPreferenceCookieName(key)}=; path=/; max-age=0; samesite=lax`
    }
  },
  subscribe(key: string, callback: (value: string | null) => void) {
    if (typeof window === "undefined") {
      return undefined
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        callback(event.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  },
}

const configStorage = createJSONStorage<Config>(() => preferenceStringStorage)
const componentsLayoutStateStorage = createJSONStorage<ComponentsLayoutState>(
  () => preferenceStringStorage
)
const blocksStateStorage = createJSONStorage<BlocksState>(
  () => preferenceStringStorage
)

export const configAtom = atomWithStorage<Config>(
  CONFIG_STORAGE_KEY,
  DEFAULT_CONFIG,
  configStorage,
  { getOnInit: true }
)

export function useConfig() {
  return useAtom(configAtom)
}

const componentsLayoutStateAtom = atomWithStorage<ComponentsLayoutState>(
  COMPONENTS_STATE_STORAGE_KEY,
  DEFAULT_COMPONENTS_STATE,
  componentsLayoutStateStorage,
  { getOnInit: true }
)

export function useComponentsLayoutState() {
  return useAtom(componentsLayoutStateAtom)
}

const blocksStateAtom = atomWithStorage<BlocksState>(
  BLOCKS_STATE_STORAGE_KEY,
  DEFAULT_BLOCKS_STATE,
  blocksStateStorage,
  { getOnInit: true }
)

export function useBlocksState() {
  return useAtom(blocksStateAtom)
}

const dismissedAnnouncementsAtom = atomWithStorage<string[]>(
  "dismissed-announcements",
  []
)

export function useDismissedAnnouncements() {
  return useAtom(dismissedAnnouncementsAtom)
}
