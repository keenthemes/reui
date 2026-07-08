"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"

import {
  hasActiveComponentSearch,
  normalizeComponentSearchQuery,
} from "@/lib/component-search-filter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SEARCH_DEBOUNCE_MS = 250

interface ComponentsBrowseSearchProps {
  placeholder?: string
  className?: string
  clearKeys?: string[]
}

function buildSearchUrl(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  searchValue: string | null,
  clearKeys: string[]
) {
  const nextParams = new URLSearchParams(searchParams.toString())

  for (const key of clearKeys) {
    nextParams.delete(key)
  }

  if (searchValue) {
    nextParams.set("search", searchValue)
  } else {
    nextParams.delete("search")
  }

  const queryString = nextParams.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

export function ComponentsBrowseSearch({
  placeholder = "Search...",
  className,
  clearKeys = [],
}: ComponentsBrowseSearchProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const committedSearch = normalizeComponentSearchQuery(
    searchParams.get("search") || ""
  )

  const [localQuery, setLocalQuery] = React.useState(committedSearch)

  React.useEffect(() => {
    setLocalQuery(committedSearch)
  }, [committedSearch])

  const commitSearch = React.useCallback(
    (value: string) => {
      const nextValue = normalizeComponentSearchQuery(value)
      const searchValue = hasActiveComponentSearch(nextValue) ? nextValue : null
      const currentValue = committedSearch || null

      if (searchValue === currentValue) {
        return
      }

      router.replace(
        buildSearchUrl(pathname, searchParams, searchValue, clearKeys),
        {
          scroll: false,
        }
      )
    },
    [clearKeys, committedSearch, pathname, router, searchParams]
  )

  React.useEffect(() => {
    const normalizedLocalQuery = normalizeComponentSearchQuery(localQuery)

    if (normalizedLocalQuery === committedSearch) {
      return
    }

    const timer = window.setTimeout(() => {
      commitSearch(localQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [commitSearch, committedSearch, localQuery])

  const handleClear = React.useCallback(() => {
    setLocalQuery("")
    router.replace(buildSearchUrl(pathname, searchParams, null, clearKeys), {
      scroll: false,
    })
  }, [clearKeys, pathname, router, searchParams])

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="text-site-muted-foreground/80 pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
      <input
        type="text"
        value={localQuery}
        onChange={(event) => setLocalQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            commitSearch(localQuery)
          }

          if (event.key === "Escape") {
            event.preventDefault()
            handleClear()
          }
        }}
        placeholder={placeholder}
        className={cn(
          "border-site-border bg-site-background site-rounded-full focus-visible:border-site-ring focus-visible:ring-site-ring/30 placeholder:text-site-muted-foreground h-9 w-full border py-0 pl-10 text-sm transition-[border-color,box-shadow] outline-none focus-visible:ring-2",
          localQuery ? "pr-11" : "pr-4"
        )}
      />
      {localQuery ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-2 size-7 shrink-0 -translate-y-1/2"
          onClick={handleClear}
        >
          <XIcon className="size-3.5" />
          <span className="sr-only">Clear search</span>
        </Button>
      ) : null}
    </div>
  )
}
