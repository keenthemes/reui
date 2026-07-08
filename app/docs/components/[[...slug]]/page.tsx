import { notFound } from "next/navigation"

import {
  generateComponentDocMetadata,
  renderComponentDocPage,
} from "@/app/docs/_lib/component-doc-page"
import { CANONICAL_COMPONENT_DOC_SLUGS } from "@/lib/component-doc-paths"

export function generateStaticParams() {
  return CANONICAL_COMPONENT_DOC_SLUGS.flatMap((component) => [
    { slug: [component] },
    { slug: ["base", component] },
    { slug: ["radix", component] },
  ])
}

function resolveLegacyComponentDocSlug(slug: string[] | undefined) {
  if (!slug?.length) {
    notFound()
  }

  if (slug.length === 1) {
    return {
      base: "base",
      component: slug[0],
    }
  }

  if (slug.length === 2 && (slug[0] === "base" || slug[0] === "radix")) {
    return {
      base: slug[0],
      component: slug[1],
    }
  }

  notFound()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const resolved = resolveLegacyComponentDocSlug(params.slug)

  return generateComponentDocMetadata(resolved)
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const resolved = resolveLegacyComponentDocSlug(params.slug)

  return renderComponentDocPage(resolved)
}
