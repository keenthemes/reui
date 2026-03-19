"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn, isActive } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ExternalLinkIcon } from "lucide-react"

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string; pro?: boolean; soon?: boolean }[]
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center gap-0.5", className)} {...props}>
      {items.map((item) => {
        const active = !item.soon && !item.pro && isActive(pathname, item.href)

        const button = (
          <Button
            variant="ghost"
            size="sm"
            asChild={!item.soon}
            className={cn(
              "relative",
              active && "bg-muted text-primary",
              item.soon && "opacity-60"
            )}
          >
            {item.soon ? (
              <span>{item.label}</span>
            ) : item.href ? (
              item.href.startsWith('https://') ? (
                <Link href={item.href} target="_blank" className="flex items-center gap-0.5" rel="noreferrer">{item.label} <ExternalLinkIcon className="size-3.5" /></Link>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )
            ) : null}
          </Button>
        )

        if (item.pro) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent className="leading-relaxed max-w-50">
               🔥 Cooking something special! Join the waitlist for 50% off.
              </TooltipContent>
            </Tooltip>
          )
        }

        return <React.Fragment key={item.href}>{button}</React.Fragment>
      })}
    </nav>
  )
}
