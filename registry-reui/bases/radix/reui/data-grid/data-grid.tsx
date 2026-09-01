"use client"

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react"
import type { ReactNode } from "react"
import {
  mergeDataGridI18n,
  type DataGridI18nConfig,
  type DataGridI18nOverrides,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid-i18n"
import {
  cellSelectionFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
  tableFeatures,
} from "@tanstack/react-table"
import type {
  Cell,
  Column,
  ColumnFiltersState,
  ReactTable,
  RowData,
  SortingState,
  Table,
  TableFeatures,
} from "@tanstack/react-table"

import { cn } from "@/registry/bases/radix/lib/utils"

/**
 * Per-column extras the grid reads off `columnDef.meta`.
 *
 * TanStack v9 resolves this through the `columnMeta` slot on the feature
 * bundle below instead of a global `declare module` augmentation, so
 * installing the data grid no longer widens `ColumnMeta` for every other
 * table in the consuming app.
 */
/**
 * Per-column write contract for the spreadsheet operations (paste, fill,
 * clear, cut). Presence marks the column writable; every write still flows
 * through `onCellsChange`, so the consumer's state stays the only data owner.
 */
export interface DataGridColumnCellEdit<TData> {
  /**
   * Set false for a column that formats clipboard output but is never
   * written; a function decides per row, so locked rows (archived, another
   * user's, a totals row) reject like any read-only cell. Defaults to true.
   */
  editable?: boolean | ((row: TData) => boolean)
  /**
   * Clipboard or fill string to typed value. Return undefined to reject the
   * cell into `rejected`. Without it the raw string passes through unchanged -
   * a deliberate non-coercion, so a number column receives strings only when
   * the consumer chose not to parse.
   */
  parse?: (raw: string, row: TData) => unknown
  /** Typed value to clipboard string. Fallback: String(value ?? ""). */
  format?: (value: unknown, row: TData) => string
  /** Value dispatched by Delete/Backspace and cut. Defaults to null. */
  clearValue?: unknown
  /**
   * Opt into the grid's built-in free-text editor: an overlay input (or
   * auto-growing textarea) flush over the focused cell, opened by Enter, F2,
   * typing, or double-click, committing through `onCellsChange` as source
   * `"edit"` with `parse` applied. Columns without it stay consumer-edited
   * via `onCellEditRequest` or their own cell renderers.
   */
  control?: "text" | "textarea"
}

export interface DataGridColumnMeta<TData> {
  headerTitle?: string
  headerClassName?: string
  cellClassName?: string
  skeleton?: ReactNode
  expandedContent?: (row: TData) => ReactNode
  autoSize?: boolean
  cellEdit?: DataGridColumnCellEdit<TData>
  /**
   * Under `columnsResizable`, this column absorbs the free space the filler
   * strip would otherwise hold, so the grid always reads full-width and the
   * built-in editor covers the whole cell. One column per grid; while free
   * space remains, manual resizing of this column is visually a no-op (the
   * absorbed space compensates), the flex-column trade-off.
   */
  fillWidth?: boolean
}

/**
 * The batteries-included feature bundle every ReUI data-grid example builds
 * on. v9 requires each table to declare its features up front, and the grid's
 * render path needs the ones registered here: `columnVisibilityFeature` alone
 * gates `row.getVisibleCells()`, so even a grid that never hides a column
 * needs it to render at all.
 *
 * Pass it straight through for the full grid:
 *
 * ```tsx
 * const table = useTable({ features: dataGridFeatures, columns, data })
 * ```
 *
 * Extend it when a grid needs more, keeping each prerequisite feature ahead of
 * the slot that depends on it:
 *
 * ```tsx
 * const features = tableFeatures({
 *   ...dataGridFeatures,
 *   columnGroupingFeature,
 *   groupedRowModel: createGroupedRowModel(),
 * })
 * ```
 *
 * Or drop it entirely and hand `<DataGrid>` a leaner table - the components
 * accept any bundle, so you keep full ownership of the TanStack core.
 */
export const dataGridFeatures = tableFeatures({
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  // columnResizingFeature requires columnSizingFeature, declared above.
  columnResizingFeature,
  columnFilteringFeature,
  // Powers DataGridColumnFilter's column.getFacetedUniqueValues(). On v8 an
  // unregistered facet silently returned an empty map; on v9 the method would
  // not exist at all, so the faceted row models below are required, not
  // optional.
  columnFacetingFeature,
  // globalFilteringFeature requires columnFilteringFeature, declared above.
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  rowPinningFeature,
  // Registration alone is inert: it seeds a `cellSelection: []` slice and
  // prototype methods but binds no DOM handlers, so grids without
  // `tableLayout.cellSelection` render and behave exactly as before.
  cellSelectionFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  // Every built-in v9 ships. A string `sortFn` resolves against this map
  // alone, and `sortFn: "auto"` infers a name ("alphanumeric", "text" or
  // "datetime") from the first row's value - so a partial map makes auto
  // sorting warn and silently fall back on ordinary string columns.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
    textCaseSensitive: sortFn_textCaseSensitive,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnMeta: metaHelper<DataGridColumnMeta<any>>(),
})

/** The feature set `dataGridFeatures` registers. */
export type DataGridFeatures = typeof dataGridFeatures

/**
 * The grid's internal view of the table.
 *
 * `TFeatures` is invariant in v9 and an unresolved generic one collapses to a
 * union that includes the bare core arm, so no generic signature can call
 * `getVisibleCells()`, `getStartVisibleLeafColumns()` and friends. The public
 * components stay generic so consumers can pass any bundle they like; the
 * table is widened to this concrete type exactly once, on the way into
 * context, and every internal component reads it from there.
 */
export type DataGridTableInstance<TData extends object> = ReactTable<
  DataGridFeatures,
  TData
>

/** Label for headers / column visibility: `meta.headerTitle`, string `columnDef.header`, or `column.id`. */
export function getColumnHeaderLabel<TData extends RowData, TValue>(
  column: Column<DataGridFeatures, TData, TValue>
): string {
  const meta = column.columnDef.meta as { headerTitle?: string } | undefined
  if (typeof meta?.headerTitle === "string") return meta.headerTitle
  const defHeader = column.columnDef.header
  if (typeof defHeader === "string") return defHeader
  return String(column.id)
}

/**
 * The td contract for spreadsheet selection. Call inside a
 * `Subscribe source={table.atoms.cellSelection}` render only: the reads are
 * builder calls whose state dependency React Compiler cannot see, exactly the
 * trap the row-selection checkbox documents.
 */
export function getDataGridCellSelectionCellAttrs<TData extends object>(
  cell: Cell<DataGridFeatures, TData, unknown>
): {
  "aria-selected": boolean
  "data-col-id": string
  "data-cell-selected": true | undefined
  "data-cell-focused": true | undefined
  "data-cell-edge-top": true | undefined
  "data-cell-edge-right": true | undefined
  "data-cell-edge-bottom": true | undefined
  "data-cell-edge-left": true | undefined
} {
  const selected = cell.getIsSelected()
  const edges = cell.getSelectionEdges()
  return {
    "aria-selected": selected,
    "data-col-id": cell.column.id,
    "data-cell-selected": selected || undefined,
    "data-cell-focused": cell.getIsFocused() || undefined,
    "data-cell-edge-top": edges.top || undefined,
    "data-cell-edge-right": edges.right || undefined,
    "data-cell-edge-bottom": edges.bottom || undefined,
    "data-cell-edge-left": edges.left || undefined,
  }
}

/**
 * Selection chrome for a body td, activated by the data attributes above plus
 * the imperatively toggled `data-cell-fill-target` (fill-drag preview, written
 * outside React like the resize indicator). A ::before overlay, not outline
 * or box-shadow: an outline ring hugs the cell box and cannot line up with
 * the gridlines the perimeter paints on, and the pinned-column dividers
 * already own the cell's shadow slot (tailwind-merge would collapse a second
 * shadow-[...] into it).
 */
export const dataGridCellSelectionCellClasses = cn(
  "relative select-none",
  // A light tint: the selection must read as a range without drowning the
  // gridlines under a heavy fill. The focused cell stays unfilled. Pinned
  // cells must stay OPAQUE (they hide scrolled content), so they get the
  // tint pre-mixed over the background, and the focused pinned cell keeps
  // a solid background instead of turning transparent.
  "data-[cell-selected]:bg-primary/4",
  "data-[cell-selected]:data-pinned:bg-[color-mix(in_oklab,var(--primary)_4%,var(--background))]",
  "data-[cell-focused]:bg-transparent!",
  "data-[cell-focused]:data-pinned:bg-background!",
  // Every selection line is one layout-free ::before overlay per cell. It
  // reaches 1px BEYOND the cell so each line paints exactly ON the shared
  // gridline it replaces: the range perimeter and the interior dividers
  // share this geometry, so where they meet they coincide instead of
  // stacking into a wider edge, every side stays exactly 1px, and
  // selecting never adds real borders that shift layout. At the table's
  // own boundary there is no shared gridline and the overshoot leaves the
  // scrollable content box, where it is CLIPPED - the perimeter simply
  // vanished on the first column, last column and last row. So every
  // overshoot that can hit a boundary goes through a variable the
  // boundary cells zero out. Longhand inset utilities only, logical
  // start/end
  // so RTL mirrors for free; a separate override rule cannot do this,
  // equal-specificity variants leave shorthand-vs-longhand to sort order.
  "data-[cell-selected]:before:pointer-events-none data-[cell-selected]:before:absolute data-[cell-selected]:before:top-[var(--data-grid-overlay-top,-1px)] data-[cell-selected]:before:start-[var(--data-grid-overlay-start,-1px)] data-[cell-selected]:before:end-[var(--data-grid-overlay-end,-1px)] data-[cell-selected]:before:bottom-[var(--data-grid-overlay-bottom,-1px)] data-[cell-selected]:before:border-primary data-[cell-selected]:before:content-['']",
  "data-[cell-focused]:before:pointer-events-none data-[cell-focused]:before:absolute data-[cell-focused]:before:top-[var(--data-grid-overlay-top,-1px)] data-[cell-focused]:before:start-[var(--data-grid-overlay-start,-1px)] data-[cell-focused]:before:end-[var(--data-grid-overlay-end,-1px)] data-[cell-focused]:before:bottom-[var(--data-grid-overlay-bottom,-1px)] data-[cell-focused]:before:border-primary data-[cell-focused]:before:content-['']",
  // Interior dividers: selected cells repaint their own end and bottom
  // gridlines on the overlay, so gridline-less grids still divide a range.
  // The gray color is guarded by not- variants (higher specificity), so a
  // side that belongs to the range perimeter deterministically stays
  // primary.
  "data-[cell-selected]:before:border-e data-[cell-selected]:before:border-b",
  "data-[cell-selected]:not-data-[cell-edge-right]:before:border-e-border",
  "data-[cell-selected]:not-data-[cell-edge-bottom]:before:border-b-border",
  // The Sheets model: a single selected cell IS its own range, so the four
  // edge attributes below already draw its full primary box; inside a
  // larger range the anchor reads by its unfilled background alone. The
  // explicit ring only covers a focused cell with no selection at all.
  // Edge sides are logical (border-e/border-s): the feature derives edges
  // from display-order column indexes, which mirror in RTL.
  "data-[cell-focused]:not-data-[cell-selected]:before:border",
  "data-[cell-edge-top]:before:border-t data-[cell-edge-right]:before:border-e data-[cell-edge-bottom]:before:border-b data-[cell-edge-left]:before:border-s",
  // While a fill drag is live the preview border is the ONE painter for
  // the whole pending region, so the source cells' own chrome rests -
  // otherwise its lines double against the region border at every shared
  // edge. display is the no-cascade-fight switch (see below).
  "in-data-[cell-filling]:data-[cell-selected]:before:hidden",
  "in-data-[cell-filling]:data-[cell-focused]:before:hidden",
  // While the built-in editor is open its outline is the one border; the
  // edited cell's own overlay chrome hides so nothing peeks around the
  // flush editor. display is the switch because no other before: rule
  // sets it, so there is no cascade order to lose.
  "in-data-[cell-editing]:data-[cell-focused]:before:hidden",
  // Clamped to the cell edge at the grid's own boundary, the overlay's
  // lines sit flush against the container border instead of being clipped
  // away outside the scrollable content. A custom property has no cascade
  // fight to lose. First/last-child cover the boundary columns: when a
  // filler td follows the last data column, that cell's overshoot lands
  // INSIDE the table and needs no clamp, and the td:first/last-child of a
  // row are its logical start/end in RTL too.
  "in-[tr:last-child]:[--data-grid-overlay-bottom:0px]",
  // The top overshoot lands under a sticky header, which is positioned and
  // paints over it - so the first row's perimeter lost its top line. Clamp
  // inside the cell there, exactly like the other three boundaries.
  "in-[tr:first-child]:[--data-grid-overlay-top:0px]",
  "first:[--data-grid-overlay-start:0px]",
  "last:[--data-grid-overlay-end:0px]",
  // A pinned column is a boundary like the grid's own edges: the sticky
  // neighbor would cover an on-gridline overlay line, and re-painting it
  // from the pinned side doubles into a 2px blur whenever subpixel
  // positions disagree (browser zoom, fractional fill widths). One
  // painter instead: the overlay clamps inside its own cell there, the
  // same custom-property clamp the first and last cells use.
  "[&:has(+td[data-pinned])]:[--data-grid-overlay-end:0px]",
  "[&:has(+[data-slot=data-grid-table-fill-body-cell]:last-child)]:[--data-grid-overlay-end:0px]",
  "[&:has(+[data-slot=data-grid-table-fill-body-cell]+td[data-pinned])]:[--data-grid-overlay-end:0px]",
  "[td[data-pinned]+&]:[--data-grid-overlay-start:0px]",
  // Tint only: the dashed region outline is one overlay element drawn by
  // the fill session, so neighboring target cells never double their edges.
  "data-[cell-fill-target]:bg-primary/4",
  "data-[cell-fill-target]:data-pinned:bg-[color-mix(in_oklab,var(--primary)_4%,var(--background))]"
)

export type DataGridApiFetchParams = {
  pageIndex: number
  pageSize: number
  sorting?: SortingState
  filters?: ColumnFiltersState
  searchQuery?: string
}

export type DataGridApiResponse<T> = {
  data: T[]
  empty: boolean
  pagination: {
    total: number
    page: number
  }
}

/**
 * Everything `<DataGrid>` accepts except the two props the provider consumes
 * itself. Kept feature-agnostic: layout and messaging never depend on which
 * TanStack features the consumer registered.
 */
export type DataGridLayoutProps<TData extends object> = Omit<
  DataGridProps<TableFeatures, TData>,
  "table" | "children"
>

export interface DataGridContextProps<TData extends object> {
  props: DataGridLayoutProps<TData>
  table: DataGridTableInstance<TData>
  recordCount: number
  isLoading: boolean
  /** Stable per-grid prefix for the DOM ids ARIA relations point at. */
  gridId: string
  /** The merged label set; components read `i18n.labels.<key>`. */
  i18n: DataGridI18nConfig
  /**
   * Internal coordinator for `meta.autoSize` columns. Lives at the core level
   * so every table variant and viewport instance shares one application state.
   */
  autoSize?: DataGridAutoSizeController
}

/**
 * Row and column ids are consumer strings; DOM ids cannot carry spaces or
 * quotes. One shared sanitizer so `aria-activedescendant` writers and the id
 * renderers always agree on the same encoding.
 */
export function toDataGridDomId(value: string): string {
  return value.replace(/[^\w-]/g, "_")
}

export type DataGridAutoSizeController = {
  /**
   * Feeds the controller one viewport measurement: the SIGNED free space
   * between the scroll container and the table, negative while the table
   * overflows. The first sight of a `meta.autoSize` column absorbs the
   * free space into its width; after that, every measurement REFLOWS the
   * same growth - a wider window widens the column, a narrower one gives
   * the space back down to the column's `minSize` (or its starting width
   * when none is set) - so the grid tracks its container live. Commits
   * are coalesced for performance: sub-pixel deltas are dropped, a
   * streaming resize gets one leading commit plus one trailing commit at
   * settle, and a width the user dragged is never touched. Safe to call
   * from every viewport measurement; returns true when a sizing update
   * was dispatched.
   */
  apply: (freeSpace: number) => boolean
}

type DataGridAutoSizeReflowState = {
  applied: { columnId: string; base: number; grown: number } | null
  settleTimer: ReturnType<typeof setTimeout> | null
  pendingFreeSpace: number
  lastCommitAt: number
}

/**
 * Bookkeeping keyed on the TABLE STORE, never on a React instance: dev
 * StrictMode double-mounts the tree, so two controller instances serve one
 * page and only the first would remember what it absorbed - the second
 * reads the grown width as a user drag and freezes the column. The store
 * object is the one identity that provably survives that dance (the
 * absorbed sizing rides inside it), and the WeakMap lets a discarded
 * table take its bookkeeping with it.
 */
const dataGridAutoSizeStates = new WeakMap<
  object,
  DataGridAutoSizeReflowState
>()

function getDataGridAutoSizeState(store: object): DataGridAutoSizeReflowState {
  let state = dataGridAutoSizeStates.get(store)
  if (!state) {
    state = {
      applied: null,
      settleTimer: null,
      pendingFreeSpace: 0,
      lastCommitAt: 0,
    }
    dataGridAutoSizeStates.set(store, state)
  }
  return state
}

function createDataGridAutoSizeController<TData extends object>(
  /**
   * A getter, not the table itself.
   *
   * v8 handed back one stable table whose state mutated in place, so a
   * controller could close over it. v9 returns a NEW table wrapper on every
   * state change, and a captured one keeps reporting the state it was built
   * with - here that meant `columnSizing` looked permanently empty, the
   * applied-once guard re-armed on every measurement, and the fill overwrote
   * whatever width the user had just dragged the column to.
   */
  getTable: () => DataGridTableInstance<TData>
): DataGridAutoSizeController {
  // Reflow coalescing: a live window drag streams a measurement per frame,
  // and every accepted commit re-renders the table. One leading commit
  // keeps single snaps (a maximize) instant; the rest of the stream parks
  // its latest value behind one trailing timer, so a continuous drag costs
  // two commits instead of sixty a second. The trailing timer may fire
  // after the grid unmounts; it re-reads the table then, and a sizing
  // write to the consumer's store is inert once nothing renders it.
  const SETTLE_MS = 150

  const reflow = (freeSpace: number): boolean => {
    const table = getTable()
    const state = getDataGridAutoSizeState(table.store)
    // LIVE state, never the render snapshot: a measurement can run between
    // our own sizing commit and React's re-render, and the stale snapshot
    // would hide the width this controller just wrote.
    const columnSizing =
      table.atoms.columnSizing?.get() ?? table.state.columnSizing
    if (!state.applied) return false
    const autoSizeColumn = table
      .getVisibleLeafColumns()
      .find(
        (column) => column.columnDef.meta?.autoSize && column.getCanResize()
      )
    if (!autoSizeColumn || autoSizeColumn.id !== state.applied.columnId)
      return false
    // A width this coordinator did not write belongs to the user's drag;
    // reflow stands down until a reset re-arms the column.
    const currentSize = columnSizing[state.applied.columnId]
    if (currentSize !== undefined && currentSize !== state.applied.grown) {
      return false
    }
    // The free space as it would measure with our growth removed; the
    // target re-absorbs exactly that, floored at minSize so a narrow
    // window hands space back without ever crushing the column (no
    // explicit minSize floors at the starting width instead).
    const freeAtBase = freeSpace + (state.applied.grown - state.applied.base)
    const floor = autoSizeColumn.columnDef.minSize ?? state.applied.base
    const target = Math.max(floor, state.applied.base + freeAtBase)
    if (Math.abs(target - state.applied.grown) < 1) return false
    state.applied = { ...state.applied, grown: target }
    table.setColumnSizing((old) => ({
      ...old,
      [state.applied!.columnId]: target,
    }))
    return true
  }

  return {
    apply(freeSpace: number) {
      const table = getTable()
      const state = getDataGridAutoSizeState(table.store)
      // Same live read as `reflow`; the snapshot race is what made the
      // re-arm check clear the bookkeeping right after the first absorb.
      const columnSizing =
        table.atoms.columnSizing?.get() ?? table.state.columnSizing

      // Re-arm after reset flows (double-click resetSize, resetColumnSizing,
      // controlled state replacement) so the column re-fills instead of
      // leaving a dead blank strip.
      if (state.applied && columnSizing[state.applied.columnId] === undefined) {
        state.applied = null
      }

      const autoSizeColumn = table
        .getVisibleLeafColumns()
        .find(
          (column) => column.columnDef.meta?.autoSize && column.getCanResize()
        )

      if (autoSizeColumn && state.applied?.columnId === autoSizeColumn.id) {
        state.pendingFreeSpace = freeSpace
        const now = Date.now()
        if (now - state.lastCommitAt > SETTLE_MS) {
          state.lastCommitAt = now
          return reflow(freeSpace)
        }
        if (state.settleTimer !== null) clearTimeout(state.settleTimer)
        state.settleTimer = setTimeout(() => {
          state.settleTimer = null
          state.lastCommitAt = Date.now()
          reflow(state.pendingFreeSpace)
        }, SETTLE_MS)
        return false
      }

      const fillWidth = Math.max(0, freeSpace)
      if (fillWidth <= 0) return false

      if (!autoSizeColumn) {
        return false
      }

      // A width this coordinator did not write belongs to someone else -
      // almost always the user, who just dragged the column's resize handle.
      // Filling over it is what made a `meta.autoSize` column look
      // un-resizable: the drag committed, the next viewport measurement
      // stamped the fill back on top, and the column snapped to its old width.
      //
      // Deliberately keyed on observed state rather than on `state.applied`, which
      // is per-coordinator memory: anything that rebuilds the coordinator
      // (a remount, a new table store) forgets what it did, and the guard has
      // to survive that. An explicit reset clears the entry and re-arms the
      // fill, which is what makes double-click-to-reset still work.
      const currentSize = columnSizing[autoSizeColumn.id]
      if (currentSize !== undefined && currentSize !== state.applied?.grown) {
        return false
      }

      // Candidate switched (e.g. the grown column was hidden and another
      // meta.autoSize column took over): revert the previous growth if the
      // user hasn't manually resized that column since, so visibility
      // toggles cannot ratchet the table wider than its container forever.
      const revert =
        state.applied &&
        columnSizing[state.applied.columnId] === state.applied.grown
          ? state.applied
          : null
      const base = columnSizing[autoSizeColumn.id] ?? autoSizeColumn.getSize()
      const grown = base + fillWidth

      state.applied = { columnId: autoSizeColumn.id, base, grown }
      table.setColumnSizing((old) => {
        const next = { ...old, [autoSizeColumn.id]: grown }
        if (revert && next[revert.columnId] === revert.grown) {
          next[revert.columnId] = revert.base
        }
        return next
      })

      return true
    },
  }
}

export type DataGridRequestParams = {
  pageIndex: number
  pageSize: number
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
}

/** Which spreadsheet operation produced a cell change batch. */
export type DataGridCellsChangeSource =
  | "paste"
  | "cut"
  | "clear"
  | "fill"
  | "edit"

export interface DataGridCellChange<TData> {
  rowId: string
  columnId: string
  /** The consumer's row object, so immutable write-back needs no second lookup. */
  row: TData
  /** Accessor value at dispatch time; enables consumer-side undo stacks. */
  previousValue: unknown
  /** Typed value produced by `meta.cellEdit.parse`, or `clearValue` for clear/cut. */
  value: unknown
}

/** What onCellsCopy receives after the grid writes the clipboard. */
export interface DataGridCopyDetails {
  /** The TSV text that reached the clipboard. */
  text: string
  /** The same content as a row-major grid of formatted fields. */
  grid: string[][]
  /** True when the write came from a cut, which clears the region next. */
  cut: boolean
}

/** One resolved positive region, in pre-paginated display indexes. */
export interface DataGridCellSelectionBound {
  minRowIndex: number
  maxRowIndex: number
  minColumnIndex: number
  maxColumnIndex: number
}

/** What onCellSelectionChange receives, resolved from the live selection. */
export interface DataGridCellSelectionSnapshot {
  /** The virtually focused cell, the active range's anchor. Null when clear. */
  focused: { rowId: string; columnId: string } | null
  /** Every positive region, geometric order. */
  bounds: DataGridCellSelectionBound[]
  /** The most recent region, the one copy and paste act on. */
  activeBound: DataGridCellSelectionBound | null
  /**
   * Cells of the selection the view can show - the count that matches the
   * painted range and what a batch will touch.
   */
  visibleCellCount: number
}

export interface DataGridCellRejection {
  rowId: string
  columnId: string
  raw: string
  reason: "readonly" | "invalid"
}

/**
 * Lifecycle of a row for the optional CRUD indications: "new" and "dirty"
 * tint the row, "deleted" mutes and strikes it. Purely presentational - the
 * consumer's state stays the only owner of what the statuses mean.
 */
export type DataGridRowStatus = "new" | "dirty" | "deleted"

/**
 * Lifecycle of a cell for the optional CRUD indications: a corner mark in
 * the amber tone for "dirty", the destructive tone for "invalid".
 */
export type DataGridCellStatus = "dirty" | "invalid"

/**
 * Asks the consumer to open its editor for the focused cell: Enter or F2, or
 * a typed printable character (then `initialText` carries it, the
 * Notion/Airtable type-to-replace flow). Dispatched only for cells whose
 * column is writable via `meta.cellEdit`.
 */
export interface DataGridCellEditRequest<TData> {
  rowId: string
  columnId: string
  row: TData
  previousValue: unknown
  /** The typed character that started the edit; absent for Enter and F2. */
  initialText?: string
}

/**
 * One batch per operation, however many cells it spans: a 10k-cell paste is
 * one callback, one consumer setState, one table rebuild. The grid never
 * writes data itself.
 */
export interface DataGridCellsChangeDetails<TData> {
  source: DataGridCellsChangeSource
  changes: DataGridCellChange<TData>[]
  rejected: DataGridCellRejection[]
}

export interface DataGridProps<
  TFeatures extends TableFeatures,
  TData extends object,
> {
  className?: string
  table?: Table<TFeatures, TData>
  recordCount: number
  children?: ReactNode
  onRowClick?: (row: TData) => void
  /**
   * Receives every spreadsheet write batch (paste, cut, clear, fill, edit).
   * Served through the props getter like `onRowClick`, so an inline identity
   * never republishes the context. Absent: copy still works, writes no-op.
   */
  onCellsChange?: (details: DataGridCellsChangeDetails<TData>) => void
  /**
   * Opens the consumer's editor from the keyboard: Enter, F2, or typing on
   * the focused cell. Absent: Enter keeps moving down, typing does nothing.
   */
  onCellEditRequest?: (request: DataGridCellEditRequest<TData>) => void
  /**
   * Fires on every cell-selection change (focus moves, ranges grow or
   * clear) with a resolved snapshot, so a selection count, formula bar or
   * context panel needs no reach into TanStack internals.
   */
  onCellSelectionChange?: (snapshot: DataGridCellSelectionSnapshot) => void
  /**
   * Fires after the grid writes the clipboard (Cmd/Ctrl+C or X, or the
   * native copy and cut events), e.g. to confirm with a toast.
   */
  onCellsCopy?: (details: DataGridCopyDetails) => void
  /**
   * Renders an "Add row" affordance as the table body's last row; clicking
   * it is the consumer's cue to start creating a row. Absent: no row.
   */
  onRowCreate?: () => void
  /** Label of the onRowCreate affordance. Defaults to "Add row". */
  rowCreateLabel?: ReactNode
  /**
   * Rendered inside the table body after the data rows: the slot a DRAFT
   * row lives in while it is being created, before it joins `data` and the
   * pagination math. Supply a `<tr>` of cells; the colgroup sizes them.
   */
  appendRow?: ReactNode
  /**
   * Optional CRUD indication per row. Return undefined for no indication;
   * omit the prop entirely to render none anywhere.
   */
  getRowStatus?: (row: TData) => DataGridRowStatus | undefined
  /**
   * Optional CRUD indication per cell: the classic corner mark on cells the
   * consumer tracks as edited or invalid.
   */
  getCellStatus?: (
    row: TData,
    columnId: string
  ) => DataGridCellStatus | undefined
  isLoading?: boolean
  /**
   * Overrides for every built-in string: menu items, aria labels,
   * pagination copy, state messages. Merged over the defaults; a more
   * specific component prop (`rowCreateLabel`, `loadingMessage`, the
   * pagination label props) still wins over its `i18n` counterpart.
   */
  i18n?: DataGridI18nOverrides
  loadingMode?: "skeleton" | "spinner"
  loadingMessage?: ReactNode | string
  fetchingMoreMessage?: ReactNode | string
  allRowsLoadedMessage?: ReactNode | string
  emptyMessage?: ReactNode | string
  tableLayout?: {
    dense?: boolean
    cellBorder?: boolean
    rowBorder?: boolean
    rowRounded?: boolean
    stripped?: boolean
    headerBackground?: boolean
    footerBackground?: boolean
    headerBorder?: boolean
    headerSticky?: boolean
    width?: "auto" | "fixed"
    columnsVisibility?: boolean
    columnsResizable?: boolean
    columnsResizeMode?: "onChange" | "onEnd"
    columnsPinnable?: boolean
    columnsMovable?: boolean
    columnsDraggable?: boolean
    rowsDraggable?: boolean
    rowsPinnable?: boolean
    /** Spreadsheet cell range selection: mouse ranges, keyboard, clipboard chrome. */
    cellSelection?: boolean
    /**
     * "range" (default): drag, Shift and Ctrl/Cmd gestures and Shift+keys
     * grow multi-cell regions. "single": one focused cell only - every
     * gesture collapses to it and Ctrl/Cmd+A is inert.
     */
    cellSelectionMode?: "single" | "range"
    /** Drag-to-fill handle on the selection corner. Requires cellSelection. */
    cellFillHandle?: boolean
    /**
     * How a cell opens its editor from the mouse: "dblclick" (default,
     * the spreadsheet standard - first click focuses, second edits) or
     * "click", opening the editor as soon as a plain click lands on the
     * focused cell; modifier clicks and drags still select.
     */
    cellEditMode?: "dblclick" | "click"
    /**
     * When true, committing an edit with Enter moves focus down (Shift+Enter
     * up), the Sheets and Excel convention. Off by default: the commit keeps
     * focus on the edited cell. Tab always commits and moves across.
     */
    cellEditEnterAdvance?: boolean
    /**
     * The handle's look: "dot" is a solid primary dot kept inside the
     * cell corner; "ring" is the Sheets-style hollow circle riding the
     * corner point, clamped at the grid's own boundary; "square" is the
     * Excel-style solid square inside the corner. Default "dot".
     */
    cellFillHandleVariant?: "dot" | "ring" | "square"
  }
  tableClassNames?: {
    base?: string
    header?: string
    headerRow?: string
    headerSticky?: string
    body?: string
    bodyRow?: string
    footer?: string
    edgeCell?: string
    /** Override the getRowStatus tints; defaults are the warning-muted set. */
    rowNew?: string
    rowDirty?: string
    rowDeleted?: string
    /**
     * Override the pinned-row chrome (muted tint, boundary shadow). A grid
     * that pins a draft row for quick-create wants it to read as an active
     * row, not a muted one.
     */
    rowPinned?: string
    /** The onRowCreate affordance row, e.g. to match the grid's row height. */
    rowCreate?: string
    /** The fill handle, e.g. to restyle or resize it beyond the built-in variants. */
    cellFillHandle?: string
  }
}

const DataGridContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataGridContextProps<any> | undefined
>(undefined)

/**
 * Reads the grid context. Pass `TData` from the calling component when the
 * table, a row or a cell is handed on to something typed against that row
 * shape: v9 declares `TData` invariant, so the default `any` no longer
 * unifies with a concrete row type the way it did on v8.
 */
function useDataGrid<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData extends object = any,
>(): DataGridContextProps<TData> {
  const context = useContext(DataGridContext) as
    | DataGridContextProps<TData>
    | undefined
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider")
  }
  return context
}

