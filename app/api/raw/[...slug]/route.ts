import fs from "node:fs/promises"
import path from "node:path"
import { NextResponse, type NextRequest } from "next/server"

const CONTENT_DIR = path.resolve(process.cwd(), "content")

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params

  // Reject slug segments that attempt path traversal
  if (slug.some((segment) => segment === ".." || segment === ".")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  // Construct the file path from the slug
  // If we have ['docs', 'filename'], look in (root) directory
  let filePath: string
  if (slug.length === 2 && slug[0] === "docs") {
    filePath = path.join(CONTENT_DIR, "docs", "(root)", slug[1] || "")
  } else {
    filePath = path.join(CONTENT_DIR, ...slug)
  }

  // Resolve and verify the path stays within the content directory
  const resolvedPath = path.resolve(filePath)
  if (!resolvedPath.startsWith(CONTENT_DIR)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  // Check for both .mdx and .md extensions
  const mdxPath = resolvedPath.endsWith(".mdx")
    ? resolvedPath
    : `${resolvedPath}.mdx`
  const mdPath = resolvedPath.endsWith(".md")
    ? resolvedPath
    : `${resolvedPath}.md`

  try {
    let content: string

    // Try .mdx first, then .md
    try {
      content = await fs.readFile(mdxPath, "utf-8")
    } catch {
      content = await fs.readFile(mdPath, "utf-8")
    }

    // Return raw markdown with appropriate headers
    return new NextResponse(content, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
