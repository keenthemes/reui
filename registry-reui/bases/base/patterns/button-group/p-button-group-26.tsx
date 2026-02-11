// Description: Button group with user selection select
// Order: 26

"use client"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    avatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    initials: "MR",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    initials: "EW",
  },
]

export default function Pattern() {
  const mappedUsers = users.map((user) => ({
    value: user.id,
    label: user.name,
    avatar: user.avatar,
    initials: user.initials,
  }))

  const [selectedUser, setSelectedUser] = useState<
    (typeof mappedUsers)[number] | null
  >(mappedUsers[2])

  return (
    <ButtonGroup>
      <Select
        value={selectedUser}
        onValueChange={(val) => setSelectedUser(val)}
        items={mappedUsers}
      >
        <SelectTrigger className="w-40">
          <SelectValue>
            {(item: (typeof mappedUsers)[number]) => (
              <span className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarImage src={item?.avatar} alt={item?.label} />
                  <AvatarFallback className="text-[10px]">
                    {item?.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{item?.label}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} className="min-w-[200px]">
          <SelectGroup>
            <SelectLabel>Team Members</SelectLabel>
            {mappedUsers.map((user) => (
              <SelectItem key={user.value} value={user}>
                <Avatar className="size-6">
                  <AvatarImage src={user.avatar} alt={user.label} />
                  <AvatarFallback className="text-[10px]">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <span>{user.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" aria-label="Add Tag">
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon" aria-label="Settings">
        <IconPlaceholder
          lucide="Settings2Icon"
          tabler="IconAdjustmentsHorizontal"
          hugeicons="FilterHorizontalIcon"
          phosphor="SlidersHorizontalIcon"
          remixicon="RiEqualizer2Line"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
