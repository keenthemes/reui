// Description: Multi-level collapsible menu
// Order: 9

"use client"

import { ReactElement, useState } from "react"

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import { Item, ItemMedia, ItemTitle } from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type NavItem = {
  id: string
  name: string
  icon: ReactElement
  items?: NavItem[]
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: (
      <IconPlaceholder
        lucide="LayoutDashboardIcon"
        tabler="IconLayoutDashboard"
        hugeicons="DashboardSquare02Icon"
        phosphor="LayoutIcon"
        remixicon="RiDashboardLine"
      />
    ),
    items: [
      {
        id: "analytics",
        name: "Analytics",
        icon: (
          <IconPlaceholder
            lucide="ChartBarIcon"
            tabler="IconChartSankey"
            hugeicons="BarChartHorizontalIcon"
            phosphor="ChartLineIcon"
            remixicon="RiLineChartLine"
          />
        ),
        items: [
          {
            id: "real-time",
            name: "Real-time",
            icon: (
              <IconPlaceholder
                lucide="FileTextIcon"
                tabler="IconFileText"
                hugeicons="File02Icon"
                phosphor="FileTextIcon"
                remixicon="RiFileTextLine"
                aria-hidden="true"
              />
            ),
          },
          {
            id: "historical",
            name: "Historical",
            icon: (
              <IconPlaceholder
                lucide="FileTextIcon"
                tabler="IconFileText"
                hugeicons="File02Icon"
                phosphor="FileTextIcon"
                remixicon="RiFileTextLine"
                aria-hidden="true"
              />
            ),
          },
        ],
      },
      {
        id: "reports",
        name: "Reports",
        icon: (
          <IconPlaceholder
            lucide="MessageSquareIcon"
            tabler="IconMessageDots"
            hugeicons="Message02Icon"
            phosphor="ChatIcon"
            remixicon="RiChat4Line"
            aria-hidden="true"
          />
        ),
      },
    ],
  },
  {
    id: "team",
    name: "Team",
    icon: (
      <IconPlaceholder
        lucide="UserIcon"
        tabler="IconUser"
        hugeicons="UserIcon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
        aria-hidden="true"
      />
    ),
    items: [
      {
        id: "members",
        name: "Members",
        icon: (
          <IconPlaceholder
            lucide="UserIcon"
            tabler="IconUser"
            hugeicons="UserIcon"
            phosphor="UserIcon"
            remixicon="RiUserLine"
            aria-hidden="true"
          />
        ),
      },
      {
        id: "permissions",
        name: "Permissions",
        icon: (
          <IconPlaceholder
            lucide="ShieldIcon"
            tabler="IconShield"
            hugeicons="Shield01Icon"
            phosphor="ShieldIcon"
            remixicon="RiShieldLine"
            aria-hidden="true"
          />
        ),
      },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    icon: (
      <IconPlaceholder
        lucide="CreditCardIcon"
        tabler="IconCreditCard"
        hugeicons="CreditCardIcon"
        phosphor="CreditCardIcon"
        remixicon="RiBankCardLine"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "settings",
    name: "Settings",
    icon: (
      <IconPlaceholder
        lucide="SettingsIcon"
        tabler="IconSettings"
        hugeicons="SettingsIcon"
        phosphor="GearIcon"
        remixicon="RiSettings3Line"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: (
      <IconPlaceholder
        lucide="BellIcon"
        tabler="IconBell"
        hugeicons="NotificationIcon"
        phosphor="BellIcon"
        remixicon="RiNotificationLine"
        aria-hidden="true"
      />
    ),
  },
]

function NavMenuItem({
  item,
  level = 0,
  selectedId,
  onSelect,
}: {
  item: NavItem
  level?: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const isFolder = !!item.items && item.items.length > 0
  const isSelected = selectedId === item.id

  if (isFolder) {
    return (
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger
          render={
            <Item
              size="xs"
              className="hover:bg-accent data-[state=open]:bg-accent group/item cursor-pointer py-1.25"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
            />
          }
        >
          <ItemMedia variant="icon">
            <div className="text-muted-foreground group-hover/item:text-foreground size-3.5">
              {item.icon}
            </div>
          </ItemMedia>
          <ItemTitle className="data-[state=open]/collapsible:font-semibold text-sm">
            {item.name}
          </ItemTitle>
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
            aria-hidden="true"
            className="text-muted-foreground ml-auto size-4 transition-transform in-data-open:rotate-90"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden pt-0.5">
          <div className="flex flex-col gap-0.5">
            {item.items?.map((child) => (
              <NavMenuItem
                key={child.id}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Item
      size="xs"
      className="hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-foreground group/item cursor-pointer py-1.25"
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={() => onSelect(item.id)}
    >
      <ItemMedia variant="icon">
        <div className="text-muted-foreground group-hover/item:text-foreground group-data-[active=true]/item:text-foreground size-3.5">
          {item.icon}
        </div>
      </ItemMedia>
      <ItemTitle className="text-sm">{item.name}</ItemTitle>
    </Item>
  )
}

export default function Pattern() {
  const [selectedId, setSelectedId] = useState<string | null>("real-time")

  return (
    <div className="min-h-64 w-full max-w-56">
      <Card className="p-0">
        <CardContent className="p-1">
          <div className="gap-0/5 flex flex-col">
            {navItems.map((item) => (
              <NavMenuItem
                key={item.id}
                item={item}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
