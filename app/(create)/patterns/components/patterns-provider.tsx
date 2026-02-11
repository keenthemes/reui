"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useConfig, usePatternsState } from "@/hooks/use-config"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { CustomizerSidebar } from "./customizer-sidebar"
import { PatternsSidebar } from "./patterns-sidebar"

// SSR-safe defaults — must match server render to avoid hydration mismatch
const DEFAULT_SIDEBAR_OPEN = true
const DEFAULT_SIDEBAR_MENU_VIEW: "menu" | "inline" = "menu"
const DEFAULT_CUSTOMIZER_OPEN = true

interface PatternsContextValue {
  totalCount: number
  categoryCounts: Record<string, number>
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

const PatternsContext = createContext<PatternsContextValue | null>(null)
const CustomizerContext = createContext<CustomizerContextValue | null>(null)

export function usePatterns() {
  const context = useContext(PatternsContext)
  if (!context) {
    throw new Error("usePatterns must be used within a PatternsProvider")
  }
  return context
}

export function useCustomizer() {
  const context = useContext(CustomizerContext)
  if (!context) {
    throw new Error("useCustomizer must be used within a PatternsProvider")
  }
  return context
}

interface PatternsProviderProps {
  children: React.ReactNode
  totalCount: number
  categoryCounts: Record<string, number>
}

export function PatternsProvider({
  children,
  totalCount,
  categoryCounts,
}: PatternsProviderProps) {
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
  const [patternsState, setPatternsState] = usePatternsState()
  const [config, setConfig] = useConfig()

  // Gate values: use SSR defaults until mounted, then use stored values.
  // This ensures server HTML and initial client render produce identical output.
  const sidebarOpen = mounted ? patternsState.sidebarOpen : DEFAULT_SIDEBAR_OPEN
  const sidebarMenuView = mounted
    ? (patternsState.sidebarMenuView ?? DEFAULT_SIDEBAR_MENU_VIEW)
    : DEFAULT_SIDEBAR_MENU_VIEW
  const customizerOpen = mounted
    ? (config.customizerOpen ?? DEFAULT_CUSTOMIZER_OPEN)
    : DEFAULT_CUSTOMIZER_OPEN

  // Stable callbacks that write directly to atoms
  const setSidebarMenuView = useCallback(
    (view: "menu" | "inline") => {
      setPatternsState((prev) => ({ ...prev, sidebarMenuView: view }))
    },
    [setPatternsState]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setPatternsState((prev) => ({ ...prev, sidebarOpen: open }))
    },
    [setPatternsState]
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
  const patternsValue = useMemo<PatternsContextValue>(
    () => ({
      totalCount,
      categoryCounts,
      sidebarCategoryFilter,
      setSidebarCategoryFilter,
      sidebarMenuView,
      setSidebarMenuView,
    }),
    [
      totalCount,
      categoryCounts,
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
    <PatternsContext.Provider value={patternsValue}>
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
                  "[data-patterns-layout] * { transition-duration: 0s !important; }",
              }}
            />
          )}
          <SidebarProvider
            data-patterns-layout=""
            open={sidebarOpen}
            onOpenChange={handleOpenChange}
            className="bordered-sidebar min-h-[calc(100svh-var(--header-height)-10px)] [--top-spacing:0] **:data-[sidebar=sidebar]:bg-transparent"
            suppressHydrationWarning
          >
            <PatternsSidebar />
            <SidebarInset className="bg-transparent">{children}</SidebarInset>
            <CustomizerSidebar />
          </SidebarProvider>
        </div>
      </CustomizerContext.Provider>
    </PatternsContext.Provider>
  )
}
