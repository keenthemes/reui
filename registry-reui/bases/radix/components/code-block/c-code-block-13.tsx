"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useCodeBlockConfig,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"

import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import { Input } from "@/registry/bases/radix/ui/input"
import { ScrollArea, ScrollBar } from "@/registry/bases/radix/ui/scroll-area"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const code = `export async function createInvite(workspaceId: string, email: string) {
  const workspace = await db.workspace.findUnique({ where: { id: workspaceId } })
  if (!workspace) throw new WorkspaceNotFoundError(workspaceId)

  const seats = await countBillableSeats(workspaceId)
  if (seats.used >= seats.total) {
    throw new SeatLimitError(workspaceId, seats.total)
  }

  const invite = await db.invite.create({
    data: { workspaceId, email, status: "pending" },
  })

  await mail.send({ to: email, template: "workspace-invite" })
  return invite
}`

/**
 * The counter takes no `code` prop: `useCodeBlockConfig` hands it the block's
 * own source, so a control composed into the header cannot drift from what the
 * block actually renders.
 *
 * Counting is case SENSITIVE on purpose. `highlightedWords` marks exact
 * matches, so a case-insensitive count reports 11 where the block paints 10
 * and the header quietly contradicts the code under it.
 */
function MatchCount({ query }: { query: string }) {
  const { code: source } = useCodeBlockConfig("MatchCount")

  const matches = useMemo(() => {
    const needle = query.trim()
    if (needle.length < 2) return null
    return source.split(needle).length - 1
  }, [source, query])

  if (matches === null) return null

  return (
    <Badge variant={matches ? "primary-light" : "secondary"}>
      {matches} {matches === 1 ? "match" : "matches"}
    </Badge>
  )
}

export default function Pattern() {
  const [query, setQuery] = useState("workspace")

  /* `highlightedWords` is a spec, not a regex: a query under two characters
     would mark almost every line, so it stays empty until the search is worth
     rendering. */
  const words = useMemo(
    () => (query.trim().length < 2 ? undefined : [query.trim()]),
    [query]
  )

  return (
    <CodeBlock
      code={code}
      language="typescript"
      showLineNumbers
      highlightedWords={words}
      className="w-full max-w-2xl"
    >
      <CodeBlockHeader className="gap-2">
        <CodeBlockTitle>invites.ts</CodeBlockTitle>
        <div className="ml-auto flex items-center gap-2">
          <MatchCount query={query} />
          {/* The group joins the field to its clear button into one control,
                so the header keeps a single bordered shape rather than two. */}
          <ButtonGroup>
            <Input
              type="search"
              value={query}
              aria-label="Search in file"
              placeholder="Search"
              onChange={(event) => setQuery(event.target.value)}
              className="w-40 text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              aria-label="Clear search"
              disabled={!query}
              onClick={() => setQuery("")}
            >
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </Button>
          </ButtonGroup>
        </div>
      </CodeBlockHeader>

      {/* Pinned over the code: the header is already carrying the search
            control, so the copy affordance moves onto the surface itself. */}
      <CodeBlockCopyButton
        variant="outline"
        size="icon-xs"
        className="bg-card hover:bg-muted"
      />
      <ScrollArea className="rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-72">
        <CodeBlockContent />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CodeBlock>
  )
}
