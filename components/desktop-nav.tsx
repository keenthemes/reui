"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navEntries, type NavEntry, type NavStats } from "@/lib/nav-config"
import { cn, isActive } from "@/lib/utils"

/**
 * Shared look for the top-level bar items: a quiet `h-9` pill that lights up on
 * hover / open. No focus ring or outline - the hover / open accent is the only
 * affordance.
 */
const rootItemClass =
  "group/trigger inline-flex h-9 w-max items-center justify-center gap-1 site-rounded-lg bg-site-background px-3 py-2 text-sm font-medium ring-0 outline-none transition-colors xl:px-4 hover:bg-site-accent hover:text-site-accent-foreground focus:outline-none focus-visible:ring-0 focus-visible:outline-none data-[state=open]:bg-site-accent data-[state=open]:text-site-accent-foreground dark:hover:bg-site-muted/60 dark:data-[state=open]:bg-site-muted"

/**
 * Active match for a plain link. `exact` links (Docs) only match the exact
 * route so they do not stay lit on every nested /docs/* page.
 */
function linkActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname.replace(/\/$/, "") === href.replace(/\/$/, "")
  return isActive(pathname, href)
}

export function DesktopNav({
  entries = navEntries,
  className,
}: {
  entries?: NavEntry[]
  // Accepted for caller compatibility; the open-source nav is links-only.
  stats?: NavStats
  className?: string
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center gap-0.5", className)}>
      {entries.map((entry) =>
        entry.kind === "link" ? (
          <PlainLink key={entry.label} entry={entry} pathname={pathname} />
        ) : null
      )}
    </nav>
  )
}

function PlainLink({
  entry,
  pathname,
}: {
  entry: Extract<NavEntry, { kind: "link" }>
  pathname: string
}) {
  if (entry.soon) {
    return (
      <span
        aria-disabled="true"
        className={cn(rootItemClass, "pointer-events-none opacity-60")}
      >
        {entry.label}
      </span>
    )
  }

  const active = linkActive(pathname, entry.href, entry.exact)
  const cls = cn(
    rootItemClass,
    active && "bg-site-accent text-site-accent-foreground dark:bg-site-muted"
  )

  return entry.external ? (
    <a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-current={active ? "page" : undefined}
      className={cls}
    >
      {entry.label}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  ) : (
    <Link
      href={entry.href}
      aria-current={active ? "page" : undefined}
      className={cls}
    >
      {entry.label}
    </Link>
  )
}
