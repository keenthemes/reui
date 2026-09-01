import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"
import type { CodeBlockLine } from "@/registry-reui/bases/radix/reui/code-block/code-block"

const source = `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`

/**
 * Lines built without shiki, to show the shape any highlighter can produce.
 *
 * The same array is what a server component gets back from `highlightCode` and
 * hands over the RSC boundary, so this is also the pre-highlighted path: the
 * client never loads a grammar.
 */
const lines: CodeBlockLine[] = source.split("\n").map((text, index) => ({
  number: index + 1,
  text,
  tokens: text
    .split(/(\b(?:def|for|in|return)\b)/)
    .filter(Boolean)
    .map((content) => ({
      content,
      ...(/^(def|for|in|return)$/.test(content)
        ? { color: "#cf222e", colorDark: "#ff7b72" }
        : {}),
    })),
}))

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock lines={lines} showLineNumbers label="Python code">
        <CodeBlockHeader>
          <CodeBlockTitle>fib.py</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">
              No shiki on the client
            </span>
            <CodeBlockCopyButton value={source} />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
