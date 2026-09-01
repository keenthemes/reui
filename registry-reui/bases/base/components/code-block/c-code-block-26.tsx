import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"

const files = [
  {
    name: "app/api/invites/route.ts",
    added: 12,
    removed: 3,
    code: `export async function POST(request: Request) {
  const { email } = await request.json()
  const invite = await createInvite(session.workspaceId, email)
  return Response.json(invite, { status: 201 })
}`,
  },
  {
    name: "lib/seats.ts",
    added: 8,
    removed: 0,
    code: `export async function countBillableSeats(workspaceId: string) {
  const members = await db.member.findMany({ where: { workspaceId } })
  const used = members.filter((member) => !member.isGuest).length
  return { used, total: await seatAllowance(workspaceId) }
}`,
  },
  {
    name: "emails/workspace-invite.tsx",
    added: 24,
    removed: 1,
    code: `export function WorkspaceInvite({ workspace }: InviteProps) {
  return (
    <Email preview={\`Join \${workspace.name}\`}>
      <Button href={workspace.inviteUrl}>Accept invite</Button>
    </Email>
  )
}`,
  },
]

/**
 * The block owns only its OWN scrolling, so framing is a composition concern:
 * one shadcn `ScrollArea` scrolls the whole changed-file list, each block
 * sizes to its content instead of scrolling separately, and the `Card` is the
 * container - per-style radius comes from it, never from a hand-rolled
 * `rounded-* border` div.
 */
export default function Pattern() {
  return (
    <Card className="w-full max-w-2xl gap-0 py-0">
      <CardContent className="p-0">
        <ScrollArea className="h-96 rounded-[inherit]">
          <div className="flex flex-col gap-3 p-3">
            {files.map((file) => (
              <CodeBlock
                key={file.name}
                code={file.code}
                language="tsx"
                showLineNumbers
              >
                <CodeBlockHeader className="gap-2">
                  <CodeBlockTitle>{file.name}</CodeBlockTitle>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Badge variant="success-light">+{file.added}</Badge>
                    <Badge variant="destructive-light">-{file.removed}</Badge>
                    <CodeBlockCopyButton />
                  </div>
                </CodeBlockHeader>
              </CodeBlock>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
