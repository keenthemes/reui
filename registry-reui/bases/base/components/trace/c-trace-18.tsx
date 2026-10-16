"use client"

import * as React from "react"

import { Label } from "@/registry/bases/base/ui/label"
import { Switch } from "@/registry/bases/base/ui/switch"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/base/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type Case = {
  id: string
  name: string
  score: number
  expected?: string
  got?: string
  judge?: string
}

const PASS_MARK = 0.7
const TOTAL = 48

const CASES: Case[] = [
  { id: "c01", name: "Unopened item within 30 days", score: 0.98 },
  {
    id: "c03",
    name: "Damaged item refund",
    score: 0.31,
    expected: "A new jug or a 40% refund",
    got: "A full refund once returned",
    judge: "Policy 3.1 keeps full refunds for items that do not work.",
  },
  { id: "c04", name: "Refund request in German", score: 0.92 },
  {
    id: "c07",
    name: "Chargeback already opened",
    score: 0.18,
    expected: "Hand off to billing",
    got: "Refunded on top of the dispute",
    judge: "Refunding during a chargeback pays the customer twice.",
  },
]

// A failure opens to a compact expected, got and judge list.
export default function Pattern() {
  const [failuresOnly, setFailuresOnly] = React.useState(false)
  const failed = CASES.filter((c) => c.score < PASS_MARK)
  const shown = failuresOnly ? failed : CASES
  const hiddenPasses = TOTAL - CASES.length

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Switch
          id="failures-only"
          size="sm"
          checked={failuresOnly}
          onCheckedChange={setFailuresOnly}
        />
        <Label htmlFor="failures-only">Failures only</Label>
      </div>
      <Trace>
        {shown.map((item) =>
          item.score >= PASS_MARK ? (
            <TraceLine key={item.id}>
              <TraceIcon>
                <IconPlaceholder
                  lucide="CircleCheckIcon"
                  tabler="IconCircleCheck"
                  hugeicons="CheckmarkCircle02Icon"
                  phosphor="CheckCircleIcon"
                  remixicon="RiCheckboxCircleLine"
                />
              </TraceIcon>
              <TraceTitle>{item.name}</TraceTitle>
              <TraceDescription>{item.score.toFixed(2)}</TraceDescription>
            </TraceLine>
          ) : (
            <TraceCollapsible
              key={item.id}
              defaultOpen={item.id === failed[0]?.id}
            >
              <TraceCollapsibleTrigger>
                <TraceLine status="error">
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="CircleXIcon"
                      tabler="IconCircleX"
                      hugeicons="CancelCircleIcon"
                      phosphor="XCircleIcon"
                      remixicon="RiCloseCircleLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Failed: {item.name}</TraceTitle>
                  <TraceDescription>{item.score.toFixed(2)}</TraceDescription>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <dl className="flex flex-col gap-1 text-xs">
                  {(
                    [
                      ["Expected", item.expected],
                      ["Got", item.got],
                      ["Judge", item.judge],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex gap-3">
                      <dt className="w-14 shrink-0">{label}</dt>
                      <dd className="text-foreground min-w-0">{value}</dd>
                    </div>
                  ))}
                </dl>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          )
        )}
        {failuresOnly ? null : (
          <TraceLine>
            <TraceTitle>{hiddenPasses} more cases passed</TraceTitle>
          </TraceLine>
        )}
      </Trace>
    </div>
  )
}
