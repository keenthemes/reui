// Description: Agent mode selector with credit cap dropdown
// Order: 57

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const modes = [
  {
    id: "assist",
    label: "Assist",
    icon: (
      <IconPlaceholder
        lucide="MessageSquareIcon"
        tabler="IconMessageCircle"
        hugeicons="Message02Icon"
        phosphor="ChatCircleIcon"
        remixicon="RiChat3Line"
        className="size-3.5 opacity-60"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "review",
    label: "Review",
    icon: (
      <IconPlaceholder
        lucide="ShieldCheckIcon"
        tabler="IconShieldCheck"
        hugeicons="ShieldEnergyIcon"
        phosphor="ShieldCheckIcon"
        remixicon="RiShieldCheckLine"
        className="size-3.5 opacity-60"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "auto",
    label: "Auto",
    icon: (
      <IconPlaceholder
        lucide="ZapIcon"
        tabler="IconBolt"
        hugeicons="LightningIcon"
        phosphor="LightningIcon"
        remixicon="RiFlashlightLine"
        className="size-3.5 opacity-60"
        aria-hidden="true"
      />
    ),
  },
] as const

const limits = ["2k credits", "10k credits", "Unlimited"]

type ModeId = (typeof modes)[number]["id"]

export default function Pattern() {
  const [active, setActive] = useState<ModeId>("review")
  const [limit, setLimit] = useState(limits[1])

  return (
    <ButtonGroup>
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant="outline"
          size="sm"
          className={cn(active === mode.id && "bg-muted")}
          onClick={() => setActive(mode.id)}
        >
          {mode.icon}
          {mode.label}
        </Button>
      ))}
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              aria-label="Select credit cap"
            />
          }
        >
          {limit}
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconChevronDown"
            hugeicons="ArrowDown01Icon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
            className="size-3 opacity-60"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuGroup>
            {limits.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setLimit(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
