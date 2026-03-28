"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"
import { useQueryState } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import {
  filterCatalogBySearchQuery,
  hasActiveCatalogSearch,
  normalizeCatalogSearchQuery,
} from "@/lib/catalog-search-filter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useComponents } from "./components-provider"

const SEARCH_DEBOUNCE_MS = 320

interface ComponentHeaderSearchProps {
  placeholder?: string
  className?: string
}

export function ComponentHeaderSearch({
  placeholder = "Search components...",
  className,
}: ComponentHeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { totalCount, categoryCounts, catalogItems } = useComponents()

  const isOnCategoryPage =
    pathname.startsWith("/components/") && pathname !== "/components"
  const currentCategory = isOnCategoryPage
    ? (pathname.split("/").at(-1) ?? "")
    : ""

  const [, setCurrentUrlQuery] = useQueryState(
    "search",
    parseAsSearchStringClient.withOptions({
      shallow: true,
      history: "replace",
    })
  )

  const committedSearch = normalizeCatalogSearchQuery(
    searchParams.get("search") || ""
  )

  const [localQuery, setLocalQuery] = useState<string>(() => committedSearch)

  const resultCount = useMemo(() => {
    if (!committedSearch) {
      if (currentCategory) {
        return categoryCounts[currentCategory] ?? 0
      }
      return totalCount
    }
    if (pathname !== "/components") {
      return totalCount
    }
    return filterCatalogBySearchQuery(catalogItems, committedSearch).length
  }, [
    committedSearch,
    pathname,
    currentCategory,
    categoryCounts,
    totalCount,
    catalogItems,
  ])

  const getSearchValueToCommit = useCallback((value: string) => {
    const normalizedValue = normalizeCatalogSearchQuery(value)
    return hasActiveCatalogSearch(normalizedValue) ? normalizedValue : null
  }, [])

  const buildSearchUrl = useCallback(
    (basePath: string, searchValue: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("item")
      if (searchValue) {
        params.set("search", searchValue)
      } else {
        params.delete("search")
      }
      const queryString = params.toString()
      return queryString ? `${basePath}?${queryString}` : basePath
    },
    [searchParams]
  )

  const commitSearch = useCallback(
    (value: string) => {
      const finalValue = getSearchValueToCommit(value)
      const currentValue = committedSearch || null

      if (finalValue === currentValue) {
        return
      }

      if (isOnCategoryPage) {
        router.replace(buildSearchUrl(pathname, finalValue), {
          scroll: false,
        })
        return
      }

      setCurrentUrlQuery(finalValue)
    },
    [
      getSearchValueToCommit,
      committedSearch,
      isOnCategoryPage,
      router,
      buildSearchUrl,
      pathname,
      setCurrentUrlQuery,
    ]
  )

  // URL changed externally (back/forward, programmatic): sync input when not typing
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      return
    }
    setLocalQuery(committedSearch)
  }, [committedSearch])

  // Debounced URL update: search runs only after typing pauses,
  // and only once the query becomes an active search (3+ chars).
  useEffect(() => {
    const nextCommittedSearch = getSearchValueToCommit(localQuery) || ""

    if (nextCommittedSearch === committedSearch) return

    const timer = setTimeout(() => {
      commitSearch(localQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [localQuery, committedSearch, getSearchValueToCommit, commitSearch])

  const handleClear = () => {
    setLocalQuery("")
    if (isOnCategoryPage) {
      router.replace(buildSearchUrl(pathname, null), {
        scroll: false,
      })
    } else {
      setCurrentUrlQuery(null)
    }
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSearchShortcut =
        e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))

      if (
        isSearchShortcut &&
        !["INPUT", "TEXTAREA"].includes(
          (e.target as HTMLElement)?.tagName || ""
        )
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commitSearch(localQuery)
    }
    if (e.key === "Escape") {
      if (localQuery) {
        setLocalQuery("")
        if (isOnCategoryPage) {
          router.replace(buildSearchUrl(pathname, null), {
            scroll: false,
          })
        } else {
          setCurrentUrlQuery(null)
        }
        inputRef.current?.focus()
      } else {
        inputRef.current?.blur()
      }
    }
  }

  const flushOnBlur = () => {
    const nextCommittedSearch = getSearchValueToCommit(localQuery) || ""
    if (nextCommittedSearch !== committedSearch) {
      commitSearch(localQuery)
    }
  }

  const inSync = (getSearchValueToCommit(localQuery) || "") === committedSearch

  const showFound =
    inSync &&
    pathname === "/components" &&
    hasActiveCatalogSearch(committedSearch) &&
    resultCount > 0

  return (
    <div className={cn("group relative flex-1", className)}>
      <div className="pointer-events-none absolute top-1/2 left-0 flex -translate-y-1/2 items-center pl-0">
        <SearchIcon className="text-site-muted-foreground group-focus-within:text-site-foreground size-4 transition-colors" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onBlur={flushOnBlur}
        className={cn(
          "ring-offset-site-background placeholder:text-site-muted-foreground flex h-9 w-full border-0 bg-transparent py-1 pl-6 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          localQuery ? "pr-32" : "pr-4"
        )}
      />
      <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-1 pr-1">
        {showFound ? (
          <div className="flex items-center gap-1.5">
            <div className="text-site-muted-foreground hidden items-center gap-1.5 text-xs font-medium sm:flex">
              Found {resultCount}{" "}
              {resultCount === 1 ? "component" : "components"}
            </div>
            <Separator
              className="ml-1 h-4! w-px shrink-0"
              orientation="vertical"
            />
          </div>
        ) : null}
        {localQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 h-7 w-7 opacity-60 hover:bg-transparent hover:opacity-100"
            onClick={handleClear}
          >
            <XIcon className="size-3.5" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  )
}
