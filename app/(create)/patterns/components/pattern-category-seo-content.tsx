"use client"

import * as React from "react"
import Link from "next/link"

import type { PatternCategorySeo, RelatedComponentsBlock } from "@/lib/registry"
import { isCanonicalComponentDoc } from "@/lib/seo"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
    <Link href={href} className={cls}>
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
    ? `/docs/base/${slug}`
    : `/patterns/${slug}`
}

function isInternalAppPath(href: string) {
  return (
    href.startsWith("/patterns/") ||
    href.startsWith("/docs/") ||
    (href.startsWith("/") && !href.startsWith("//"))
  )
}

/** Popular Patterns (root): `title` is `[Component](/patterns/...)` then `: description`. */
function isFeatureItemLinkColonTitle(title: string) {
  return /^\[[^\]]+\]\([^)]+\)/.test(title.trimStart())
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

/**
 * Inline SEO mini-markdown:
 * - `[label](url)` → internal or external link (same text-link style as pattern category cards)
 * - `` `…` `` → `SeoInlineBadge` (same style for all chips)
 * - `**…**` and `*…*` → strong
 * - `{{count}}` / `[[count]]` stay literal until `applySeoCountPlaceholder`
 * - Legacy: `[[pkg:…]]`, `[[slug|Label]]` (same link style as `[Label](/patterns/slug)`)
 */
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
          className="text-foreground font-semibold"
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
          className="text-foreground font-semibold"
        >
          {strong[1]}
        </strong>
      )
      pos += strong[0].length
      continue
    }

    pushText(rest[0])
    pos += 1
  }

  return parts.length ? parts : [text]
}

/**
 * Category page hero (`seo.intro`): same inline mini-markdown as SEO body copy
 * (`**…**`, `[label](url)`, `` `pkg:…` ``, `{{count}}`, etc.).
 */
export function PatternCategoryHeroIntro({ intro }: { intro: string }) {
  return (
    <p className="text-site-muted-foreground mt-4 text-base leading-7 text-pretty">
      {renderSeoLinkedText(intro, "cat-hero-intro")}
    </p>
  )
}

/** Unified section title style (matches pattern SEO guide headings). */
export const SEO_BLOCK_TITLE_CLASS =
  "text-foreground text-xl font-semibold tracking-tight text-balance sm:text-2xl"

