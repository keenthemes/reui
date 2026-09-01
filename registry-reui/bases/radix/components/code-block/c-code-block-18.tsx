import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import {
  CodeBlock,
  CodeBlockDownloadButton,
  CodeBlockHeader,
  CodeBlockTitle,
  parseUnifiedDiff,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"

const patch = `diff --git a/lib/seats.ts b/lib/seats.ts
--- a/lib/seats.ts
+++ b/lib/seats.ts
@@ -12,7 +12,8 @@ export async function countBillableSeats(workspaceId: string) {
   const members = await db.member.findMany({ where: { workspaceId } })
-  const used = members.length
+  const used = members.filter((member) => !member.isGuest).length
+  if (used < 0) throw new SeatCountError(workspaceId)
   return { used, total: await seatAllowance(workspaceId) }
 }
diff --git a/app/api/invites/route.ts b/app/api/invites/route.ts
--- a/app/api/invites/route.ts
+++ b/app/api/invites/route.ts
@@ -3,6 +3,7 @@ export async function POST(request: Request) {
   const { email } = await request.json()
+  if (!email) return new Response("email required", { status: 422 })
   const invite = await createInvite(session.workspaceId, email)
   return Response.json(invite, { status: 201 })
 }`

/*
 * The whole review renders from ONE `parseUnifiedDiff` call: tints, +/-
 * glyphs and the dual old/new gutter numbers all come out of the parse, so
 * nothing here counts lines against a hand-concatenated string. The parsed
 * lines go in through the `lines` prop, which also means no highlighter runs.
 */
const files = parseUnifiedDiff(patch)

export default function Pattern() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      {files.map((file) => (
        <CodeBlock
          key={file.file}
          lines={file.lines}
          showLineNumbers
          label={`Patch for ${file.file}`}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>{file.file}</CodeBlockTitle>
            <div className="ml-auto flex items-center gap-1.5">
              <Badge variant="success-light">+{file.added}</Badge>
              <Badge variant="destructive-light">-{file.removed}</Badge>
              <CodeBlockDownloadButton
                filename={`${file.file.split("/").pop()}.patch`}
              />
            </div>
          </CodeBlockHeader>
        </CodeBlock>
      ))}
    </div>
  )
}
