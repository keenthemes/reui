"use client"

import { useState } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@/registry-reui/bases/base/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/base/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/base/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/base/reui/cascader/cascader-types"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const textIcon = (
  <IconPlaceholder
    lucide="TypeIcon"
    tabler="IconLetterCase"
    hugeicons="TextIcon"
    phosphor="TextAaIcon"
    remixicon="RiText"
    className="size-4"
  />
)
const hashIcon = (
  <IconPlaceholder
    lucide="HashIcon"
    tabler="IconHash"
    hugeicons="Hash01Icon"
    phosphor="HashIcon"
    remixicon="RiHashtag"
    className="size-4"
  />
)
const usersIcon = (
  <IconPlaceholder
    lucide="UsersIcon"
    tabler="IconUsers"
    hugeicons="UserGroupIcon"
    phosphor="UsersIcon"
    remixicon="RiGroupLine"
    className="size-4"
  />
)
const mailIcon = (
  <IconPlaceholder
    lucide="AtSignIcon"
    tabler="IconAt"
    hugeicons="AtIcon"
    phosphor="AtIcon"
    remixicon="RiAtLine"
    className="size-4"
  />
)
const checkIcon = (
  <IconPlaceholder
    lucide="SquareCheckIcon"
    tabler="IconSquareCheck"
    hugeicons="CheckmarkSquare02Icon"
    phosphor="CheckSquareIcon"
    remixicon="RiCheckboxLine"
    className="size-4"
  />
)
const clockIcon = (
  <IconPlaceholder
    lucide="CalendarClockIcon"
    tabler="IconCalendarClock"
    hugeicons="Calendar03Icon"
    phosphor="CalendarDotsIcon"
    remixicon="RiCalendarLine"
    className="size-4"
  />
)
const userIcon = (
  <IconPlaceholder
    lucide="UserIcon"
    tabler="IconUser"
    hugeicons="User02Icon"
    phosphor="UserIcon"
    remixicon="RiUserLine"
    className="size-4"
  />
)

const attributes: CascaderNode[] = [
  { value: "record-id", label: "Record ID", icon: hashIcon },
  {
    value: "person",
    label: "Person",
    icon: usersIcon,
    count: 24,
    children: [
      { value: "person.name", label: "Name", icon: textIcon },
      {
        value: "person.email",
        label: "Email addresses",
        icon: mailIcon,
        keywords: ["mail"],
      },
      { value: "person.title", label: "Job title", icon: textIcon },
      {
        value: "person.company",
        label: "Company",
        icon: usersIcon,
        count: 8,
        children: [
          {
            value: "person.company.name",
            label: "Company name",
            icon: textIcon,
          },
          { value: "person.company.domain", label: "Domain", icon: textIcon },
          {
            value: "person.company.employees",
            label: "Employees",
            icon: hashIcon,
          },
        ],
      },
    ],
  },
  {
    value: "email",
    label: "Primary email address",
    icon: mailIcon,
    keywords: ["mail"],
  },
  { value: "user-id", label: "User ID", icon: textIcon },
  {
    value: "workspaces",
    label: "Workspaces",
    icon: usersIcon,
    count: 9,
    children: [
      { value: "workspaces.name", label: "Name", icon: textIcon },
      { value: "workspaces.plan", label: "Plan", icon: textIcon },
      { value: "workspaces.seats", label: "Seats", icon: hashIcon },
    ],
  },
  {
    value: "next-task",
    label: "Next due task",
    icon: checkIcon,
    count: 1,
    children: [{ value: "next-task.due", label: "Due date", icon: clockIcon }],
  },
  { value: "created-at", label: "Created at", icon: clockIcon },
  { value: "created-by", label: "Created by", icon: userIcon },
]

export default function Pattern() {
  const [value, setValue] = useState("")

  return (
    <div className="flex w-full justify-center p-4">
      <Cascader items={attributes} value={value} onValueChange={setValue}>
        <CascaderTrigger
          aria-label="Attribute"
          render={
            <Button
              variant="outline"
              className="w-72 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue placeholder="Select an attribute" maxSegments={3} />
        </CascaderTrigger>

        <CascaderContent className="w-80">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  )
}
