"use client"

import * as React from "react"
import { CodeBlock } from "@/registry-reui/bases/radix/reui/code-block/code-block"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/bases/radix/ui/sheet"
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

type Kind = "bug" | "security"

type Finding = {
  id: string
  kind: Kind
  title: string
  fixed: string
  file: string
  line: number
  explanation: string
  code: string
  // The line within `code` the comment is about, 1-based.
  focus: number
  suggestion: string
  diff: { added: number[]; removed: number[] }
}

const FINDINGS: Finding[] = [
  {
    id: "null-user",
    kind: "bug",
    title: "Null user in getInvoice",
    fixed: "Guarded the null user",
    file: "lib/billing/invoice.ts",
    line: 42,
    explanation:
      "getUser returns null for a deleted account, and the export job runs for those too.",
    code: `const user = await getUser(userId)
return user.invoices.find((i) => i.id === id)`,
    focus: 2,
    suggestion: `const user = await getUser(userId)
if (!user) throw new NotFoundError("user")
return user.invoices.find((i) => i.id === id)`,
    diff: { added: [2], removed: [] },
  },
  {
    id: "password-log",
    kind: "security",
    title: "Password in the error log",
    fixed: "Dropped the password from the log",
    file: "lib/auth/login.ts",
    line: 17,
    explanation: "Log lines are shipped to a third party and kept for 30 days.",
    code: `logger.error("login failed", { email, password })`,
    focus: 1,
    suggestion: `logger.error("login failed", { email, password })
logger.error("login failed", { email })`,
    diff: { added: [2], removed: [1] },
  },
]

type Resolution = "applied" | "dismissed"

// The Sheet returns focus to the row it opened from, which then says what
// happened to the comment.
export default function Pattern() {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [resolved, setResolved] = React.useState<Record<string, Resolution>>({})

  const remaining = FINDINGS.filter((f) => !resolved[f.id]).length

  function resolve(id: string, resolution: Resolution) {
    setResolved((current) => ({ ...current, [id]: resolution }))
    setOpenId(null)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="GitPullRequestArrowIcon"
              tabler="IconGitPullRequest"
              hugeicons="GitPullRequestIcon"
              phosphor="GitPullRequest"
              remixicon="RiGitPullRequestLine"
            />
          </TraceIcon>
          <TraceTitle>Reviewed 6 changed files</TraceTitle>
          <TraceDescription>+214 -38</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="MessageSquareTextIcon"
                  tabler="IconMessageDots"
                  hugeicons="Comment01Icon"
                  phosphor="ChatTextIcon"
                  remixicon="RiMessage3Line"
                />
              </TraceIcon>
              <TraceTitle>Left {FINDINGS.length} comments</TraceTitle>
              <TraceDescription>{remaining} open</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {FINDINGS.map((finding) => {
                const resolution = resolved[finding.id]
                return (
                  <Sheet
                    key={finding.id}
                    open={openId === finding.id}
                    onOpenChange={(open) => setOpenId(open ? finding.id : null)}
                  >
                    <SheetTrigger>
                      <TraceLine>
                        <TraceIcon>
                          {resolution === "applied" ? (
                            <IconPlaceholder
                              lucide="CircleCheckIcon"
                              tabler="IconCircleCheck"
                              hugeicons="CheckmarkCircle02Icon"
                              phosphor="CheckCircleIcon"
                              remixicon="RiCheckboxCircleLine"
                            />
                          ) : (
                            <KindGlyph kind={finding.kind} />
                          )}
                        </TraceIcon>
                        <TraceTitle>
                          {resolution === "applied"
                            ? finding.fixed
                            : resolution === "dismissed"
                              ? `Dismissed: ${finding.title}`
                              : finding.title}
                        </TraceTitle>
                        <TraceDescription>
                          {finding.file.split("/").pop()}:{finding.line}
                        </TraceDescription>
                      </TraceLine>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>{finding.title}</SheetTitle>
                        <SheetDescription>
                          {finding.explanation}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col gap-3 px-4">
                        <CodeBlock
                          code={finding.code}
                          language="typescript"
                          showLineNumbers
                          startLine={finding.line - finding.focus + 1}
                          highlightedLines={[finding.focus]}
                          label={`${finding.file} at line ${finding.line}`}
                        />
                        <p className="text-muted-foreground text-sm">
                          Suggested change
                        </p>
                        <CodeBlock
                          code={finding.suggestion}
                          language="typescript"
                          diff={finding.diff}
                          wrap
                          label="Suggested change"
                        />
                      </div>
                      <SheetFooter className="flex-row">
                        <Button onClick={() => resolve(finding.id, "applied")}>
                          Apply suggestion
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => resolve(finding.id, "dismissed")}
                        >
                          Dismiss
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  )
}

function KindGlyph({ kind }: { kind: Kind }) {
  if (kind === "bug") {
    return (
      <IconPlaceholder
        lucide="BugIcon"
        tabler="IconBug"
        hugeicons="Bug01Icon"
        phosphor="BugIcon"
        remixicon="RiBugLine"
      />
    )
  }
  return (
    <IconPlaceholder
      lucide="LockIcon"
      tabler="IconLock"
      hugeicons="SquareLock01Icon"
      phosphor="LockSimpleIcon"
      remixicon="RiLockLine"
    />
  )
}
