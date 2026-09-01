"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"

import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/bases/radix/ui/card"

const patch = `export async function retryPayment(orderId: string) {
  const order = await orders.find(orderId)
  await payments.charge(order)
  const receipt = await payments.charge(order, { idempotencyKey: orderId })
  await notify.customer(order, receipt)
  return receipt
}`

/*
 * `variant="ghost"` drops the block's own border and background so the Card
 * supplies the chrome exactly once; the zeroed Card padding is what lets the
 * ghost surface sit flush against the footer.
 */
export default function Pattern() {
  const [decision, setDecision] = useState<"accepted" | "rejected" | null>(null)

  return (
    <Card className="w-full max-w-2xl gap-0 py-0">
      <CardContent className="p-0">
        <CodeBlock
          code={patch}
          language="typescript"
          showLineNumbers
          variant="ghost"
          diff={{ added: [4, 5, 6], removed: [3] }}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>billing/retry-payment.ts</CodeBlockTitle>
            <div className="ml-auto flex items-center gap-1.5">
              <Badge variant="success-light">+3</Badge>
              <Badge variant="destructive-light">-1</Badge>
            </div>
          </CodeBlockHeader>
        </CodeBlock>
      </CardContent>

      <CardFooter className="border-border bg-muted/40 border-t px-3 py-2!">
        <span className="text-muted-foreground text-xs">
          {decision === null && "Agent proposed this change"}
          {decision === "accepted" && "Change applied to the branch"}
          {decision === "rejected" && "Change discarded"}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {decision === null ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDecision("rejected")}
              >
                Reject
              </Button>
              <Button size="sm" onClick={() => setDecision("accepted")}>
                Accept
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setDecision(null)}>
              Undo
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
