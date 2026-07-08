"use client"

import * as React from "react"

import { normalizeComponentSearchQuery } from "@/lib/component-search-filter"

import type { Component } from "../types"
import { ComponentsGrid } from "../components/components-grid"

interface CategoryPageContentProps {
  components: Component[]
}

/**
 * Category pages restore the interactive create shell experience:
 * sidebar browsing, live component previews, and the customizer.
 */
export function CategoryPageContent({ components }: CategoryPageContentProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    const syncFromLocation = () => {
      setSearchQuery(
        normalizeComponentSearchQuery(
          new URLSearchParams(window.location.search).get("search") || ""
        )
      )
    }

    const handleSearchChange = (event: Event) => {
      const detail = (event as CustomEvent<{ search?: string | null }>).detail
      if (!detail) {
        syncFromLocation()
        return
      }

      setSearchQuery(normalizeComponentSearchQuery(detail.search || ""))
    }

    syncFromLocation()
    window.addEventListener("popstate", syncFromLocation)
    window.addEventListener("reui-components-search", handleSearchChange)

    return () => {
      window.removeEventListener("popstate", syncFromLocation)
      window.removeEventListener("reui-components-search", handleSearchChange)
    }
  }, [])

  return (
    <div className="theme-container w-full" data-slot="components-preview">
      <ComponentsGrid components={components} searchQuery={searchQuery} />
    </div>
  )
}
