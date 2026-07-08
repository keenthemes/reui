import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { FIGMA_URL, FigmaIcon } from "@/lib/nav-config"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const resourceLinks = [
  { label: "Components", href: "/components" },
  { label: "Docs", href: "/docs" },
]

const communityLinks = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "X / Twitter", href: siteConfig.links.twitter },
  { label: "Figma", href: FIGMA_URL },
]

const currentYear = 2026

function FooterLinkGroup({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-site-foreground text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-site-muted-foreground hover:text-site-foreground focus-visible:ring-site-ring site-rounded-sm inline-block text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "site-theme-container font-site-sans bg-site-background text-site-foreground relative",
        className
      )}
    >
      {/* Top border */}
      <div className="bg-site-border h-px w-full" aria-hidden="true" />

      <div className="container-wrapper">
        <div className="container py-8 md:py-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            <FooterLinkGroup title="Product" links={resourceLinks} />
            <FooterLinkGroup title="Community" links={communityLinks} />
          </div>
        </div>
      </div>

      {/* Compact bottom bar */}
      <div className="relative">
        <div className="bg-site-border h-px w-full" aria-hidden="true" />
        <div className="container-wrapper">
          <div className="container flex flex-col items-center justify-between gap-3 py-3 md:flex-row md:py-3.5">
            <p className="text-site-muted-foreground text-sm">
              &copy; {currentYear} ReUI. Released under the MIT License.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-site-muted-foreground hover:text-site-foreground focus-visible:ring-site-ring site-rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Follow us on X"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={FIGMA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-site-muted-foreground hover:text-site-foreground focus-visible:ring-site-ring site-rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label="View ReUI on Figma"
                  >
                    <FigmaIcon className="size-[18px]" aria-hidden="true" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Free shadcn/ui Figma</TooltipContent>
              </Tooltip>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-site-muted-foreground hover:text-site-foreground focus-visible:ring-site-ring site-rounded-sm inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="View ReUI on GitHub"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-xs font-medium tabular-nums">
                  {siteConfig.githubStars}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
