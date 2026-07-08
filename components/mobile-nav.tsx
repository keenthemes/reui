"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import {
  filterNavEntriesByStats,
  NAV_BADGE_PRESETS,
  navEntries,
  type NavEntry,
  type NavStats,
} from "@/lib/nav-config"
import { cn, isActive } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Logo } from "@/components/logo"

export function MobileNav({
  // Imported here (not passed from the server header) so the `icon` component
  // functions never cross the RSC server -> client boundary.
  entries = navEntries,
  // Live server-resolved counts (plain numbers). Only used to drop stat-gated
  // rows when a count is 0; the drawer itself shows no counts.
  stats,
  className,
}: {
  entries?: NavEntry[]
  stats?: NavStats
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  // Keep the drawer in lockstep with the desktop nav: hide any stat-gated row
  // whose count is 0.
  const visibleEntries = React.useMemo(
    () => filterNavEntriesByStats(entries, stats),
    [entries, stats]
  )

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Open navigation menu"
          className={cn(
            "extend-touch-target text-site-foreground h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
            className
          )}
        >
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="theme-container border-site-border bg-site-background text-site-foreground h-full">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Navigation Menu</DrawerTitle>
          <DrawerDescription>
            Access the main sections of ReUI.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-8 overflow-auto px-6 py-6">
          <div className="mb-2">
            <Link
              href="/"
              aria-label="ReUI home"
              onClick={() => setOpen(false)}
            >
              <Logo width={85} />
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            <MobileLink
              href="/"
              onOpenChange={setOpen}
              active={pathname === "/"}
            >
              Home
            </MobileLink>

            {visibleEntries.map((entry) =>
              entry.kind === "link" ? (
                entry.soon ? (
                  <SoonRow key={entry.label} label={entry.label} />
                ) : (
                  <MobileLink
                    key={entry.label}
                    href={entry.href}
                    onOpenChange={setOpen}
                    external={entry.external}
                    active={
                      !entry.external &&
                      (entry.exact
                        ? pathname.replace(/\/$/, "") ===
                          entry.href.replace(/\/$/, "")
                        : isActive(pathname, entry.href))
                    }
                  >
                    {entry.label}
                    {entry.external && (
                      <span className="sr-only"> (opens in new tab)</span>
                    )}
                  </MobileLink>
                )
              ) : (
                <div key={entry.label} className="flex flex-col gap-3">
                  <p className="text-site-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                    {entry.label}
                  </p>
                  {entry.items.map((child) => {
                    const Icon = child.icon
                    const preset = child.badge
                      ? NAV_BADGE_PRESETS[child.badge]
                      : null

                    if (child.soon)
                      return <SoonRow key={child.href} label={child.title} />

                    return (
                      <MobileLink
                        key={child.href}
                        href={child.href}
                        onOpenChange={setOpen}
                        external={child.external}
                        active={
                          !child.external && isActive(pathname, child.href)
                        }
                        className="flex items-center gap-2.5"
                      >
                        <Icon
                          className="text-site-muted-foreground size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{child.title}</span>
                        {preset && (
                          <Badge
                            variant={preset.variant}
                            className="ml-auto h-[18px] px-1.5 py-0 text-[10px] leading-none"
                          >
                            <span aria-hidden="true">{preset.label}</span>
                            <span className="sr-only">{preset.srLabel}</span>
                          </Badge>
                        )}
                        {child.external && (
                          <span className="sr-only">(opens in new tab)</span>
                        )}
                      </MobileLink>
                    )
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function SoonRow({ label }: { label: string }) {
  return (
    <span className="text-site-muted-foreground flex items-center gap-2 text-sm font-medium">
      {label}
      <span className="bg-site-muted text-site-muted-foreground site-rounded-sm px-1.5 py-0.5 text-[10px] leading-none font-medium">
        Soon
      </span>
    </span>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  active,
  external,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  active?: boolean
  external?: boolean
}) {
  const linkClassName = cn(
    "hover:text-site-primary text-sm font-medium transition-colors",
    active ? "text-site-primary" : "text-site-muted-foreground",
    className
  )

  // External links open a new tab and only close the drawer (the page
  // underneath must not navigate away).
  if (external) {
    return (
      <a
        href={href.toString()}
        target="_blank"
        rel="noopener noreferrer"
        aria-current={active ? "page" : undefined}
        onClick={() => onOpenChange?.(false)}
        className={linkClassName}
      >
        {children}
      </a>
    )
  }

  // Let next/link handle the client-side navigation; the onClick only closes
  // the drawer (a manual router.push here would double-navigate).
  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      onClick={() => onOpenChange?.(false)}
      className={linkClassName}
      {...props}
    >
      {children}
    </Link>
  )
}
