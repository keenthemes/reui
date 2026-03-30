// Description: Basic command
// Order: 1

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Command,
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
  return (
    <Card className="w-full max-w-xs p-0">
      <CardContent className="p-0">
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <IconPlaceholder
                  lucide="CalendarIcon"
                  tabler="IconCalendarEvent"
                  hugeicons="Calendar04Icon"
                  phosphor="CalendarBlankIcon"
                  remixicon="RiCalendarLine"
                />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="SmileIcon"
                  tabler="IconMoodSmile"
                  hugeicons="SmileIcon"
                  phosphor="SmileyIcon"
                  remixicon="RiEmotionHappyLine"
                />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem disabled>
                <IconPlaceholder
                  lucide="CalculatorIcon"
                  tabler="IconCalculator"
                  hugeicons="Calculator01Icon"
                  phosphor="CalculatorIcon"
                  remixicon="RiCalculatorLine"
                />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="CreditCardIcon"
                  tabler="IconCreditCard"
                  hugeicons="CreditCardIcon"
                  phosphor="CreditCardIcon"
                  remixicon="RiBankCardLine"
                />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="SettingsIcon"
                  tabler="IconSettings"
                  hugeicons="SettingsIcon"
                  phosphor="GearIcon"
                  remixicon="RiSettings3Line"
                />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  )
}
