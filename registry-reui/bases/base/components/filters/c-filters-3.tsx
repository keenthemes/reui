// Description: Filters with custom trigger button
// Order: 3
// GridSize: 1

"use client"

import { useCallback, useState } from "react"
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@/registry-reui/bases/base/reui/filters"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Priority icon component
const PriorityIcon = ({ priority }: { priority: string }) => {
  const colors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    urgent: "text-red-500",
  }
  return (
    <IconPlaceholder
      lucide="StarIcon"
      tabler="IconStar"
      hugeicons="StarIcon"
      phosphor="StarIcon"
      remixicon="RiStarLine"
      className={colors[priority as keyof typeof colors]}
    />
  )
}

export default function Pattern() {
  // Basic filter fields for outline variant demo
  const fields: FilterFieldConfig[] = [
    {
      key: "text",
      label: "Text",
      icon: (
        <IconPlaceholder
          lucide="TagIcon"
          tabler="IconTag"
          hugeicons="Tag01Icon"
          phosphor="TagIcon"
          remixicon="RiPriceTag3Line"
          className="size-3.5"
        />
      ),
      type: "text",
      className: "w-36",
      placeholder: "Search text...",
    },
    {
      key: "email",
      label: "Email",
      icon: (
        <IconPlaceholder
          lucide="MailIcon"
          tabler="IconMail"
          hugeicons="MailIcon"
          phosphor="EnvelopeIcon"
          remixicon="RiMailLine"
          className="size-3.5"
        />
      ),
      type: "text",
      className: "w-40",
      placeholder: "user@example.com",
    },
    {
      key: "website",
      label: "Website",
      icon: (
        <IconPlaceholder
          lucide="GlobeIcon"
          tabler="IconWorld"
          hugeicons="Globe02Icon"
          phosphor="GlobeSimpleIcon"
          remixicon="RiGlobalLine"
          className="size-3.5"
        />
      ),
      type: "text",
      className: "w-40",
      placeholder: "https://example.com",
    },
    {
      key: "assignee",
      label: "Assignee",
      icon: (
        <IconPlaceholder
          lucide="UserIcon"
          tabler="IconUser"
          hugeicons="UserIcon"
          phosphor="UserIcon"
          remixicon="RiUserLine"
          className="size-3.5"
        />
      ),
      type: "multiselect",
      className: "w-[200px]",
      options: [
        {
          value: "john",
          label: "John Doe",
          icon: (
            <Avatar className="size-5">
              <AvatarImage
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: "jane",
          label: "Jane Smith",
          icon: (
            <Avatar className="size-5">
              <AvatarImage
                src="https://randomuser.me/api/portraits/women/2.jpg"
                alt="Jane Smith"
              />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: "bob",
          label: "Bob Johnson",
          icon: (
            <Avatar className="size-5">
              <AvatarImage
                src="https://randomuser.me/api/portraits/men/3.jpg"
                alt="Bob Johnson"
              />
              <AvatarFallback>BJ</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: "alice",
          label: "Alice Brown",
          icon: (
            <Avatar className="size-5">
              <AvatarImage
                src="https://randomuser.me/api/portraits/women/4.jpg"
                alt="Alice Brown"
              />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: "nick",
          label: "Nick Bold",
          icon: (
            <Avatar className="size-5">
              <AvatarImage
                src="https://randomuser.me/api/portraits/men/4.jpg"
                alt="Nick Bold"
              />
              <AvatarFallback>NB</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: "unassigned",
          label: "Unassigned",
          icon: (
            <Avatar className="size-5">
              <AvatarFallback>
                <IconPlaceholder
                  lucide="UserRoundXIcon"
                  tabler="IconUserX"
                  hugeicons="UserRemove01Icon"
                  phosphor="UserGearIcon"
                  remixicon="RiUserUnfollowLine"
                />
              </AvatarFallback>
            </Avatar>
          ),
        },
      ],
    },
    {
      key: "priority",
      label: "Priority",
      icon: (
        <IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconAlertCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
          className="size-3.5"
        />
      ),
      type: "multiselect",
      className: "w-[180px]",
      options: [
        { value: "low", label: "Low", icon: <PriorityIcon priority="low" /> },
        {
          value: "medium",
          label: "Medium",
          icon: <PriorityIcon priority="medium" />,
        },
        {
          value: "high",
          label: "High",
          icon: <PriorityIcon priority="high" />,
        },
        {
          value: "urgent",
          label: "Urgent",
          icon: <PriorityIcon priority="urgent" />,
        },
      ],
    },
  ]

  const [filters, setFilters] = useState<Filter[]>([
    createFilter("assignee", "is_any_of", ["john", "nick", "alice"]),
  ])

  const handleFiltersChange = useCallback((filters: Filter[]) => {
    setFilters(filters)
  }, [])

  return (
    <div className="flex grow content-start items-start gap-2.5 self-start">
      <div className="flex-1">
        <Filters
          filters={filters}
          fields={fields}
          trigger={
            <Button variant="outline" size="icon">
              <IconPlaceholder
                lucide="ListFilterIcon"
                tabler="IconFilter2"
                hugeicons="FilterMailIcon"
                phosphor="FunnelSimpleIcon"
                remixicon="RiFilter3Line"
              />
            </Button>
          }
          onChange={handleFiltersChange}
        />
      </div>

      {filters.length > 0 && (
        <Button variant="outline" onClick={() => setFilters([])}>
          <IconPlaceholder
            lucide="FunnelXIcon"
            tabler="IconFilterX"
            hugeicons="FilterRemoveIcon"
            phosphor="FunnelXIcon"
            remixicon="RiFilterOffLine"
          />
          Clear
        </Button>
      )}
    </div>
  )
}
