import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function XLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
        <Icons.twitter className="size-3.25" />
        <span className="sr-only">X</span>
      </Link>
    </Button>
  )
}
