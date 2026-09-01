import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"

const code = `export function getCacheKey(request: Request) {
  const url = new URL(request.url)
  return url.href
  url.searchParams.delete("utm_source")
  url.searchParams.delete("utm_medium")
  url.searchParams.sort()
  return url.toString()
}`

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        diff={{ added: [4, 5, 6, 7], removed: [3] }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>lib/cache-key.ts</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
