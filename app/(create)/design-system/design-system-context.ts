"use client"

import * as React from "react"

import { type IconLibraryName } from "@/registry/config"

/**
 * Pure design-system Context module (no font/next/font imports).
 *
 * Separated from `design-system-provider.tsx` so that block source —
 * which only needs the readable Context value via `IconPlaceholder` —
 * doesn't transitively pull `next/font/google` into bundlers that
 * can't transform that macro (esbuild during block-package builds).
 */

export interface DesignSystemContextValue {
  style: string | null
  theme: string | null
  font: string | null
  fontHeading: string | null
  chartColor: string | null
  baseColor: string | null
  menuAccent: string | null
  menuColor: string | null
  radius: string | null
  iconLibrary: IconLibraryName | null
}

export const DesignSystemContext =
  React.createContext<DesignSystemContextValue | null>(null)

export function useDesignSystem() {
  const context = React.useContext(DesignSystemContext)
  if (!context) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider"
    )
  }
  return context
}

// Keys to check for in URL to determine if design system params exist.
// Lives here (vs. design-system-provider.tsx) so static consumers like
// query-param helpers don't depend on the Provider chain either.
export const DESIGN_SYSTEM_URL_KEYS = [
  "base",
  "style",
  "theme",
  "baseColor",
  "chartColor",
  "font",
  "fontHeading",
  "iconLibrary",
  "menuAccent",
  "menuColor",
  "radius",
  "item",
  "template",
  "size",
  "custom",
] as const
