import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

const code = `export function useTotals(items: Item[]) {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    const tax = Math.round(subtotal * 0.2)
    return { subtotal, tax, total: subtotal + tax }
  }, [items])
}`

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock code={code} language="typescript" showLineNumbers>
        <CodeBlockHeader>
          <CodeBlockTitle>use-totals.ts</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
