import {
  ansiToLines,
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"

/*
 * Real agent stdout arrives with SGR escapes in it. `ansiToLines` turns them
 * into renderable tokens - 16-colour, 256-colour and truecolor foregrounds,
 * bold and underline - and the block's copy button still receives clean text,
 * because the parser records each line's text with the escapes stripped.
 * The 16 base slots re-tint through `--code-ansi-*` variables.
 */
const stdout = [
  "\u001b[1m$ vitest run tests/checkout\u001b[0m",
  "",
  " \u001b[32m✓\u001b[0m tests/checkout/totals.test.ts \u001b[90m(8 tests)\u001b[0m \u001b[33m41ms\u001b[0m",
  " \u001b[32m✓\u001b[0m tests/checkout/coupons.test.ts \u001b[90m(5 tests)\u001b[0m \u001b[33m12ms\u001b[0m",
  " \u001b[31m✗\u001b[0m tests/checkout/refunds.test.ts \u001b[90m(3 tests)\u001b[0m",
  "   \u001b[31mAssertionError\u001b[0m: expected \u001b[36m402\u001b[0m to be \u001b[36m204\u001b[0m",
  "   \u001b[90mat\u001b[0m refunds.test.ts\u001b[90m:\u001b[0m\u001b[33m18\u001b[0m",
  "",
  " \u001b[1mTests\u001b[0m  \u001b[32m13 passed\u001b[0m \u001b[90m|\u001b[0m \u001b[31m1 failed\u001b[0m \u001b[90m(14)\u001b[0m",
].join("\n")

const lines = ansiToLines(stdout)

export default function Pattern() {
  return (
    <div className="dark w-full max-w-2xl">
      <CodeBlock lines={lines} label="Test run output">
        <CodeBlockHeader>
          <CodeBlockTitle>Terminal</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
