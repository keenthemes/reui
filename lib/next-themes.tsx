"use client"

import * as React from "react"

interface ValueObject {
  [themeName: string]: string
}

type DataAttribute = `data-${string}`

interface ScriptProps extends React.DetailedHTMLProps<
  React.ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
> {
  [dataAttribute: DataAttribute]: any
}

export type Attribute = DataAttribute | "class"

export interface ThemeProviderProps extends React.PropsWithChildren {
  themes?: string | string[] | undefined
  forcedTheme?: string | undefined
  enableSystem?: boolean | undefined
  disableTransitionOnChange?: boolean | undefined
  enableColorScheme?: boolean | undefined
  storageKey?: string | undefined
  defaultTheme?: string | undefined
  attribute?: Attribute | Attribute[] | undefined
  value?: ValueObject | undefined
  nonce?: string
  scriptProps?: ScriptProps
}

export interface UseThemeProps {
  themes: string[]
  forcedTheme?: string | undefined
  setTheme: React.Dispatch<React.SetStateAction<string>>
  theme?: string | undefined
  resolvedTheme?: string | undefined
  systemTheme?: "dark" | "light" | undefined
}

const DEFAULT_THEMES = ["light", "dark"]
const SYSTEM_THEME_MEDIA = "(prefers-color-scheme: dark)"
const isServer = typeof window === "undefined"

const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined)

const fallbackContext: UseThemeProps = {
  themes: [],
  setTheme: () => undefined,
}

const useIsomorphicLayoutEffect = isServer
  ? React.useEffect
  : React.useLayoutEffect

function getSystemTheme(media?: MediaQueryList): "light" | "dark" {
  return (media ?? window.matchMedia(SYSTEM_THEME_MEDIA)).matches
    ? "dark"
    : "light"
}

function getStoredTheme(storageKey: string, fallbackTheme: string) {
  if (isServer) {
    return fallbackTheme
  }

  try {
    return window.localStorage.getItem(storageKey) ?? fallbackTheme
  } catch {
    return fallbackTheme
  }
}

function withDisabledTransitions(nonce?: string) {
  const style = document.createElement("style")

  if (nonce) {
    style.setAttribute("nonce", nonce)
  }

  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important;-webkit-transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    void document.body.offsetHeight
    window.setTimeout(() => {
      style.remove()
    }, 1)
  }
}

function applyTheme({
  attribute,
  value,
  themes,
  resolvedTheme,
  enableColorScheme,
}: {
  attribute: Attribute | Attribute[]
  value?: ValueObject
  themes: string[]
  resolvedTheme?: string
  enableColorScheme: boolean
}) {
  if (!resolvedTheme) {
    return
  }

  const root = document.documentElement
  const mappedTheme = value?.[resolvedTheme] ?? resolvedTheme
  const attributes = Array.isArray(attribute) ? attribute : [attribute]
  const classValues = value
    ? themes.map((theme) => value[theme] ?? theme)
    : themes

  attributes.forEach((currentAttribute) => {
    if (currentAttribute === "class") {
      root.classList.remove(...classValues)
      root.classList.add(mappedTheme)
      return
    }

    root.setAttribute(currentAttribute, mappedTheme)
  })

  if (enableColorScheme) {
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      root.style.colorScheme = resolvedTheme
    } else {
      root.style.removeProperty("color-scheme")
    }
  }
}

export function ThemeProvider({
  children,
  forcedTheme,
  enableSystem = true,
  disableTransitionOnChange = false,
  enableColorScheme = true,
  storageKey = "theme",
  themes: themeList = DEFAULT_THEMES,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  nonce,
  scriptProps,
}: ThemeProviderProps) {
  void scriptProps

  const themes = React.useMemo(
    () => (Array.isArray(themeList) ? themeList : [themeList]),
    [themeList]
  )

  const [theme, setThemeState] = React.useState<string>(() =>
    getStoredTheme(storageKey, defaultTheme)
  )
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">(() =>
    isServer || !enableSystem ? "light" : getSystemTheme()
  )

  const resolvedTheme = React.useMemo(() => {
    if (forcedTheme) {
      return forcedTheme
    }

    if (theme === "system" && enableSystem) {
      return systemTheme
    }

    return theme
  }, [enableSystem, forcedTheme, systemTheme, theme])

  const setTheme = React.useCallback<
    React.Dispatch<React.SetStateAction<string>>
  >(
    (valueOrUpdater) => {
      setThemeState((previousTheme) => {
        const nextTheme =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(previousTheme)
            : valueOrUpdater

        try {
          window.localStorage.setItem(storageKey, nextTheme)
        } catch {
          // Ignore storage failures.
        }

        return nextTheme
      })
    },
    [storageKey]
  )

  useIsomorphicLayoutEffect(() => {
    const cleanup = disableTransitionOnChange
      ? withDisabledTransitions(nonce)
      : undefined

    applyTheme({
      attribute,
      value,
      themes,
      resolvedTheme,
      enableColorScheme,
    })

    cleanup?.()
  }, [
    attribute,
    disableTransitionOnChange,
    enableColorScheme,
    nonce,
    resolvedTheme,
    themes,
    value,
  ])

  React.useEffect(() => {
    if (!enableSystem) {
      return
    }

    const media = window.matchMedia(SYSTEM_THEME_MEDIA)
    const handleChange = () => {
      setSystemTheme(getSystemTheme(media))
    }

    handleChange()

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange)
      return () => media.removeEventListener("change", handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [enableSystem])

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return
      }

      setThemeState(event.newValue ?? defaultTheme)
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [defaultTheme, storageKey])

  const contextValue = React.useMemo<UseThemeProps>(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: enableSystem ? systemTheme : undefined,
    }),
    [
      enableSystem,
      forcedTheme,
      resolvedTheme,
      setTheme,
      systemTheme,
      theme,
      themes,
    ]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext) ?? fallbackContext
}
