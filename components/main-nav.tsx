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

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string; soon?: boolean }[]
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center gap-0.5", className)} {...props}>
      {items.map((item) => {
        const active = !item.soon && isActive(pathname, item.href)

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
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </Button>
        )

        if (item.soon) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent>🔥 ReUI Pro - Coming Soon!</TooltipContent>
            </Tooltip>
          )
        }

        return <React.Fragment key={item.href}>{button}</React.Fragment>
      })}
    </nav>
  )
}
