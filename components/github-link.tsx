import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link
        href={siteConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ReUI on GitHub (opens in new tab)"
      >
        <Icons.gitHub aria-hidden="true" />
        {/* Hardcoded star count from siteConfig (updated by hand). `min-w-[2ch]`
            + tabular-nums keep the label box from jittering. */}
        <span className="text-site-muted-foreground min-w-[2ch] text-center text-xs tabular-nums">
          {siteConfig.githubStars}
        </span>
      </Link>
    </Button>
  )
}
