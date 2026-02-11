"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { normalizeSlug } from "@/lib/utils"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

export interface PatternsCategoryCardProps {
  name: string
  label: string
  count: number
}

export function PatternsCategoryCard({
  name,
  label,
  count,
}: PatternsCategoryCardProps) {
  const slug = normalizeSlug(name)
  const [params] = useDesignSystemSearchParams()

  // Build href with preserved design system params
  const href = React.useMemo(
    () => serializeDesignSystemSearchParams(`/patterns/${slug}`, params),
    [slug, params]
  )

  return (
    <Link
      href={href}
      className="group/thumbnail bg-muted/50 dark:bg-background border-border/60 flex flex-col rounded-xl border p-0.5 shadow-sm shadow-black/5"
    >
      <div className="bg-background border-border/60 relative overflow-hidden rounded-xl border">
        <Image
          src={`/screenshots/patterns/${slug}-light.png`}
          alt={slug}
          width={600}
          height={400}
          className="w-full object-cover transition-all duration-300 dark:hidden"
          onError={(e) => {
            e.currentTarget.src = "/screenshots/patterns/default-light.png"
          }}
        />
        <Image
          src={`/screenshots/patterns/${slug}-dark.png`}
          alt={slug}
          width={600}
          height={400}
          className="hidden w-full object-cover transition-all duration-300 dark:block"
          onError={(e) => {
            e.currentTarget.src = "/screenshots/patterns/default-dark.png"
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-px px-3 py-2.5">
        <h3 className="text-foreground text-base font-medium tracking-tight">
          {label}
        </h3>
        <span className="text-muted-foreground text-xs font-normal">
          {count} {count === 1 ? "pattern" : "patterns"}
        </span>
      </div>
    </Link>
  )
}
