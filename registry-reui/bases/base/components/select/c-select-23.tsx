// Description: Multi-select with overlapping dots
// Order: 23

"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { cn } from "@/lib/utils"
import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const statuses = [
  { value: "ready", label: "Ready", color: "bg-emerald-400" },
  { value: "error", label: "Error", color: "bg-red-500" },
  { value: "building", label: "Building", color: "bg-amber-500" },
  { value: "queued", label: "Queued", color: "bg-blue-500" },
  { value: "initializing", label: "Initializing", color: "bg-primary" },
  { value: "canceled", label: "Canceled", color: "bg-fuchsia-500" },
]

export default function Pattern() {
  const [selected, setSelected] = useState<string[]>(
    statuses.slice(0, 5).map((s) => s.value)
  )

  return (
    <Field className="max-w-xs">
      <Select
        multiple
        value={selected}
        onValueChange={(val) => setSelected(val)}
        items={statuses}
      >
        <SelectTrigger className="w-full justify-between">
          <SelectValue>
            {(values: string[]) => {
              const selectedData = statuses.filter((s) =>
                values.includes(s.value)
              )
              return (
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="flex -space-x-1 overflow-hidden">
                    {selectedData.map((s) => (
                      <div
                        key={s.value}
                        className={cn(
                          "ring-background size-2.5 shrink-0 rounded-full ring-2",
                          s.color
                        )}
                      />
                    ))}
                  </div>
                  <span className="truncate">Status</span>
                  <Badge variant="outline" size="sm">
                    {values.length}/{statuses.length}
                  </Badge>
                </div>
              )
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} className="min-w-48">
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
