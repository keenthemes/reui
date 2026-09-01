"use client"

import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"

import { Button } from "@/registry/bases/radix/ui/button"

const code = `export function parseAmount(input: string) {
  const value = parseInt(input)
  if (value == NaN) return 0
  return value
}`

export default function Pattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        lineLevels={{ error: [3], warning: [2] }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>parse-amount.ts</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            <Badge variant="destructive-light">1 error</Badge>
            <Badge variant="warning-light">1 warning</Badge>
          </div>
        </CodeBlockHeader>

        {/*
          One group is REGISTERED for the whole block and rendered inside
          whichever row is active, so a 2,000 line file costs a single button.
          Gated on the diagnostic: a fix offer on a clean line is noise.
        */}
        <CodeBlockLineActions>
          {({ line, state }) =>
            state?.level ? (
              <Button size="xs" variant="outline" className="bg-background">
                Fix line {line}
              </Button>
            ) : null
          }
        </CodeBlockLineActions>
      </CodeBlock>
    </div>
  )
}
