"use client"

import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

/**
 * Diff styling expressed as notation inside the source rather than as props.
 * `transformers` is a straight pass-through to shiki, so `@shikijs/transformers`
 * works without the primitive knowing about it. The directive above is required:
 * this object carries a method, and functions cannot cross a server boundary.
 */
const notationDiff = {
  line(node: { properties: Record<string, unknown> }, line: number) {
    if (line === 2) node.properties.class = "line diff remove"
    if (line === 3) node.properties.class = "line diff add"
  },
}

const code = `export function slugify(input: string) {
  return input.toLowerCase().replace(/ /g, "-")
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
}`

/* The array itself must be module-scope: `transformers` is a reference dep
   of the highlight effect, so a fresh array each render re-tokenizes. */
const transformers = [notationDiff]

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        transformers={transformers}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>slugify.ts</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
