// Description: With groups and labels
// Order: 8

"use client"

import { useMemo, useState } from "react"
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/registry-reui/bases/base/reui/autocomplete"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)

  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: "base" })

  const filteredItems = useMemo(() => {
    if (!value) return groupedUsers

    return groupedUsers
      .map((group) => ({
        ...group,
        items: (group.items || []).filter(
          (item) =>
            contains(item.name || "", value) ||
            contains(item.group || "", value) ||
            contains(item.position || "", value)
        ),
      }))
      .filter((group) => group.items && group.items.length > 0)
  }, [value, contains])

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        items={filteredItems}
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        itemToStringValue={(item: unknown) => (item as User).name}
        filter={null}
      >
        <AutocompleteInput placeholder="e.g. John, Developer, Marketing" />
        {open && (
          <AutocompleteContent className="pt-0">
            {filteredItems.length === 0 ? (
              <AutocompleteEmpty>No matching users found.</AutocompleteEmpty>
            ) : (
              <AutocompleteList className="not-empty:py-0">
                {(group: UserGroup) => (
                  <AutocompleteGroup
                    key={group.group}
                    items={group.items}
                    className="py-0"
                  >
                    <AutocompleteGroupLabel className="bg-background text-muted-foreground sticky top-0 z-10 me-1.5 py-2.5 text-xs font-medium">
                      {group.group}
                    </AutocompleteGroupLabel>
                    <AutocompleteCollection>
                      {(item: User) => (
                        <AutocompleteItem
                          key={item.id}
                          value={item}
                          className="flex items-center gap-2.5 rounded-lg"
                        >
                          <Avatar className="size-9">
                            <AvatarImage
                              src={item.avatar}
                              alt={item.name || "User"}
                            />
                            <AvatarFallback>
                              {(item.name || "U")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {item.name || "Unknown"}
                            </div>
                            <div className="text-muted-foreground truncate text-sm">
                              {item.position || "No position available"}
                            </div>
                          </div>
                        </AutocompleteItem>
                      )}
                    </AutocompleteCollection>
                  </AutocompleteGroup>
                )}
              </AutocompleteList>
            )}
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  )
}

interface User {
  id: string
  name: string
  group: string
  position: string
  avatar: string
  status: "Active" | "Inactive" | "Away"
}

interface UserGroup {
  group: string
  items: User[]
}

const usersData: User[] = [
  // Development Team
  {
    id: "john-doe",
    name: "John Doe",
    group: "Development Team",
    position: "Senior Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "Active",
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    group: "Development Team",
    position: "Full Stack Developer",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "Active",
  },
  {
    id: "mike-wilson",
    name: "Mike Wilson",
    group: "Development Team",
    position: "Backend Developer",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "Active",
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    group: "Development Team",
    position: "DevOps Engineer",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    status: "Away",
  },
  {
    id: "david-brown",
    name: "David Brown",
    group: "Development Team",
    position: "Mobile Developer",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    status: "Active",
  },
  {
    id: "lisa-garcia",
    name: "Lisa Garcia",
    group: "Development Team",
    position: "UI/UX Developer",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    status: "Active",
  },

  // Design Team
  {
    id: "alex-martinez",
    name: "Alex Martinez",
    group: "Design Team",
    position: "Lead UX Designer",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    status: "Active",
  },
  {
    id: "emma-davis",
    name: "Emma Davis",
    group: "Design Team",
    position: "UI Designer",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    status: "Active",
  },
  {
    id: "chris-taylor",
    name: "Chris Taylor",
    group: "Design Team",
    position: "Product Designer",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    status: "Active",
  },
  {
    id: "olivia-anderson",
    name: "Olivia Anderson",
    group: "Design Team",
    position: "Visual Designer",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    status: "Inactive",
  },

  // Marketing Team
  {
    id: "james-moore",
    name: "James Moore",
    group: "Marketing Team",
    position: "Marketing Manager",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    status: "Active",
  },
  {
    id: "sophia-white",
    name: "Sophia White",
    group: "Marketing Team",
    position: "Content Marketing Specialist",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    status: "Active",
  },
  {
    id: "william-harris",
    name: "William Harris",
    group: "Marketing Team",
    position: "Digital Marketing Specialist",
    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
    status: "Active",
  },
  {
    id: "ava-martin",
    name: "Ava Martin",
    group: "Marketing Team",
    position: "Social Media Manager",
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    status: "Away",
  },

  // Sales Team
  {
    id: "ethan-thompson",
    name: "Ethan Thompson",
    group: "Sales Team",
    position: "Sales Director",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    status: "Active",
  },
  {
    id: "mia-garcia",
    name: "Mia Garcia",
    group: "Sales Team",
    position: "Account Executive",
    avatar: "https://randomuser.me/api/portraits/women/16.jpg",
    status: "Active",
  },
  {
    id: "noah-martinez",
    name: "Noah Martinez",
    group: "Sales Team",
    position: "Sales Representative",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    status: "Active",
  },
  {
    id: "isabella-rodriguez",
    name: "Isabella Rodriguez",
    group: "Sales Team",
    position: "Business Development Manager",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    status: "Active",
  },

  // Management Team
  {
    id: "lucas-lee",
    name: "Lucas Lee",
    group: "Management Team",
    position: "CEO",
    avatar: "https://randomuser.me/api/portraits/men/19.jpg",
    status: "Active",
  },
  {
    id: "charlotte-walker",
    name: "Charlotte Walker",
    group: "Management Team",
    position: "CTO",
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    status: "Active",
  },
  {
    id: "benjamin-hall",
    name: "Benjamin Hall",
    group: "Management Team",
    position: "VP of Engineering",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    status: "Active",
  },
  {
    id: "amelia-allen",
    name: "Amelia Allen",
    group: "Management Team",
    position: "VP of Marketing",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    status: "Active",
  },

  // Support Team
  {
    id: "henry-young",
    name: "Henry Young",
    group: "Support Team",
    position: "Customer Success Manager",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    status: "Active",
  },
  {
    id: "grace-king",
    name: "Grace King",
    group: "Support Team",
    position: "Technical Support Specialist",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    status: "Active",
  },
  {
    id: "sebastian-wright",
    name: "Sebastian Wright",
    group: "Support Team",
    position: "Customer Support Representative",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    status: "Away",
  },
  {
    id: "lily-lopez",
    name: "Lily Lopez",
    group: "Support Team",
    position: "Help Desk Technician",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    status: "Active",
  },
]

function groupUsers(users: User[]): UserGroup[] {
  const groups: { [key: string]: User[] } = {}
  users.forEach((item) => {
    ;(groups[item.group] ??= []).push(item)
  })

  // Sort by status within each group (Active first, then Away, then Inactive)
  Object.keys(groups).forEach((group) => {
    groups[group].sort((a, b) => {
      const statusOrder = { Active: 0, Away: 1, Inactive: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
  })

  const order = [
    "Management Team",
    "Development Team",
    "Design Team",
    "Marketing Team",
    "Sales Team",
    "Support Team",
  ]
  return order.map((group) => ({ group, items: groups[group] ?? [] }))
}

const groupedUsers: UserGroup[] = groupUsers(usersData)
