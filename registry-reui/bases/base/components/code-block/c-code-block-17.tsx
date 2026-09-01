"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockWrapToggle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Separator } from "@/registry/bases/base/ui/separator"

const code = `export const contentSecurityPolicy = "default-src 'self'; script-src 'self' 'nonce-{NONCE}' https://cdn.example.com; style-src 'self' 'nonce-{NONCE}'; img-src 'self' data: https://images.example.com; font-src 'self' data:; connect-src 'self' https://api.example.com"`

export default function Pattern() {
  // Controlled wrap: `wrap` plus `onWrapChange` moves the state up to the page,
  // so the toggle and the status chip read one value. `defaultWrap` would keep
  // it inside the block, leaving the header nothing to render.
  const [wrap, setWrap] = useState(true)

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        wrap={wrap}
        onWrapChange={setWrap}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>security-headers.ts</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            <Badge variant="info-light">{wrap ? "Wrapped" : "Scrolling"}</Badge>
            <CodeBlockWrapToggle size="xs" />
            <Separator orientation="vertical" className="h-4" />
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
