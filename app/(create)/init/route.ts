import { NextResponse, type NextRequest } from "next/server"
import { registryItemSchema } from "shadcn/schema"

import { isBaseAvailable } from "@/lib/registry-bases"
import { buildRegistryBase, designSystemConfigSchema } from "@/registry/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const result = designSystemConfigSchema.safeParse({
      base: searchParams.get("base"),
      style: searchParams.get("style"),
      iconLibrary: searchParams.get("iconLibrary"),
      baseColor: searchParams.get("baseColor"),
      theme: searchParams.get("theme"),
      font: searchParams.get("font"),
      menuAccent: searchParams.get("menuAccent"),
      menuColor: searchParams.get("menuColor"),
      radius: searchParams.get("radius"),
      template: searchParams.get("template"),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    // designSystemConfigSchema builds its base enum from the mirror, so it
    // accepts every shadcn base including ones this repo does not ship.
    // Reject those instead of returning an install target (and a runtime
    // dependency such as react-aria-components) backed by no content.
    if (!isBaseAvailable(result.data.base)) {
      return NextResponse.json(
        { error: `Unsupported base: ${result.data.base}` },
        { status: 400 }
      )
    }

    const registryBase = buildRegistryBase(result.data)
    const parseResult = registryItemSchema.safeParse(registryBase)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid registry base item",
          details: parseResult.error.format(),
        },
        { status: 500 }
      )
    }

    return NextResponse.json(parseResult.data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    )
  }
}
