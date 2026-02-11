// Description: User profile dropdown menu with theme toggle and status selector
// Order: 14

"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { cn } from "@/lib/utils"
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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/registry/bases/base/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const statuses = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "away", label: "Away", color: "bg-amber-500" },
  { value: "busy", label: "Busy", color: "bg-red-500" },
  { value: "offline", label: "Offline", color: "bg-gray-400" },
]

export default function Pattern() {
  const [status, setStatus] = useState("available")
  const [theme, setTheme] = useState("light")

  const activeStatus = statuses.find((s) => s.value === status) || statuses[0]

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" className="w-40" />}
        >
          <Avatar className="size-4">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">shadcn</span>

          <IconPlaceholder
            lucide="ChevronsUpDownIcon"
            tabler="IconSelector"
            hugeicons="UnfoldMoreIcon"
            phosphor="CaretUpDownIcon"
            remixicon="RiExpandUpDownLine"
            className="ml-auto opacity-60"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start" sideOffset={8}>
          <div className="flex items-center gap-3 px-1 pt-1.5">
            <Avatar className="size-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-medium">
                shadcn
              </span>
              <span className="text-muted-foreground text-xs">
                ui@shadcn.com
              </span>
            </div>
          </div>
          <div className="py-2.5">
            <Tabs value={theme} onValueChange={setTheme}>
              <TabsList className="w-full">
                <TabsTrigger value="light" className="h-6 flex-1">
                  <IconPlaceholder
                    lucide="SunIcon"
                    tabler="IconSun"
                    hugeicons="Sun01Icon"
                    phosphor="SunIcon"
                    remixicon="RiSunLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                </TabsTrigger>
                <TabsTrigger value="dark" className="h-6 flex-1">
                  <IconPlaceholder
                    lucide="MoonIcon"
                    tabler="IconMoon"
                    hugeicons="Moon02Icon"
                    phosphor="MoonIcon"
                    remixicon="RiMoonLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                </TabsTrigger>
                <TabsTrigger value="system" className="h-6 flex-1">
                  <IconPlaceholder
                    lucide="MonitorIcon"
                    tabler="IconDeviceDesktop"
                    hugeicons="ComputerIcon"
                    phosphor="MonitorIcon"
                    remixicon="RiComputerLine"
                    className="size-4"
                    aria-hidden="true"
                  />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <IconPlaceholder
                  lucide="BuildingIcon"
                  tabler="IconBuilding"
                  hugeicons="Building01Icon"
                  phosphor="BuildingsIcon"
                  remixicon="RiBuildingLine"
                  aria-hidden="true"
                />
                Your Companies
              </span>
              <Badge
                variant="secondary"
                size="sm"
                className="rounded-full px-1.5"
              >
                12
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <IconPlaceholder
                  lucide="PhoneIcon"
                  tabler="IconPhone"
                  hugeicons="Call02Icon"
                  phosphor="PhoneIcon"
                  remixicon="RiPhoneLine"
                  aria-hidden="true"
                />
                Your Numbers
              </span>
              <Badge
                variant="secondary"
                size="sm"
                className="rounded-full px-1.5"
              >
                2
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="flex items-center gap-2">
                <span
                  className={cn("size-2 rounded-full", activeStatus.color)}
                />
                {activeStatus.label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              {statuses.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                  {status === s.value && (
                    <IconPlaceholder
                      lucide="CheckIcon"
                      tabler="IconCheck"
                      hugeicons="Tick02Icon"
                      phosphor="CheckIcon"
                      remixicon="RiCheckLine"
                      className="text-muted-foreground size-4"
                      aria-hidden="true"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="SettingsIcon"
                tabler="IconSettings"
                hugeicons="SettingsIcon"
                phosphor="GearIcon"
                remixicon="RiSettings3Line"
                aria-hidden="true"
              />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="LifeBuoyIcon"
                tabler="IconLifebuoy"
                hugeicons="LifebuoyIcon"
                phosphor="LifebuoyIcon"
                remixicon="RiLifebuoyLine"
                aria-hidden="true"
              />
              Help Center
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder
              lucide="LogOutIcon"
              tabler="IconLogout"
              hugeicons="LogoutSquare01Icon"
              phosphor="SignOutIcon"
              remixicon="RiLogoutBoxRLine"
              aria-hidden="true"
            />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
