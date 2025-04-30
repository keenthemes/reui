import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MobileNav } from '@/components/mobile-nav';
import { ModeSwitcher } from '@/components/mode-switcher';
import { MainNav } from './main-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 dark:border-border">
      <div className="flex h-16 items-center px-8 container justify-between gap-4">
        <MobileNav />

        <div className="hidden md:flex items-center gap-3.5">
          <Link href="/" className="mr-10 flex items-center gap-2">
            <Image
              src="/brand/logo-text-light.svg"
              alt={siteConfig.name}
              width={75}
              height={0}
              className="dark:hidden"
            />
            <Image
              src="/brand/logo-text-dark.svg"
              alt={siteConfig.name}
              width={75}
              height={0}
              className="hidden dark:inline-block"
            />
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <nav className="flex items-center gap-1">
            <Button variant="ghost" mode="icon" size="sm" className="size-8">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.github className="h-4! w-4!" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="ghost" mode="icon" size="sm" className="size-8">
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.twitter />
                <span className="sr-only">X</span>
              </Link>
            </Button>
            <ModeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
