"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePathname } from "next/navigation"

import { DEFAULT_COMPONENTS_STATE } from "@/lib/preferences"
import {
  useComponentsLayoutState,
  type ComponentsLayoutState,
  type Config,
} from "@/hooks/use-config"
import { SidebarProvider } from "@/components/ui/sidebar"

interface ComponentsContextValue {
  totalCount: number
  categoryCounts: Record<string, number>
  searchResultCount: number | null
  setSearchResultCount: (count: number | null) => void
  sidebarCategoryFilter: string
  setSidebarCategoryFilter: (filter: string) => void
  sidebarMenuView: "menu" | "inline"
  setSidebarMenuView: (view: "menu" | "inline") => void
}

interface CustomizerContextValue {
  customizerOpen: boolean
  toggleCustomizer: () => void
  setCustomizerOpen: (open: boolean) => void
}

const ComponentsContext = createContext<ComponentsContextValue | null>(null)
const CustomizerContext = createContext<CustomizerContextValue | null>(null)

export function useComponents() {
  const context = useContext(ComponentsContext)
  if (!context) {
    throw new Error("useComponents must be used within a ComponentsProvider")
  }
  return context
}

export function useCustomizer() {
  const context = useContext(CustomizerContext)
  if (!context) {
    throw new Error("useCustomizer must be used within a ComponentsProvider")
  }
  return context
}

interface ComponentsProviderProps {
  children: React.ReactNode
  totalCount: number
  categoryCounts: Record<string, number>
  initialConfig: Config
  initialComponentsLayout: ComponentsLayoutState
}

export function ComponentsProvider({
  children,
  totalCount,
  categoryCounts,
  initialComponentsLayout,
}: ComponentsProviderProps) {
  const [hydrated, setHydrated] = useState(false)
  // Settled guard: after stored values are applied, wait one frame before
  // re-enabling CSS transitions. This prevents sidebar open/close animations
  // from playing during initial layout settlement.
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    setHydrated(true)
    // Double rAF: first frame applies stored values to DOM,
    // second frame ensures paint is complete before enabling transitions.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSettled(true)
      })
    })
  }, [])

  // Ephemeral state (not persisted)
  const [sidebarCategoryFilter, setSidebarCategoryFilter] = useState("")
  const [searchResultCount, setSearchResultCount] = useState<number | null>(
    null
  )

  // Single source of truth: Jotai atoms from use-config.ts
  const [layoutState, setLayoutState] = useComponentsLayoutState()

  const sidebarOpen = hydrated
    ? layoutState.sidebarOpen
    : initialComponentsLayout.sidebarOpen
  const sidebarMenuView = hydrated
    ? (layoutState.sidebarMenuView ??
      DEFAULT_COMPONENTS_STATE.sidebarMenuView ??
      "menu")
    : (initialComponentsLayout.sidebarMenuView ??
      DEFAULT_COMPONENTS_STATE.sidebarMenuView ??
      "menu")

  // Customizer open/closed is intentionally NOT persisted. The panel
  // starts closed on every page load — user re-opens it via toolbar
  // or keyboard shortcut as needed. Decoupled from `config` so opening
  // the panel doesn't write to localStorage / cookie.
  const [customizerOpen, setCustomizerOpenState] = useState(false)

  // The customizer is intentionally NOT remembered across navigations.
  // Reset to closed on every pathname change.
  const pathname = usePathname()
  useEffect(() => {
    setCustomizerOpenState(false)
  }, [pathname])

  // Stable callbacks that write directly to atoms
  const setSidebarMenuView = useCallback(
    (view: "menu" | "inline") => {
      setLayoutState((prev) => ({ ...prev, sidebarMenuView: view }))
    },
    [setLayoutState]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setLayoutState((prev) => ({ ...prev, sidebarOpen: open }))
    },
    [setLayoutState]
  )

  const toggleCustomizer = useCallback(() => {
    setCustomizerOpenState((prev) => !prev)
  }, [])

  const handleSetCustomizerOpen = useCallback((open: boolean) => {
    setCustomizerOpenState(open)
  }, [])

  // Memoize context values to prevent unnecessary re-renders
  const componentsValue = useMemo<ComponentsContextValue>(
    () => ({
      totalCount,
      categoryCounts,
      searchResultCount,
      setSearchResultCount,
      sidebarCategoryFilter,
      setSidebarCategoryFilter,
      sidebarMenuView,
      setSidebarMenuView,
    }),
    [
      totalCount,
      categoryCounts,
      searchResultCount,
      sidebarCategoryFilter,
      sidebarMenuView,
      setSidebarMenuView,
    ]
  )

  const customizerValue = useMemo<CustomizerContextValue>(
    () => ({
      customizerOpen,
      toggleCustomizer,
      setCustomizerOpen: handleSetCustomizerOpen,
    }),
    [customizerOpen, toggleCustomizer, handleSetCustomizerOpen]
  )

  return (
    <ComponentsContext.Provider value={componentsValue}>
      <CustomizerContext.Provider value={customizerValue}>
        <>
          {/* Suppress CSS transitions until layout has settled with stored values.
              This prevents sidebars from animating open→closed on initial load. */}
          {!settled && (
            <style
              dangerouslySetInnerHTML={{
                __html:
                  "[data-components-layout] * { transition-duration: 0s !important; }",
              }}
            />
          )}
          <SidebarProvider
            data-components-layout=""
            open={sidebarOpen}
            onOpenChange={handleOpenChange}
            className="bordered-sidebar min-h-[calc(100svh-var(--site-top-offset)-10px)] [--top-spacing:0] **:data-[sidebar=sidebar]:bg-transparent"
          >
            {children}
          </SidebarProvider>
        </>
      </CustomizerContext.Provider>
    </ComponentsContext.Provider>
  )
}
