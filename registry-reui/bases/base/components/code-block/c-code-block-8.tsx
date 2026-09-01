"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Button } from "@/registry/bases/base/ui/button"

const code = `export async function checkout(cart: Cart) {
  const totals = computeTotals(cart)

  const session = await payments.createSession({
    amount: totals.total,
    currency: cart.currency,
  })

  await audit.record("checkout.started", session.id)
  return session
}`

const steps = [
  { label: "Totals", lines: "2" },
  { label: "Payment session", lines: "4-7" },
  { label: "Audit", lines: "9-10" },
]

/*
 * `focusedLines` keeps a step sharp and dims the rest - unlike highlighting,
 * which adds emphasis without taking any away. Hovering the block restores
 * everything, so the surrounding code is one glance away.
 */
export default function Pattern() {
  const [step, setStep] = useState(0)

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        focusedLines={steps[step].lines}
      >
        <CodeBlockHeader className="gap-1.5">
          <CodeBlockTitle>checkout.ts</CodeBlockTitle>
          <div
            role="group"
            aria-label="Walkthrough step"
            className="ml-auto flex items-center gap-1"
          >
            {steps.map((entry, index) => (
              <Button
                key={entry.label}
                aria-pressed={index === step}
                size="xs"
                variant={index === step ? "secondary" : "ghost"}
                onClick={() => setStep(index)}
              >
                {entry.label}
              </Button>
            ))}
          </div>
          <Badge variant="primary-light">
            {step + 1}/{steps.length}
          </Badge>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
