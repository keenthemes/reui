import * as React from "react"
import { FigmaIcon as FigmaIconData } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { VariantProps } from "class-variance-authority"

import type { badgeVariants } from "@/components/ui/badge"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

/**
 * Any icon component that accepts `className` + standard SVG props. Covers
 * lucide icons and the `FigmaIcon` wrapper below.
 */
export type NavIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

/**
 * Figma brand glyph from hugeicons (lucide dropped its brand icons). Wrapped
 * as a plain SVG-props component so it slots into `NavIcon` everywhere a
 * lucide icon does (dropdown rows, the header toolbar link, the footer). It
 * uses `currentColor` strokes, so it inherits color from its container.
 */
export function FigmaIcon(props: React.SVGProps<SVGSVGElement>) {
  // `strokeWidth` is omitted from the spread: SVG props type it as
  // `string | number` while hugeicons narrows it to `number`, which would
  // clash. Call sites only pass `className` / `aria-hidden`.
  return (
    <HugeiconsIcon
      icon={FigmaIconData}
      {...(props as Omit<React.SVGProps<SVGSVGElement>, "strokeWidth">)}
    />
  )
}

/**
 * Preset badge labels for the dropdown inner items. The Title-case key
 * doubles as the visible label. All presets use the Badge `default` variant
 * (a neutral, non-colorful pill) so the menu reads calm; `srLabel` is what
 * assistive tech announces. Add a preset here once and reference it by key,
 * never inline a variant. To recolor a single preset later, change its
 * `variant` here.
 */
// Note: "coming soon" is expressed by the `soon` flag (which disables the
// item), not a badge. A "Soon" badge would render on a live, clickable link -
// a footgun - so it is intentionally absent from the preset palette.
export type NavBadgePreset = "New" | "Free" | "Beta" | "Updated"

export const NAV_BADGE_PRESETS: Record<
  NavBadgePreset,
  { label: string; variant: BadgeVariant; srLabel: string }
> = {
  Free: { label: "Free", variant: "default", srLabel: "Free" },
  New: { label: "New", variant: "default", srLabel: "New" },
  Beta: { label: "Beta", variant: "default", srLabel: "Beta" },
  Updated: { label: "Updated", variant: "default", srLabel: "Updated" },
}

/** Keys for the live registry counts injected into stat-driven subtitles. */
export type NavStatKey = "components"

/**
 * Live counts resolved ON THE SERVER and passed to the nav as plain numbers -
 * no client fetching, computed once per render. A `{count}` token in a child's
 * `subtitle` is replaced with its `statKey` value.
 */
export type NavStats = Partial<Record<NavStatKey, number>>

/** Round large counts down to a clean "N+", show small ones exactly. */
export function formatNavCount(n: number): string {
  return n >= 30 ? `${Math.floor(n / 10) * 10}+` : `${n}`
}

/** A single row inside a dropdown panel. */
export type NavMenuChild = {
  title: string
  subtitle: string
  href: string
  icon: NavIcon
  /** Optional size override for the row icon (e.g. a brand glyph that reads
   *  small at the default `size-4`). Defaults to `size-4`. */
  iconClassName?: string
  /** Replace the subtitle's `{count}` token with this live stat (server-resolved). */
  statKey?: NavStatKey
  /**
   * Hide this row entirely when its `statKey` count resolves to 0, instead of
   * rendering a "0 ..." subtitle. Applied by `filterNavEntriesByStats` on the
   * surfaces that receive live stats.
   */
  hideWhenZero?: boolean
  /**
   * External link. Renders an `<a target="_blank" rel="noopener noreferrer">`
   * with a trailing arrow and a visually hidden "opens in new tab" hint.
   */
  external?: boolean
  /** Optional preset badge (label, variant, srLabel from NAV_BADGE_PRESETS). */
  badge?: NavBadgePreset
  /**
   * Coming soon: rendered disabled and never active. It is still surfaced
   * (greyed out, non-selectable) in the command palette and mobile drawer.
   */
  soon?: boolean
}

/** Optional conversion strip pinned to the bottom of a panel. */
export type NavPanelFooter = {
  title: string
  subtitle: string
  href: string
}

/** A top-level entry: either a dropdown menu or a plain link. */
export type NavEntry =
  | {
      kind: "link"
      label: string
      href: string
      external?: boolean
      soon?: boolean
      /** Only highlight on an exact route match (not nested children). */
      exact?: boolean
    }
  | {
      kind: "menu"
      label: string
      /** Route prefixes that mark the trigger active when matched. */
      matchPrefixes?: string[]
      items: NavMenuChild[]
      footer?: NavPanelFooter
    }

/** Single place to override the external Figma destination. */
export const FIGMA_URL =
  "https://www.figma.com/community/file/1649373313065184861/shadcn-ui-design-system-by-reui"

/**
 * The menu, top to bottom. This is the single source of truth: the desktop
 * dropdown nav, the mobile drawer, and (via `navFlatItems`) the command
 * palette are all derived from it. Edit here, nowhere else.
 */
export const navEntries: NavEntry[] = [
  { kind: "link", label: "Components", href: "/components" },
  { kind: "link", label: "Docs", href: "/docs", exact: true },
]

/**
 * Drop menu children that opt into `hideWhenZero` when their live stat resolves
 * to exactly 0, so the menu never surfaces an empty "0 ..." row. Hides only on a
 * definite 0; an unknown (undefined) count leaves the row in place, so a missing
 * stat never silently removes a real item. Pure: a menu whose items are
 * unchanged passes through by reference, keeping `useMemo` consumers stable.
 */
export function filterNavEntriesByStats(
  entries: NavEntry[],
  stats: NavStats | undefined
): NavEntry[] {
  return entries.map((entry) => {
    if (entry.kind !== "menu") return entry
    const items = entry.items.filter((child) => {
      if (!child.hideWhenZero || !child.statKey) return true
      return stats?.[child.statKey] !== 0
    })
    return items.length === entry.items.length ? entry : { ...entry, items }
  })
}

/**
 * Flat list for the command palette and mobile drawer search. Derived so the
 * config stays the single source of truth. External links (the Figma URL) are
 * skipped because those surfaces only `router.push` internal routes.
 */
export function toFlatNavItems(
  entries: NavEntry[] = navEntries
): { href: string; label: string; soon?: boolean }[] {
  const out: { href: string; label: string; soon?: boolean }[] = []
  for (const entry of entries) {
    if (entry.kind === "link") {
      if (!entry.external)
        out.push({ href: entry.href, label: entry.label, soon: entry.soon })
    } else {
      for (const child of entry.items) {
        if (!child.external)
          out.push({ href: child.href, label: child.title, soon: child.soon })
      }
    }
  }
  return out
}

/** Precomputed flat list for direct import. */
export const navFlatItems = toFlatNavItems()
