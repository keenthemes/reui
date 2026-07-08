import Link from "next/link"

import {
  getComponentCategories,
  getComponentsTotalCount,
} from "@/lib/component-stats"
import { navFlatItems } from "@/lib/nav-config"
import { Separator } from "@/components/ui/separator"
import { CommandMenuLazy } from "@/components/command-menu-lazy"
import { DesktopNav } from "@/components/desktop-nav"
import { FigmaLink } from "@/components/figma-link"
import { GitHubLink } from "@/components/github-link"
import { Logo } from "@/components/logo"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeModeToggleButton } from "@/components/theme-mode-toggle-button"
import { XLink } from "@/components/x-link"

export async function SiteHeader() {
  const componentCategories = getComponentCategories()

  // Live nav counts - a single synchronous in-memory read. The header contains
  // no server cookies() read, so every page shell is fully static.
  const navStats = {
    components: getComponentsTotalCount(),
  }

  return (
    <header className="theme-container bg-site-background text-site-foreground font-site-sans w-full overscroll-none">
      <div className="container-wrapper">
        {/*
          Three-zone header: LEFT logo | CENTER menu | RIGHT secondary nav.

          At `xl+` the `grid-cols-[1fr_auto_1fr]` template is load-bearing:
          equal `1fr` rails guarantee the center cell's midpoint equals the
          container's midpoint, so the menu stays optically centered even
          though the logo (narrow) and the right cluster (wide) are unequal.

          BELOW `xl` we switch to `grid-cols-[auto_1fr_auto]`: between `lg`
          and `xl` the full desktop nav + the whole right cluster are too wide
          for equal rails (the equal `1fr` rails both inflate to the WIDER
          right cluster, padding the left with dead space and pushing the
          total past the viewport, so the menu and toolbar collided). With
          `auto_1fr_auto` the logo + right cluster size to content and the nav
          centers in the flexible middle track instead - it fits and reads
          balanced, trading viewport-perfect centering for breathing room
          where space is tight. The center cell is empty below `lg` (mobile
          drawer takes over) under both templates, so nothing shifts there.
        */}
        <div className="grid h-[calc(var(--header-height)-1px)] grid-cols-[auto_1fr_auto] items-center gap-2 **:data-[slot=separator]:h-4! xl:grid-cols-[1fr_auto_1fr] xl:gap-3.5">
          {/* LEFT rail: mobile menu trigger (below lg) + logo. */}
          <div className="flex min-w-0 items-center justify-start gap-2.5">
            <MobileNav stats={navStats} className="flex lg:hidden" />
            <Link href="/" aria-label="ReUI home">
              <Logo />
            </Link>
          </div>

          {/* CENTER cell: desktop dropdown nav. Optically centered at `xl+`
              (the `1fr auto 1fr` grid does the centering, which sits the menu
              right next to the wide right cluster). Below `xl` the grid switches
              to `auto 1fr auto`, so right-align the triggers here to pull the
              menu up against the right toolbar - consistent with the xl+ look -
              instead of letting it float in the middle with large gaps on both
              sides. */}
          <DesktopNav
            stats={navStats}
            className="hidden justify-end lg:flex xl:justify-center"
          />

          {/*
            RIGHT rail: secondary nav cluster - search + theme/X/GitHub toolbar.

            `min-w-0` lets the rail shrink-wrap so the toolbar absorbs
            slack instead of forcing overflow.
          */}
          <div className="flex min-w-0 items-center justify-end gap-1.5 xl:gap-3">
            {/*
              Utility toolbar (left -> right): search, theme, X, Figma,
              GitHub. All ghost icon buttons on a shared `h-8` baseline so
              they read as one quiet group next to the louder primary CTA.
              The Figma link sources its URL + glyph from `@/lib/nav-config`
              (same single source as the "Free Figma" dropdown item).
            */}
            <div className="hidden items-center gap-0.5 md:flex">
              <CommandMenuLazy
                navItems={navFlatItems}
                componentCategories={componentCategories}
              />
              {/* Divider between search and the theme/social icon cluster. */}
              <Separator orientation="vertical" className="mx-1" />
              <ThemeModeToggleButton variant="ghost" className="size-8" />
              <XLink />
              <FigmaLink />
              <GitHubLink />
            </div>
          </div>
        </div>
      </div>
      {/* Header bottom border */}
      <div className="bg-site-border/80 h-px w-full" aria-hidden="true" />
    </header>
  )
}
