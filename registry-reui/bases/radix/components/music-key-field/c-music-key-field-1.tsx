"use client"

import * as React from "react"

import { MusicKeyField } from "@/registry-reui/bases/radix/reui/music-key-field"

export default function Pattern() {
  const [value, setValue] = React.useState("D")
  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <MusicKeyField mode="simple" value={value} onChange={setValue} />
      <p className="font-mono text-xs text-muted-foreground">value: {value || "—"}</p>
    </div>
  )
}
