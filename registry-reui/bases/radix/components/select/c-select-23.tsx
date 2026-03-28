// Description: Select with colored status dots
// Order: 23

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Field } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"

const statuses = [
  { value: "ready", label: "Ready", color: "bg-emerald-400" },
  { value: "error", label: "Error", color: "bg-red-500" },
  { value: "building", label: "Building", color: "bg-amber-500" },
  { value: "queued", label: "Queued", color: "bg-blue-500" },
  { value: "initializing", label: "Initializing", color: "bg-primary" },
  { value: "canceled", label: "Canceled", color: "bg-fuchsia-500" },
]

export default function Pattern() {
  const [selected, setSelected] = useState<string>(statuses[0].value)

  return (
    <Field className="max-w-xs">
      <Select value={selected} onValueChange={(val) => setSelected(val)}>
        <SelectTrigger className="w-full justify-between">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent position="popper" className="min-w-48">
          <SelectGroup>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <div className={cn("size-2 rounded-full", status.color)} />
                  <span>{status.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
