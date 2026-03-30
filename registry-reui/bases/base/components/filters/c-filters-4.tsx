// Description: Filters with small size controls
// Order: 4
// GridSize: 1

"use client"

import { useCallback, useState } from "react"
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@/registry-reui/bases/base/reui/filters"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "todo":
      return (
        <IconPlaceholder
          lucide="ClockIcon"
          tabler="IconClock"
          hugeicons="ClockIcon"
          phosphor="ClockIcon"
          remixicon="RiTimeLine"
          className="text-primary"
        />
      )
    case "in-progress":
      return (
        <IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconAlertCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
          className="text-yellow-500"
        />
      )
    case "done":
      return (
        <IconPlaceholder
          lucide="CircleCheckIcon"
          tabler="IconCircleCheck"
          hugeicons="CheckmarkCircle01Icon"
          phosphor="CheckCircleIcon"
          remixicon="RiCheckboxCircleLine"
          className="text-green-500"
        />
      )
    case "cancelled":
      return (
        <IconPlaceholder
          lucide="BanIcon"
          tabler="IconBan"
          hugeicons="UnavailableIcon"
          phosphor="ProhibitIcon"
          remixicon="RiProhibitedLine"
          className="text-destructive"
        />
      )
    default:
      return (
        <IconPlaceholder
          lucide="CircleIcon"
          tabler="IconCircle"
          hugeicons="CircleIcon"
          phosphor="CircleIcon"
          remixicon="RiCircleLine"
          className="text-muted-foreground"
        />
      )
  }
}

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
  // Basic filter fields for size variant demo
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
      className: "w-48",
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
      key: "status",
      label: "Status",
      icon: (
        <IconPlaceholder
          lucide="ClockIcon"
          tabler="IconClock"
          hugeicons="ClockIcon"
          phosphor="ClockIcon"
          remixicon="RiTimeLine"
          className="size-3.5"
        />
      ),
      type: "select",
      searchable: false,
      className: "w-[200px]",
      options: [
        { value: "todo", label: "To Do", icon: <StatusIcon status="todo" /> },
        {
          value: "in-progress",
          label: "In Progress",
          icon: <StatusIcon status="in-progress" />,
        },
        { value: "done", label: "Done", icon: <StatusIcon status="done" /> },
        {
          value: "cancelled",
          label: "Cancelled",
          icon: <StatusIcon status="cancelled" />,
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

  const [smallFilters, setSmallFilters] = useState<Filter[]>([
    createFilter("priority", "is_any_of", ["high", "urgent"]),
  ])

  const [mediumFilters, setMediumFilters] = useState<Filter[]>([
    createFilter("status", "is", ["todo"]),
  ])

  const [largeFilters, setLargeFilters] = useState<Filter[]>([
    createFilter("email", "contains", ["example@example.com"]),
  ])

  const handleSmallFiltersChange = useCallback((filters: Filter[]) => {
    setSmallFilters(filters)
  }, [])

  const handleMediumFiltersChange = useCallback((filters: Filter[]) => {
    setMediumFilters(filters)
  }, [])

  const handleLargeFiltersChange = useCallback((filters: Filter[]) => {
    setLargeFilters(filters)
  }, [])

  return (
    <div className="flex grow flex-col content-start items-start gap-2.5 space-y-6 self-start">
      <Filters
        size="sm"
        filters={smallFilters}
        fields={fields}
        onChange={handleSmallFiltersChange}
        trigger={
          <Button variant="outline" size="icon-sm">
            <IconPlaceholder
              lucide="ListFilterIcon"
              tabler="IconFilter2"
              hugeicons="FilterMailIcon"
              phosphor="FunnelSimpleIcon"
              remixicon="RiFilter3Line"
            />
          </Button>
        }
      />
    </div>
  )
}
