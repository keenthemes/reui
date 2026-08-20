"use client"

import * as React from "react"
import { CascaderColumnPanel } from "@/registry-reui/bases/radix/reui/cascader/cascader-columns"
import {
  useCascaderActions,
  useCascaderHighlight,
  useCascaderState,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-context"
import type { CascaderColumn } from "@/registry-reui/bases/radix/reui/cascader/cascader-context"
import {
  CascaderItem,
  CascaderItems,
  getCascaderMoreProps,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
  type Virtualizer,
} from "@tanstack/react-virtual"

/**
 * Windowing for the cascader, in its own file so the primitive's own install
 * never pulls `@tanstack/react-virtual` in. Base UI forces three rules:
 *
 * 1. A windowed row MUST carry an explicit `index`; the fallback
 *    `findItemIndex` is O(n) per row and returns `-1` on the frame a level swap
 *    renders empty, dangling `aria-activedescendant`.
 * 2. That index is DESTRUCTIVE while unvirtualized (`useCompositeListItem`
 *    skips registration, `CompositeList` truncates `elementsRef` to zero and
 *    the first arrow key highlights nothing), so rows stay plain until the root
 *    flips `virtualized`, gated inside `CascaderItem`.
 * 3. No `Combobox.Collection` and no FUNCTION CHILD on `Combobox.List`, which
 *    implicitly wraps one in a Collection: a Collection renders every filtered
 *    item.
 */

/* -------------------------------------------------------------------------- */
/*                                 Virtualizer                                */
/* -------------------------------------------------------------------------- */

export interface UseCascaderVirtualizerOptions {
  count: number
  getScrollElement: () => HTMLElement | null
  estimateSize?: number
  overscan?: number
  /** Key rows by node value, never by index: a tree expand shifts every index. */
  getItemKey: (index: number) => string | number
  /** Render index of the highlighted row, or `-1`. Pinned into the window. */
  activeIndex?: number
}

export type CascaderVirtualizer = Virtualizer<HTMLElement, HTMLElement>

/**
 * The cascader's virtualizer: TanStack plus the highlight pinning and
 * scroll-into-view a combobox list needs. `activeIndex` is clamped here, not by
 * the caller: emitted from a layout effect, it can be one commit ahead of a
 * level that just shrank and would otherwise scroll to a row that is gone.
 */
export function useCascaderVirtualizer({
  count,
  getScrollElement,
  estimateSize = 32,
  overscan = 8,
  getItemKey,
  activeIndex = -1,
}: UseCascaderVirtualizerOptions): CascaderVirtualizer {
  const active = activeIndex >= 0 && activeIndex < count ? activeIndex : -1

  // Keeps the highlighted row mounted so `aria-activedescendant` never dangles.
  const rangeExtractor = React.useCallback(
    (range: Range) => {
      const indices = new Set(defaultRangeExtractor(range))
      if (active !== -1) indices.add(active)
      return Array.from(indices).sort((a, b) => a - b)
    },
    [active]
  )

  const measureEstimate = React.useCallback(() => estimateSize, [estimateSize])

  // React Compiler bails on `useVirtualizer`; harmless, rows memoise one by one.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer<HTMLElement, HTMLElement>({
    count,
    getScrollElement,
    estimateSize: measureEstimate,
    overscan,
    getItemKey,
    rangeExtractor,
  })

  // Base UI's scroll-into-view no-ops on a windowed-out row (empty `listRef`).
  React.useEffect(() => {
    if (active === -1) return
    virtualizer.scrollToIndex(active, { align: "auto" })
  }, [active, count, virtualizer])

  return virtualizer
}

/* -------------------------------------------------------------------------- */
/*                                  Geometry                                  */
/* -------------------------------------------------------------------------- */

interface CascaderVirtualGutter {
  block: number
  inline: number
}

const NO_GUTTER: CascaderVirtualGutter = { block: 0, inline: 0 }

/**
 * The ROWS' BOX's own padding, never the scrollport's (separate element, reads
 * a flat zero). Measured because every style sets its own: a windowed row is
 * positioned against this box's PADDING box while the scroll-height spacer is
 * an in-flow child of its CONTENT box, so without it rows sit flush.
 */
