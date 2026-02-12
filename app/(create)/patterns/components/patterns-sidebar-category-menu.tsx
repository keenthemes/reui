"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { getCategoryNames } from "@/lib/registry"
import { cn, formatLabel, normalizeSlug } from "@/lib/utils"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

import { usePatterns } from "./patterns-provider"

interface PatternsSidebarCategoryMenuProps {
  onSelect?: () => void
  filter?: string
  view?: "list" | "compact"
}

export const PatternsSidebarCategoryMenu = React.memo(
  function PatternsSidebarCategoryMenu({
    onSelect,
    filter = "",
    view = "list",
  }: PatternsSidebarCategoryMenuProps) {
    const { totalCount, categoryCounts } = usePatterns()
    const pathname = usePathname()
    const [params] = useDesignSystemSearchParams()

    // Get category names once (from small __stats__.ts file)
    const categoryNames = React.useMemo(() => getCategoryNames(), [])

    // Filter categories
    const filteredCategories = React.useMemo(() => {
      if (!filter) return categoryNames
      const search = filter.toLowerCase()
      return categoryNames.filter((category) =>
        category.toLowerCase().includes(search)
      )
    }, [categoryNames, filter])

    // Use pathname from Next.js hook (SSR-safe)
    const currentPathname = pathname || ""

    // Build href with preserved design system params
    const buildHref = React.useCallback(
      (basePath: string) => serializeDesignSystemSearchParams(basePath, params),
      [params]
    )

    if (view === "compact") {
      return (
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-1.5">
              {!filter && (
                <Link
                  href={buildHref("/patterns")}
                  prefetch={false}
                  onClick={onSelect}
                  className={cn(
                    "border-border flex items-center justify-between gap-2 rounded-md border px-2 py-1 text-xs transition-colors",
                    currentPathname === "/patterns"
                      ? "bg-primary border-primary text-primary-foreground font-medium"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  All Patterns
                  <span
                    className={cn(
                      "text-xs",
                      currentPathname === "/patterns"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground/80"
                    )}
                  >
                    {totalCount}
                  </span>
                </Link>
              )}
              {filteredCategories.map((category) => {
                const slug = normalizeSlug(category)
                const count = categoryCounts[category] || 0
                const basePath = `/patterns/${slug}`
                const isActive = currentPathname === basePath

                return (
                  <Link
                    key={category}
                    href={buildHref(basePath)}
                    prefetch={false}
                    onClick={onSelect}
                    className={cn(
                      "border-border flex items-center justify-between gap-2 rounded-md border px-2 py-1 text-xs transition-colors",
                      isActive
                        ? "bg-primary border-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>{formatLabel(category)}</span>
                    <span
                      className={cn(
                        "text-xs",
                        isActive
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground/80"
                      )}
                    >
                      {count}
                    </span>
                  </Link>
                )
              })}
            </div>
            {filteredCategories.length === 0 && (
              <div className="text-muted-foreground px-1 py-4 text-center text-sm">
                No category found
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      )
    }

    return (
      <SidebarGroup>
        <SidebarGroupContent>
          {!filter && (
            <Link
              href={buildHref("/patterns")}
              prefetch={false}
              onClick={onSelect}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                currentPathname === "/patterns"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>All Patterns</span>
              <span
                className={cn(
                  "text-xs",
                  currentPathname === "/patterns"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {totalCount}
              </span>
            </Link>
          )}
          {filteredCategories.map((category) => {
            const slug = normalizeSlug(category)
            const count = categoryCounts[category] || 0
            const basePath = `/patterns/${slug}`
            const isActive = currentPathname === basePath

            return (
              <Link
                key={category}
                href={buildHref(basePath)}
                prefetch={false}
                onClick={onSelect}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{formatLabel(category)}</span>
                <span
                  className={cn(
                    "text-xs",
                    isActive
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/80"
                  )}
                >
                  {count}
                </span>
              </Link>
            )
          })}
          {filteredCategories.length === 0 && (
            <div className="text-muted-foreground px-3 py-4 text-center text-sm">
              No category found
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }
)
