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
} from "@/registry-reui/bases/radix/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

import { Button } from "@/registry/bases/radix/ui/button"

const menu: CascaderNode[] = [
  {
    value: "food",
    label: "Food",
    children: [
      {
        value: "food.mains",
        label: "Mains",
        children: [
          { value: "food.mains.pasta", label: "Pasta" },
          { value: "food.mains.curry", label: "Curry" },
          { value: "food.mains.risotto", label: "Risotto" },
        ],
      },
      { value: "food.sides", label: "Sides" },
      { value: "food.salads", label: "Salads" },
    ],
  },
  {
    value: "drinks",
    label: "Drinks",
    children: [
      { value: "drinks.coffee", label: "Coffee" },
      { value: "drinks.tea", label: "Tea" },
      { value: "drinks.juice", label: "Juice" },
    ],
  },
  {
    value: "breakfast",
    label: "Breakfast",
    children: [
      { value: "breakfast.pastry", label: "Pastries" },
      { value: "breakfast.eggs", label: "Eggs" },
    ],
  },
  {
    value: "desserts",
    label: "Desserts",
    children: [
      { value: "desserts.cake", label: "Cake" },
      { value: "desserts.icecream", label: "Ice cream" },
    ],
  },
  {
    value: "snacks",
    label: "Snacks",
    children: [
      { value: "snacks.crisps", label: "Crisps" },
      { value: "snacks.nuts", label: "Nuts" },
    ],
  },
  {
    value: "specials",
    label: "Specials",
    children: [
      { value: "specials.soup", label: "Soup of the day" },
      { value: "specials.roast", label: "Sunday roast" },
    ],
  },
  {
    value: "kids",
    label: "Kids menu",
    children: [
      { value: "kids.pasta", label: "Pasta" },
      { value: "kids.fruit", label: "Fruit plate" },
    ],
  },
  { value: "water", label: "Still water" },
]

/**
 * Value to label for every node, flattened once at module scope so the readout
 * can name a path without walking the tree on each render.
 */
const LABELS = new Map<string, string>()

function indexLabels(nodes: CascaderNode[]) {
  for (const node of nodes) {
    LABELS.set(node.value, node.label)
    if (node.children) indexLabels(node.children)
  }
}

indexLabels(menu)

/**
 * Every piece of state the cascader holds is driven from outside here: the
 * selection, the navigation path, the query and the open state. The buttons
 * write the path and the selection directly, and the readout below prints all
 * four, so the controlled contract is observable rather than merely claimed.
 *
 * Both path buttons also OPEN the popup, and that is the point rather than a
 * convenience. The path is only ever drawn inside the panel, so writing it
 * while the popup is shut changes state nothing renders; and a press on a
 * button outside the popup dismisses an open panel before the handler runs, so
 * a handler that only writes the path looks dead in both states. Reopening is
 * what makes an external navigation visible at all.
 *
 * `onValueChange` also hands over a details object, so the change line is built
 * straight from the committed node and its ancestor chain rather than looking
 * the raw value back up in `menu`.
 */
export default function Pattern() {
  const [value, setValue] = useState("")
  const [path, setPath] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [lastChange, setLastChange] = useState("(none yet)")

  // The query is cleared alongside the jump for the same reason the primitive's
  // own breadcrumb and back button clear it: a filter typed against one level
  // has no meaning against the level you just landed on.
  const goTo = (next: string[]) => {
    setPath(next)
    setQuery("")
    setOpen(true)
  }

  const here = path.length
    ? path.map((entry) => LABELS.get(entry) ?? entry).join(" / ")
    : "root"

  return (
    <div className="flex w-full flex-col items-center gap-3 p-4">
      <Cascader
        items={menu}
        value={value}
        onValueChange={(next, details) => {
          setValue(next)
          setLastChange(
            `${details.reason}: ${details.path.map((node) => node.label).join(" / ")}`
          )
        }}
        path={path}
        onPathChange={setPath}
        inputValue={query}
        onInputValueChange={setQuery}
        open={open}
        onOpenChange={setOpen}
        revealSelected={false}
      >
        <CascaderTrigger
          aria-label="Menu item"
          render={
            <Button
              variant="outline"
              className="w-72 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue placeholder="Pick an item" />
        </CascaderTrigger>

        <CascaderContent className="w-72">
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

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => goTo(["food", "food.mains"])}
        >
          Jump to Mains
        </Button>
        <Button size="sm" variant="outline" onClick={() => goTo([])}>
          Reset to root
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!value}
          onClick={() => {
            setValue("")
            // Written from outside, so `onValueChange` never fires and the
            // change line would otherwise still name the node just dropped.
            setLastChange("cleared from outside")
          }}
        >
          Clear selection
        </Button>
      </div>

      <dl className="text-muted-foreground grid w-72 grid-cols-[3.5rem_1fr] gap-x-3 gap-y-1 font-mono text-xs">
        <dt>path</dt>
        <dd className="text-foreground truncate">{here}</dd>
        <dt>query</dt>
        <dd className="text-foreground truncate">{query || "(empty)"}</dd>
        <dt>open</dt>
        <dd className="text-foreground">{open ? "true" : "false"}</dd>
        <dt>change</dt>
        <dd className="text-foreground truncate">{lastChange}</dd>
      </dl>
    </div>
  )
}
