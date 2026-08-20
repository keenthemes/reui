"use client"

import * as React from "react"
import {
  useCascaderActions,
  useCascaderState,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-context"
import type { CascaderColumn } from "@/registry-reui/bases/radix/reui/cascader/cascader-context"
import {
  CascaderItem,
  getCascaderMoreProps,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  CASCADER_LIST_HEIGHT_CLASS,
  CASCADER_LIST_PAD_CLASS,
  CASCADER_ROOT_KEY,
  CASCADER_ROWS_CLASS,
  CASCADER_SCROLL_CLASS,
  warnCascaderOnce,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-lib"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { cn } from "@/registry/bases/radix/lib/utils"
import { ScrollArea } from "@/registry/bases/radix/ui/scroll-area"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export interface CascaderColumnsProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Width of each column. */
  columnWidth?: number | string
  /** Height CAP per column. Falls back to the root `maxHeight`, then 24rem. */
  maxHeight?: number | string
  /** Replaces the default panel; the seam a windowed column plugs into. */
  children?: (column: CascaderColumn) => React.ReactNode
}

/**
 * Miller columns: the open trail side by side, one panel per level. Only the
 * DEEPEST column is a real listbox (Base UI owns exactly one list); the trail
 * behind is plain buttons, which keeps one state machine instead of a second,
 * 2D one. `CascaderInput` moves between columns with ArrowLeft/ArrowRight.
 */
function CascaderColumns({
  className,
  columnWidth = 220,
  maxHeight: maxHeightProp,
  children,
  ...props
}: CascaderColumnsProps) {
  const { maxHeight, mode, labels } = useCascaderActions()
  const { columns } = useCascaderState()

  // Before the early return, so the hook count is the same in both modes.
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    if (mode === "columns") return
    warnCascaderOnce(
      `columns-outside-columns-mode:${mode}`,
      `\`CascaderColumns\` renders nothing in \`mode="${mode}"\`, so \`columnWidth\` and everything else on it does nothing. Set \`mode="columns"\` on the root, or render \`CascaderList\` instead.`
    )
  }, [mode])

  if (mode !== "columns") return null

  const height = maxHeightProp ?? maxHeight
  const toCss = (value: number | string) =>
    typeof value === "number" ? `${value}px` : value

  return (
    <div
      data-slot="cascader-columns"
      role="group"
      aria-label={labels.columnsLabel}
      style={
        {
          "--cascader-column-width": toCss(columnWidth),
          /* Set only from an EXPLICIT cap: unset means "24rem or what the
             viewport leaves", via the `min()` fallback on the panel. A `?? 280`
             default here ignored short viewports and wasted tall ones. */
          ...(height != null
            ? { "--cascader-max-height": toCss(height) }
            : null),
        } as React.CSSProperties
      }
      className={cn(
        /* `max-h-full` with `min-h-0`: the trail is the panel's shrinking
           child, and the columns inside it size against this box. */
        "flex max-h-full min-h-0 items-stretch overflow-x-auto overscroll-x-contain",
        CASCADER_LIST_PAD_CLASS,
        className
      )}
      {...props}
    >
      {columns.map((column) =>
        children ? (
          <React.Fragment key={column.depth}>{children(column)}</React.Fragment>
        ) : (
          <CascaderColumnPanel key={column.depth} column={column} />
        )
      )}
    </div>
  )
}

/**
 * One column's box. `columnWidth` is the width of the LIST, not the box: under
 * `border-box` the 1px inline-start divider on every column but the first would
 * come out of the rows, so bordered columns are widened by that pixel. The box
 * is also the BOUND, the same `min(--available-height, cap)` the single list
 * uses, and the `ScrollArea` inside scrolls, so every column shows a thumb.
 */
const PANEL_CLASS = `flex w-(--cascader-column-width) shrink-0 flex-col overscroll-contain not-first:w-[calc(var(--cascader-column-width)_+_1px)] not-first:border-border/60 not-first:border-s ${CASCADER_LIST_HEIGHT_CLASS}`

export interface CascaderColumnPanelProps {
  column: CascaderColumn
  /** Replaces the panel's rows; the empty state still wins on an empty column. */
  children?: React.ReactNode
  /** Containing block for the windowed column's absolutely positioned rows. */
  virtualized?: boolean
}

