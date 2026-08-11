"use client"

import * as React from "react"

import { MusicKeyField } from "@/registry-reui/bases/radix/reui/music-key-field"

export default function Pattern() {
  const [value, setValue] = React.useState("Dm")
  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <MusicKeyField mode="complex" value={value} onChange={setValue} label="Key" />
      <p className="font-mono text-xs text-muted-foreground">value: {value || "—"}</p>
    </div>
  )
}