function useCascaderVirtualGutter(
  contentElement: HTMLElement | null
): CascaderVirtualGutter {
  const [gutter, setGutter] = React.useState<CascaderVirtualGutter>(NO_GUTTER)

  React.useLayoutEffect(() => {
    if (!contentElement) return
    const styles = getComputedStyle(contentElement)
    const block = Number.parseFloat(styles.paddingTop) || 0
    const inline =
      Number.parseFloat(styles.paddingInlineStart || styles.paddingLeft) || 0
    setGutter((previous) =>
      previous.block === block && previous.inline === inline
        ? previous
        : { block, inline }
    )
  }, [contentElement])

  return gutter
}

/** Logical insets, not `left` / `width`, so RTL needs no second code path. */
function cascaderVirtualRowStyle(
  start: number,
  gutter: CascaderVirtualGutter
): React.CSSProperties {
  return {
    position: "absolute",
    top: 0,
    insetInlineStart: gutter.inline,
    insetInlineEnd: gutter.inline,
    transform: `translateY(${start + gutter.block}px)`,
  }
}

/**
 * The element that actually SCROLLS: the `ScrollArea` viewport above the rows'
 * box, not the rows' box itself, which never overflows, so a virtualizer aimed
 * at it would read a full `clientHeight` and render every row. `closest` rather
 * than `parentElement`, plus a fallback to the content element, keeps a
 * hand-written `overflow-y-auto` container working.
 */
function cascaderScrollElement(
  content: HTMLElement | null
): HTMLElement | null {
  if (!content) return null
  return (
    content.closest<HTMLElement>('[data-slot="scroll-area-viewport"]') ??
    content
  )
}

/**
 * `role="presentation"` keeps the listbox owning nothing but options, and this
 * node's parent IS the rows' box, saving a ref threaded through `CascaderList`.
 */
