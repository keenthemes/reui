import { NextResponse } from "next/server"

import { getComponentSourcePayload } from "@/lib/component-source-payload"
import { resolveRegistryOptions } from "@/lib/docs-registry-options"
import type { IconLibraryName } from "@/registry/config"

function getComponentSourceCacheHeaders(isVersioned: boolean) {
  if (!isVersioned) {
    return {
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "CDN-Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
      "Vercel-CDN-Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    }
  }

  return {
    "Cache-Control":
      "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable",
    "CDN-Cache-Control":
      "public, s-maxage=31536000, stale-while-revalidate=86400",
    "Vercel-CDN-Cache-Control":
      "public, s-maxage=31536000, stale-while-revalidate=86400",
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json(
      { error: "Missing component name" },
      { status: 400 }
    )
  }

  const { styleName, iconLibrary } = resolveRegistryOptions({
    styleName: searchParams.get("styleName"),
    iconLibrary: searchParams.get("iconLibrary") as IconLibraryName | null,
  })
  const version = searchParams.get("v")
  const rawMaxLines = searchParams.get("maxLines")
  const maxLines =
    rawMaxLines && /^\d+$/.test(rawMaxLines) ? Number(rawMaxLines) : undefined

  try {
    const payload = await getComponentSourcePayload({
      name,
      registryOrigin: requestUrl.origin,
      styleName,
      iconLibrary,
      maxLines,
    })

    if (!payload) {
      return NextResponse.json(
        { error: "Component source not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(payload, {
      headers: getComponentSourceCacheHeaders(Boolean(version)),
    })
  } catch (error) {
    console.error("Failed to load component source payload", error)
    return NextResponse.json(
      { error: "Failed to load component source" },
      { status: 500 }
    )
  }
}
