// Description: Command with recent and favorites sections
// Order: 8

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/bases/base/ui/command"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Search Everything
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder="Search or jump to..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Favorites">
              <CommandItem>
                <IconPlaceholder
                  lucide="StarIcon"
                  tabler="IconStar"
                  hugeicons="StarIcon"
                  phosphor="StarIcon"
                  remixicon="RiStarLine"
                  className="text-yellow-500"
                />
                <span>Design System</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="StarIcon"
                  tabler="IconStar"
                  hugeicons="StarIcon"
                  phosphor="StarIcon"
                  remixicon="RiStarLine"
                  className="text-yellow-500"
                />
                <span>API Documentation</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Recent">
              <CommandItem>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="ClockIcon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                  className="text-muted-foreground"
                />
                <span>Dashboard Analytics</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>2m ago</span>
                </div>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="ClockIcon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                  className="text-muted-foreground"
                />
                <span>User Settings</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>15m ago</span>
                </div>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="ClockIcon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                  className="text-muted-foreground"
                />
                <div className="flex flex-1 items-center justify-between">
                  <span>Team Members</span>
                  <div className="ml-auto" data-slot="command-shortcut">
                    <span>1h ago</span>
                  </div>
                </div>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="ClockIcon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                  className="text-muted-foreground"
                />
                <span>Billing & Plans</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>2h ago</span>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick Links">
              <CommandItem>
                <IconPlaceholder
                  lucide="BookOpenIcon"
                  tabler="IconBook"
                  hugeicons="BookOpen01Icon"
                  phosphor="BookOpenIcon"
                  remixicon="RiBookOpenLine"
                />
                <span>Documentation</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="LifeBuoyIcon"
                  tabler="IconLifebuoy"
                  hugeicons="LifebuoyIcon"
                  phosphor="LifebuoyIcon"
                  remixicon="RiLifebuoyLine"
                />
                <span>Help & Support</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="MessageSquareIcon"
                  tabler="IconMessageDots"
                  hugeicons="Message02Icon"
                  phosphor="ChatIcon"
                  remixicon="RiChat4Line"
                />
                <span>Contact Us</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