function CascaderVirtualSpacer({
  height,
  onContentElement,
}: {
  height: number
  onContentElement: (element: HTMLElement | null) => void
}) {
  return (
    <div
      ref={(node) => onContentElement(node?.parentElement ?? null)}
      role="presentation"
      data-slot="cascader-virtual-spacer"
      style={{ height }}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

export interface CascaderVirtualItemsProps {
  /** Row height before measurement. Defaults to the root `estimateRowSize`. */
  estimateSize?: number
  /** Rows rendered beyond each edge. Defaults to the root `overscan`. */
  overscan?: number
}

/**
 * Windowed replacement for `CascaderItems`, dropped inside `CascaderList`. The
 * registration is a LAYOUT effect because the root derives `virtualized` from
 * it and the flip has to land before the browser paints. Until the root has
 * seen it, this renders exactly what `CascaderItems` does, so no frame carries
 * indexed rows while Base UI still owns the composite list.
 */
function CascaderVirtualItems(props: CascaderVirtualItemsProps) {
  const { virtualized, registerVirtualRenderer } = useCascaderActions()

  React.useLayoutEffect(
    () => registerVirtualRenderer(),
    [registerVirtualRenderer]
  )

  if (!virtualized) return <CascaderItems />

  return <CascaderVirtualRows {...props} />
}

function CascaderVirtualRows({
  estimateSize,
  overscan,
}: CascaderVirtualItemsProps) {
  const {
    estimateRowSize,
    overscan: rootOverscan,
    mode,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate,
  } = useCascaderActions()
  const { renderedItems, treeRows, deepResults, loadStates } =
    useCascaderState()
  // Re-renders on every highlight change, and has to: the pinned row and the
  // scroll target are both derived from it.
  const highlight = useCascaderHighlight()

  const [contentElement, setContentElement] =
    React.useState<HTMLElement | null>(null)
  const gutter = useCascaderVirtualGutter(contentElement)

  const tree = mode === "tree"
  const count = tree ? treeRows.length : renderedItems.length
  const showPath = !tree && deepResults !== null

  const getItemKey = React.useCallback(
    (index: number) =>
      (tree ? treeRows[index]?.node.value : renderedItems[index]?.value) ??
      index,
    [tree, treeRows, renderedItems]
  )

  const virtualizer = useCascaderVirtualizer({
    count,
    getScrollElement: () => cascaderScrollElement(contentElement),
    estimateSize: estimateSize ?? estimateRowSize,
    overscan: overscan ?? rootOverscan,
    getItemKey,
    activeIndex: highlight.index,
  })

  return (
    <>
      <CascaderVirtualSpacer
        height={virtualizer.getTotalSize()}
        onContentElement={setContentElement}
      />
      {virtualizer.getVirtualItems().map((row) => {
        const flat = tree ? treeRows[row.index] : undefined
        const node = tree ? flat?.node : renderedItems[row.index]
        // For one commit after a query narrows the level, the window can name
        // a row it no longer has; the count recomputes on the same tick.
        if (!node) return null

        return (
          <CascaderItem
            key={row.key}
            /* Measured, not estimated: rows are two lines with a `description`
               and three in deep search, and row height is per style. An
               estimate alone would make `scrollToIndex` land on the wrong row. */
            ref={virtualizer.measureElement}
            data-index={row.index}
            style={cascaderVirtualRowStyle(row.start, gutter)}
            node={node}
            index={row.index}
            depth={flat?.depth}
            expanded={flat?.expanded}
            branch={flat ? flat.branch : isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            showPath={showPath}
            aria-setsize={flat ? flat.setSize : count}
            aria-posinset={flat ? flat.posInSet : row.index + 1}
          />
        )
      })}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Column                                   */
/* -------------------------------------------------------------------------- */

export interface CascaderVirtualColumnProps extends CascaderVirtualItemsProps {
  column: CascaderColumn
}

/**
 * Windowed replacement for one Miller column, passed through the
 * `CascaderColumns` render slot. One virtualizer PER COLUMN, since columns
 * scroll independently, and only the deepest is Base UI's listbox: the trail
 * behind is `as="button"` rows outside Base UI, so it windows on its own row
 * count rather than waiting for the root to flip.
 */
function CascaderVirtualColumn({
  column,
  estimateSize,
  overscan,
}: CascaderVirtualColumnProps) {
  const {
    virtualized,
    registerVirtualRenderer,
    virtualize,
    virtualizeThreshold,
  } = useCascaderActions()

  React.useLayoutEffect(
    () => registerVirtualRenderer(),
    [registerVirtualRenderer]
  )

  const windowed = column.active
    ? virtualized
    : (virtualize ?? column.items.length >= virtualizeThreshold)

  if (!windowed) return <CascaderColumnPanel column={column} />

  return (
    <CascaderColumnPanel column={column} virtualized>
      {column.active ? (
        <CascaderVirtualActiveColumnRows
          column={column}
          estimateSize={estimateSize}
          overscan={overscan}
        />
      ) : (
        <CascaderVirtualColumnRows
          column={column}
          estimateSize={estimateSize}
          overscan={overscan}
          activeIndex={-1}
        />
      )}
    </CascaderColumnPanel>
  )
}

/** Only the active column subscribes to the highlight; a trail column must not. */
function CascaderVirtualActiveColumnRows(props: CascaderVirtualColumnProps) {
  const highlight = useCascaderHighlight()
  return <CascaderVirtualColumnRows {...props} activeIndex={highlight.index} />
}

function CascaderVirtualColumnRows({
  column,
  estimateSize,
  overscan,
  activeIndex,
}: CascaderVirtualColumnProps & { activeIndex: number }) {
  const {
    estimateRowSize,
    overscan: rootOverscan,
    baseId,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate,
  } = useCascaderActions()
  const { loadStates } = useCascaderState()

  const [contentElement, setContentElement] =
    React.useState<HTMLElement | null>(null)
  const gutter = useCascaderVirtualGutter(contentElement)

  const items = column.items
  const getItemKey = React.useCallback(
    (index: number) => items[index]?.value ?? index,
    [items]
  )

  const virtualizer = useCascaderVirtualizer({
    count: items.length,
    getScrollElement: () => cascaderScrollElement(contentElement),
    estimateSize: estimateSize ?? estimateRowSize,
    overscan: overscan ?? rootOverscan,
    getItemKey,
    activeIndex,
  })

  return (
    <>
      <CascaderVirtualSpacer
        height={virtualizer.getTotalSize()}
        onContentElement={setContentElement}
      />
      {virtualizer.getVirtualItems().map((row) => {
        const node = items[row.index]
        if (!node) return null
        const open = node.value === column.activeValue

        return (
          <CascaderItem
            key={row.key}
            ref={virtualizer.measureElement}
            data-index={row.index}
            style={cascaderVirtualRowStyle(row.start, gutter)}
            node={node}
            as={column.active ? "option" : "button"}
            depth={column.depth}
            branch={isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            data-open={open || undefined}
            className={open ? "bg-accent/60 text-accent-foreground" : undefined}
            /* Only the listbox column may carry an index or listbox metadata.
               A trail row is a `role="button"`, which allows neither. */
            {...(column.active
              ? {
                  index: row.index,
                  "aria-setsize": items.length,
                  "aria-posinset": row.index + 1,
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
      })}
    </>
  )
}

export { CascaderVirtualColumn, CascaderVirtualItems }
