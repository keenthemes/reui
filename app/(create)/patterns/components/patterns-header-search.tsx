"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"
import { useQueryState } from "nuqs"

import { parseAsSearchStringClient } from "@/lib/nuqs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

interface PatternsHeaderSearchProps {
  placeholder?: string
  className?: string
  count?: number
}

export function PatternsHeaderSearch({
  placeholder = "Search patterns...",
  className,
  count,
}: PatternsHeaderSearchProps) {
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we're on a category page (not the main /patterns page)
  const isOnCategoryPage =
    pathname.startsWith("/patterns/") && pathname !== "/patterns"

  const [currentUrlQuery, setCurrentUrlQuery] = useQueryState(
    "search",
    parseAsSearchStringClient.withOptions({
      startTransition,
      shallow: false,
    })
  )

  // Local state for immediate UI feedback while typing
  const [localQuery, setLocalQuery] = useState<string>(currentUrlQuery || "")
  const localQueryRef = useRef(localQuery)
  localQueryRef.current = localQuery

  // Track if we should autofocus after a navigation/render
  const shouldFocusRef = useRef(false)

  // Sync local query when URL query changes externally (e.g. back button)
  useEffect(() => {
    if (!isPending && localQueryRef.current !== (currentUrlQuery || "")) {
      setLocalQuery(currentUrlQuery || "")
    }

    // If we were waiting for a transition to finish to restore focus
    if (!isPending && shouldFocusRef.current) {
      shouldFocusRef.current = false
      inputRef.current?.focus()
    }
  }, [currentUrlQuery, isPending])

  // Helper to build URL with current params + search
  const buildSearchUrl = useCallback(
    (basePath: string, searchValue: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
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
      const finalValue = value.trim()

      // If the input is currently focused, we want to maintain that focus after the transition
      if (document.activeElement === inputRef.current) {
        shouldFocusRef.current = true
      }

      // If on a category page, navigate to main patterns page with search
      if (isOnCategoryPage && finalValue) {
        // Only add search param, preserve other existing params
        router.push(buildSearchUrl("/patterns", finalValue))
      } else {
        setCurrentUrlQuery(finalValue || null)
      }
    },
    [setCurrentUrlQuery, isOnCategoryPage, router, buildSearchUrl]
  )

  // Debounce URL update: wait for user to stop typing
  useEffect(() => {
    if (localQuery === (currentUrlQuery || "")) return

    const timer = setTimeout(() => {
      commitSearch(localQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [localQuery, currentUrlQuery, commitSearch])

  const handleClear = () => {
    setLocalQuery("")
    shouldFocusRef.current = true

    // If on category page with search, navigate back to that category (remove search)
    if (isOnCategoryPage) {
      // Only remove search param, preserve other existing params
      router.push(buildSearchUrl(pathname, null))
    } else {
      setCurrentUrlQuery(null)
    }
    // Maintain focus on the input after clearing
    inputRef.current?.focus()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on "/" or "Cmd+K" (specific to this page)
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
      // Force immediate update on Enter
      const finalValue = localQuery.trim()
      shouldFocusRef.current = true
      if (isOnCategoryPage && finalValue) {
        // Only add search param, preserve other existing params
        router.push(buildSearchUrl("/patterns", finalValue))
      } else {
        setCurrentUrlQuery(finalValue || null)
      }
    }
    if (e.key === "Escape") {
      if (localQuery) {
        setLocalQuery("")
        shouldFocusRef.current = true
        commitSearch("")
        // Ensure focus is kept/regained after clearing
        inputRef.current?.focus()
      } else {
        inputRef.current?.blur()
      }
    }
  }

  return (
    <div className={cn("group relative flex-1", className)}>
      <div className="pointer-events-none absolute top-1/2 left-0 flex -translate-y-1/2 items-center pl-0">
        {isPending ? (
          <Spinner className="size-4 opacity-60" />
        ) : (
          <SearchIcon className="text-muted-foreground group-focus-within:text-foreground size-4 transition-colors" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={handleInputKeyDown}
        className={cn(
          "ring-offset-background placeholder:text-muted-foreground flex h-9 w-full border-0 bg-transparent py-1 pl-6 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          localQuery ? "pr-32" : "pr-4"
        )}
      />
      <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-1 pr-1">
        {localQuery && count && count > 0 ? (
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground hidden items-center gap-1.5 text-xs font-medium sm:flex">
              Found {count} {count === 1 ? "pattern" : "patterns"}
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
