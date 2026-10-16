import { CodeBlock } from "@/registry-reui/bases/base/reui/code-block/code-block"

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

const ITEMS = [
  { name: "@reui/c-data-grid-1", kind: "example" },
  { name: "@reui/data-grid", kind: "component" },
  { name: "button", kind: "ui" },
]

const FILES = [
  { path: "components/reui/data-grid/data-grid.tsx", created: true },
  { path: "components/ui/button.tsx", created: false },
  { path: "components/examples/c-data-grid-1.tsx", created: true },
]

const css = `@theme inline {
  --color-success: var(--success);
  --color-info: var(--info);
  --color-warning: var(--warning);
}`

// A file that already existed is kept, because shadcn add never overwrites a
// file without asking.
export default function Pattern() {
  const created = FILES.filter((file) => file.created)
  const skipped = FILES.filter((file) => !file.created)

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
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
          <TraceTitle>Ran shadcn add @reui/c-data-grid-1</TraceTitle>
          <TraceDescription>9.4s</TraceDescription>
        </TraceLine>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="BoxesIcon"
                  tabler="IconBoxMultiple"
                  hugeicons="BoxesIcon"
                  phosphor="CubeIcon"
                  remixicon="RiStackLine"
                />
              </TraceIcon>
              <TraceTitle>Resolved {ITEMS.length} registry items</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {ITEMS.map((item) => (
                <TraceLine key={item.name}>
                  <TraceTitle>
                    <code>{item.name}</code>
                  </TraceTitle>
                  <TraceDescription>{item.kind}</TraceDescription>
                </TraceLine>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="PackageIcon"
              tabler="IconPackage"
              hugeicons="PackageIcon"
              phosphor="PackageIcon"
              remixicon="RiBox3Line"
            />
          </TraceIcon>
          <TraceTitle>Installed @tanstack/react-table</TraceTitle>
          <TraceDescription>6.1s</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="FileCodeIcon"
                  tabler="IconFileCode"
                  hugeicons="FileScriptIcon"
                  phosphor="FileCodeIcon"
                  remixicon="RiFileCodeLine"
                />
              </TraceIcon>
              <TraceTitle>
                Wrote {created.length} files, kept {skipped.length}
              </TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {FILES.map((file) =>
                file.created ? (
                  <a key={file.path} href="#">
                    <TraceLine>
                      <TraceTitle>Created {file.path}</TraceTitle>
                    </TraceLine>
                  </a>
                ) : (
                  <TraceLine key={file.path}>
                    <TraceTitle>Kept {file.path}, it already exists</TraceTitle>
                  </TraceLine>
                )
              )}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="PaletteIcon"
                  tabler="IconPalette"
                  hugeicons="PaintBoardIcon"
                  phosphor="PaletteIcon"
                  remixicon="RiPaletteLine"
                />
              </TraceIcon>
              <TraceTitle>Updated app/globals.css</TraceTitle>
              <TraceDescription>+3</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={css}
              language="css"
              diff={{ added: [2, 3, 4] }}
              label="Changes to app/globals.css"
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  )
}
