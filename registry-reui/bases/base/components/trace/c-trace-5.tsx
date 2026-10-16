"use client"

import * as React from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
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

type Action = "create" | "update" | "destroy"

type Change = { action: Action; address: string; detail?: string }

const CHANGES: Change[] = [
  { action: "create", address: "aws_sqs_queue.invoices" },
  {
    action: "update",
    address: "aws_lambda_function.invoices",
    detail: "+512 MB",
  },
  { action: "destroy", address: "aws_sqs_queue.invoices_v1" },
]

const COUNT_WORDS: Record<Action, { plan: string; done: string }> = {
  create: { plan: "to add", done: "added" },
  update: { plan: "to change", done: "changed" },
  destroy: { plan: "to destroy", done: "destroyed" },
}

// "3 to add, 1 to change, 1 to destroy", the summary terraform itself prints.
function countLine(tense: "plan" | "done") {
  return (Object.keys(COUNT_WORDS) as Action[])
    .map((action) => {
      const n = CHANGES.filter((c) => c.action === action).length
      return n ? `${n} ${COUNT_WORDS[action][tense]}` : null
    })
    .filter(Boolean)
    .join(", ")
}

// "+3 ~1 -1", the symbols terraform prints beside each resource.
function countSymbols() {
  const symbol: Record<Action, string> = {
    create: "+",
    update: "~",
    destroy: "-",
  }
  return (Object.keys(symbol) as Action[])
    .map((action) => {
      const n = CHANGES.filter((c) => c.action === action).length
      return n ? `${symbol[action]}${n}` : null
    })
    .filter(Boolean)
    .join(" ")
}

const VERBS: Record<Action, [plan: string, running: string, done: string]> = {
  create: ["Create", "Creating", "Created"],
  update: ["Update", "Updating", "Updated"],
  destroy: ["Destroy", "Destroying", "Destroyed"],
}

type Phase = "review" | "applying" | "applied" | "denied"

// The planned rows are the rows that apply: each moves from pending to running
// to done in place.
export default function Pattern() {
  const [phase, setPhase] = React.useState<Phase>("review")
  const [applied, setApplied] = React.useState(0)
  const statusRef = React.useRef<HTMLParagraphElement>(null)
  const applyRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (phase !== "applying") return
    const timer = window.setTimeout(() => {
      const next = applied + 1
      setApplied(next)
      if (next === CHANGES.length) setPhase("applied")
    }, 900)
    return () => window.clearTimeout(timer)
  }, [phase, applied])

  // The prompt unmounts on either answer, so focus moves to the line that
  // reports what the answer did.
  function answer(next: Phase) {
    setPhase(next)
    window.requestAnimationFrame(() => statusRef.current?.focus())
  }

  const destroyed = CHANGES.filter((c) => c.action === "destroy")

  const summary = {
    review: `Planned ${CHANGES.length} changes`,
    applying: `Applying ${CHANGES.length} changes`,
    applied: `Applied ${CHANGES.length} changes`,
    denied: `Planned ${CHANGES.length} changes, apply denied`,
  }[phase]

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="RefreshCwIcon"
              tabler="IconRefresh"
              hugeicons="RefreshIcon"
              phosphor="ArrowsClockwiseIcon"
              remixicon="RiRefreshLine"
            />
          </TraceIcon>
          <TraceTitle>Refreshed state for 42 resources</TraceTitle>
          <TraceDescription>11s</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status={phase === "applying" ? "running" : undefined}>
              <TraceIcon>
                <IconPlaceholder
                  lucide="ListChecksIcon"
                  tabler="IconListCheck"
                  hugeicons="TaskDone01Icon"
                  phosphor="ChecksIcon"
                  remixicon="RiListCheck"
                />
              </TraceIcon>
              <TraceTitle>{summary}</TraceTitle>
              {/* Terraform's own change symbols keep the row short; the
                      words are what a screen reader hears. */}
              <TraceDescription>
                <span aria-hidden="true">{countSymbols()}</span>
                <span className="sr-only">
                  {countLine(phase === "applied" ? "done" : "plan")}
                </span>
              </TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {CHANGES.map((change, index) => {
                const [plan, running, done] = VERBS[change.action]
                const isDone = index < applied
                const isRunning = phase === "applying" && index === applied
                return (
                  <TraceLine
                    key={change.address}
                    status={
                      isRunning ? "running" : isDone ? undefined : "pending"
                    }
                  >
                    <TraceIcon>
                      <ActionGlyph action={change.action} />
                    </TraceIcon>
                    <TraceTitle>
                      {isDone ? done : isRunning ? running : plan}{" "}
                      <span className="font-mono">{change.address}</span>
                    </TraceTitle>
                    {change.detail ? (
                      <TraceDescription>{change.detail}</TraceDescription>
                    ) : null}
                  </TraceLine>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      {/* A pending approval is a question for the reader, not activity, so
            it is an Item outside the trace rather than one more row. */}
      {phase === "review" ? (
        <Item variant="outline" size="sm">
          <ItemContent>
            <ItemTitle>Apply {CHANGES.length} changes to production?</ItemTitle>
            <ItemDescription>
              Destroys {destroyed.map((c) => c.address).join(", ")}.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="sm"
              variant="outline"
              onClick={() => answer("denied")}
            >
              Deny
            </Button>
            <Button ref={applyRef} size="sm" onClick={() => answer("applying")}>
              Apply
            </Button>
          </ItemActions>
        </Item>
      ) : null}
      {phase === "review" ? null : (
        <div className="flex items-center gap-3">
          {phase === "applying" ? null : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setApplied(0)
                setPhase("review")
                // This button unmounts with the phase it belongs to, so
                // focus moves to Apply on the prompt that replaces it.
                window.requestAnimationFrame(() => applyRef.current?.focus())
              }}
            >
              Plan again
            </Button>
          )}
          <p
            ref={statusRef}
            role="status"
            tabIndex={-1}
            className="text-muted-foreground text-xs outline-none"
          >
            {phase === "applying"
              ? `Applied ${applied} of ${CHANGES.length}`
              : phase === "applied"
                ? `Apply complete: ${countLine("done")}.`
                : "Apply denied. Nothing was changed."}
          </p>
        </div>
      )}
    </div>
  )
}

function ActionGlyph({ action }: { action: Action }) {
  if (action === "create") {
    return (
      <IconPlaceholder
        lucide="PlusIcon"
        tabler="IconPlus"
        hugeicons="PlusSignIcon"
        phosphor="PlusIcon"
        remixicon="RiAddLine"
      />
    )
  }
  if (action === "update") {
    return (
      <IconPlaceholder
        lucide="PencilIcon"
        tabler="IconPencil"
        hugeicons="PenIcon"
        phosphor="PencilIcon"
        remixicon="RiPencilLine"
      />
    )
  }
  return (
    <IconPlaceholder
      lucide="Trash2Icon"
      tabler="IconTrash"
      hugeicons="Delete02Icon"
      phosphor="TrashIcon"
      remixicon="RiDeleteBinLine"
    />
  )
}
