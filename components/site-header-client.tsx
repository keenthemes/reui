"use client"

import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"

import type { CategoryInfo } from "@/lib/registry"
import { Button } from "@/components/ui/button"
import type { CommandMenuGroup } from "@/components/command-menu"

const CommandMenu = dynamic(
  () => import("@/components/command-menu").then((mod) => mod.CommandMenu),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="secondary"
        className="text-site-foreground relative h-8 w-full justify-start bg-transparent pl-2! font-medium shadow-none sm:pr-12 md:w-21"
        disabled
        aria-hidden="true"
      >
        <SearchIcon className="size-4 shrink-0 opacity-60" />
      </Button>
    ),
  }
)

const MobileNav = dynamic(
  () => import("@/components/mobile-nav").then((mod) => mod.MobileNav),
  {
    ssr: false,
    loading: () => <div className="size-8 lg:hidden" aria-hidden="true" />,
  }
)

const ModeSwitcher = dynamic(
  () => import("@/components/mode-switcher").then((mod) => mod.ModeSwitcher),
  {
    ssr: false,
    loading: () => <div className="size-8" aria-hidden="true" />,
  }
)

type HeaderTree = unknown

export function SiteHeaderMobileNav({
  tree,
  navItems,
  componentCategories,
}: {
  tree: HeaderTree
  navItems: { href: string; label: string; soon?: boolean }[]
  componentCategories: CategoryInfo[]
}) {
  return (
    <MobileNav
      tree={tree as never}
      items={navItems}
      componentCategories={componentCategories}
      className="flex lg:hidden"
    />
  )
}

export function SiteHeaderCommandMenu({
  navItems,
  componentCategories,
  commandGroups,
}: {
  navItems: { href: string; label: string; soon?: boolean }[]
  componentCategories: CategoryInfo[]
  commandGroups: CommandMenuGroup[]
}) {
  return (
    <CommandMenu
      groups={commandGroups}
      navItems={navItems}
      componentCategories={componentCategories}
    />
  )
}

export function SiteHeaderModeSwitcher() {
  return <ModeSwitcher />
}
