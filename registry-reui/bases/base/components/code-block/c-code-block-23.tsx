"use client"

import { useState } from "react"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Button } from "@/registry/bases/base/ui/button"
import { ScrollArea, ScrollBar } from "@/registry/bases/base/ui/scroll-area"
import { Separator } from "@/registry/bases/base/ui/separator"

const code = `export async function syncWorkspace(workspaceId: string) {
  const workspace = await db.workspace.findUnique({ where: { id: workspaceId } })

  if (!workspace) {
    throw new WorkspaceNotFoundError(workspaceId)
  }

  const members = await db.member.findMany({ where: { workspaceId } })

  for (const member of members) {
    if (member.status === "invited") {
      await mail.send({
        to: member.email,
        template: "workspace-reminder",
      })
    }
  }

  return { synced: members.length }
}`

/*
 * The block detects its own regions from indentation, so the only reason this
 * list exists is the "Fold all" button: the snippet is a literal here, so its
 * region starts are known without asking the primitive for them.
 *
 * The ScrollArea composes INSIDE the block, under the header, so the fold
 * controls never scroll away and the block's own chrome stays the container.
 */
const REGION_STARTS = [1, 4, 10, 11, 12]

export default function Pattern() {
  /* Opens with the inner branch folded, so the nesting is visible at a glance:
     folding line 10 swallows it, and unfolding 10 brings it back still
     folded. */
  const [folded, setFolded] = useState<number[]>([11])

  return (
    <CodeBlock
      code={code}
      language="typescript"
      showLineNumbers
      className="w-full max-w-2xl"
      foldable
      folded={folded}
      onFoldedChange={setFolded}
    >
      <CodeBlockHeader className="gap-1.5">
        <CodeBlockTitle>sync-workspace.ts</CodeBlockTitle>
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setFolded(REGION_STARTS)}
          >
            Fold all
          </Button>
          <Button
            size="xs"
            variant="ghost"
            disabled={!folded.length}
            onClick={() => setFolded([])}
          >
            Unfold all
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <CodeBlockCopyButton />
        </div>
      </CodeBlockHeader>
      <ScrollArea className="rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-72">
        <CodeBlockContent />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CodeBlock>
  )
}
