import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function XLink() {
  return (
    <Button
      asChild
      size="icon-sm"
      variant="ghost"
      className="shadow-none"
    >
      <Link
        href={siteConfig.links.twitter}
        target="_blank"
        rel="noreferrer"
        aria-label="Open X profile"
      >
        <Icons.twitter className="size-3.5" aria-hidden="true" />
        <span className="sr-only">X</span>
      </Link>
    </Button>
  )
}
