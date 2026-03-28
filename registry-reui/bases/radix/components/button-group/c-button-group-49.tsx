// Description: Vertical nav links with icons
// Order: 49

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <IconPlaceholder
        lucide="LayoutDashboardIcon"
        tabler="IconLayoutDashboard"
        hugeicons="DashboardSquare01Icon"
        phosphor="SquaresFourIcon"
        remixicon="RiLayoutGridLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <IconPlaceholder
        lucide="BarChart2Icon"
        tabler="IconChartBar"
        hugeicons="BarChartIcon"
        phosphor="ChartBarIcon"
        remixicon="RiBarChartLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <IconPlaceholder
        lucide="SettingsIcon"
        tabler="IconSettings"
        hugeicons="Settings01Icon"
        phosphor="GearIcon"
        remixicon="RiSettings3Line"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "help",
    label: "Help",
    icon: (
      <IconPlaceholder
        lucide="CircleHelpIcon"
        tabler="IconHelp"
        hugeicons="HelpCircleIcon"
        phosphor="QuestionIcon"
        remixicon="RiQuestionLine"
        aria-hidden="true"
      />
    ),
  },
]

export default function Pattern() {
  const [active, setActive] = useState("dashboard")

  return (
    <ButtonGroup orientation="vertical">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className={cn("justify-start", active === item.id ? "bg-muted" : "")}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </ButtonGroup>
  )
}
