"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const broken = `export function totalDue(invoice: Invoice) {
  const lines = invoice.lines.map((line) => line.amount)
  const subtotal = lines.reduce((sum, amount) => sum + amount)
  return subtotal + invoice.tax
}`

const patched = `export function totalDue(invoice: Invoice) {
  const lines = invoice.lines.map((line) => line.amount)
  const subtotal = lines.reduce((sum, amount) => sum + amount, 0)
  return subtotal + invoice.tax
}`

export default function Pattern() {
  const [fixed, setFixed] = useState(false)

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={fixed ? patched : broken}
        language="typescript"
        showLineNumbers
        lineLevels={fixed ? undefined : { error: [3] }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>invoice.ts</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            {fixed ? (
              <>
                <Badge variant="success-light">Patch applied</Badge>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setFixed(false)}
                >
                  Undo
                </Button>
              </>
            ) : (
              <Badge variant="destructive-light">
                Empty array crashes reduce
              </Badge>
            )}
          </div>
        </CodeBlockHeader>

        {/*
          The action is scoped to the line that actually carries the diagnostic:
          the render prop receives that line's state, so one group serves the
          whole block and still only offers the fix where there is something to
          fix.
        */}
        <CodeBlockLineActions>
          {({ state }) =>
            state?.level === "error" ? (
              <Button size="xs" onClick={() => setFixed(true)}>
                <IconPlaceholder
                  lucide="SparklesIcon"
                  tabler="IconSparkles"
                  hugeicons="SparklesIcon"
                  phosphor="SparkleIcon"
                  remixicon="RiSparklingLine"
                />
                Fix with AI
              </Button>
            ) : null
          }
        </CodeBlockLineActions>
      </CodeBlock>
    </div>
  )
}
