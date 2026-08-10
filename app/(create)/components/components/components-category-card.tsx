"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { normalizeSlug } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

export interface ComponentsCategoryCardProps {
  name: string
  label: string
  count: number
}

export function ComponentsCategoryCard({
  name,
  label,
  count,
}: ComponentsCategoryCardProps) {
  const slug = normalizeSlug(name)
  const searchParams = useSearchParams()
  const [loaded, setLoaded] = React.useState(false)

  // Resolve the loading state from the <img> element itself on mount. The
  // `load` event can fire before React attaches onLoad - a cached or
  // synchronously-decoded screenshot completes during hydration - which
  // otherwise leaves the spinner running on top of a fully-loaded thumbnail.
  // Reading `complete`/`naturalWidth` catches that race.
  const resolveFromElement = React.useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) setLoaded(true)
    },
    []
  )

  // Build href with preserved design system params
  const href = React.useMemo(() => {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete("item")
    nextParams.delete("search")
    nextParams.delete("view")

    const queryString = nextParams.toString()
    return queryString
      ? `/components/${slug}?${queryString}`
      : `/components/${slug}`
  }, [searchParams, slug])

  return (
    <Link
      href={href}
      prefetch={false}
      className="group/thumbnail bg-site-muted/50 dark:bg-site-background border-site-border/60 site-rounded-xl flex flex-col border p-0.5 shadow-sm shadow-black/5"
    >
      <div className="bg-site-background border-site-border/60 site-rounded-xl relative overflow-hidden border">
        {/* Spinner placeholder while the screenshot loads, covered by the
            (opaque) image once it paints. */}
        {!loaded ? (
          <div className="bg-site-muted/40 absolute inset-0 flex items-center justify-center">
            <Spinner className="text-site-muted-foreground/50 size-5" />
          </div>
        ) : null}
        <Image
          ref={resolveFromElement}
          src={`/screenshots/components/${slug}-light.png`}
          alt={slug}
          width={600}
          height={400}
          className="w-full object-cover transition-all duration-300 dark:hidden"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            // Clear the spinner too: a category with no screenshot yet would
            // otherwise spin forever behind the fallback image.
            setLoaded(true)
            e.currentTarget.src = "/screenshots/components/default-light.png"
          }}
        />
        <Image
          ref={resolveFromElement}
          src={`/screenshots/components/${slug}-dark.png`}
          alt={slug}
          width={600}
          height={400}
          className="hidden w-full object-cover transition-all duration-300 dark:block"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            setLoaded(true)
            e.currentTarget.src = "/screenshots/components/default-dark.png"
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-px px-3 py-2.5">
        <h3 className="text-site-foreground text-base font-medium tracking-tight">
          {label}
        </h3>
        <span className="text-site-muted-foreground text-xs font-normal">
          {count} {count === 1 ? "component" : "components"}
        </span>
      </div>
    </Link>
  )
}