function DataGridProvider<TData extends object>({
  children,
  table,
  ...props
}: DataGridLayoutProps<TData> & {
  table: DataGridTableInstance<TData>
  children?: ReactNode
}) {
  // Latest-props ref: context reads always resolve fresh props through the
  // getter below without the memoized context value depending on unstable
  // Stable for the grid's lifetime; ARIA ids and relations hang off it.
  const gridId = useId()
  // ReactNode/function prop identities (inline emptyMessage/onRowClick would
  // otherwise publish a new context value on every consumer render - at
  // mousemove rate during a resize drag, piercing the body-rows memo).
  const propsRef = useRef(props)
  propsRef.current = props
  const i18n = mergeDataGridI18n(props.i18n)
  const i18nRef = useRef(i18n)
  i18nRef.current = i18n

  // Same treatment for the table itself, which v9 - unlike v8 - re-creates on
  // every state change. Depending on it directly would republish the context
  // on each resize tick, which is exactly what the memo below exists to
  // prevent; the getter still hands every consumer the current instance.
  const tableRef = useRef(table)
  tableRef.current = table

  // Re-assert an explicit tableLayout resize mode so consumer-level useTable
  // options cannot flip it back between drags. v9 makes `table.options`
  // readonly, so this goes through setOptions in an effect rather than a
  // render-phase mutation. Without an explicit mode, the consumer's own
  // tanstack columnResizeMode (default "onEnd") is honored.
  const resizeMode =
    props.tableLayout?.columnsResizable && props.tableLayout.columnsResizeMode
      ? props.tableLayout.columnsResizeMode
      : undefined

  useEffect(() => {
    if (!resizeMode) return
    if (table.options.columnResizeMode === resizeMode) return
    table.setOptions((old) => ({ ...old, columnResizeMode: resizeMode }))
  }, [table, resizeMode])

  // With the selection UI on, every paste/fill/clear batch replaces `data`,
  // and the feature's default autoResetCellSelection would wipe the selection
  // after each write. Ranges are row-id based and unresolvable ids drop out
  // of the bounds safely, so keeping state across data edits is the correct
  // default here.
  const cellSelectionOn = !!props.tableLayout?.cellSelection
  useEffect(() => {
    if (!cellSelectionOn || table.atoms.cellSelection == null) return
    if (table.options.autoResetCellSelection === false) return
    table.setOptions((old) => ({ ...old, autoResetCellSelection: false }))
  }, [table, cellSelectionOn])

  // Rendered row indexes re-base per page, so a range kept across a page flip
  // re-lights the same positions over different rows. A page change clears
  // the selection instead - the rule Excel-family grids apply to paginated
  // range selection.
  const pageKey = `${table.state.pagination?.pageIndex}:${table.state.pagination?.pageSize}`
  const previousPageKeyRef = useRef(pageKey)
  useEffect(() => {
    if (previousPageKeyRef.current === pageKey) return
    previousPageKeyRef.current = pageKey
    if (!cellSelectionOn || table.atoms.cellSelection == null) return
    tableRef.current.resetCellSelection(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, cellSelectionOn])

  // One autoSize coordinator per table instance so split header/body viewports
  // cannot apply the growth twice. Keyed on `table.store`, which v9 keeps
  // stable for the life of the table, rather than on `table` itself: the
  // wrapper is re-created on every state change, and re-creating the
  // controller with it would reset its applied-once bookkeeping mid-drag.
  const autoSize = useMemo(
    () => createDataGridAutoSizeController(() => tableRef.current),
    [table.store]
  )

  const tableState = table.state

  // Memoize context value so consumers don't re-render during column resize.
  // Column sizing state is intentionally excluded from deps -- CSS variables
  // on the <table> element handle width updates without React re-renders.
  // ReactNode/function props (messages, onRowClick) are also excluded: they
  // are served fresh through the props getter, so unstable inline identities
  // cannot invalidate the context value.
  // `cellSelection` state is excluded on purpose too: a drag writes it once
  // per cell crossed, and nothing reads it through context - cells and the
  // selection bar subscribe to `table.atoms.cellSelection` directly.
  const value = useMemo(
    () => ({
      get props() {
        return propsRef.current
      },
      get table() {
        return tableRef.current
      },
      get i18n() {
        return i18nRef.current
      },
      recordCount: props.recordCount,
      isLoading: props.isLoading || false,
      gridId,
      autoSize,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      autoSize,
      props.recordCount,
      props.isLoading,
      props.loadingMode,
      props.className,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableLayout),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableClassNames),
      tableState.sorting,
      tableState.pagination,
      tableState.columnFilters,
      tableState.rowSelection,
      tableState.rowPinning,
      tableState.expanded,
      tableState.columnVisibility,
      tableState.columnOrder,
      tableState.columnPinning,
      tableState.globalFilter,
    ]
  )

  return (
    // One React context serves every TData, but v9 declares both TFeatures and
    // TData invariant, so a `DataGridContextProps<any>` context cannot accept a
    // `DataGridContextProps<TData>` value structurally. The erasure happens
    // here and is undone by the TData generic on each consumer component.
    <DataGridContext.Provider
      value={value as unknown as DataGridContextProps<TData>}
    >
      {children}
    </DataGridContext.Provider>
  )
}

