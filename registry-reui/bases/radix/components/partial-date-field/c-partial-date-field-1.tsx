"use client"

import * as React from "react"

import { PartialDateField } from "@/registry-reui/bases/radix/reui/partial-date-field"

export default function Pattern() {
  const [value, setValue] = React.useState("2015-06")
  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <PartialDateField value={value} onChange={setValue} locale="en" />
      <p className="font-mono text-xs text-muted-foreground">stored: {value || "—"}</p>
    </div>
  )
}
