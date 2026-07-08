"use client"

import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"

import type { ComponentCategoryInfo } from "@/lib/component-stats"
import { Button } from "@/components/ui/button"

const CommandMenu = dynamic(
  () => import("@/components/command-menu").then((mod) => mod.CommandMenu),
  {
    ssr: false,
    // Mirror the real trigger (see command-menu.tsx: ghost `size-8` icon
    // button) pixel-for-pixel so the swap on hydration is invisible. The old
    // fallback was a wide `md:w-21` search bar, which collapsed to the 32px
    // icon once the chunk loaded - the visible width jump on every load.
    loading: () => (
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="Search"
      >
        <SearchIcon className="size-4" />
      </Button>
    ),
  }
)

export function CommandMenuLazy({
  navItems,
  componentCategories = [],
}: {
  navItems?: { href: string; label: string; soon?: boolean }[]
  componentCategories?: ComponentCategoryInfo[]
}) {
  return (
    <CommandMenu navItems={navItems} componentCategories={componentCategories} />
  )
}
