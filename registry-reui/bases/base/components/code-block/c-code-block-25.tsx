"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle,
  useCodeBlockSelection,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Button } from "@/registry/bases/base/ui/button"
import { Card } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const FILE = "use-mobile.ts"
const PATH = "src/hooks/use-mobile.ts"

const code = `import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>()

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}`

/*
 * The gutter button turns code into REFERENCES: press + on a line and the
 * composer below gains a file:line badge, or select a range first and one
 * press references every selected line. `useCodeBlockSelection` is what makes
 * the range case possible - the render prop alone only knows its own line.
 */
function AddToChat({
  line,
  onAdd,
}: {
  line: number
  onAdd: (lines: number[]) => void
}) {
  const { selectedLines, clearSelection } = useCodeBlockSelection()
  const batch = selectedLines.length > 0 ? selectedLines : [line]

  return (
    <Button
      type="button"
      size="icon-xs"
      aria-label={
        batch.length > 1
          ? `Reference ${batch.length} selected lines in the chat`
          : `Reference line ${line} in the chat`
      }
      title={
        batch.length > 1
          ? `Reference ${batch.length} lines`
          : `Reference line ${line}`
      }
      onClick={() => {
        onAdd(batch)
        clearSelection()
      }}
      /* Trimmed below the icon-xs rung: the control hangs over the line
         numbers, so a full 24px chip covers the digits it floats above. */
      className="size-5"
    >
      <IconPlaceholder
        lucide="PlusIcon"
        tabler="IconPlus"
        hugeicons="PlusSignIcon"
        phosphor="PlusIcon"
        remixicon="RiAddLine"
      />
    </Button>
  )
}

export default function Pattern() {
  const [refs, setRefs] = useState<number[]>([])
  const [highlighted, setHighlighted] = useState<number | null>(null)

  const addLines = (lines: number[]) =>
    setRefs((current) =>
      [...new Set([...current, ...lines])].sort((a, b) => a - b)
    )

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        selectable
        highlightedLines={highlighted === null ? undefined : [highlighted]}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{FILE}</CodeBlockTitle>
          <span className="text-muted-foreground ml-auto text-xs">
            Press + on a line to reference it
          </span>
        </CodeBlockHeader>

        <CodeBlockLineActions side="gutter">
          {({ line }) => <AddToChat line={line} onAdd={addLines} />}
        </CodeBlockLineActions>
      </CodeBlock>

      {/* The composer the references land in. A Card, not a hand-rolled
          bordered div, so its radius resolves per style. */}
      <Card size="sm" className="gap-2 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {refs.length === 0 ? (
            <span className="text-muted-foreground px-1 text-sm">
              Ask about {FILE}...
            </span>
          ) : (
            refs.map((line) => (
              <Badge
                key={line}
                variant={highlighted === line ? "primary-light" : "outline"}
                title={`${PATH}:${line}`}
                className="gap-0.5 font-mono"
              >
                {/* Two actions per chip, so two real buttons: the label
                    highlights the referenced line in the block above through
                    `highlightedLines`, the X removes the reference. */}
                <Button
                  variant="ghost"
                  size="xs"
                  aria-pressed={highlighted === line}
                  aria-label={`Highlight line ${line} in the code`}
                  onClick={() =>
                    setHighlighted((current) =>
                      current === line ? null : line
                    )
                  }
                  className="h-auto p-0 font-mono hover:bg-transparent"
                >
                  {FILE}:{line}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove the reference to line ${line}`}
                  onClick={() => {
                    setRefs((current) =>
                      current.filter((value) => value !== line)
                    )
                    setHighlighted((current) =>
                      current === line ? null : current
                    )
                  }}
                  className="size-4 hover:bg-transparent [&_svg]:size-2.5"
                >
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="Cancel01Icon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                  />
                </Button>
              </Badge>
            ))
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {refs.length > 0
              ? `${refs.length} ${refs.length === 1 ? "line" : "lines"} in context`
              : "No context yet"}
          </span>
          <Button size="xs" className="ml-auto" disabled={!refs.length}>
            Ask AI
          </Button>
        </div>
      </Card>
    </div>
  )
}
