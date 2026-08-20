"use client"

import { useMemo, useState } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderActions,
  useCascaderState,
} from "@/registry-reui/bases/radix/reui/cascader/cascader"
import {
  CascaderGroup,
  CascaderItem,
  CascaderLabel,
  CascaderSeparator,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const spaceIcon = (
  <IconPlaceholder
    lucide="BookIcon"
    tabler="IconBook"
    hugeicons="Book02Icon"
    phosphor="BookIcon"
    remixicon="RiBookLine"
    className="size-4"
  />
)
const folderIcon = (
  <IconPlaceholder
    lucide="FolderIcon"
    tabler="IconFolder"
    hugeicons="Folder01Icon"
    phosphor="FolderIcon"
    remixicon="RiFolderLine"
    className="size-4"
  />
)

const spaces: CascaderNode[] = [
  {
    value: "engineering",
    label: "Engineering",
    icon: spaceIcon,
    children: [
      { value: "engineering.rfcs", label: "RFCs", icon: folderIcon },
      {
        value: "engineering.runbooks",
        label: "Runbooks",
        icon: folderIcon,
        keywords: ["oncall"],
      },
      {
        value: "engineering.postmortems",
        label: "Postmortems",
        icon: folderIcon,
      },
      {
        value: "engineering.architecture",
        label: "Architecture",
        icon: folderIcon,
      },
    ],
  },
  {
    value: "design",
    label: "Design",
    icon: spaceIcon,
    children: [
      { value: "design.system", label: "Design system", icon: folderIcon },
      { value: "design.research", label: "Research", icon: folderIcon },
      { value: "design.brand", label: "Brand", icon: folderIcon },
    ],
  },
  {
    value: "product",
    label: "Product",
    icon: spaceIcon,
    children: [
      { value: "product.roadmap", label: "Roadmap", icon: folderIcon },
      { value: "product.specs", label: "Specs", icon: folderIcon },
      { value: "product.launches", label: "Launch plans", icon: folderIcon },
    ],
  },
  {
    value: "marketing",
    label: "Marketing",
    icon: spaceIcon,
    children: [
      { value: "marketing.campaigns", label: "Campaigns", icon: folderIcon },
      {
        value: "marketing.calendar",
        label: "Content calendar",
        icon: folderIcon,
      },
      { value: "marketing.seo", label: "Search", icon: folderIcon },
    ],
  },
  {
    value: "sales",
    label: "Sales",
    icon: spaceIcon,
    children: [
      { value: "sales.playbooks", label: "Playbooks", icon: folderIcon },
      { value: "sales.pricing", label: "Pricing", icon: folderIcon },
      { value: "sales.stories", label: "Customer stories", icon: folderIcon },
    ],
  },
  {
    value: "support",
    label: "Support",
    icon: spaceIcon,
    children: [
      { value: "support.macros", label: "Macros", icon: folderIcon },
      { value: "support.escalations", label: "Escalations", icon: folderIcon },
      {
        value: "support.known-issues",
        label: "Known issues",
        icon: folderIcon,
      },
    ],
  },
  {
    value: "people",
    label: "People",
    icon: spaceIcon,
    children: [
      {
        value: "people.handbook",
        label: "Handbook",
        icon: folderIcon,
        keywords: ["policy"],
      },
      { value: "people.onboarding", label: "Onboarding", icon: folderIcon },
      { value: "people.reviews", label: "Reviews", icon: folderIcon },
    ],
  },
  {
    value: "finance",
    label: "Finance",
    icon: spaceIcon,
    children: [
      { value: "finance.budgets", label: "Budgets", icon: folderIcon },
      { value: "finance.forecasts", label: "Forecasts", icon: folderIcon },
      { value: "finance.invoices", label: "Invoices", icon: folderIcon },
    ],
  },
  {
    value: "legal",
    label: "Legal",
    icon: spaceIcon,
    children: [
      { value: "legal.contracts", label: "Contracts", icon: folderIcon },
      { value: "legal.compliance", label: "Compliance", icon: folderIcon },
      { value: "legal.trademarks", label: "Trademarks", icon: folderIcon },
    ],
  },
  {
    value: "personal",
    label: "Personal",
    icon: spaceIcon,
    children: [
      { value: "personal.drafts", label: "Drafts", icon: folderIcon },
      { value: "personal.scratch", label: "Scratchpad", icon: folderIcon },
    ],
  },
]

/** How many entries the recent run holds before the oldest one falls out. */
const RECENT_LIMIT = 3

const spaceByValue = new Map(
  spaces.map((space) => [space.value, space] as const)
)

/**
 * Every destination, keyed by the value the cascader commits: the space it
 * belongs to, and the full name to report once it is picked.
 *
 * One flat map rather than a walk back up the tree. The example already owns
 * the data, so resolving "which space did that folder come from" is a lookup,
 * and nothing here has to reach into the primitive's own index to answer it.
 */
const folderIndex = new Map(
  spaces.flatMap((space) =>
    (space.children ?? []).map(
      (folder) =>
        [
          folder.value,
          { space: space.value, name: `${space.label} / ${folder.label}` },
        ] as const
    )
  )
)

/**
 * The root level, in two named runs.
 *
 * `CascaderItems` renders ONE flat run per level, so a level with headings has
 * to be composed by hand - and the rules it has to keep are all about the array
 * it is composed from. `Combobox.Root` is given `renderedItems`, and Base UI
 * sizes its `listRef` from that array and maps a highlight index straight back
 * into it. So the rows in the DOM must be exactly that array, in that order,
 * each node once: split it with `slice`, never rebuild it with `filter` or by
 * pulling a node in from somewhere else in the tree. A recent run is therefore
 * a REORDERING of the root level (see `items` below), not a second copy of
 * three rows that already appear further down.
 *
 * Two more rules that a hand-written run is on the hook for:
 *
 * - `aria-setsize` and `aria-posinset` count across the whole LEVEL, not the
 *   group. Numbering each run from one would have the second group announce
 *   "1 of 7" under a heading that is genuinely the fourth row of ten.
 * - No `index` prop. `CascaderItem` only forwards one while the list is
 *   windowed; passing it here would make each row self-register, truncate Base
 *   UI's `listRef` and leave `aria-activedescendant` pointing at nothing.
 *
 * The groups are a ROOT-level affordance and nothing else. Inside a space there
 * is no "recently used" run to show, and while a query is running the level is
 * a set of search hits whose order is the match order - a heading over either
 * would name a group that does not exist. Both cases fall back to the plain
 * flat run, which is also where deep-search results pick up their ancestor path.
 */
function DestinationItems({ recentCount }: { recentCount: number }) {
  const { isBranch, isSelectable, isSelected, isIndeterminate } =
    useCascaderActions()
  const { renderedItems, currentParent, query, deepResults } =
    useCascaderState()

  const row = (node: CascaderNode, index: number) => (
    <CascaderItem
      key={node.value}
      node={node}
      showPath={deepResults !== null}
      branch={isBranch(node)}
      selectable={isSelectable(node)}
      selected={isSelected(node)}
      indeterminate={isIndeterminate(node)}
      aria-setsize={renderedItems.length}
      aria-posinset={index + 1}
    />
  )

  if (currentParent !== null || query !== "") {
    return <>{renderedItems.map(row)}</>
  }

  return (
    <>
      {/* `CascaderGroup`, not a `<div>` with a heading in it. A listbox drops a
          bare heading from the accessibility tree entirely - it looks right and
          reads as if it were not there - whereas the group is what carries the
          name, so the run is announced as "Recently used, group". */}
      <CascaderGroup>
        <CascaderLabel>Recently used</CascaderLabel>
        {renderedItems.slice(0, recentCount).map(row)}
      </CascaderGroup>

      {/* Decorative, and deliberately so: the two runs are already separated
          for a screen reader by the groups around them. */}
      <CascaderSeparator />

      <CascaderGroup>
        <CascaderLabel>All spaces</CascaderLabel>
        {renderedItems
          .slice(recentCount)
          .map((node, index) => row(node, index + recentCount))}
      </CascaderGroup>
    </>
  )
}

/**
 * A grouped level: a short run of recent destinations above the full catalogue.
 *
 * Moving a page is a two-part question - which space, then which folder - and
 * drill-down answers it one part at a time, which is the right shape right up
 * until you notice that most moves go back to somewhere you were last week. A
 * flat list of ten spaces makes those three cost the same as the other seven.
 * Lifting them into their own named run is what earns the grouping: it turns
 * the common move into one press and a pick, and it costs the catalogue
 * nothing, because the recent run is the same ten root entries in a different
 * order rather than three extra rows.
 *
 * Recency is real here, not a decoration. Pick a folder and its space moves to
 * the head of the run, which is the whole reason `items` is derived from state
 * instead of being the static array below it. Order is the ONLY thing that
 * changes: the tree is the same tree, and a space appears exactly once in it.
 *
 * `revealSelected={false}` for the same reason. Reopening onto the level that
 * holds the current selection is right for a field being edited, but a move is
 * a fresh action every time - it should start at the root, where the recent run
 * is, not inside whichever space was used last.
 */
export default function Pattern() {
  const [value, setValue] = useState("")
  const [recent, setRecent] = useState<string[]>([
    "product",
    "engineering",
    "design",
  ])
  const [log, setLog] = useState("")

  // Recent first, then everything else in catalogue order. Built by
  // concatenation rather than by sorting, so the first `recent.length` entries
  // are the recent ones by construction - which is exactly the promise
  // `DestinationItems` slices the level on.
  const items = useMemo(() => {
    const pinned = recent
      .map((entry) => spaceByValue.get(entry))
      .filter((space): space is CascaderNode => space != null)
    const rest = spaces.filter((space) => !recent.includes(space.value))
    return [...pinned, ...rest]
  }, [recent])

  const handleValueChange = (next: string) => {
    setValue(next)
    const destination = folderIndex.get(next)
    if (!destination) return
    setRecent((previous) =>
      [
        destination.space,
        ...previous.filter((entry) => entry !== destination.space),
      ].slice(0, RECENT_LIMIT)
    )
    setLog(`Moved to ${destination.name}`)
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 p-4">
      <Cascader
        items={items}
        value={value}
        onValueChange={handleValueChange}
        revealSelected={false}
        searchScope="deep"
      >
        <CascaderTrigger
          aria-label="Destination"
          render={
            <Button
              variant="outline"
              className="w-72 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue placeholder="Move page to" maxSegments={2} />
        </CascaderTrigger>

        <CascaderContent className="w-72">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput placeholder="Search spaces and folders..." />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <DestinationItems recentCount={recent.length} />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>

      <p className="text-muted-foreground min-h-4 text-xs" role="status">
        {log}
      </p>
    </div>
  )
}
