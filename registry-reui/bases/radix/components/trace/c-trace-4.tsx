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

type AgentState = "running" | "done" | "failed"

type Call = {
  title: string
  description?: string
  status?: "running" | "error"
  output?: string
}

type Subagent = {
  id: string
  name: string
  title: Record<AgentState, string>
  calls: Record<AgentState, Call[]>
  result?: string
}

const EXPLORER_CALLS: Call[] = [
  { title: "Searched for seatPrice", description: "9 results" },
  { title: "Read lib/billing/plans.ts" },
]

const AGENTS: Subagent[] = [
  {
    id: "explorer",
    name: "Explorer",
    title: {
      running: "Explorer is mapping the billing code",
      done: "Explorer mapped the billing code",
      failed: "Explorer failed",
    },
    calls: { running: EXPLORER_CALLS, done: EXPLORER_CALLS, failed: [] },
    result:
      "Found 3 fixed seat prices: plans.ts, the webhook and the invoice preview.",
  },
  {
    id: "implementer",
    name: "Implementer",
    title: {
      running: "Implementer is editing 2 files",
      done: "Implementer edited 2 files",
      failed: "Implementer failed",
    },
    calls: {
      running: [
        { title: "Edited lib/billing/plans.ts", description: "+38 -12" },
        { title: "Creating lib/billing/meter.ts", status: "running" },
      ],
      done: [
        { title: "Edited lib/billing/plans.ts", description: "+38 -12" },
        { title: "Created lib/billing/meter.ts", description: "+64" },
      ],
      failed: [],
    },
  },
  {
    id: "tests",
    name: "Test writer",
    title: {
      running: "Test writer is running the billing suite",
      done: "Test writer added 6 passing tests",
      failed: "Test writer's suite did not compile",
    },
    calls: {
      running: [
        { title: "Wrote tests/billing/meter.test.ts", description: "+92" },
        { title: "Running pnpm test billing", status: "running" },
      ],
      done: [
        { title: "Wrote tests/billing/meter.test.ts", description: "+92" },
        { title: "Ran pnpm test billing", description: "6 passed" },
      ],
      failed: [
        { title: "Wrote tests/billing/meter.test.ts", description: "+92" },
        {
          title: "Failed to run pnpm test billing",
          status: "error",
          output: `FAIL tests/billing/meter.test.ts
Error: Cannot find module '@/lib/billing/meter'`,
        },
      ],
    },
  },
]

// The parent status is derived from the children on every render, so it can
// never disagree with them.
export default function Pattern() {
  const [states, setStates] = React.useState<Record<string, AgentState>>({
    explorer: "done",
    implementer: "running",
    tests: "failed",
  })

  const statusRef = React.useRef<HTMLParagraphElement>(null)
  const canRetry = states.tests === "failed" && states.implementer === "done"
  const running = Object.values(states).filter((s) => s === "running").length
  const failed = Object.values(states).filter((s) => s === "failed").length

  React.useEffect(() => {
    const ids = Object.keys(states).filter((id) => states[id] === "running")
    if (ids.length === 0) return
    // Stands in for the subagent's own completion event.
    const timer = window.setTimeout(() => {
      setStates((current) => {
        const next = { ...current }
        for (const id of ids) next[id] = "done"
        return next
      })
    }, 3200)
    return () => window.clearTimeout(timer)
  }, [states])

  const summary = [
    `${running ? "Running" : "Ran"} ${AGENTS.length} subagents`,
    running ? `${running} still working` : null,
    failed ? `${failed} failed` : null,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="flex w-full max-w-md flex-col gap-3 text-sm">
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine
              status={running ? "running" : failed ? "error" : undefined}
            >
              <TraceIcon>
                <IconPlaceholder
                  lucide="WorkflowIcon"
                  tabler="IconSitemap"
                  hugeicons="WorkflowCircle01Icon"
                  phosphor="TreeStructureIcon"
                  remixicon="RiFlowChart"
                />
              </TraceIcon>
              <TraceTitle>{summary}</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {AGENTS.map((agent) => {
                const state = states[agent.id]
                return (
                  <TraceCollapsible key={agent.id}>
                    <TraceCollapsibleTrigger>
                      <TraceLine
                        status={
                          state === "running"
                            ? "running"
                            : state === "failed"
                              ? "error"
                              : undefined
                        }
                      >
                        <TraceIcon>
                          <IconPlaceholder
                            lucide="BotIcon"
                            tabler="IconRobot"
                            hugeicons="BotIcon"
                            phosphor="RobotIcon"
                            remixicon="RiRobot2Line"
                          />
                        </TraceIcon>
                        <TraceTitle>{agent.title[state]}</TraceTitle>
                        <TraceDescription>
                          {agent.calls[state].length} calls
                        </TraceDescription>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <div className="flex flex-col gap-2">
                        <Trace>
                          {agent.calls[state].map((call) =>
                            call.output ? (
                              <TraceCollapsible key={call.title} defaultOpen>
                                <TraceCollapsibleTrigger>
                                  <CallLine call={call} />
                                </TraceCollapsibleTrigger>
                                <TraceCollapsibleContent>
                                  <CodeBlock
                                    code={call.output}
                                    language="bash"
                                    lineLevels={{ error: [2] }}
                                    label={call.title}
                                    wrap
                                  />
                                </TraceCollapsibleContent>
                              </TraceCollapsible>
                            ) : (
                              <CallLine key={call.title} call={call} />
                            )
                          )}
                        </Trace>
                        {state === "done" && agent.result ? (
                          <p className="text-pretty">{agent.result}</p>
                        ) : null}
                      </div>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      {/* The button disables itself, so focus moves to the status line. */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={!canRetry}
          onClick={() => {
            setStates((current) => ({ ...current, tests: "running" }))
            statusRef.current?.focus()
          }}
        >
          Retry test writer
        </Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground min-w-0 text-xs outline-none"
        >
          {states.implementer === "running"
            ? "Retry opens once Implementer finishes"
            : states.tests === "failed"
              ? "lib/billing/meter.ts exists now"
              : states.tests === "running"
                ? "Retrying test writer"
                : "All subagents finished"}
        </p>
      </div>
    </div>
  )
}

function CallLine({ call }: { call: Call }) {
  return (
    <TraceLine status={call.status}>
      <TraceIcon>
        <IconPlaceholder
          lucide="TerminalIcon"
          tabler="IconTerminal"
          hugeicons="ComputerTerminal01Icon"
          phosphor="TerminalIcon"
          remixicon="RiTerminalLine"
        />
      </TraceIcon>
      <TraceTitle>{call.title}</TraceTitle>
      {call.description ? (
        <TraceDescription>{call.description}</TraceDescription>
      ) : null}
    </TraceLine>
  )
}
