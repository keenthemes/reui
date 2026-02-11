// Description: Permissions tree with checkboxes
// Order: 7

"use client"

import { useState } from "react"
import {
  Tree,
  TreeItem,
  TreeItemLabel,
} from "@/registry-reui/bases/base/reui/tree"
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"

import { Checkbox } from "@/registry/bases/base/ui/checkbox"

interface PermissionItem {
  name: string
  children?: string[]
}

const items: Record<string, PermissionItem> = {
  permissions: {
    name: "All Permissions",
    children: ["users", "content", "billing", "api"],
  },
  users: {
    name: "User Management",
    children: ["users-view", "users-create", "users-edit", "users-delete"],
  },
  "users-view": { name: "View users" },
  "users-create": { name: "Create users" },
  "users-edit": { name: "Edit users" },
  "users-delete": { name: "Delete users" },
  content: {
    name: "Content Management",
    children: ["content-view", "content-publish", "content-delete"],
  },
  "content-view": { name: "View content" },
  "content-publish": { name: "Publish content" },
  "content-delete": { name: "Delete content" },
  billing: { name: "Billing", children: ["billing-view", "billing-manage"] },
  "billing-view": { name: "View invoices" },
  "billing-manage": { name: "Manage subscriptions" },
  api: { name: "API Access", children: ["api-read", "api-write"] },
  "api-read": { name: "Read access" },
  "api-write": { name: "Write access" },
}

const indent = 24

export default function Pattern() {
  const [checked, setChecked] = useState<Set<string>>(
    new Set([
      "users-view",
      "content-view",
      "content-publish",
      "billing-view",
      "api-read",
    ])
  )

  const togglePermission = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const tree = useTree<PermissionItem>({
    initialState: {
      expandedItems: ["users", "content"],
    },
    indent,
    rootItemId: "permissions",
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
      <Tree
        indent={indent}
        tree={tree}
        toggleIconType="plus-minus"
        className=""
      >
        {tree.getItems().map((item) => {
          const id = item.getId()
          const isLeaf = !item.isFolder()

          return (
            <TreeItem key={id} item={item}>
              <TreeItemLabel className="not-in-data-[folder=true]:ps-5">
                <span className="flex items-center gap-2">
                  {isLeaf && (
                    <Checkbox
                      checked={checked.has(id)}
                      onCheckedChange={() => togglePermission(id)}
                      className="size-3.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {item.getItemName()}
                </span>
              </TreeItemLabel>
            </TreeItem>
          )
        })}
      </Tree>
    </div>
  )
}
