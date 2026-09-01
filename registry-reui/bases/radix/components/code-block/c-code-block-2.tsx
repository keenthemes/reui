import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"

import { ScrollArea, ScrollBar } from "@/registry/bases/radix/ui/scroll-area"

const code = `export async function resolveWorkspaceMembershipForActiveSubscription(workspaceId: string, userId: string) {
  const membership = await db.membership.findFirst({ where: { workspaceId, userId, status: "active" } })
  if (!membership) throw new WorkspaceAccessError("No active membership for this workspace")
  return membership
}

export function formatSeatSummary(seats: number, used: number) {
  return \`\${used} of \${seats} seats in use, \${Math.max(0, seats - used)} remaining\`
}

export function countBillableSeats(members: Member[]) {
  return members.filter((member) => member.status === "active" && !member.isGuest).length
}

export function canInviteMember(seats: number, used: number) {
  return used < seats
}`

/**
 * Both axes belong to the consumer's ScrollArea here: `CodeBlockContent`
 * hands the surface over without an internal scroll container, and the block
 * itself stays the bordered chrome. `max-h` rather than a fixed height, so a
 * short file does not leave dead space under the code.
 *
 * With no header the copy button pins itself over the code surface, hidden
 * until the block is hovered or the button takes focus. Line 1 scrolls
 * underneath it, so the button needs a backdrop of its own: `outline` draws
 * the border, and `bg-card` fills it (the variant's own dark fill is 4.5%
 * opaque, which the code shows through).
 */
export default function Pattern() {
  return (
    <CodeBlock code={code} language="typescript" className="w-full max-w-2xl">
      <CodeBlockCopyButton
        variant="outline"
        size="icon-sm"
        className="bg-card hover:bg-muted"
      />
      {/* The cap goes on the ScrollArea VIEWPORT, not its root: the viewport
          is height-100% of the root, and a percentage against a max-height
          only parent resolves to auto, so a root-level cap clips without ever
          scrolling. */}
      <ScrollArea className="rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-56">
        <CodeBlockContent />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CodeBlock>
  )
}
