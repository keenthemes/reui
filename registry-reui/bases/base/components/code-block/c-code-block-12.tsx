"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Button } from "@/registry/bases/base/ui/button"

const code = `function applyDiscount(order: Order) {
  if (order.coupon) {
    const rate = COUPONS[order.coupon]
    order.total = order.total * (1 - rate)
  }
  return order
}`

/*
  Selection arrives sorted but not necessarily contiguous, so a range label
  would lie about a click on 2 and 6. Count is the only honest summary.
*/
function describe(lines: number[]) {
  if (!lines.length) return "Select lines to ask about them"
  if (lines.length === 1) return `Ask about line ${lines[0]}`
  return `Ask about ${lines.length} lines`
}

export default function Pattern() {
  const [selected, setSelected] = useState<number[]>([])

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        selectable
        selectedLines={selected}
        onSelectedLinesChange={setSelected}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>discount.ts</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            {selected.length > 0 && (
              <Badge variant="primary-light">{selected.length} selected</Badge>
            )}
            <span className="text-muted-foreground text-xs">
              Click a line, shift-click to extend
            </span>
          </div>
        </CodeBlockHeader>
      </CodeBlock>

      <div className="flex items-center gap-2">
        <Button size="sm" disabled={!selected.length}>
          {describe(selected)}
        </Button>
        {selected.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
