import {
  generateComponentDocMetadata,
  renderComponentDocPage,
} from "@/app/docs/_lib/component-doc-page"
import { CANONICAL_COMPONENT_DOC_SLUGS } from "@/lib/component-doc-paths"

export function generateStaticParams() {
  return CANONICAL_COMPONENT_DOC_SLUGS.flatMap((component) => [
    { base: "base", component },
    { base: "radix", component },
  ])
}

export async function generateMetadata(props: {
  params: Promise<{ base: string; component: string }>
}) {
  const { base, component } = await props.params

  return generateComponentDocMetadata({ base, component })
}

export default async function Page(props: {
  params: Promise<{ base: string; component: string }>
}) {
  const { base, component } = await props.params

  return renderComponentDocPage({ base, component })
}
