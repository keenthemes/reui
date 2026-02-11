import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub />
        <React.Suspense fallback={<Skeleton className="h-4 w-6" />}>
          <StarsCount />
        </React.Suspense>
      </Link>
    </Button>
  )
}

export async function StarsCount() {
  if (process.env.NODE_ENV === "development") {
    return (
      <span className="text-muted-foreground w-6 text-xs tabular-nums">
        2.5k
      </span>
    )
  }

  try {
    const data = await fetch("https://api.github.com/repos/keenthemes/reui", {
      next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
    })
    const json = await data.json()
    const count = json?.stargazers_count

    // Handle undefined/null count
    if (typeof count !== "number") {
      return (
        <span className="text-muted-foreground w-6 text-xs tabular-nums">
          2.5k
        </span>
      )
    }

    return (
      <span className="text-muted-foreground w-6 text-xs tabular-nums">
        {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count)}
      </span>
    )
  } catch {
    // Fallback on fetch error
    return (
      <span className="text-muted-foreground w-6 text-xs tabular-nums">—</span>
    )
  }
}
