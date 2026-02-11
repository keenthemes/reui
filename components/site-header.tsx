import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { getCategories } from "@/lib/registry"
import { source } from "@/lib/source"
import { Separator } from "@/components/ui/separator"
import { CommandMenu } from "@/components/command-menu"
import { GitHubLink } from "@/components/github-link"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { XLink } from "@/components/x-link"

export function SiteHeader() {
  const pageTree = source.getPageTree()
  const patternCategories = getCategories()

  return (
    <header className="bg-background sticky top-0 z-50 w-full overscroll-none border-b border-transparent">
      <div className="container-wrapper">
        <div className="flex h-[calc(var(--header-height)-1px)] items-center gap-3.5 **:data-[slot=separator]:h-4!">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/logo-text-light.svg"
              alt={siteConfig.name}
              width={75}
              height={0}
              className="shrink-0 dark:hidden"
            />
            <Image
              src="/brand/logo-text-dark.svg"
              alt={siteConfig.name}
              width={75}
              height={0}
              className="hidden shrink-0 dark:inline-block"
            />
            <span className="sr-only">{siteConfig.name}</span>
          </Link>
          <MobileNav
            tree={pageTree}
            items={siteConfig.navItems}
            className="flex lg:hidden"
          />
          <div className="ml-auto flex items-center gap-1 md:flex-1 md:justify-end">
            <div className="mr-2 hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <CommandMenu
                tree={pageTree}
                navItems={siteConfig.navItems}
                patternCategories={patternCategories}
              />
            </div>

            <MainNav items={siteConfig.navItems} className="hidden lg:flex" />

            <Separator orientation="vertical" className="hidden lg:flex" />

            <div className="flex items-center gap-0">
              <GitHubLink />
              <XLink />
              <ModeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
