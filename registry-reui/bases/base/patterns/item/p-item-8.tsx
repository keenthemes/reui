// Description: Small-size items with badges
// Order: 8

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const menuItems = [
  {
    icon: (
      <IconPlaceholder
        lucide="InboxIcon"
        tabler="IconInbox"
        hugeicons="InboxIcon"
        phosphor="TrayIcon"
        remixicon="RiInboxLine"
      />
    ),
    label: "Inbox",
    count: 12,
  },
  {
    icon: (
      <IconPlaceholder
        lucide="SendIcon"
        tabler="IconSend"
        hugeicons="SentIcon"
        phosphor="PaperPlaneTiltIcon"
        remixicon="RiSendInsLine"
      />
    ),
    label: "Sent",
    count: 0,
  },
  {
    icon: (
      <IconPlaceholder
        lucide="FileIcon"
        tabler="IconFile"
        hugeicons="FileEmpty02Icon"
        phosphor="FileIcon"
        remixicon="RiFileLine"
      />
    ),
    label: "Drafts",
    count: 3,
  },
  {
    icon: (
      <IconPlaceholder
        lucide="ArchiveIcon"
        tabler="IconArchive"
        hugeicons="Archive02Icon"
        phosphor="ArchiveIcon"
        remixicon="RiArchiveLine"
      />
    ),
    label: "Archive",
    count: 0,
  },
  {
    icon: (
      <IconPlaceholder
        lucide="Trash2Icon"
        tabler="IconTrash"
        hugeicons="Delete02Icon"
        phosphor="TrashIcon"
        remixicon="RiDeleteBinLine"
      />
    ),
    label: "Trash",
    count: 0,
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-64 flex-col gap-0.5">
      {menuItems.map((item) => (
        <Item key={item.label} size="xs" render={<a href="#" />}>
          <ItemMedia variant="icon">{item.icon}</ItemMedia>
          <ItemContent>
            <ItemTitle>{item.label}</ItemTitle>
          </ItemContent>
          {item.count > 1 && (
            <ItemActions>
              <Badge variant="success-light" className="rounded-full" size="xs">
                {item.count}
              </Badge>
            </ItemActions>
          )}
        </Item>
      ))}
    </div>
  )
}
