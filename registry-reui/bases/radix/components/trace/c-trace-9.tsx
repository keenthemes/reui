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

type JobState = "done" | "failed" | "running" | "pending"

type Step = { title: string; duration: string; failed?: boolean; log?: string }

type Job = {
  id: string
  title: Record<JobState, string>
  duration?: string
  initial: JobState
  steps?: Partial<Record<JobState, Step[]>>
}

const FAILURE_LOG = `FAIL search-input.test.tsx
  × debounces keystrokes
    onSearch ran 3 times, expected 1
  × cancels the timer on unmount
    onSearch ran after unmount`

const JOBS: Job[] = [
  {
    id: "install",
    title: {
      done: "Installed dependencies",
      failed: "Failed to install dependencies",
      running: "Installing dependencies",
      pending: "Install dependencies",
    },
    duration: "38s",
    initial: "done",
    steps: {
      done: [
        { title: "Restored the pnpm store from cache", duration: "4s" },
        { title: "Ran pnpm install --frozen-lockfile", duration: "31s" },
      ],
    },
  },
  {
    id: "test",
    title: {
      done: "Ran 418 tests",
      failed: "Tests failed, 2 of 418",
      running: "Running 418 tests",
      pending: "Run tests",
    },
    duration: "1m 12s",
    initial: "failed",
    steps: {
      done: [
        { title: "Ran unit tests", duration: "48s" },
        { title: "Ran component tests", duration: "24s" },
      ],
      failed: [
        { title: "Ran unit tests", duration: "48s" },
        {
          title: "Component tests failed",
          duration: "24s",
          failed: true,
          log: FAILURE_LOG,
        },
      ],
    },
  },
  {
    id: "build",
    title: {
      done: "Built the app",
      failed: "Build failed",
      running: "Building the app",
      pending: "Build the app",
    },
    duration: "1m 3s",
    initial: "pending",
  },
  {
    id: "deploy",
    title: {
      done: "Deployed a preview",
      failed: "Preview deploy failed",
      running: "Deploying a preview",
      pending: "Deploy a preview",
    },
    duration: "18s",
    initial: "pending",
  },
]

// Jobs a re-run repeats, in order. Everything before the failure keeps its
// result, which is what re-running only the failed jobs means.
const RERUN = ["test", "build", "deploy"]

export default function Pattern() {
  // null until the reader re-runs; then how many re-run jobs have finished.
  const [rerun, setRerun] = React.useState<number | null>(null)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  const stateOf = (job: Job): JobState => {
    const index = RERUN.indexOf(job.id)
    if (rerun === null || index === -1) return job.initial
    return index < rerun ? "done" : index === rerun ? "running" : "pending"
  }

  const states = JOBS.map(stateOf)
  const running = states.includes("running")
  const failed = states.includes("failed")

  React.useEffect(() => {
    if (rerun === null || rerun >= RERUN.length) return
    const timer = window.setTimeout(() => setRerun(rerun + 1), 1800)
    return () => window.clearTimeout(timer)
  }, [rerun])

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        {JOBS.map((job, index) => {
          const state = states[index]
          const steps = job.steps?.[state]
          const line = (
            <TraceLine
              status={
                state === "failed"
                  ? "error"
                  : state === "done"
                    ? undefined
                    : state
              }
            >
              <TraceIcon>
                <JobGlyph state={state} />
              </TraceIcon>
              <TraceTitle>{job.title[state]}</TraceTitle>
              {state === "done" || state === "failed" ? (
                <TraceDescription>{job.duration}</TraceDescription>
              ) : null}
            </TraceLine>
          )
          if (!steps)
            return <React.Fragment key={job.id}>{line}</React.Fragment>
          return (
            <TraceCollapsible key={job.id} defaultOpen={state === "failed"}>
              <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  {steps.map((step) =>
                    step.log ? (
                      <TraceCollapsible key={step.title} defaultOpen>
                        <TraceCollapsibleTrigger>
                          <TraceLine status="error">
                            <TraceTitle>{step.title}</TraceTitle>
                            <TraceDescription>{step.duration}</TraceDescription>
                          </TraceLine>
                        </TraceCollapsibleTrigger>
                        <TraceCollapsibleContent>
                          <CodeBlock
                            code={step.log}
                            language="bash"
                            lineLevels={{ error: [2, 4] }}
                            label="Failing test output"
                          />
                        </TraceCollapsibleContent>
                      </TraceCollapsible>
                    ) : (
                      <TraceLine key={step.title}>
                        <TraceTitle>{step.title}</TraceTitle>
                        <TraceDescription>{step.duration}</TraceDescription>
                      </TraceLine>
                    )
                  )}
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          )
        })}
      </Trace>
      <div className="flex items-center gap-3">
        {/* The button disables itself on click, so focus moves to the line
              that reports the re-run instead of falling back to the page. */}
        <Button
          size="sm"
          variant="outline"
          disabled={!failed}
          onClick={() => {
            setRerun(0)
            statusRef.current?.focus()
          }}
        >
          Re-run failed jobs
        </Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground text-xs outline-none"
        >
          {failed
            ? "Build and deploy wait on the tests"
            : running
              ? `Re-running ${RERUN.length} jobs`
              : "All jobs passed"}
        </p>
      </div>
    </div>
  )
}

function JobGlyph({ state }: { state: JobState }) {
  if (state === "failed") {
    return (
      <IconPlaceholder
        lucide="CircleXIcon"
        tabler="IconCircleX"
        hugeicons="CancelCircleIcon"
        phosphor="XCircleIcon"
        remixicon="RiCloseCircleLine"
      />
    )
  }
  if (state === "pending") {
    return (
      <IconPlaceholder
        lucide="CircleDashedIcon"
        tabler="IconCircleDashed"
        hugeicons="CircleDashedIcon"
        phosphor="CircleDashedIcon"
        remixicon="RiCheckboxBlankCircleLine"
      />
    )
  }
  if (state === "running") {
    return (
      <IconPlaceholder
        lucide="LoaderCircleIcon"
        tabler="IconLoader2"
        hugeicons="Loading02Icon"
        phosphor="CircleNotchIcon"
        remixicon="RiLoader4Line"
        className="motion-safe:animate-spin"
      />
    )
  }
  return (
    <IconPlaceholder
      lucide="CircleCheckIcon"
      tabler="IconCircleCheck"
      hugeicons="CheckmarkCircle02Icon"
      phosphor="CheckCircleIcon"
      remixicon="RiCheckboxCircleLine"
    />
  )
}
