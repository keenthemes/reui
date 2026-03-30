// Description: Buy sell hold toggle group
// Order: 43

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const stances = [
  {
    id: "buy",
    label: "Buy",
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
    id: "hold",
    label: "Hold",
    icon: (
      <IconPlaceholder
        lucide="MinusIcon"
        tabler="IconMinus"
        hugeicons="Minus02Icon"
        phosphor="MinusIcon"
        remixicon="RiSubtractLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "sell",
    label: "Sell",
    icon: (
      <IconPlaceholder
        lucide="TrendingDownIcon"
        tabler="IconTrendingDown"
        hugeicons="TrendDown01Icon"
        phosphor="TrendDownIcon"
        remixicon="RiArrowDownLine"
        aria-hidden="true"
      />
    ),
  },
]

export default function Pattern() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <ButtonGroup>
      {stances.map((stance) => (
        <Button
          key={stance.id}
          variant={active === stance.id ? "default" : "outline"}
          onClick={() => setActive(active === stance.id ? null : stance.id)}
        >
          {stance.icon}
          {stance.label}
        </Button>
      ))}
    </ButtonGroup>
  )
}
