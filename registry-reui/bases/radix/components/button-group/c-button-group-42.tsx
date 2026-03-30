// Description: Segmented order type selector
// Order: 42

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const orderTypes = [
  {
    id: "market",
    label: "Market",
    tooltip: "Execute immediately at best available price",
    icon: (
      <IconPlaceholder
        lucide="TrendingUpIcon"
        tabler="IconTrendingUp"
        hugeicons="TrendUp01Icon"
        phosphor="TrendUpIcon"
        remixicon="RiStockLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "limit",
    label: "Limit",
    tooltip: "Execute only at your specified price or better",
    icon: (
      <IconPlaceholder
        lucide="TargetIcon"
        tabler="IconTarget"
        hugeicons="Target01Icon"
        phosphor="TargetIcon"
        remixicon="RiFocus3Line"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "stop",
    label: "Stop",
    tooltip: "Trigger a market order at stop level",
    icon: (
      <IconPlaceholder
        lucide="ShieldAlertIcon"
        tabler="IconShieldExclamation"
        hugeicons="SecurityPasswordIcon"
        phosphor="ShieldWarningIcon"
        remixicon="RiShieldLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "stop-limit",
    label: "Stop-Limit",
    tooltip: "Trigger a limit order at stop level",
    icon: (
      <IconPlaceholder
        lucide="ShieldCheckIcon"
        tabler="IconShieldCheck"
        hugeicons="SecurityCheckIcon"
        phosphor="ShieldCheckIcon"
        remixicon="RiShieldCheckLine"
        aria-hidden="true"
      />
    ),
  },
]

export default function Pattern() {
  const [active, setActive] = useState("market")

  return (
    <ButtonGroup>
      <TooltipProvider>
        {orderTypes.map((type) => (
          <Tooltip key={type.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === type.id ? "bg-muted" : "")}
                onClick={() => setActive(type.id)}
              >
                {type.icon}
                {type.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-52 text-center">
              {type.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </ButtonGroup>
  )
}
