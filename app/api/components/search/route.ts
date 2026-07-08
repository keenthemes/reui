import { NextResponse } from "next/server"

import { searchComponents } from "@/lib/components"

const MAX_QUERY_LEN = 200

// The component search index only changes per deploy, and Vercel purges the
// CDN on every deploy, so a long s-maxage is
// safe and keeps identical queries off the origin function (fewer
// invocations = lower Vercel cost).
const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
  "CDN-Cache-Control":
    "public, s-maxage=31536000, stale-while-revalidate=86400",
  "Vercel-CDN-Cache-Control":
    "public, s-maxage=31536000, stale-while-revalidate=86400",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = (searchParams.get("q") ?? "").slice(0, MAX_QUERY_LEN)
  const components = searchComponents(raw)

  return NextResponse.json({ components }, { headers: CACHE_HEADERS })
}
