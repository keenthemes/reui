import Link from "next/link"
import { notFound } from "next/navigation"
import { getMDXComponents } from "@/mdx-components"
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react"
import fm from "front-matter"
import { findNeighbour } from "fumadocs-core/page-tree"
import { createRelativeLink } from "fumadocs-ui/mdx"
import z from "zod"

import { siteConfig } from "@/lib/config"
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo"
import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DocsCopyPage } from "@/components/docs-copy-page"
import { getDocsPageTree } from "@/components/docs-page-tree"
import { DocsTableOfContents } from "@/components/docs-toc"
import { JsonLd } from "@/components/json-ld"

/**
 * Prebuild EVERY plain docs page (fumadocs source enumeration). Without
 * this the route had no static params, so pages like /docs/get-started
 * were never prerendered - each request rendered on demand by
 * RESUMING the route's fallback-shell postponed state, and on production
 * deploy skew that resume threw "Couldn't find all resumable slots"
 * on every docs hit. With the pages prebuilt (and the header auth island
 * now client-rendered), each docs page is a fully static prerender with
 * zero postponed state - nothing left to mis-resume on any deploy.
 */
export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data

  return buildPageMetadata({
    title: doc.title,
    description: doc.description ?? siteConfig.description,
    path: page.url,
    type: "article",
  })
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data
  const { body: MDX, toc } = await doc.load()
  const neighbours = findNeighbour(getDocsPageTree(), page.url)
  const raw = await page.data.getText("raw")
  const { attributes } = fm(raw)
  const { links } = z
    .object({
      links: z
        .object({
          doc: z.string().optional(),
          api: z.string().optional(),
        })
        .optional(),
    })
    .parse(attributes)

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ReUI", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: doc.title, path: page.url },
        ])}
      />
      {/* Same title/description generateMetadata uses, so the canonical
          and the structured data always agree. */}
      <JsonLd
        data={buildArticleJsonLd({
          title: doc.title,
          description: doc.description ?? siteConfig.description,
          path: page.url,
        })}
      />
      <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-(--top-spacing) shrink-0" />
          <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                    {doc.title}
                  </h1>
                  <div className="docs-nav bg-site-background/80 border-site-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                    <DocsCopyPage page={raw} url={absoluteUrl(page.url)} />

                    {neighbours.previous && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="extend-touch-target ml-auto hidden size-8 shadow-none md:size-7"
                        asChild
                      >
                        <Link href={neighbours.previous.url} prefetch={false}>
                          <IconArrowLeft />
                          <span className="sr-only">Previous</span>
                        </Link>
                      </Button>
                    )}
                    {neighbours.next && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="extend-touch-target hidden size-8 shadow-none md:size-7"
                        asChild
                      >
                        <Link href={neighbours.next.url} prefetch={false}>
                          <span className="sr-only">Next</span>
                          <IconArrowRight />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                {doc.description ? (
                  <p className="text-site-muted-foreground text-[1.05rem] sm:text-base">
                    {doc.description}
                  </p>
                ) : null}
              </div>
              {links ? (
                <div className="flex items-center gap-2 pt-4">
                  {links.doc && (
                    <Badge
                      asChild
                      variant="secondary"
                      className="site-rounded-full"
                    >
                      <a href={links.doc} target="_blank" rel="noreferrer">
                        Docs <IconArrowUpRight />
                      </a>
                    </Badge>
                  )}
                  {links.api && (
                    <Badge
                      asChild
                      variant="secondary"
                      className="site-rounded-full"
                    >
                      <a href={links.api} target="_blank" rel="noreferrer">
                        API Reference <IconArrowUpRight />
                      </a>
                    </Badge>
                  )}
                </div>
              ) : null}
            </div>
            <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
              <MDX
                components={getMDXComponents({
                  a: createRelativeLink(source, page),
                })}
              />
            </div>
          </div>
          <div className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-0">
            {neighbours.previous && (
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="shadow-none"
              >
                <Link href={neighbours.previous.url} prefetch={false}>
                  <IconArrowLeft /> {neighbours.previous.name}
                </Link>
              </Button>
            )}
            {neighbours.next && (
              <Button
                variant="secondary"
                size="sm"
                className="ml-auto shadow-none"
                asChild
              >
                <Link href={neighbours.next.url} prefetch={false}>
                  {neighbours.next.name} <IconArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
          <div className="h-(--top-spacing) shrink-0" />
          {toc?.length ? (
            <div className="no-scrollbar overflow-y-auto px-8">
              <DocsTableOfContents toc={toc} />
              <div className="h-12" />
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
