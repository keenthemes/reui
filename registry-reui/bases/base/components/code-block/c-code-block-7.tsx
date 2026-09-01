import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

const code = `const client = createClient({
  url: process.env.DATABASE_URL,
  maxConnections: 20,
  idleTimeoutMillis: 30000,
})

await client.connect()`

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        highlightedLines="2-4"
        highlightedWords={["createClient", "maxConnections"]}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>db/client.ts</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
