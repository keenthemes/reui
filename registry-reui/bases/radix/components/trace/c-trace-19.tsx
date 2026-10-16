"use client"

import * as React from "react"

import { Field, FieldLabel } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
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

type Role = "viewer" | "billing" | "admin"

const MEMBERS = [
  { value: "maria", label: "Maria Lopez", role: "viewer" as Role, mfa: true },
  { value: "sam", label: "Sam Okafor", role: "billing" as Role, mfa: false },
  { value: "priya", label: "Priya Shah", role: "admin" as Role, mfa: true },
]

const RESOURCES = [
  {
    value: "billing",
    label: "Billing settings",
    roles: ["billing", "admin"] as Role[],
    needsMfa: false,
    sharedWith: [] as string[],
  },
  {
    value: "keys",
    label: "API keys",
    roles: ["admin"] as Role[],
    needsMfa: true,
    sharedWith: [] as string[],
  },
  {
    value: "deck",
    label: "Q3 board deck",
    roles: ["admin"] as Role[],
    needsMfa: false,
    sharedWith: ["maria"],
  },
]

const ROLE_NAMES: Record<Role, string> = {
  viewer: "Viewer",
  billing: "Billing admin",
  admin: "Admin",
}

type Verdict = "allow" | "deny" | "pass" | "skipped"

type Rule = { id: string; text: string; verdict: Verdict }

// The icon is hidden from assistive tech, so the deciding rule says so in words.
const VERDICT_PREFIX: Record<Verdict, string> = {
  allow: "Allowed: ",
  deny: "Denied: ",
  pass: "",
  skipped: "Not reached: ",
}

// Rules run in order and the first allow or deny decides. Everything after the
// deciding rule is still listed, as pending, so a reader sees which rules never
// got a say instead of wondering whether they were checked.
function evaluate(memberId: string, resourceId: string) {
  const member = MEMBERS.find((m) => m.value === memberId) ?? MEMBERS[0]
  const resource = RESOURCES.find((r) => r.value === resourceId) ?? RESOURCES[0]
  const first = member.label.split(" ")[0]
  const checks: Omit<Rule, "verdict">[] = []
  const verdicts: Verdict[] = []

  checks.push({ id: "member", text: `${first} is a member of Northwind` })
  verdicts.push("pass")

  if (resource.needsMfa) {
    checks.push({
      id: "mfa",
      text: member.mfa
        ? `Needs 2FA, and ${first} has it on`
        : `Needs 2FA, and ${first} has it off`,
    })
    verdicts.push(member.mfa ? "pass" : "deny")
  }

  const shared = resource.sharedWith.includes(member.value)
  checks.push({
    id: "share",
    text: shared
      ? `Shared with ${first} directly`
      : `Not shared with ${first} directly`,
  })
  verdicts.push(shared ? "allow" : "pass")

  const allowed = resource.roles.includes(member.role)
  const role = ROLE_NAMES[member.role]
  checks.push({
    id: "role",
    text: allowed
      ? `The ${role} role can open ${resource.label}`
      : `Needs ${resource.roles.map((r) => ROLE_NAMES[r]).join(" or ")}, not ${role}`,
  })
  verdicts.push(allowed ? "allow" : "deny")

  const decidedAt = verdicts.findIndex((v) => v === "allow" || v === "deny")
  const rules: Rule[] = checks.map((check, index) => ({
    ...check,
    verdict: index > decidedAt ? "skipped" : verdicts[index],
  }))
  return { rules, allowed: verdicts[decidedAt] === "allow", first, resource }
}

export default function Pattern() {
  const [memberId, setMemberId] = React.useState("maria")
  const [resourceId, setResourceId] = React.useState("billing")
  const { rules, allowed, first, resource } = evaluate(memberId, resourceId)
  const verdict = `${first} ${allowed ? "can open" : "cannot open"} ${resource.label}`

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="access-member">Member</FieldLabel>
          <Select value={memberId} onValueChange={setMemberId}>
            <SelectTrigger id="access-member" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBERS.map((member) => (
                <SelectItem key={member.value} value={member.value}>
                  {member.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="access-page">Page</FieldLabel>
          <Select value={resourceId} onValueChange={setResourceId}>
            <SelectTrigger id="access-page" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOURCES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status={allowed ? undefined : "error"}>
              <TraceIcon>
                <VerdictGlyph verdict={allowed ? "allow" : "deny"} />
              </TraceIcon>
              <TraceTitle>{verdict}</TraceTitle>
              <TraceDescription>{rules.length} rules</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {rules.map((rule) => (
                <TraceLine
                  key={rule.id}
                  status={
                    rule.verdict === "deny"
                      ? "error"
                      : rule.verdict === "skipped"
                        ? "pending"
                        : undefined
                  }
                >
                  <TraceIcon>
                    <VerdictGlyph verdict={rule.verdict} />
                  </TraceIcon>
                  <TraceTitle>
                    {VERDICT_PREFIX[rule.verdict]
                      ? `${VERDICT_PREFIX[rule.verdict]}${rule.text[0].toLowerCase()}${rule.text.slice(1)}`
                      : rule.text}
                  </TraceTitle>
                </TraceLine>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      {/* Only the verdict is live; re-reading every rule on each change
            would bury it. */}
      <p role="status" className="sr-only">
        {verdict}
      </p>
    </div>
  )
}

function VerdictGlyph({ verdict }: { verdict: Verdict }) {
  if (verdict === "deny") {
    return (
      <IconPlaceholder
        lucide="BanIcon"
        tabler="IconBan"
        hugeicons="UnavailableIcon"
        phosphor="ProhibitIcon"
        remixicon="RiForbidLine"
      />
    )
  }
  if (verdict === "allow") {
    return (
      <IconPlaceholder
        lucide="KeyRoundIcon"
        tabler="IconKey"
        hugeicons="Key02Icon"
        phosphor="KeyIcon"
        remixicon="RiKey2Line"
      />
    )
  }
  if (verdict === "skipped") {
    return (
      <IconPlaceholder
        lucide="CircleDashedIcon"
        tabler="IconCircleDashed"
        hugeicons="CircleDashedIcon"
        phosphor="CircleDashedIcon"
        remixicon="RiCheckboxBlankCircleLine"
      />
    )
  }
  return (
    <IconPlaceholder
      lucide="CircleCheckIcon"
      tabler="IconCircleCheck"
      hugeicons="CheckmarkCircle02Icon"
      phosphor="CheckCircleIcon"
      remixicon="RiCheckboxCircleLine"
    />
  )
}
