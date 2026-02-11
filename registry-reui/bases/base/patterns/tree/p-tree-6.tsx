// Description: Organization chart tree with avatars
// Order: 6

"use client"

import {
  Tree,
  TreeItem,
  TreeItemLabel,
} from "@/registry-reui/bases/base/reui/tree"
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

interface OrgItem {
  name: string
  role?: string
  avatar?: string
  children?: string[]
}

const items: Record<string, OrgItem> = {
  company: { name: "Acme Inc.", children: ["ceo"] },
  ceo: {
    name: "Sarah Chen",
    role: "CEO",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    children: ["cto", "coo", "cfo"],
  },
  cto: {
    name: "Alex Johnson",
    role: "CTO",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    children: ["eng-lead", "design-lead"],
  },
  coo: {
    name: "Emma Wilson",
    role: "COO",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    children: ["ops-mgr", "hr-mgr"],
  },
  cfo: {
    name: "David Kim",
    role: "CFO",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80",
    children: ["finance-mgr"],
  },
  "eng-lead": {
    name: "Michael Rodriguez",
    role: "Engineering Lead",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    children: ["dev-1", "dev-2"],
  },
  "design-lead": {
    name: "Lisa Park",
    role: "Design Lead",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
  },
  "ops-mgr": {
    name: "James Brown",
    role: "Operations Manager",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
  },
  "hr-mgr": {
    name: "Amy Taylor",
    role: "HR Manager",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&dpr=2&q=80",
  },
  "finance-mgr": {
    name: "Robert Davis",
    role: "Finance Manager",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=96&h=96&dpr=2&q=80",
  },
  "dev-1": {
    name: "Tom Harris",
    role: "Senior Developer",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80",
  },
  "dev-2": {
    name: "Nina Patel",
    role: "Developer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80",
  },
}

const indent = 24

export default function Pattern() {
  const tree = useTree<OrgItem>({
    initialState: {
      expandedItems: ["ceo", "cto"],
    },
    indent,
    rootItemId: "company",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  })

  return (
    <div className="mx-auto w-full grow place-self-start lg:w-xs">
      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => {
          const data = item.getItemData()
          const initials = data.name
            .split(" ")
            .map((n) => n[0])
            .join("")

          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel className="gap-2 py-1">
                <Avatar className="size-6 shrink-0">
                  <AvatarImage src={data.avatar} alt={data.name} />
                  <AvatarFallback className="text-[9px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col items-start">
                  <span className="text-sm leading-tight">{data.name}</span>
                  {data.role && (
                    <span className="text-muted-foreground text-[10px] leading-tight">
                      {data.role}
                    </span>
                  )}
                </span>
              </TreeItemLabel>
            </TreeItem>
          )
        })}
      </Tree>
    </div>
  )
}
