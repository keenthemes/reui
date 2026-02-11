import { NextResponse, type NextRequest } from "next/server"

import {
  getAllRegistryItemNames,
  getRegistryItemForApi,
  parseStyleName,
} from "@/lib/registry-server"

// Default style when accessing /r/[name].json without style prefix
const DEFAULT_STYLE = "radix-nova"

// Hybrid mode configuration for 10,000+ patterns:
// - generateStaticParams pre-builds default style at build time
// - Other styles are generated on-demand and cached
// - ISR revalidates every 24 hours
export const dynamicParams = true // Allow on-demand generation for non-prebuilt paths
export const revalidate = 86400 // Cache for 24 hours (ISR)

type RouteParams = {
  params: Promise<{ path: string[] }>
}

/**
 * Handle registry item requests
 * - /r/p-accordion.json -> uses default style (radix-nova)
 * - /r/radix-nova/p-accordion.json -> uses explicit style
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { path } = await params

  if (!path || path.length === 0) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 })
  }

  let styleName = DEFAULT_STYLE
  let itemName: string

  if (path.length === 1) {
    // Format: /r/p-accordion.json
    const name = path[0]
    if (!name.endsWith(".json")) {
      return NextResponse.json(
        { error: "Registry item must end with .json" },
        { status: 400 }
      )
    }
    itemName = name.replace(".json", "")
  } else if (path.length === 2) {
    // Format: /r/radix-nova/p-accordion.json
    styleName = path[0]
    const name = path[1]
    if (!name.endsWith(".json")) {
      return NextResponse.json(
        { error: "Registry item must end with .json" },
        { status: 400 }
      )
    }
    itemName = name.replace(".json", "")

    // Validate and normalize the style name
    const { base, style } = parseStyleName(styleName)
    styleName = `${base}-${style}`
  } else {
    return NextResponse.json(
      {
        error:
          "Invalid path format. Expected /r/[style]/[name].json or /r/[style]/[name].json",
      },
      { status: 400 }
    )
  }

  try {
    const registryItem = await getRegistryItemForApi(itemName, styleName)

    if (!registryItem) {
      return NextResponse.json(
        { error: "Registry item not found" },
        { status: 404 }
      )
    }

    // Transform local registryDependencies to full URLs so shadcn CLI can resolve them
    if (registryItem.registryDependencies) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"
      const localNames = getAllRegistryItemNames()

      registryItem.registryDependencies = registryItem.registryDependencies.map(
        (dep) => {
          if (localNames.includes(dep)) {
            // If the item was requested with a style prefix in the path, use it for dependencies too
            if (path.length === 2) {
              return `${baseUrl}/r/${path[0]}/${dep}.json`
            }
            return `${baseUrl}/r/${dep}.json`
          }
          return dep
        }
      )
    }

    return NextResponse.json(registryItem)
  } catch (error) {
    console.error("Error generating registry item:", error)
    return NextResponse.json(
      { error: "Failed to generate registry item" },
      { status: 500 }
    )
  }
}

// Pre-generate default style patterns at build time (hybrid mode)
// Other styles are generated on-demand and cached via ISR
export async function generateStaticParams() {
  const itemNames = getAllRegistryItemNames()
  const params: { path: string[] }[] = []

  // Only pre-generate default style (radix-nova) at build time
  // This keeps build time manageable for 10,000+ patterns
  // Style-specific paths like /r/base-nova/p-accordion.json are generated on-demand
  for (const itemName of itemNames) {
    params.push({
      path: [`${itemName}.json`],
    })
  }

  // Optionally pre-generate the most popular style (radix-nova explicit path)
  for (const itemName of itemNames) {
    params.push({
      path: [DEFAULT_STYLE, `${itemName}.json`],
    })
  }

  return params
}
