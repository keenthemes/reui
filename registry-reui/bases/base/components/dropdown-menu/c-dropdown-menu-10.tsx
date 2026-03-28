// Description: Workspace switcher dropdown menu
// Order: 10

"use client"

import { ReactNode, useState } from "react"

import { AnthropicBlack } from "@/components/ui/svgs/anthropicBlack"
import { AnthropicWhite } from "@/components/ui/svgs/anthropicWhite"
import { ClaudeAiIcon } from "@/components/ui/svgs/claudeAiIcon"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

interface Workspace {
  id: string
  name: string
  plan: string
  avatar?: string
  logo?: ReactNode
  logoDark?: ReactNode
}

const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Anthropic",
    plan: "Enterprise",
    logo: <AnthropicBlack />,
    logoDark: <AnthropicWhite />,
  },
  {
    id: "2",
    name: "Claude",
    plan: "Pro",
    logo: <ClaudeAiIcon />,
  },
  {
    id: "3",
    name: "Alex Wong",
    plan: "Team",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
  },
]

export default function Pattern() {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(workspaces[1].id)
  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" className="w-52" />}
        >
          <div className="style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1.5 style-maia:gap-1.5 style-mira:gap-1.5 flex items-center">
            {activeWorkspace.logo}
            <span className="text-sm font-medium">{activeWorkspace.name}</span>
          </div>

          <IconPlaceholder
            lucide="ChevronsUpDownIcon"
            tabler="IconSelector"
            hugeicons="UnfoldMoreIcon"
            phosphor="CaretUpDownIcon"
            remixicon="RiExpandUpDownLine"
            className="ml-auto size-3.5 opacity-60"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                className="gap-3"
                onSelect={() => setActiveWorkspaceId(workspace.id)}
              >
                {/* Workspace logo (dark mode) */}
                {workspace.logoDark ? (
                  <>
                    <span aria-hidden className="dark:hidden">
                      {workspace.logo}
                    </span>
                    <span aria-hidden className="hidden dark:block">
                      {workspace.logoDark}
                    </span>
                  </>
                ) : (
                  workspace.logo && workspace.logo
                )}

                {workspace.avatar && (
                  <Avatar className="size-4">
                    <AvatarImage src={workspace.avatar} alt={workspace.name} />
                    <AvatarFallback>{workspace.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}

                {/* Workspace name and plan */}
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">{workspace.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {workspace.plan}
                  </span>
                </div>

                {/* Check icon */}
                {activeWorkspaceId === workspace.id && (
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                    phosphor="CheckIcon"
                    remixicon="RiCheckLine"
                    className="text-primary size-4"
                    aria-hidden="true"
                  />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
                aria-hidden="true"
              />
              Create Workspace
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="SettingsIcon"
                tabler="IconSettings"
                hugeicons="SettingsIcon"
                phosphor="GearIcon"
                remixicon="RiSettings3Line"
                aria-hidden="true"
              />
              Manage Workspaces
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
