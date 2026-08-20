"use client"

import { useState } from "react"
import { Filters } from "@/registry-reui/bases/base/reui/filters/filters"
import {
  createFilterQuery,
  createFilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterField,
  FilterQuery,
  FilterValueType,
} from "@/registry-reui/bases/base/reui/filters/filters-types"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                 Type icons                                 */
/* -------------------------------------------------------------------------- */

/**
 * One icon per value type, created once and shared by reference.
 *
 * A branch earns a bespoke icon, because the top level is scanned by meaning. A
 * leaf carries its TYPE instead: three rows into a level of 250 the useful
 * question stops being "which noun is this" and becomes "will this ask me for a
 * number, a word or a choice", and that is the only thing telling one generated
 * row from the next.
 *
 * Icon names are written out per set rather than built by a helper: the shadcn
 * CLI rewrites these attributes to a real import at install time and only
 * accepts string literals, so a computed name breaks `shadcn add` for everyone
 * installing this example.
 */
const TYPE_ICON: Partial<Record<FilterValueType, FilterField["icon"]>> = {
  text: (
    <IconPlaceholder
      lucide="TypeIcon"
      tabler="IconLetterT"
      hugeicons="TextIcon"
      phosphor="TextTIcon"
      remixicon="RiText"
    />
  ),
  number: (
    <IconPlaceholder
      lucide="HashIcon"
      tabler="IconHash"
      hugeicons="HashtagIcon"
      phosphor="HashIcon"
      remixicon="RiHashtag"
    />
  ),
  select: (
    <IconPlaceholder
      lucide="ListIcon"
      tabler="IconList"
      hugeicons="LeftToRightListBulletIcon"
      phosphor="ListIcon"
      remixicon="RiListUnordered"
    />
  ),
  multiselect: (
    <IconPlaceholder
      lucide="TagsIcon"
      tabler="IconTags"
      hugeicons="Tag01Icon"
      phosphor="TagIcon"
      remixicon="RiPriceTag3Line"
    />
  ),
  boolean: (
    <IconPlaceholder
      lucide="SquareCheckIcon"
      tabler="IconSquareCheck"
      hugeicons="CheckmarkSquare02Icon"
      phosphor="CheckSquareIcon"
      remixicon="RiCheckboxLine"
    />
  ),
}

/** The compact form a generated attribute is written in. */
type Attribute = [label: string, type: FilterValueType, options?: string[]]

const slugify = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-")

/** Option labels, slugged into the values a query is stored with. */
const toOptions = (labels: string[]) =>
  labels.map((label) => ({ value: slugify(label), label }))

/** One leaf from its compact form. `copy` numbers the repeats past the first. */
function toField([label, type, options]: Attribute, copy = 1): FilterField {
  const name = copy > 1 ? `${label} ${copy}` : label
  return {
    id: slugify(name),
    label: name,
    type,
    icon: TYPE_ICON[type],
    options: options && toOptions(options),
  }
}

/* -------------------------------------------------------------------------- */
/*                             A hand written level                           */
/* -------------------------------------------------------------------------- */

