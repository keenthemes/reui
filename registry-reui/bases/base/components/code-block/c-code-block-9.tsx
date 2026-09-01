import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockWrapToggle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

/**
 * Terminal output has no grammar to tokenize, so `highlight={false}` skips the
 * highlighter and shiki is never loaded for this block. The wrap toggle still
 * works, because wrapping is a layout concern rather than a highlight one.
 */
const output = `$ turbo build --filter @acme/web
· Packages in scope: @acme/web
· Running build in 1 package
@acme/web:build: ▲ Next.js 16.3.0
@acme/web:build: Creating an optimized production build ...
@acme/web:build: ✓ Compiled successfully in 42.1s
@acme/web:build: Route (app)                                Size     First Load JS
@acme/web:build: ┌ ○ /                                      5.12 kB         112 kB
@acme/web:build: └ ○ /pricing                               2.94 kB         109 kB
 Tasks:    1 successful, 1 total
 Time:     48.331s`

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={output}
        language="bash"
        highlight={false}
        label="Build output"
      >
        <CodeBlockHeader>
          <CodeBlockTitle>Terminal</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            <CodeBlockWrapToggle />
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
