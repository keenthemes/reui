// Description: Segmented control with dropdown inside button group
// Order: 34

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const items = [
  {
    id: "Routes",
    label: "Routes",
    icon: (
      <IconPlaceholder
        lucide="RouteIcon"
        tabler="IconRoute"
        hugeicons="Route01Icon"
        phosphor="PathIcon"
        remixicon="RiRouteLine"
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
  {
    id: "Paths",
    label: "Paths",
    icon: (
      <IconPlaceholder
        lucide="WaypointsIcon"
        tabler="IconEaseInOutControlPoints"
        hugeicons="EaseCurveControlPointsIcon"
        phosphor="LineSegmentsIcon"
        remixicon="RiRouteLine"
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
  {
    id: "Bot Name",
    label: "Bot Name",
    icon: (
      <IconPlaceholder
        lucide="BotIcon"
        tabler="IconRobotFace"
        hugeicons="RoboticIcon"
        phosphor="RobotIcon"
        remixicon="RiRobot2Line"
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
]

export default function Pattern() {
  const [active, setActive] = useState("Paths")

  return (
    <ButtonGroup>
      {items.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className={cn(active === item.id ? "bg-muted" : "")}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconChevronDown"
            hugeicons="ArrowDown01Icon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>Filter by Group</DropdownMenuItem>
          <DropdownMenuItem>Sort by Name</DropdownMenuItem>
          <DropdownMenuItem>Export Data</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