// A field holding `fields` renders as a branch, and a branch always DRILLS IN.
// It never commits a filter on itself: the row carries a chevron and a child
// count, so a press has one meaning, and "filter on the branch as a whole" is
// declared as an ordinary leaf beside its siblings (Name > Full) rather than as
// a second meaning for the same click.
//
// `keywords` are matched by search alongside the label and are never drawn, so
// they are where a schema absorbs the words users actually type: half a team
// says postcode and the other half says zip, and the person searching for the
// second one should not have to learn the first.
//
// No branch here sets `count`. The picker falls back to the number of children
// it holds, which is the truth for a level declared in full; an explicit count
// is for the level that knows its total before it has fetched it, which is the
// generated branch below.
const CORE: FilterField[] = [
  {
    id: "record-id",
    label: "Record ID",
    type: "text",
    keywords: ["uuid", "primary key", "identifier"],
    placeholder: "8f14e45f",
    icon: (
      <IconPlaceholder
        lucide="HashIcon"
        tabler="IconHash"
        hugeicons="HashtagIcon"
        phosphor="HashIcon"
        remixicon="RiHashtag"
      />
    ),
  },
  {
    id: "name",
    label: "Name",
    icon: (
      <IconPlaceholder
        lucide="UserIcon"
        tabler="IconUser"
        hugeicons="User02Icon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
      />
    ),
    fields: [
      { id: "first", label: "First", type: "text", icon: TYPE_ICON.text },
      { id: "last", label: "Last", type: "text", icon: TYPE_ICON.text },
      {
        id: "full",
        label: "Full",
        type: "text",
        icon: TYPE_ICON.text,
        keywords: ["display name", "whole name"],
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: (
      <IconPlaceholder
        lucide="UsersIcon"
        tabler="IconUsers"
        hugeicons="UserMultiple02Icon"
        phosphor="UsersIcon"
        remixicon="RiGroupLine"
      />
    ),
    fields: [
      {
        id: "lead",
        label: "Lead",
        type: "text",
        icon: TYPE_ICON.text,
        keywords: ["manager", "owner", "reports to"],
      },
      {
        id: "size",
        label: "Size",
        type: "number",
        icon: TYPE_ICON.number,
        keywords: ["headcount", "seats"],
      },
      {
        id: "department",
        label: "Department",
        type: "select",
        icon: TYPE_ICON.select,
        keywords: ["function", "discipline"],
        options: toOptions([
          "Engineering",
          "Design",
          "Sales",
          "Marketing",
          "Support",
          "Finance",
        ]),
      },
      {
        id: "region",
        label: "Region",
        type: "select",
        icon: TYPE_ICON.select,
        keywords: ["territory", "market"],
        options: toOptions(["North America", "EMEA", "APAC", "LATAM"]),
      },
    ],
  },
  {
    id: "location",
    label: "Primary location",
    icon: (
      <IconPlaceholder
        lucide="MapPinIcon"
        tabler="IconMapPin"
        hugeicons="Location01Icon"
        phosphor="MapPinIcon"
        remixicon="RiMapPinLine"
      />
    ),
    fields: [
      {
        id: "city",
        label: "City",
        type: "text",
        icon: TYPE_ICON.text,
        keywords: ["town"],
      },
      {
        id: "country",
        label: "Country",
        type: "text",
        icon: TYPE_ICON.text,
        keywords: ["market"],
      },
      {
        id: "postcode",
        label: "Postcode",
        type: "text",
        icon: TYPE_ICON.text,
        placeholder: "SW1A",
        keywords: ["zip", "postal code", "zip code"],
      },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                            A workspace sized level                         */
/* -------------------------------------------------------------------------- */

const ATTRIBUTES_PER_OBJECT = 250

/** What every object carries, cycled to fill the level out. */
const GENERIC: Attribute[] = [
  ["Owner", "text"],
  ["Source", "select", ["Organic", "Paid", "Referral", "Event", "Outbound"]],
  ["Health score", "number"],
  ["Tags", "multiselect", ["Beta", "Churn risk", "Expansion", "VIP"]],
  ["External ID", "text"],
  ["Archived", "boolean"],
]

/** What each object OPENS with: the attributes that only it has. */
const OBJECTS: Record<string, Attribute[]> = {
  Person: [
    [
      "Lifecycle stage",
      "select",
      ["Subscriber", "Lead", "Qualified", "Opportunity", "Customer", "Churned"],
    ],
    ["Job title", "text"],
    ["Lead score", "number"],
    ["Email opt in", "boolean"],
  ],
  Company: [
    [
      "Industry",
      "select",
      ["Software", "Retail", "Finance", "Healthcare", "Manufacturing"],
    ],
    ["Employees", "number"],
    ["Domain", "text"],
    ["Publicly listed", "boolean"],
  ],
  Deal: [
    [
      "Stage",
      "select",
      ["Discovery", "Demo", "Proposal", "Negotiation", "Won", "Lost"],
    ],
    ["Amount", "number"],
    ["Close quarter", "select", ["Q1", "Q2", "Q3", "Q4"]],
    ["Forecast committed", "boolean"],
  ],
  Ticket: [
    ["Severity", "select", ["Sev 1", "Sev 2", "Sev 3", "Sev 4"]],
    ["Queue", "select", ["Billing", "Onboarding", "Bugs", "How to"]],
    ["First response minutes", "number"],
    ["Breached SLA", "boolean"],
  ],
  Invoice: [
    ["Status", "select", ["Draft", "Open", "Paid", "Overdue", "Void"]],
    ["Total", "number"],
    ["Currency", "select", ["USD", "EUR", "GBP", "JPY"]],
    ["Auto charge", "boolean"],
  ],
  Campaign: [
    [
      "Channel",
      "select",
      ["Email", "Paid search", "Paid social", "Webinar", "Field event"],
    ],
    ["Budget", "number"],
    ["Audience", "multiselect", ["Trial", "Free", "Paid", "Partner"]],
    ["Running", "boolean"],
  ],
  Product: [
    ["Category", "select", ["Hardware", "Software", "Service", "Add on"]],
    ["Price", "number"],
    ["SKU", "text"],
    ["In catalogue", "boolean"],
  ],
  Workspace: [
    ["Plan", "select", ["Free", "Pro", "Business", "Enterprise"]],
    ["Seats", "number"],
    ["Data region", "select", ["US east", "EU west", "AP south"]],
    ["SSO enforced", "boolean"],
  ],
}

/**
 * Eight objects of 250 attributes each, 2,000 in all, under one branch.
 *
 * Every object opens with the attributes that belong to it and pads out with
 * the generic ones, because scale nobody can read proves nothing: the first
 * screen has to be worth the drill, and the 246 rows under it are what the
 * windowing is for. The picker is the cascader, which windows its rows, so only
 * the visible slice is ever in the DOM however long the level runs.
 *
 * Both generated branches state their `count` rather than leaving the row to
 * count the children it was handed, which is what the prop is for: a level
 * whose total is known before it is read. And the primitive indexes the schema
 * on a content SIGNATURE rather than on the array's identity, so this tree is
 * walked into maps once and every later render reuses them.
 */
function buildCustomFields(): FilterField {
  const entries = Object.entries(OBJECTS)
  return {
    id: "custom",
    label: "Custom fields",
    count: entries.length * ATTRIBUTES_PER_OBJECT,
    icon: (
      <IconPlaceholder
        lucide="LayersIcon"
        tabler="IconStack2"
        hugeicons="Layers01Icon"
        phosphor="StackIcon"
        remixicon="RiStackLine"
      />
    ),
    fields: entries.map(([object, own]) => ({
      id: slugify(object),
      label: object,
      count: ATTRIBUTES_PER_OBJECT,
      fields: Array.from({ length: ATTRIBUTES_PER_OBJECT }, (_, index) => {
        if (index < own.length) return toField(own[index])
        const position = index - own.length
        return toField(
          GENERIC[position % GENERIC.length],
          Math.floor(position / GENERIC.length) + 1
        )
      }),
    })),
  }
}

const FIELDS: FilterField[] = [...CORE, buildCustomFields()]

export default function Pattern() {
  // ONE seeded rule, three segments deep into the level holding 2,000
  // attributes. A chip prints its whole chain, so the drill-down is legible
  // without opening the picker, and the value beside it resolves against that
  // leaf's own option list rather than being drawn as the raw stored string.
  const [query, setQuery] = useState<FilterQuery>(() =>
    createFilterQuery([
      createFilterRule({
        id: "seed-1",
        path: ["custom", "person", "lifecycle-stage"],
        operator: "is",
        value: "customer",
      }),
    ])
  )

  return (
    <Filters fields={FIELDS} query={query} onQueryChange={setQuery} showClear />
  )
}
