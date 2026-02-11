import { NextResponse, type NextRequest } from "next/server"

import { formatCode } from "@/lib/code-utils"
import { highlightCode } from "@/lib/highlight-code"
import { transformIcons } from "@/lib/icons"
import { getRegistryItem } from "@/lib/registry"
import { IconLibraryName } from "@/registry/config"

export const revalidate = 86400 // ISR: cache each unique URL for 24 hours

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const { searchParams } = new URL(request.url)
  const styleName = searchParams.get("styleName") || undefined
  const iconLibrary =
    (searchParams.get("iconLibrary") as IconLibraryName) || undefined

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  try {
    const item = await getRegistryItem(name, styleName, iconLibrary)

    if (!item) {
      return NextResponse.json(
        { error: "Registry item not found" },
        { status: 404 }
      )
    }

    const rawCode = item.files?.[0]?.content

    if (!rawCode) {
      return NextResponse.json(
        { error: "Source code not found" },
        { status: 404 }
      )
    }

    // Process code (fix imports, exports)
    let processedCode = await formatCode(rawCode, styleName || "base-nova")
    processedCode = processedCode
      .replaceAll("/* eslint-disable react/no-children-prop */\n", "")
      .trim()

    // Highlight the code
    let highlightedCode = await highlightCode(processedCode)

    // Clean up registry paths in highlighted code
    highlightedCode = highlightedCode
      .replaceAll("@/registry/shadcn/base/", "@/components/ui/")
      .replaceAll("@/registry/shadcn/radix/", "@/components/ui/")
      .replaceAll("@/registry/default/reui/", "@/components/reui/")

    return NextResponse.json({
      name,
      rawCode: processedCode,
      highlightedCode,
    })
  } catch (error) {
    console.error("Error fetching registry item:", error)
    return NextResponse.json(
      { error: "Failed to fetch registry item" },
      { status: 500 }
    )
  }
}
