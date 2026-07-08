import * as React from "react"
import Link from "next/link"

import { isCanonicalComponentDoc } from "@/lib/component-doc-paths"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

function SeoInlineLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const cls = cn(
    "text-site-primary underline-offset-4 font-medium underline",
    className
  )
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} prefetch={false} className={cls}>
      {children}
    </Link>
  )
}

function SeoInlineBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-site-background text-site-foreground/90 px-1.5 py-0.5 text-xs",
        className
      )}
    >
      {children}
    </Badge>
  )
}

function hrefForCategorySlug(slug: string) {
  return isCanonicalComponentDoc(slug)
    ? `/docs/components/base/${slug}`
    : `/components/${slug}`
}

function isInternalAppPath(href: string) {
  return (
    href.startsWith("/components/") ||
    href.startsWith("/docs/") ||
    (href.startsWith("/") && !href.startsWith("//"))
  )
}

function renderInternalMarkdownLink(
  label: string,
  href: string,
  key: string
): React.ReactNode {
  return (
    <SeoInlineLink key={key} href={href}>
      {label}
    </SeoInlineLink>
  )
}

function renderBacktickContent(content: string, key: string): React.ReactNode {
  const trimmed = content.trim()
  if (trimmed.startsWith("pkg:")) {
    const pkg = trimmed.slice(4).trim()
    if (!pkg) {
      return <SeoInlineBadge key={key}>{content}</SeoInlineBadge>
    }
    return <SeoInlineBadge key={key}>{pkg}</SeoInlineBadge>
  }
  return <SeoInlineBadge key={key}>{trimmed || content}</SeoInlineBadge>
}

export function renderSeoLinkedText(
  text: string,
  keyPrefix: string
): React.ReactNode {
  const parts: React.ReactNode[] = []
  let pos = 0
  let k = 0

  const pushText = (s: string) => {
    if (s) parts.push(s)
  }

  while (pos < text.length) {
    const rest = text.slice(pos)

    if (rest.startsWith("{{count}}")) {
      pushText("{{count}}")
      pos += 9
      continue
    }
    if (rest.startsWith("[[count]]")) {
      pushText("[[count]]")
      pos += 9
      continue
    }

    const pkgLegacy = /^\[\[pkg:([^\]]+)\]\]/.exec(rest)
    if (pkgLegacy) {
      const name = pkgLegacy[1]
      parts.push(
        <SeoInlineBadge key={`${keyPrefix}-${k++}`}>{name}</SeoInlineBadge>
      )
      pos += pkgLegacy[0].length
      continue
    }

    const linkLegacy = /^\[\[([a-z0-9-]+)\|([^\]]+)\]\]/.exec(rest)
    if (linkLegacy) {
      const slug = linkLegacy[1]
      const label = linkLegacy[2]
      parts.push(
        renderInternalMarkdownLink(
          label,
          hrefForCategorySlug(slug),
          `${keyPrefix}-${k++}`
        )
      )
      pos += linkLegacy[0].length
      continue
    }

    if (rest[0] === "[" && rest[1] !== "[") {
      const md = /^\[([^\]]*)\]\(([^)]+)\)/.exec(rest)
      if (md) {
        const label = md[1]
        const url = md[2]
        if (url.startsWith("http://") || url.startsWith("https://")) {
          parts.push(
            <SeoInlineLink key={`${keyPrefix}-${k++}`} href={url}>
              {label || url}
            </SeoInlineLink>
          )
        } else if (isInternalAppPath(url)) {
          parts.push(
            renderInternalMarkdownLink(label, url, `${keyPrefix}-${k++}`)
          )
        } else {
          parts.push(
            <SeoInlineLink key={`${keyPrefix}-${k++}`} href={url}>
              {label || url}
            </SeoInlineLink>
          )
        }
        pos += md[0].length
        continue
      }
    }

    if (rest[0] === "`") {
      const end = rest.indexOf("`", 1)
      if (end > 0) {
        const inner = rest.slice(1, end)
        parts.push(renderBacktickContent(inner, `${keyPrefix}-${k++}`))
        pos += end + 1
        continue
      }
    }

    const strongDouble = /^\*\*([^*\n]+)\*\*/.exec(rest)
    if (strongDouble) {
      parts.push(
        <strong
          key={`${keyPrefix}-${k++}`}
          className="text-site-foreground font-semibold"
        >
          {strongDouble[1]}
        </strong>
      )
      pos += strongDouble[0].length
      continue
    }

    const strong = /^\*([^*\n]+)\*/.exec(rest)
    if (strong) {
      parts.push(
        <strong
          key={`${keyPrefix}-${k++}`}
          className="text-site-foreground font-semibold"
        >
          {strong[1]}
        </strong>
      )
      pos += strong[0].length
      continue
    }

    const nextSpecial = (() => {
      const markers = [
        rest.indexOf("[["),
        rest.indexOf("["),
        rest.indexOf("`"),
        rest.indexOf("**"),
        rest.indexOf("*"),
        rest.indexOf("{{count}}"),
      ].filter((index) => index >= 0)
      return markers.length ? Math.min(...markers) : -1
    })()

    if (nextSpecial === -1) {
      pushText(rest)
      break
    }

    pushText(rest.slice(0, nextSpecial))
    pos += nextSpecial
  }

  return parts
}
