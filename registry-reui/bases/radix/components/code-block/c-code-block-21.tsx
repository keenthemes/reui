import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"
import type { CodeBlockLine } from "@/registry-reui/bases/radix/reui/code-block/code-block"

/*
 * Terminal output with ANSI-style color, built as plain `lines`. Each token
 * carries its own light and dark color, so no grammar and no highlighter run:
 * this is the shape a PTY or CI log renderer would hand the block directly.
 */
const ok = { color: "#1a7f37", colorDark: "#3fb950" }
const err = { color: "#cf222e", colorDark: "#f85149" }
const dim = { color: "#59636e", colorDark: "#8b949e" }
const cyan = { color: "#0969da", colorDark: "#58a6ff" }

const rows: { tokens: CodeBlockLine["tokens"] }[] = [
  { tokens: [{ content: "$ ", ...dim }, { content: "vitest run" }] },
  {
    tokens: [
      { content: "RUN ", ...cyan },
      { content: "v4.1.9 ", ...dim },
      { content: "~/acme/web", ...dim },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { content: "✓ ", ...ok },
      { content: "tests/checkout.test.ts " },
      { content: "(12 tests) 84ms", ...dim },
    ],
  },
  {
    tokens: [
      { content: "✓ ", ...ok },
      { content: "tests/pricing.test.ts " },
      { content: "(9 tests) 41ms", ...dim },
    ],
  },
  {
    tokens: [
      { content: "✗ ", ...err },
      { content: "tests/session.test.ts " },
      { content: "(1 failed) 102ms", ...dim },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { content: "FAIL ", ...err },
      { content: "session refresh keeps the device id" },
    ],
  },
  {
    tokens: [
      { content: "  expected ", ...dim },
      { content: '"dev_4812"', ...ok },
      { content: " to equal ", ...dim },
      { content: '"dev_4811"', ...err },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { content: "Tests ", ...dim },
      { content: "1 failed", ...err },
      { content: " | ", ...dim },
      { content: "21 passed", ...ok },
      { content: " (22)", ...dim },
    ],
  },
]

const lines: CodeBlockLine[] = rows.map((row, index) => ({
  ...row,
  number: index + 1,
  text: row.tokens.map((token) => token.content).join(""),
}))

const raw = lines.map((line) => line.text).join("\n")

export default function Pattern() {
  return (
    /* Forced dark, like a real test log; c-code-block-20 explains the
       wrapper. `lines` skips the client highlighter entirely - these rows
       were coloured ahead of time, so the copy button is handed the raw
       text explicitly. */
    <div className="dark w-full max-w-2xl">
      <CodeBlock lines={lines} label="Test run output">
        <CodeBlockHeader>
          <CodeBlockTitle>vitest</CodeBlockTitle>
          <CodeBlockCopyButton value={raw} className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
