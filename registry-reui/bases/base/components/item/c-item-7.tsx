// Description: Items with keyboard shortcuts
// Order: 7

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { Kbd } from "@/registry/bases/base/ui/kbd"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const commands = [
  {
    icon: (
      <IconPlaceholder
        lucide="SearchIcon"
        tabler="IconSearch"
        hugeicons="Search01Icon"
        phosphor="MagnifyingGlassIcon"
        remixicon="RiSearchLine"
      />
    ),
    label: "Search",
    shortcut: "⌘K",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="PlusIcon"
        tabler="IconPlus"
        hugeicons="PlusSignIcon"
        phosphor="PlusIcon"
        remixicon="RiAddLine"
      />
    ),
    label: "New File",
    shortcut: "⌘N",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="SaveIcon"
        tabler="IconDeviceFloppy"
        hugeicons="FloppyDiskIcon"
        phosphor="FloppyDiskIcon"
        remixicon="RiSaveLine"
      />
    ),
    label: "Save",
    shortcut: "⌘S",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="SettingsIcon"
        tabler="IconSettings"
        hugeicons="SettingsIcon"
        phosphor="GearIcon"
        remixicon="RiSettings3Line"
      />
    ),
    label: "Settings",
    shortcut: "⌘,",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="LogOutIcon"
        tabler="IconLogout"
        hugeicons="LogoutSquare01Icon"
        phosphor="SignOutIcon"
        remixicon="RiLogoutBoxRLine"
      />
    ),
    label: "Sign Out",
    shortcut: "⌘Q",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-64 flex-col gap-0.5">
      {commands.map((cmd) => (
        <Item key={cmd.label} render={<a href="#" />} size="xs">
          <ItemMedia variant="icon">{cmd.icon}</ItemMedia>
          <ItemContent>
            <ItemTitle>{cmd.label}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Kbd>{cmd.shortcut}</Kbd>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}
