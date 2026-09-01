"use client"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useCodeBlockConfig,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { cn } from "@/registry/bases/base/lib/utils"
import { ScrollArea, ScrollBar } from "@/registry/bases/base/ui/scroll-area"

/**
 * An excerpt that opens partway through a generated file, so the first row
 * reads 120 rather than 1. `startLine` only resets the gutter's CSS counter:
 * line specs keep addressing source lines, so moving the offset never
 * invalidates a `highlightedLines` value.
 */
const code = Array.from(
  { length: 26 },
  (_, index) =>
    `export const rule${index + 120} = { id: ${index + 120}, enabled: true }`
).join("\n")

/*
 * The collapse cap lives on the ScrollArea VIEWPORT and follows the block's
 * own `expanded` state through `useCodeBlockConfig`, so "Show more" releases
 * the cap and every scrollbar on this block is the shadcn one. `maxLines`
 * still marks the block collapsible; with the surface composed here it caps
 * nothing itself.
 */
function CollapsibleArea({ children }: { children: React.ReactNode }) {
  const { expanded } = useCodeBlockConfig("CollapsibleArea")

  return (
    <ScrollArea
      className={cn(
        "rounded-[inherit]",
        /* overflow-hidden makes collapsed mean collapsed - without it the
           reader could wheel through everything under the "Show more" fade.
           The 208px cap is chosen to LAND near maxLines' 8 rows, not derived
           from it. */
        !expanded &&
          "**:data-[slot=scroll-area-viewport]:max-h-52 **:data-[slot=scroll-area-viewport]:overflow-hidden"
      )}
    >
      {children}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        startLine={120}
        maxLines={8}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>rules.generated.ts</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
        <CollapsibleArea>
          <CodeBlockContent />
        </CollapsibleArea>
        <CodeBlockExpandButton />
      </CodeBlock>
    </div>
  )
}
