"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { ComponentCatalogItem } from "@/lib/registry"
import { useComponentsLayoutState, useConfig } from "@/hooks/use-config"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { ComponentHeader } from "./component-header"
import { ComponentSidebar } from "./component-sidebar"
import { CustomizerSidebar } from "./customizer-sidebar"

// SSR-safe defaults — must match server render to avoid hydration mismatch
const DEFAULT_SIDEBAR_OPEN = true
const DEFAULT_SIDEBAR_MENU_VIEW: "menu" | "inline" = "menu"
const DEFAULT_CUSTOMIZER_OPEN = true

interface ComponentsContextValue {
  totalCount: number
  categoryCounts: Record<string, number>
  /** Full catalog list for search result counts in the header */
  catalogItems: ComponentCatalogItem[]
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
  catalogItems: ComponentCatalogItem[]
}

export function ComponentsProvider({
  children,
  totalCount,
  categoryCounts,
  catalogItems,
}: ComponentsProviderProps) {
  // Mount guard: use SSR defaults until after first client paint,
  // then switch to stored values from localStorage (via Jotai atoms).
  // This prevents hydration mismatch and flash of wrong layout.
  const [mounted, setMounted] = useState(false)
  // Settled guard: after stored values are applied, wait one frame before
  // re-enabling CSS transitions. This prevents sidebar open/close animations
  // from playing during initial layout settlement.
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  // Single source of truth: Jotai atoms from use-config.ts
  const [layoutState, setLayoutState] = useComponentsLayoutState()
  const [config, setConfig] = useConfig()

  // Gate values: use SSR defaults until mounted, then use stored values.
  // This ensures server HTML and initial client render produce identical output.
  const sidebarOpen = mounted ? layoutState.sidebarOpen : DEFAULT_SIDEBAR_OPEN
  const sidebarMenuView = mounted
    ? (layoutState.sidebarMenuView ?? DEFAULT_SIDEBAR_MENU_VIEW)
    : DEFAULT_SIDEBAR_MENU_VIEW
  const customizerOpen = mounted
    ? (config.customizerOpen ?? DEFAULT_CUSTOMIZER_OPEN)
    : DEFAULT_CUSTOMIZER_OPEN

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
    setConfig((prev) => ({ ...prev, customizerOpen: !prev.customizerOpen }))
  }, [setConfig])

  const handleSetCustomizerOpen = useCallback(
    (open: boolean) => {
      setConfig((prev) => ({ ...prev, customizerOpen: open }))
    },
    [setConfig]
  )

  // Memoize context values to prevent unnecessary re-renders
  const componentsValue = useMemo<ComponentsContextValue>(
    () => ({
      totalCount,
      categoryCounts,
      catalogItems,
      sidebarCategoryFilter,
      setSidebarCategoryFilter,
      sidebarMenuView,
      setSidebarMenuView,
    }),
    [
      totalCount,
      categoryCounts,
      catalogItems,
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
        <div
          className={mounted ? "opacity-100" : "opacity-0"}
          suppressHydrationWarning
        >
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
            className="bordered-sidebar min-h-0 flex-1 [--top-spacing:0] **:data-[sidebar=sidebar]:bg-transparent"
            suppressHydrationWarning
          >
            <ComponentSidebar />
            <SidebarInset className="min-h-0 bg-transparent">
              <ComponentHeader />
              <div className="flex min-h-0 flex-col">{children}</div>
            </SidebarInset>
            <CustomizerSidebar />
          </SidebarProvider>
        </div>
      </CustomizerContext.Provider>
    </ComponentsContext.Provider>
  )
}
