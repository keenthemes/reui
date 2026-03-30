"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { getCategoryNames } from "@/lib/registry"
import { cn, formatLabel, normalizeSlug } from "@/lib/utils"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { ComponentUpdateIndicator } from "@/components/component-update-indicator"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

import { useComponents } from "./components-provider"

interface ComponentSidebarCategoryMenuProps {
  onSelect?: () => void
  filter?: string
  view?: "list" | "compact"
}

export const ComponentSidebarCategoryMenu = React.memo(
  function ComponentSidebarCategoryMenu({
    onSelect,
    filter = "",
    view = "list",
  }: ComponentSidebarCategoryMenuProps) {
    const { totalCount, categoryCounts } = useComponents()
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
      (basePath: string) => {
        const { item: _item, search: _search, ...persistedParams } = params
        return serializeDesignSystemSearchParams(basePath, persistedParams)
      },
      [params]
    )

    if (view === "compact") {
      return (
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-1.5">
              {!filter && (
                <Link
                  href={buildHref("/components")}
                  prefetch={false}
                  onClick={onSelect}
                  className={cn(
                    "border-site-border site-rounded-md flex items-center justify-between gap-2 border px-2 py-1 text-xs transition-colors",
                    currentPathname === "/components"
                      ? "bg-site-primary border-site-primary text-site-primary-foreground font-medium"
                      : "text-site-foreground hover:bg-site-muted hover:text-site-foreground"
                  )}
                >
                  All components
                  <span
                    className={cn(
                      "text-xs",
                      currentPathname === "/components"
                        ? "text-site-primary-foreground/70"
                        : "text-site-muted-foreground/80"
                    )}
                  >
                    {totalCount}
                  </span>
                </Link>
              )}
              {filteredCategories.map((category) => {
                const slug = normalizeSlug(category)
                const count = categoryCounts[category] || 0
                const basePath = `/components/${slug}`
                const isActive = currentPathname === basePath

                return (
                  <Link
                    key={category}
                    href={buildHref(basePath)}
                    prefetch={false}
                    onClick={onSelect}
                    className={cn(
                      "border-site-border site-rounded-md flex items-center justify-between gap-2 border px-2 py-1 text-xs transition-colors",
                      isActive
                        ? "bg-site-primary border-site-primary text-site-primary-foreground font-medium"
                        : "text-site-foreground hover:bg-site-muted hover:text-site-foreground"
                    )}
                  >
                    <span>{formatLabel(category)}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <ComponentUpdateIndicator category={category} />
                      <span
                        className={cn(
                          "text-xs",
                          isActive
                            ? "text-site-primary-foreground/70"
                            : "text-site-muted-foreground/80"
                        )}
                      >
                        {count}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
            {filteredCategories.length === 0 && (
              <div className="text-site-muted-foreground px-1 py-4 text-center text-sm">
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
              href={buildHref("/components")}
              prefetch={false}
              onClick={onSelect}
              className={cn(
                "site-rounded-md flex items-center justify-between px-3 py-2 text-sm transition-colors",
                currentPathname === "/components"
                  ? "bg-site-primary text-site-primary-foreground font-medium"
                  : "text-site-foreground hover:bg-site-muted hover:text-site-foreground"
              )}
            >
              <span>All components</span>
              <span
                className={cn(
                  "text-xs",
                  currentPathname === "/components"
                    ? "text-site-primary-foreground/70"
                    : "text-site-muted-foreground"
                )}
              >
                {totalCount}
              </span>
            </Link>
          )}
          {filteredCategories.map((category) => {
            const slug = normalizeSlug(category)
            const count = categoryCounts[category] || 0
            const basePath = `/components/${slug}`
            const isActive = currentPathname === basePath

            return (
              <Link
                key={category}
                href={buildHref(basePath)}
                prefetch={false}
                onClick={onSelect}
                className={cn(
                  "site-rounded-md flex items-center justify-between px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-site-primary text-site-primary-foreground font-medium"
                    : "text-site-foreground hover:bg-site-muted hover:text-site-foreground"
                )}
              >
                <span>{formatLabel(category)}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <ComponentUpdateIndicator category={category} />
                  <span
                    className={cn(
                      "text-xs",
                      isActive
                        ? "text-site-primary-foreground/70"
                        : "text-site-muted-foreground/80"
                    )}
                  >
                    {count}
                  </span>
                </span>
              </Link>
            )
          })}
          {filteredCategories.length === 0 && (
            <div className="text-site-muted-foreground px-3 py-4 text-center text-sm">
              No category found
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }
)