function CascaderColumnPanel({
  column,
  children,
  virtualized,
}: CascaderColumnPanelProps) {
  const {
    labels,
    baseId,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate,
    retryLevel,
  } = useCascaderActions()
  const { loadStates } = useCascaderState()

  // Keyed per level, not one global flag: columns load and land independently.
  const columnKey = column.parent?.value ?? CASCADER_ROOT_KEY
  const loadState = loadStates.get(columnKey)

  let emptyBody: React.ReactNode = labels.empty
  if (loadState?.error) {
    emptyBody = (
      <>
        {labels.error}{" "}
        <button
          type="button"
          data-slot="cascader-retry"
          onClick={() => retryLevel(columnKey)}
          className="text-foreground hover:bg-accent focus-visible:ring-ring/50 rounded-md px-1 font-medium outline-hidden transition-colors focus-visible:ring-2"
        >
          {labels.retry}
        </button>
      </>
    )
  } else if (loadState?.loading) {
    emptyBody = (
      <span className="flex items-center gap-1.5">
        <IconPlaceholder
          lucide="LoaderCircleIcon"
          tabler="IconLoader2"
          hugeicons="Loading02Icon"
          phosphor="CircleNotchIcon"
          remixicon="RiLoader4Line"
          className="size-3.5 animate-spin"
          aria-hidden
        />
        {labels.loading}
      </span>
    )
  }

  const rows =
    column.items.length === 0 ? (
      <p
        data-slot="cascader-column-empty"
        data-state={
          loadState?.error ? "error" : loadState?.loading ? "loading" : "empty"
        }
        className="text-muted-foreground px-2 py-1.5 text-sm"
      >
        {emptyBody}
      </p>
    ) : (
      (children ??
      column.items.map((node, i) => {
        const open = node.value === column.activeValue
        return (
          <CascaderItem
            key={node.value}
            node={node}
            /* A trail row must not compete for `aria-activedescendant`. */
            as={column.active ? "option" : "button"}
            depth={column.depth}
            /* Answered here, not in the row: the trail rows are memoised too. */
            branch={isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            data-open={open || undefined}
            className={open ? "bg-accent/60 text-accent-foreground" : undefined}
            /* Set metadata is option-only; a trail row is a `role="button"`. */
            {...(column.active
              ? {
                  "aria-setsize": column.items.length,
                  "aria-posinset": i + 1,
                }
              : null)}
            {...(!column.active && open
              ? {
                  "aria-expanded": true,
                  "aria-controls": `${baseId}-column-${column.depth + 1}`,
                }
              : null)}
          />
        )
      }))
    )

  const shared = {
    "data-slot": "cascader-column",
    "data-active": column.active || undefined,
    "data-depth": column.depth,
    // Addressable so the opening trail row can point `aria-controls` here, and
    // named even at the root, which has no parent label to borrow.
    id: `${baseId}-column-${column.depth}`,
    "aria-label": column.parent?.label ?? labels.rootLevel,
    // Conditional spread, never an explicit `undefined`: the active column is a
    // Base UI element, and its `mergeProps` iterates own keys.
    ...(virtualized ? { "data-virtualized": true } : null),
  }

  // A windowed row is absolutely positioned, so the ROWS' box is the containing
  // block, not the scrollport: it carries the padding the geometry is measured
  // against.
  const rowsClass = cn(CASCADER_ROWS_CLASS, virtualized && "relative")

  // The active column IS the Combobox list: only rows inside `Combobox.List`
  // reach the CompositeList, arrow-key navigation and `aria-activedescendant`.
  const body = column.active ? (
    <ComboboxPrimitive.List {...shared} className={rowsClass}>
      {rows}
    </ComboboxPrimitive.List>
  ) : (
    // A named `group`, not a second listbox competing with the active column.
    <div {...shared} role="group" className={rowsClass}>
      {rows}
    </div>
  )

  return (
    <div
      data-slot="cascader-column-bounds"
      /* Repeated from `shared`: this box, not the semantic element, owns the
         width, the divider and the height, so style hooks must reach it, and
         `:first-child` on the semantic element no longer means "first column"
         (it is its own scrollport's only child). */
      data-active={column.active || undefined}
      data-depth={column.depth}
      className={PANEL_CLASS}
    >
      <ScrollArea className={CASCADER_SCROLL_CLASS}>{body}</ScrollArea>
    </div>
  )
}

export { CascaderColumnPanel, CascaderColumns }
