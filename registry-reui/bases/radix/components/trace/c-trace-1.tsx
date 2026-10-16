import { CodeBlock } from "@/registry-reui/bases/radix/reui/code-block/code-block"

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

const patch = `export const csp = {
  frameSrc: ["'self'"],
  frameSrc: ["'self'", "*.stripe.com"],
  connectSrc: ["'self'", "*.stripe.com"],
}`

const testOutput = `✓ middleware/csp.test.ts (12 tests)
Tests  12 passed`

const lintOutput = `middleware/csp.ts
  14:7  error  'nonce' is unused`

// Each title says what happened, because TraceIcon is hidden from assistive
// tech and the title is all a screen reader gets.
export default function Pattern() {
  return (
    // Trace sizes its rows; the root sets the size of what they expand to.
    <div className="w-full max-w-md text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="Search01Icon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
            />
          </TraceIcon>
          <TraceTitle>Searched the codebase for frameSrc</TraceTitle>
          <TraceDescription>3 results</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="PencilIcon"
                  tabler="IconPencil"
                  hugeicons="PenIcon"
                  phosphor="PencilIcon"
                  remixicon="RiPencilLine"
                />
              </TraceIcon>
              <TraceTitle>Edited middleware/csp.ts</TraceTitle>
              <TraceDescription>+2 -1</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={patch}
              language="typescript"
              diff={{ added: [3, 4], removed: [2] }}
              label="Patch for middleware/csp.ts"
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="TerminalIcon"
                  tabler="IconTerminal"
                  hugeicons="ComputerTerminal01Icon"
                  phosphor="TerminalIcon"
                  remixicon="RiTerminalLine"
                />
              </TraceIcon>
              <TraceTitle>Ran pnpm vitest run csp</TraceTitle>
              <TraceDescription>12 passed</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={testOutput}
              language="bash"
              highlight={false}
              label="Test output"
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <IconPlaceholder
                  lucide="TerminalIcon"
                  tabler="IconTerminal"
                  hugeicons="ComputerTerminal01Icon"
                  phosphor="TerminalIcon"
                  remixicon="RiTerminalLine"
                />
              </TraceIcon>
              <TraceTitle>pnpm lint failed with 1 error</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={lintOutput}
              language="bash"
              lineLevels={{ error: [2] }}
              label="Lint output"
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status="running">
          <TraceIcon>
            <IconPlaceholder
              lucide="PencilIcon"
              tabler="IconPencil"
              hugeicons="PenIcon"
              phosphor="PencilIcon"
              remixicon="RiPencilLine"
            />
          </TraceIcon>
          <TraceTitle>Removing the unused nonce</TraceTitle>
        </TraceLine>
      </Trace>
    </div>
  )
}