export function PatternCategoryRelatedComponents({
  block,
}: {
  block: RelatedComponentsBlock
}) {
  if (block.integrationBody?.length) {
    return (
      <section
        aria-labelledby="seo-related-components-heading"
        className="w-full space-y-6"
      >
        <h2
          id="seo-related-components-heading"
          className={SEO_BLOCK_TITLE_CLASS}
        >
          {block.title}
        </h2>

        <div className="text-site-muted-foreground w-full space-y-4 text-[15px] leading-7 text-pretty sm:text-base">
          {block.integrationBody.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>
              {renderSeoLinkedText(paragraph, `int${paragraphIndex}`)}
            </p>
          ))}
        </div>
      </section>
    )
  }

  if (block.links?.length) {
    return (
      <section
        aria-labelledby="seo-related-components-heading"
        className="w-full space-y-6"
      >
        <h2
          id="seo-related-components-heading"
          className={SEO_BLOCK_TITLE_CLASS}
        >
          {block.title}
        </h2>

        <ul className="text-site-muted-foreground grid gap-2 text-sm leading-7 sm:grid-cols-2 sm:text-base">
          {block.links.map((link) => (
            <li key={link.slug}>
              <SeoInlineLink href={`/patterns/${link.slug}`}>
                {link.label}
              </SeoInlineLink>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return null
}

/**
 * Popular Components cards: split long descriptions after "Covers …" / "Supports …" into a lead + bullet list.
 */
function extractComponentListLeadAndBullets(description: string): {
  lead: string
  bullets: string[]
} {
  const text = description.trim()
  const splitCovers = text.split(/\.\s*Covers\s+/i)
  const splitSupports = text.split(/\.\s*Supports\s+/i)

  let lead: string
  let rest: string

  if (splitCovers.length >= 2) {
    lead = splitCovers[0].trim()
    if (!lead.endsWith(".")) lead += "."
    rest = splitCovers.slice(1).join(". Covers ")
  } else if (splitSupports.length >= 2) {
    lead = splitSupports[0].trim()
    if (!lead.endsWith(".")) lead += "."
    rest = splitSupports.slice(1).join(". Supports ")
  } else {
    const dot = text.indexOf(". ")
    if (dot > 0) {
      lead = text.slice(0, dot + 1).trim()
      rest = text.slice(dot + 2).trim()
    } else {
      lead = text
      rest = ""
    }
  }

  const bullets = rest
    ? rest
        .split(/,\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2)
        .slice(0, 12)
    : []

  return { lead, bullets }
}

interface PatternCategorySeoContentProps {
  seo: PatternCategorySeo
}

export function PatternCategorySeoContent({
  seo,
}: PatternCategorySeoContentProps) {
  if (!seo.content && !seo.relatedComponents) {
    return null
  }

  const content = seo.content

  return (
    <section
      aria-labelledby={
        content
          ? "pattern-category-guide-title"
          : "seo-related-components-heading"
      }
      className="bg-site-muted/15"
    >
      <div className="w-full px-6 py-10 sm:px-8 sm:py-14 xl:px-10">
        <div className="mx-auto w-full max-w-7xl space-y-12">
          {content ? (
            <header className="w-full space-y-4">
              <h2
                id="pattern-category-guide-title"
                className={SEO_BLOCK_TITLE_CLASS}
              >
                {content.title}
              </h2>
              <div className="w-full space-y-3">
                {content.summary.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-site-muted-foreground w-full text-sm leading-7 text-pretty sm:text-base"
                  >
                    {renderSeoLinkedText(paragraph, `sum-${i}`)}
                  </p>
                ))}
              </div>
            </header>
          ) : null}

          {content?.sections?.length ? (
            <div className="w-full space-y-12">
              {content.sections.map((section, si) => (
                <section key={section.title} className="w-full space-y-4">
                  <h3 className={SEO_BLOCK_TITLE_CLASS}>{section.title}</h3>

                  {section.intro ? (
                    <p className="text-site-muted-foreground w-full text-sm leading-7 text-pretty sm:text-base">
                      {renderSeoLinkedText(section.intro, `sec-${si}-intro`)}
                    </p>
                  ) : null}

                  {section.componentList?.length ? (
                    <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                      {section.componentList.map((item) => {
                        const { lead, bullets } =
                          extractComponentListLeadAndBullets(item.description)
                        return (
                          <li
                            key={item.slug}
                            className="border-site-border/80 bg-site-background site-rounded-lg border p-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <SeoInlineLink
                                href={item.href}
                                className="text-base"
                              >
                                {item.title}
                              </SeoInlineLink>
                              {item.badge ? (
                                <SeoInlineBadge>{item.badge}</SeoInlineBadge>
                              ) : null}
                            </div>
                            {bullets.length > 0 ? (
                              <>
                                <p className="text-site-muted-foreground mt-2 text-sm leading-6 text-pretty">
                                  {renderSeoLinkedText(
                                    lead,
                                    `comp-${item.slug}-lead`
                                  )}
                                </p>
                                <ul className="text-site-muted-foreground mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 sm:list-outside">
                                  {bullets.map((b, bi) => (
                                    <li key={bi} className="text-pretty">
                                      {renderSeoLinkedText(
                                        b,
                                        `comp-${item.slug}-b${bi}`
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p className="text-site-muted-foreground mt-2 text-sm leading-6 text-pretty">
                                {renderSeoLinkedText(
                                  item.description,
                                  `comp-${item.slug}`
                                )}
                              </p>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}

                  {section.paragraphs?.map((paragraph, pi) => (
                    <p
                      key={pi}
                      className="text-site-muted-foreground w-full text-sm leading-7 text-pretty sm:text-base"
                    >
                      {renderSeoLinkedText(paragraph, `sec-${si}-p${pi}`)}
                    </p>
                  ))}

                  {section.featureItems?.length ? (
                    <ul className="text-site-muted-foreground w-full list-disc space-y-2 pl-6 text-sm leading-7 sm:list-outside sm:pl-7 sm:text-base">
                      {section.featureItems.map((item, fi) => {
                        const keyT = `sec-${si}-feat-${fi}-t`
                        const keyD = `sec-${si}-feat-${fi}-d`
                        if (isFeatureItemLinkColonTitle(item.title)) {
                          return (
                            <li
                              key={`sec-${si}-feat-${fi}`}
                              className="text-pretty"
                            >
                              {renderSeoLinkedText(item.title, keyT)}
                              <span aria-hidden="true">: </span>
                              {renderSeoLinkedText(item.description, keyD)}
                            </li>
                          )
                        }
                        return (
                          <li
                            key={`sec-${si}-feat-${fi}`}
                            className="text-pretty"
                          >
                            <span className="text-foreground font-medium">
                              {item.title}
                            </span>{" "}
                            {renderSeoLinkedText(item.description, keyD)}
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}

                  {section.bullets?.length ? (
                    <ul className="text-site-muted-foreground w-full list-disc space-y-2 pl-6 text-sm leading-7 sm:list-outside sm:pl-7 sm:text-base">
                      {section.bullets.map((bullet, bidx) => (
                        <li key={bullet} className="text-pretty">
                          {renderSeoLinkedText(
                            bullet,
                            `sec-${si}-bull-${bidx}`
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          ) : null}

          {seo.relatedComponents ? (
            <PatternCategoryRelatedComponents block={seo.relatedComponents} />
          ) : null}

          {content?.faqs?.length ? (
            <section
              aria-labelledby="seo-faq-heading"
              className="w-full space-y-6"
            >
              <h2 id="seo-faq-heading" className={SEO_BLOCK_TITLE_CLASS}>
                Frequently Asked Questions
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {content.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${index}`}
                    className="border-site-border/80"
                  >
                    <AccordionTrigger className="text-foreground [&[data-state=open]>svg]:text-site-primary py-3 text-left text-sm leading-snug font-medium hover:no-underline sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-site-muted-foreground text-sm leading-7 text-pretty sm:text-base">
                      {renderSeoLinkedText(faq.answer, `faq-${index}`)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  )
}
