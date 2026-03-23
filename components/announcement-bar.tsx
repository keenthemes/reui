"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"

interface AnnouncementBarConfig {
  enabled: boolean
  homeOnly?: boolean
  badgeText?: string | null
  title: string
  linkUrl?: string | null
  linkText?: string | null
}

export function AnnouncementBar({ config }: { config: AnnouncementBarConfig }) {
  const pathname = usePathname()

  if (!config.enabled) return null
  if (config.homeOnly && pathname !== "/") return null

  return (
    <div
      data-slot="announcement-bar"
      className="font-site-sans relative flex items-center justify-center gap-2 bg-black px-4 py-2.5 text-center text-sm text-white"
    >
      {config.badgeText ? (
        <span className="site-rounded-full shrink-0 border border-emerald-500/20 bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          {config.badgeText}
        </span>
      ) : null}
      <span className="line-clamp-1 text-white/90">{config.title}</span>
      {config.linkUrl ? (
        <Link
          href={config.linkUrl}
          className="inline-flex shrink-0 items-center text-white underline underline-offset-4 transition-colors hover:text-white/80"
        >
          {config.linkText || "Learn more"}
          <ChevronRightIcon className="mt-px size-3.5" />
        </Link>
      ) : null}
    </div>
  )
}
