import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"
import { Frame, FramePanel } from "@/registry-reui/bases/base/reui/frame"

const before = `function total(items) {
  let sum = 0
  for (let i = 0; i < items.length; i++) {
    sum = sum + items[i].price
  }
  return sum
}`

const after = `const total = (items) =>
  items.reduce((sum, item) => sum + item.price, 0)`

/**
 * A non-dense frame keeps the two panels apart, so the before and after read
 * as separate surfaces rather than one split pane.
 *
 * `p-0!` needs the important marker: FramePanel sets `px-(--frame-panel-px)`,
 * and Tailwind emits the axis utility after the `p-*` shorthand, so a plain
 * `p-0` loses. Without it the ghost blocks sit inset twice, once for the panel
 * and again for the block's own padding.
 */
export default function Pattern() {
  return (
    <Frame className="w-full max-w-2xl">
      <FramePanel className="p-0!">
        <CodeBlock
          code={before}
          language="typescript"
          variant="ghost"
          showLineNumbers
        >
          <CodeBlockHeader>
            <CodeBlockTitle>Before</CodeBlockTitle>
            <CodeBlockCopyButton className="ml-auto" />
          </CodeBlockHeader>
        </CodeBlock>
      </FramePanel>
      <FramePanel className="p-0!">
        <CodeBlock
          code={after}
          language="typescript"
          variant="ghost"
          showLineNumbers
        >
          <CodeBlockHeader>
            <CodeBlockTitle>After</CodeBlockTitle>
            <CodeBlockCopyButton className="ml-auto" />
          </CodeBlockHeader>
        </CodeBlock>
      </FramePanel>
    </Frame>
  )
}
