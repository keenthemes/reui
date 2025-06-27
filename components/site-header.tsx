import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/registry/default/ui/button';
import { GithubButton } from '@/registry/default/ui/github-button';
import { siteConfig } from '@/config/site';
import { trackEvent } from '@/lib/analytics';
import { CommandMenu } from '@/components/command-menu';
import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { ModeSwitcher } from '@/components/mode-switcher';

export function SiteHeader() {
  const handleSocialClick = (platform: string) => {
    trackEvent({
      name: `site_header_${platform}_link_click`,
      properties: {
        platform,
        category: 'engagement',
        label: `Header ${platform} Click`,
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 dark:border-border">
      <div className="flex h-16 items-center container justify-between gap-4">
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
          <GithubButton
            targetStars={siteConfig.githubStars}
            initialStars={0}
            fixedWidth={false}
            label="GitHub Stars"
            className="h-8"
            repoUrl="https://github.com/keenthemes/reui"
          />

          <CommandMenu />

          <nav className="flex items-center gap-1">
            <Button variant="ghost" mode="icon" size="sm" className="size-8 text-foreground hidden">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialClick('github')}
              >
                <Icons.github className="h-4! w-4!" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="ghost" mode="icon" size="sm" className="size-8 text-foreground ">
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialClick('twitter')}
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
