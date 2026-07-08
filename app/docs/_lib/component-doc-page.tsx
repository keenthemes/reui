import Link from "next/link"
import { notFound } from "next/navigation"
import { getMDXComponents } from "@/mdx-components-registry"
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react"
import fm from "front-matter"
import { findNeighbour } from "fumadocs-core/page-tree"
import { createRelativeLink } from "fumadocs-ui/mdx"
import z from "zod"

import {
  canonicalizeComponentDocUrl,
  isCanonicalComponentDoc,
} from "@/lib/component-doc-paths"
import { siteConfig } from "@/lib/config"
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  getComponentDocSeo,
} from "@/lib/seo"
import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DocsBaseSwitcher } from "@/components/docs-base-switcher"
import { DocsComponentExamplesSection } from "@/components/docs-component-examples-section"
import { DocsCopyPage } from "@/components/docs-copy-page"
import { getDocsPageTree } from "@/components/docs-page-tree"
import { DocsTableOfContents } from "@/components/docs-toc"
import { JsonLd } from "@/components/json-ld"

type DocBase = "base" | "radix"

function normalizeDocBase(base: string): DocBase {
  if (base === "base" || base === "radix") {
    return base
  }

  notFound()
}

function getComponentSeo(
  component: string,
  title: string,
  base: DocBase,
  description?: string
) {
  if (!isCanonicalComponentDoc(component)) {
    return null
  }

  return getComponentDocSeo(component, title, base, description)
}

function getDocLinks(raw: string) {
  const { attributes } = fm(raw)

  return z
    .object({
      links: z
        .object({
          doc: z.string().optional(),
          api: z.string().optional(),
        })
        .optional(),
    })
    .parse(attributes).links
}

export async function generateComponentDocMetadata({
  base,
  component,
}: {
  base: string
  component: string
}) {
  const resolvedBase = normalizeDocBase(base)
  const page = source.getPage([resolvedBase, component])

  if (!page) {
    notFound()
  }

  const doc = page.data
  const componentSeo = getComponentSeo(
    component,
    doc.title,
    resolvedBase,
    doc.description
  )

  return buildPageMetadata({
    title: componentSeo?.title ?? doc.title,
    description:
      componentSeo?.description ?? doc.description ?? siteConfig.description,
    path: componentSeo?.canonicalPath ?? page.url,
    type: "article",
    robots:
      componentSeo && !componentSeo.shouldIndex
        ? {
            index: false,
            follow: true,
          }
        : undefined,
  })
}

export async function renderComponentDocPage({
  base,
  component,
}: {
  base: string
  component: string
}) {
  const resolvedBase = normalizeDocBase(base)
  const page = source.getPage([resolvedBase, component])

  if (!page) {
    notFound()
  }

  const doc = page.data
  const { body: MDX, toc } = await doc.load()
  const neighbours = findNeighbour(getDocsPageTree(), page.url)
  const raw = await page.data.getText("raw")
  const links = getDocLinks(raw)
  const componentSeo = getComponentSeo(
    component,
    doc.title,
    resolvedBase,
    doc.description
  )
  const breadcrumbPath = componentSeo?.canonicalPath ?? page.url
  const docHeadingTitle = componentSeo?.displayTitle ?? doc.title
  const docLead = componentSeo?.leadDescription ?? doc.description ?? undefined

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ReUI", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: docHeadingTitle, path: breadcrumbPath },
        ])}
      />
      <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-(--top-spacing) shrink-0" />
          <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                    {docHeadingTitle}
                  </h1>
                  <div className="docs-nav bg-site-background/80 border-site-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                    <DocsCopyPage
                      page={raw}
                      url={absoluteUrl(breadcrumbPath)}
                    />

                    {neighbours.previous && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="extend-touch-target ml-auto hidden size-8 shadow-none md:size-7"
                        asChild
                      >
                        <Link
                          href={canonicalizeComponentDocUrl(
                            neighbours.previous.url
                          )}
                          prefetch={false}
                        >
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
                        <Link
                          href={canonicalizeComponentDocUrl(
                            neighbours.next.url
                          )}
                          prefetch={false}
                        >
                          <span className="sr-only">Next</span>
                          <IconArrowRight />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                {docLead ? (
                  <p className="text-site-muted-foreground text-[1.05rem] sm:text-base">
                    {docLead}
                  </p>
                ) : null}
              </div>
              <DocsBaseSwitcher
                base={resolvedBase}
                component={component}
                className="mt-4"
              />
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
            <DocsComponentExamplesSection
              componentSlug={component}
              docBase={resolvedBase}
            />
          </div>
          <div className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-0">
            {neighbours.previous && (
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="shadow-none"
              >
                <Link
                  href={canonicalizeComponentDocUrl(neighbours.previous.url)}
                  prefetch={false}
                >
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
                <Link
                  href={canonicalizeComponentDocUrl(neighbours.next.url)}
                  prefetch={false}
                >
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