function DataGrid<TFeatures extends TableFeatures, TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TFeatures, TData>) {
  const defaultProps: Partial<DataGridProps<TFeatures, TData>> = {
    loadingMode: "skeleton",
    tableLayout: {
      dense: false,
      cellBorder: false,
      rowBorder: true,
      rowRounded: false,
      stripped: false,
      headerSticky: false,
      headerBackground: false,
      footerBackground: false,
      headerBorder: true,
      width: "fixed",
      columnsVisibility: false,
      columnsResizable: false,
      // columnsResizeMode has no default on purpose: when unset, the
      // consumer's tanstack columnResizeMode (default "onEnd") is honored.
      columnsPinnable: false,
      columnsMovable: false,
      columnsDraggable: false,
      rowsDraggable: false,
      rowsPinnable: false,
      cellSelection: false,
      cellFillHandle: false,
    },
    tableClassNames: {
      base: "",
      header: "",
      headerRow: "",
      // z-40 keeps the sticky header above pinned body cells (zIndex 30 in
      // getPinningStyles), which would otherwise paint over it while
      // scrolling vertically with columnsPinnable enabled.
      headerSticky: "sticky top-0 z-40 bg-background/90 backdrop-blur-xs",
      body: "",
      bodyRow: "",
      footer: "",
      edgeCell: "",
    },
  }

  const mergedProps: DataGridProps<TFeatures, TData> = {
    ...defaultProps,
    ...props,
    tableLayout: {
      ...defaultProps.tableLayout,
      ...(props.tableLayout || {}),
    },
    tableClassNames: {
      ...defaultProps.tableClassNames,
      ...(props.tableClassNames || {}),
    },
  }

  // Ensure table is provided
  if (!table) {
    throw new Error('DataGrid requires a "table" prop')
  }

  // The single widening point. Consumers own the TanStack core and may hand
  // over any feature bundle; internals need a concrete one to resolve the
  // feature-gated APIs they call, and v9's invariant TFeatures rules out
  // expressing that with a generic constraint.
  const internalTable = table as unknown as DataGridTableInstance<TData>
  const internalProps = mergedProps as unknown as DataGridLayoutProps<TData>

  return (
    <DataGridProvider table={internalTable} {...internalProps}>
      {children}
    </DataGridProvider>
  )
}

function DataGridContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
  /** Accepted for backwards compatibility; currently has no effect. */
  border?: boolean
}) {
  return (
    <div
      data-slot="data-grid"
      // relative: anchors floating chrome composed inside the container,
      // like the fill-drag preview outline.
      className={cn("relative w-full overflow-hidden", className)}
    >
      {children}
    </div>
  )
}

export { useDataGrid, DataGridProvider, DataGrid, DataGridContainer }
