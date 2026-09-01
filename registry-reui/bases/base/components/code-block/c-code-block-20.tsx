import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

const code = `export function Hero({ headline, snippet }: HeroProps) {
  const seats = useSeatCount()

  return (
    <section className="dark bg-background py-24">
      <h1 className="text-4xl font-semibold">{headline}</h1>
      <img src={cover} />
      <pre className="overflow-x-auto">{snippet}</pre>
      <CodeBlock code={snippet} language="tsx" showLineNumbers />
      <a onClick={goToPricing}>Start free</a>
      <p>{seats} seats claimed</p>
    </section>
  )
}`

/*
 * A block that stays dark in both site themes, the way marketing pages and
 * landing heroes usually want code to read. The `dark` class on the wrapper
 * re-scopes every semantic token inside it, so the primitive needs nothing:
 * the highlight, both diff tints, the three diagnostic levels and the word
 * mark all resolve against the dark palette here instead of the page's.
 */
export default function Pattern() {
  return (
    <div className="dark w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="tsx"
        showLineNumbers
        highlightedLines={[5]}
        highlightedWords={["useSeatCount"]}
        diff={{ removed: [8], added: [9] }}
        lineLevels={{ error: [10], warning: [7], info: [11] }}
      >
        <CodeBlockHeader>
          <span
            aria-hidden="true"
            className="flex shrink-0 items-center gap-1.5"
          >
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <CodeBlockTitle className="ml-1">hero.tsx</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
