import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  getCategoryInfo,
  getCategoryNames,
  getPatternCountByCategory,
} from "@/lib/registry"
import { cn, normalizeSlug } from "@/lib/utils"

interface PatternCategoryPagerProps {
  currentCategory: string
}

const linkClass =
  "border-site-border bg-site-background hover:bg-site-muted/50 focus-visible:ring-site-ring text-foreground group flex min-h-14 w-full min-w-0 items-center gap-3 site-rounded-xl border px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:min-h-16 sm:px-5"

function formatAdjacentCategoryTitle(categorySlug: string) {
  const info = getCategoryInfo(categorySlug)
  if (!info) {
    return ""
  }
  const count = getPatternCountByCategory(categorySlug)
  return `${count} Shadcn ${info.label} Patterns`
}

export function PatternCategoryPager({
  currentCategory,
}: PatternCategoryPagerProps) {
  const normalized = normalizeSlug(currentCategory)
  const names = getCategoryNames()
  const index = names.indexOf(normalized)

  if (index === -1) {
    return null
  }

  const prevName = index > 0 ? names[index - 1] : null
  const nextName = index < names.length - 1 ? names[index + 1] : null

  if (!prevName && !nextName) {
    return null
  }

  return (
    <nav
      className="w-full px-6 pt-2 pb-10 sm:px-8 xl:px-10"
      aria-label="Adjacent pattern categories"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="min-w-0">
          {prevName ? (
            <Link
              href={`/patterns/${normalizeSlug(prevName)}`}
              className={cn(linkClass, "justify-between")}
            >
              <ChevronLeft
                className="text-site-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors"
                aria-hidden
              />
              <span className="min-w-0 flex-1 text-right">
                <span className="text-site-muted-foreground block text-xs font-medium">
                  Previous
                </span>
                <span className="mt-0.5 block truncate text-sm font-medium">
                  {formatAdjacentCategoryTitle(prevName)}
                </span>
              </span>
            </Link>
          ) : null}
        </div>

        <div className="min-w-0 sm:flex sm:justify-end">
          {nextName ? (
            <Link
              href={`/patterns/${normalizeSlug(nextName)}`}
              className={cn(linkClass, "justify-between sm:w-full")}
            >
              <span className="min-w-0 flex-1 text-left">
                <span className="text-site-muted-foreground block text-xs font-medium">
                  Next
                </span>
                <span className="mt-0.5 block truncate text-sm font-medium">
                  {formatAdjacentCategoryTitle(nextName)}
                </span>
              </span>
              <ChevronRight
                className="text-site-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors"
                aria-hidden
              />
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
