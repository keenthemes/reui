// Description: Basic tree.
// Order: 1

"use client"

import {
  Tree,
  TreeItem,
  TreeItemLabel,
} from "@/registry-reui/bases/base/reui/tree"
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"

interface Item {
  name: string
  children?: string[]
}

const items: Record<string, Item> = {
  crm: {
    name: "CRM",
    children: ["leads", "accounts", "activities", "support"],
  },
  leads: {
    name: "Leads",
    children: ["new-lead", "contacted-lead", "qualified-lead"],
  },
  "new-lead": { name: "New Lead" },
  "contacted-lead": { name: "Contacted Lead" },
  "qualified-lead": { name: "Qualified Lead" },
  accounts: {
    name: "Accounts",
    children: ["acme-corp", "globex-inc"],
  },
  "acme-corp": {
    name: "Acme Corp",
    children: ["acme-contacts", "acme-opportunities"],
  },
  "acme-contacts": {
    name: "Contacts",
    children: ["john-smith", "jane-doe"],
  },
  "john-smith": { name: "John Smith" },
  "jane-doe": { name: "Jane Doe" },
  "acme-opportunities": {
    name: "Opportunities",
    children: ["website-redesign", "annual-maintenance"],
  },
  "website-redesign": { name: "Website Redesign" },
  "annual-maintenance": { name: "Annual Maintenance" },
  "globex-inc": {
    name: "Globex Inc",
    children: ["globex-contacts", "globex-opportunities"],
  },
  "globex-contacts": {
    name: "Contacts",
    children: ["alice-johnson"],
  },
  "alice-johnson": { name: "Alice Johnson" },
  "globex-opportunities": {
    name: "Opportunities",
    children: ["cloud-migration"],
  },
  "cloud-migration": { name: "Cloud Migration" },
  activities: {
    name: "Activities",
    children: ["calls", "meetings", "emails"],
  },
  calls: { name: "Calls" },
  meetings: { name: "Meetings" },
  emails: { name: "Emails" },
  support: {
    name: "Support",
    children: ["open-tickets", "closed-tickets"],
  },
  "open-tickets": { name: "Open Tickets" },
  "closed-tickets": { name: "Closed Tickets" },
}

const indent = 20

export default function Pattern() {
  const tree = useTree<Item>({
    initialState: {
      expandedItems: ["leads", "accounts", "activities"],
    },
    indent,
    rootItemId: "crm",
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
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel />
            </TreeItem>
          )
        })}
      </Tree>
    </div>
  )
}
