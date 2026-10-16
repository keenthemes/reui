"use client"

import * as React from "react"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"
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

const ERRORS = [
  { row: 12, field: "email", problem: "Missing" },
  { row: 87, field: "phone", problem: "Not a phone number" },
  { row: 233, field: "email", problem: "Invalid domain" },
]

const TOTAL = 2404

// The last step counts up in its description, and rejected rows are a Table
// because they are scanned by row number.
export default function Pattern() {
  const [imported, setImported] = React.useState(0)
  const done = imported >= TOTAL

  React.useEffect(() => {
    if (done) return
    const timer = window.setTimeout(
      () => setImported((n) => Math.min(n + 143, TOTAL)),
      120
    )
    return () => window.clearTimeout(timer)
  }, [imported, done])

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="FileSpreadsheetIcon"
              tabler="IconFileSpreadsheet"
              hugeicons="FileSpreadsheetIcon"
              phosphor="FileXlsIcon"
              remixicon="RiFileExcel2Line"
            />
          </TraceIcon>
          <TraceTitle>Parsed contacts-october.csv</TraceTitle>
          <TraceDescription>2,418 rows</TraceDescription>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="ArrowLeftRightIcon"
              tabler="IconArrowsLeftRight"
              hugeicons="ArrowDataTransferHorizontalIcon"
              phosphor="ArrowsLeftRightIcon"
              remixicon="RiArrowLeftRightLine"
            />
          </TraceIcon>
          <TraceTitle>Mapped 8 of 9 columns</TraceTitle>
          <TraceDescription>1 ignored</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <IconPlaceholder
                  lucide="CircleAlertIcon"
                  tabler="IconAlertCircle"
                  hugeicons="AlertCircleIcon"
                  phosphor="WarningCircleIcon"
                  remixicon="RiErrorWarningLine"
                />
              </TraceIcon>
              <TraceTitle>Rejected 14 invalid rows</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <div className="flex flex-col gap-2">
              {/* A borderless Card is the outer frame; the table sits flush in it. */}
              <Card className="p-0">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-8 w-14">Row</TableHead>
                        <TableHead className="h-8">Field</TableHead>
                        <TableHead className="h-8">Problem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ERRORS.map((error) => (
                        <TableRow key={error.row}>
                          <TableCell className="py-1.5">{error.row}</TableCell>
                          <TableCell className="py-1.5">
                            <code className="text-xs">{error.field}</code>
                          </TableCell>
                          <TableCell className="py-1.5">
                            {error.problem}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Button
                variant="link"
                size="xs"
                render={<a href="#" />}
                nativeButton={false}
                className="self-start"
              >
                Download all 14 rows as CSV
              </Button>
            </div>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status={done ? undefined : "running"}>
          <TraceIcon>
            <IconPlaceholder
              lucide="UsersIcon"
              tabler="IconUsers"
              hugeicons="UserMultiple02Icon"
              phosphor="UsersIcon"
              remixicon="RiGroupLine"
            />
          </TraceIcon>
          <TraceTitle>
            {done ? "Imported" : "Importing"} {TOTAL.toLocaleString("en-US")}{" "}
            contacts
          </TraceTitle>
          {/* Only the end result is announced; every tick would flood a
                screen reader with numbers. */}
          <TraceDescription aria-hidden={!done}>
            {done
              ? "in 2.1s"
              : `${imported.toLocaleString("en-US")} of ${TOTAL.toLocaleString("en-US")}`}
          </TraceDescription>
        </TraceLine>
      </Trace>
      <p role="status" className="sr-only">
        {done ? `Imported ${TOTAL} contacts` : ""}
      </p>
    </div>
  )
}
