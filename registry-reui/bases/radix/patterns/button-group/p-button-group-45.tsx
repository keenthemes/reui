// Description: Environment switcher with indicator
// Order: 45

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/bases/radix/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const environments = [
  {
    id: "development",
    label: "Dev",
    tooltip: "Local development environment",
    icon: (
      <IconPlaceholder
        lucide="Code2Icon"
        tabler="IconCode"
        hugeicons="Code01Icon"
        phosphor="CodeIcon"
        remixicon="RiCodeLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "staging",
    label: "Staging",
    tooltip: "Pre-production mirror",
    icon: (
      <IconPlaceholder
        lucide="TestTube2Icon"
        tabler="IconTestPipe"
        hugeicons="TestTube01Icon"
        phosphor="TestTubeIcon"
        remixicon="RiTestTubeLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "production",
    label: "Production",
    tooltip: "Live environment — affects real users",
    icon: (
      <IconPlaceholder
        lucide="GlobeIcon"
        tabler="IconWorld"
        hugeicons="Globe02Icon"
        phosphor="GlobeIcon"
        remixicon="RiGlobalLine"
        aria-hidden="true"
      />
    ),
  },
]

export default function Pattern() {
  const [active, setActive] = useState("development")

  return (
    <ButtonGroup>
      <TooltipProvider>
        {environments.map((env) => (
          <Tooltip key={env.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === env.id ? "bg-muted" : "")}
                onClick={() => setActive(env.id)}
              >
                {env.icon}
                {env.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{env.tooltip}</TooltipContent>
          </Tooltip>
        ))}
        {active === "production" ? (
          <ButtonGroupText className="bg-transparent">
            <div className="bg-success size-1.5 rounded-full" />
            <span>Live</span>
          </ButtonGroupText>
        ) : null}
      </TooltipProvider>
    </ButtonGroup>
  )
}
