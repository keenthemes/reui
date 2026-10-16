"use client"

import * as React from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/radix/ui/table"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/radix/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const DOMAIN = "mail.northwind.dev"

const RECORDS = [
  {
    id: "spf",
    label: "SPF",
    type: "TXT",
    name: "mail",
    value: "v=spf1 include:_spf.mailer.dev ~all",
  },
  {
    id: "dkim",
    label: "DKIM",
    type: "CNAME",
    name: "k1._domainkey.mail",
    value: "k1.dkim.mailer.dev",
  },
  {
    id: "dmarc",
    label: "DMARC",
    type: "TXT",
    name: "_dmarc.mail",
    value: "v=DMARC1; p=none; rua=mailto:dmarc@northwind.dev",
  },
]

type Phase = "checking" | "partial" | "rechecking" | "ready"

// The records stay open beside the check that waits on them.
export default function Pattern() {
  const [phase, setPhase] = React.useState<Phase>("checking")
  const [copied, setCopied] = React.useState<string | null>(null)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    const next: Partial<Record<Phase, Phase>> = {
      checking: "partial",
      rechecking: "ready",
    }
    const target = next[phase]
    if (!target) return
    const timer = window.setTimeout(() => setPhase(target), 1600)
    return () => window.clearTimeout(timer)
  }, [phase])

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(null), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
    } catch {
      // Clipboard access is refused outside a secure context. The full value
      // is still in the cell's title.
    }
  }

  const checking = phase === "checking" || phase === "rechecking"
  const verified = phase === "ready"
  const found =
    phase === "partial"
      ? ["spf", "dkim"]
      : verified
        ? RECORDS.map((r) => r.id)
        : []

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="ListIcon"
                  tabler="IconList"
                  hugeicons="LeftToRightListBulletIcon"
                  phosphor="ListIcon"
                  remixicon="RiListUnordered"
                />
              </TraceIcon>
              <TraceTitle>
                Add {RECORDS.length} records at your DNS provider
              </TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            {/* A borderless Card is the outer frame; the table sits flush in it. */}
            <Card className="p-0">
              <CardContent className="p-0">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8 w-16">Type</TableHead>
                      <TableHead className="h-8 w-28">Name</TableHead>
                      <TableHead className="h-8">Value</TableHead>
                      <TableHead className="h-8 w-9">
                        <span className="sr-only">Copy</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECORDS.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="py-1.5">{record.type}</TableCell>
                        <TableCell className="py-1.5">
                          <code className="block truncate text-xs">
                            {record.name}
                          </code>
                        </TableCell>
                        <TableCell className="py-1.5" title={record.value}>
                          <code className="block truncate text-xs">
                            {record.value}
                          </code>
                        </TableCell>
                        <TableCell className="py-1.5">
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            aria-label={`Copy the ${record.label} value`}
                            onClick={() => copy(record.id, record.value)}
                          >
                            {copied === record.id ? (
                              <IconPlaceholder
                                lucide="CheckIcon"
                                tabler="IconCheck"
                                hugeicons="Tick02Icon"
                                phosphor="CheckIcon"
                                remixicon="RiCheckLine"
                              />
                            ) : (
                              <IconPlaceholder
                                lucide="CopyIcon"
                                tabler="IconCopy"
                                hugeicons="Copy01Icon"
                                phosphor="CopyIcon"
                                remixicon="RiFileCopyLine"
                              />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine
              status={
                checking ? "running" : phase === "partial" ? "error" : undefined
              }
            >
              <TraceIcon>
                <IconPlaceholder
                  lucide="SearchIcon"
                  tabler="IconSearch"
                  hugeicons="Search01Icon"
                  phosphor="MagnifyingGlassIcon"
                  remixicon="RiSearchLine"
                />
              </TraceIcon>
              <TraceTitle>
                {checking
                  ? "Checking DNS for the records"
                  : verified
                    ? "Verified all 3 records"
                    : "Found 2 of 3 records, DMARC is missing"}
              </TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {RECORDS.map((record) => {
                const ok = found.includes(record.id)
                return (
                  <TraceLine
                    key={record.id}
                    status={checking ? "pending" : ok ? undefined : "error"}
                  >
                    <TraceTitle>
                      {checking
                        ? `Look up ${record.label}`
                        : ok
                          ? `${record.label} resolves`
                          : `${record.label} not found on ${record.name}`}
                    </TraceTitle>
                  </TraceLine>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status={phase === "ready" ? undefined : "pending"}>
          <TraceIcon>
            <IconPlaceholder
              lucide="SendIcon"
              tabler="IconSend"
              hugeicons="SentIcon"
              phosphor="PaperPlaneTiltIcon"
              remixicon="RiSendInsLine"
            />
          </TraceIcon>
          <TraceTitle>
            {phase === "ready"
              ? `Ready to send from ${DOMAIN}`
              : `Start sending from ${DOMAIN}`}
          </TraceTitle>
        </TraceLine>
      </Trace>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={phase !== "partial"}
          onClick={() => {
            setPhase("rechecking")
            // The button disables itself, so focus moves to the status line.
            statusRef.current?.focus()
          }}
        >
          Check DNS again
        </Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground min-w-0 text-xs outline-none"
        >
          {checking
            ? "Checking"
            : phase === "partial"
              ? "DNS changes can take up to an hour"
              : "Domain verified"}
        </p>
      </div>
      <p role="status" className="sr-only">
        {copied
          ? `Copied the ${RECORDS.find((r) => r.id === copied)?.label} value`
          : ""}
      </p>
    </div>
  )
}
