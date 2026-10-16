"use client"

import * as React from "react"
import { CodeBlock } from "@/registry-reui/bases/radix/reui/code-block/code-block"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/radix/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type Attempt = {
  number: number
  at: string
  ok: boolean
  title: string
  body: string
  language: "json" | "bash"
}

const PAYLOAD = `{
  "id": "evt_3Q9xLm2",
  "type": "invoice.paid",
  "invoice": "in_1Q9xKt",
  "amount_paid": 18400
}`

const HISTORY: Attempt[] = [
  {
    number: 1,
    at: "14:02:11",
    ok: false,
    title: "Attempt 1 timed out after 30s",
    body: "No response from hooks.northwind.dev within 30000 ms",
    language: "bash",
  },
  {
    number: 2,
    at: "14:03:12",
    ok: false,
    title: "Attempt 2 failed with 500",
    body: `{ "error": "database is in recovery mode" }`,
    language: "json",
  },
  {
    number: 3,
    at: "14:07:40",
    ok: true,
    title: "Attempt 3 delivered, 200 in 214 ms",
    body: PAYLOAD,
    language: "json",
  },
]

// Resend appends an attempt instead of replacing the last one.
export default function Pattern() {
  const [attempts, setAttempts] = React.useState(HISTORY)
  const [sending, setSending] = React.useState(false)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    if (!sending) return
    const timer = window.setTimeout(() => {
      // The clock is read in the timer, never during render.
      const at = new Date().toLocaleTimeString("en-GB")
      setAttempts((current) => [
        ...current,
        {
          number: current.length + 1,
          at,
          ok: true,
          title: `Attempt ${current.length + 1} delivered, 200 in 188 ms`,
          body: PAYLOAD,
          language: "json",
        },
      ])
      setSending(false)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [sending])

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        {/* The newest attempt starts open. defaultOpen applies on mount, so a
            resend opens its own row without closing the previous one. */}
        {attempts.map((attempt, index) => (
          <TraceCollapsible
            key={attempt.number}
            defaultOpen={index === attempts.length - 1}
          >
            <TraceCollapsibleTrigger>
              <TraceLine status={attempt.ok ? undefined : "error"}>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="WebhookIcon"
                    tabler="IconWebhook"
                    hugeicons="WebhookIcon"
                    phosphor="WebhooksLogoIcon"
                    remixicon="RiWebhookLine"
                  />
                </TraceIcon>
                <TraceTitle>{attempt.title}</TraceTitle>
                <TraceDescription>{attempt.at}</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <CodeBlock
                code={attempt.body}
                language={attempt.language}
                highlight={attempt.language === "json"}
                label={attempt.ok ? "Request payload" : "Response"}
                wrap
              />
            </TraceCollapsibleContent>
          </TraceCollapsible>
        ))}
        {sending ? (
          <TraceLine status="running">
            <TraceIcon>
              <IconPlaceholder
                lucide="WebhookIcon"
                tabler="IconWebhook"
                hugeicons="WebhookIcon"
                phosphor="WebhooksLogoIcon"
                remixicon="RiWebhookLine"
              />
            </TraceIcon>
            <TraceTitle>Sending attempt {attempts.length + 1}</TraceTitle>
          </TraceLine>
        ) : null}
      </Trace>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={sending}
          onClick={() => {
            setSending(true)
            // The button disables itself, so focus moves to the status line.
            statusRef.current?.focus()
          }}
        >
          Resend event
        </Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground text-xs outline-none"
        >
          {sending ? "Sending" : `${attempts.length} attempts`}
        </p>
      </div>
    </div>
  )
}
