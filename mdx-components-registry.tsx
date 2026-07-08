import dynamic from "next/dynamic"
import { getMDXComponents as getBaseMDXComponents } from "@/mdx-components"
import type { MDXComponents } from "mdx/types"

const DocsComponentPreview = dynamic(() =>
  import("@/components/docs-component-preview").then(
    (mod) => mod.DocsComponentPreview
  )
)

const DocsComponentSource = dynamic(() =>
  import("@/components/docs-component-source").then(
    (mod) => mod.DocsComponentSource
  )
)

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...getBaseMDXComponents(components),
    ComponentPreview: DocsComponentPreview,
    ComponentSource: DocsComponentSource,
  }
}

export const mdxComponents = getMDXComponents()
