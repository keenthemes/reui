// Description: Button group with select controls
// Order: 33

"use client"

import { useState } from "react"

import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const environments = [
  {
    value: "production",
    label: "Production",
    icon: (
      <IconPlaceholder
        lucide="GlobeIcon"
        tabler="IconWorld"
        hugeicons="Globe02Icon"
        phosphor="GlobeSimpleIcon"
        remixicon="RiGlobalLine"
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
  {
    value: "staging",
    label: "Staging",
    icon: (
      <IconPlaceholder
        lucide="LayersIcon"
        tabler="IconStack2"
        hugeicons="Layers01Icon"
        phosphor="StackIcon"
        remixicon="RiStackLine"
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
  {
    value: "development",
    label: "Development",
    icon: (
      <IconPlaceholder
        lucide="TerminalIcon"
        tabler="IconTerminal"
        hugeicons="ComputerTerminal01Icon"
        phosphor="TerminalIcon"
        remixicon="RiTerminalLine"
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
]

const timeRanges = [
  { value: "1h", label: "Last hour", category: "recent" },
  { value: "6h", label: "Last 6 hours", category: "recent" },
  { value: "12h", label: "Last 12 hours", category: "recent" },
  { value: "24h", label: "Last 24 hours", category: "recent" },
  { value: "3d", label: "Last 3 days", category: "plus" },
  { value: "7d", label: "Last 7 days", category: "plus" },
  { value: "14d", label: "Last 14 days", category: "plus" },
  { value: "30d", label: "Last 30 days", category: "plus" },
]

export default function Pattern() {
  const [env, setEnv] = useState<string | null>("development")
  const [range, setRange] = useState<string | null>("12h")

  return (
    <ButtonGroup>
      <Select
        value={env}
        onValueChange={(val) => setEnv(val)}
        items={environments}
      >
        <SelectTrigger className="w-40">
          <SelectValue>
            {(value: string) => {
              const item = environments.find((e) => e.value === value)
              return (
                <span className="flex items-center gap-2">
                  {item?.icon && item.icon}
                  <span>{item?.label}</span>
                </span>
              )
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          <SelectGroup>
            {environments.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={range}
        onValueChange={(val) => setRange(val)}
        items={timeRanges}
      >
        <SelectTrigger className="w-40">
          <SelectValue>
            {(value: string) => {
              const item = timeRanges.find((r) => r.value === value)
              return (
                <span className="flex items-center gap-2">
                  <IconPlaceholder
                    lucide="ClockIcon"
                    tabler="IconClock"
                    hugeicons="ClockIcon"
                    phosphor="ClockIcon"
                    remixicon="RiTimeLine"
                    className="size-3.5 opacity-60"
                  />
                  <span>{item?.label}</span>
                </span>
              )
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {timeRanges
              .filter((r) => r.category === "recent")
              .map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Observability Plus</SelectLabel>
            {timeRanges
              .filter((r) => r.category === "plus")
              .map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </ButtonGroup>
  )
}
