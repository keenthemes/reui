// Description: API service environment and version selectors
// Order: 54

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

const services = ["Resend API", "Stripe API", "GitHub API"]
const environments = ["Production", "Staging", "Development"]
const versions = ["v2", "v1", "beta"]

export default function Pattern() {
  const [service, setService] = useState(services[0])
  const [environment, setEnvironment] = useState(environments[0])
  const [version, setVersion] = useState(versions[0])

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs font-normal"
            aria-label="Select API service"
          >
            <IconPlaceholder
              lucide="Code2Icon"
              tabler="IconCode"
              hugeicons="Code01Icon"
              phosphor="CodeIcon"
              remixicon="RiCodeLine"
              className="size-3.5 opacity-60"
              aria-hidden="true"
            />
            {service}
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="size-3 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuGroup>
            {services.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setService(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground h-7 gap-1 text-xs font-normal"
            aria-label="Select environment"
          >
            {environment}
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="size-3 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuGroup>
            {environments.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setEnvironment(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground h-7 gap-1 font-mono text-xs"
            aria-label="Select API version"
          >
            {version}
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="size-3 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-24">
          <DropdownMenuGroup>
            {versions.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setVersion(item)}>
                <span className="font-mono">{item}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
