"use client"

import * as React from "react"
import type {
  CascaderActionItem,
  CascaderChangeReason,
  CascaderFlatNode,
  CascaderIndex,
  CascaderLabels,
  CascaderLoadState,
  CascaderMode,
  CascaderNode,
  CascaderSearchScope,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

/**
 * Four contexts, not one: actions (config and callbacks, near-stable), state
 * (every keystroke), render (`renderItem` identity) and highlight (every arrow
 * key and pointer move). One combined context re-rendered every row on every
 * keystroke, which is what made `React.memo` on the row worth nothing.
 */

/* -------------------------------------------------------------------------- */
/*                                Shared types                                */
/* -------------------------------------------------------------------------- */

export interface CascaderColumn<T = unknown> {
  parent: CascaderNode<T> | null
  items: CascaderNode<T>[]
  depth: number
  /** The node in this column that is drilled into, if any. */
  activeValue: string | null
  /** Whether this is the deepest column, the one Base UI owns. */
  active: boolean
}

export interface CascaderItemState<T = unknown> {
  branch: boolean
  selected: boolean
  disabled: boolean
  depth: number
  count: number
  /** Ancestor chain, root first. Populated for deep-search rows. */
  path: CascaderNode<T>[]
}

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

/**
 * Everything derived from the query, the path and the selection. One keystroke
 * rebuilds most of it, so never subscribe to it from a row.
 */
export interface CascaderStateContextValue<T = unknown> {
  /** Same `useMemo` identity as the actions context's `index`. */
  index: CascaderIndex<T>
  path: string[]
  expanded: ReadonlySet<string>
  query: string
  currentParent: CascaderNode<T> | null
  /** Rows for the current level, already filtered. */
  levelItems: CascaderNode<T>[]
  deepResults: CascaderNode<T>[] | null
  /** What `Combobox.Root` is currently rendering, in render order. */
  renderedItems: CascaderNode<T>[]
  columns: CascaderColumn<T>[]
  treeRows: CascaderFlatNode<T>[]
  selectedValues: string[]
  /** Selected nodes below each value, at any depth. Absent means zero. */
  selectedDescendants: ReadonlyMap<string, number>
  /**
   * Per level, keyed by parent value or `CASCADER_ROOT_KEY`. MEMBERSHIP is the
   * discriminator: no entry means never fetched, an entry with no `loading`, no
   * `error` and no children means fetched and genuinely empty.
   */
  loadStates: ReadonlyMap<string, CascaderLoadState>
  /** Async search, `null` when idle. Separate: a search belongs to no level. */
  searchState: CascaderLoadState | null
  announcement: string
}

const CascaderStateContext = React.createContext<
  CascaderStateContextValue | undefined
>(undefined)

/**
 * One provider serves every `T`, so the context holds an erased `unknown` value
 * and this cast restores it. The primitive never inspects the payload.
 */
export function useCascaderState<T = unknown>(): CascaderStateContextValue<T> {
  const context = React.useContext(CascaderStateContext)
  if (!context) {
    throw new Error("useCascaderState must be used within a Cascader")
  }
  return context as unknown as CascaderStateContextValue<T>
}

/* -------------------------------------------------------------------------- */
/*                                   Actions                                  */
/* -------------------------------------------------------------------------- */

/**
 * Config and callbacks, slow enough that a memoised row can subscribe: the
 * mutators are `[]`-dep callbacks over a latest-props ref. The three predicates
 * are the exception, read DURING RENDER where a ref written in an effect would
 * return the previous commit's answer, so each is memoised on its own input.
 */
export interface CascaderActionsContextValue<T = unknown> {
  index: CascaderIndex<T>
  mode: CascaderMode
  multiple: boolean
  /** Multi-select only: a commit propagates over the LOADED subtree. */
  cascade: boolean
  /** Whether a BRANCH is committable. Per-LIST: the check gutter is a COLUMN. */
  branchesSelectable: boolean
  /** Draws the SINGLE-SELECT check and its gutter. Ignored in multi-select. */
  indicator: boolean
  expandTrigger?: "click" | "hover"
  actions: CascaderActionItem[]
  searchScope: CascaderSearchScope
  maxHeight?: number | string
  inline: boolean
  invalid: boolean
  /**
   * Id prefix; columns are `${baseId}-column-${depth}`. The SCHEME is contract:
   * the filters primitive's `FilterMenuPinKeeper` restores its highlight across
   * a live re-pin through `${baseId}-column-0` and the `cascader-item` slot.
   */
  baseId: string
  labels: CascaderLabels

  /**
   * Whether rows are WINDOWED. Also handed to `Combobox.Root`, which is what
   * makes an explicit row `index` legal: forwarding one while this is false
   * makes `aria-activedescendant` resolve to nothing. Latched per level.
   */
  virtualized: boolean
  /** Mounts a windowing renderer, returns its unregister. LAYOUT effect only. */
  registerVirtualRenderer: () => () => void
  /** The root's `virtualize` prop. `undefined` means "decide by count". */
  virtualize?: boolean
  virtualizeThreshold: number
  estimateRowSize: number
  overscan: number

  /** Tells "this level is empty" from "not fetched yet" before a load state. */
  hasLoader: boolean
  /** Next page of a level. Latched: a page with nothing new is not re-asked. */
  loadMore: (parentKey: string) => void
  retryLevel: (parentKey: string) => void
  /**
   * Evicts one level's async cache, `null` for the root, so membership reads
   * never-loaded. A level that is on screen when evicted refetches at once.
   */
  invalidateLevel: (value: string | null) => void

  /** Index as of the last commit. Use in the stable callbacks, not `index`. */
  getIndex: () => CascaderIndex<T>
  getState: () => CascaderStateContextValue<T>
  /** Highlighted row or null. A getter: the highlight moves per arrow key. */
  getHighlighted: () => CascaderNode<T> | null

  setPath: (next: string[] | ((prev: string[]) => string[])) => void
  pushLevel: (value: string) => void
  popLevel: () => void
  goToDepth: (depth: number) => void
  toggleExpanded: (value: string) => void
  /**
   * Registers a footer submenu as open or closed. `Combobox` has no
   * `FloatingTree`, so one Escape would dismiss the flyout AND the cascader;
   * the root's `onOpenChange` guard cancels the close while any is open, from a
   * ref so it reads as of that event without re-rendering the root.
   */
  setFlyoutOpen: (key: string, open: boolean) => void
  hasOpenFlyout: () => boolean
  setQuery: (next: string) => void
  /**
   * Replaces the selection. `onValueChange` diffs it against the current one
   * for its node and reason; pass `reason` only when the caller knows better.
   */
  setSelection: (values: string[], reason?: CascaderChangeReason) => void
  /** Commits a node, for rows outside the listbox such as ancestor columns. */
  commit: (node: CascaderNode<T>) => void
  navigate: (node: CascaderNode<T>) => void
  /** Into `node` as a child of `depth`, replacing anything deeper. */
  navigateAt: (node: CascaderNode<T>, depth: number) => void
  /** Never undefined: falls back to a remembered label, then a synthetic node. */
  resolveNode: (value: string) => CascaderNode<T>
  isBranch: (node: CascaderNode<T>) => boolean
  isSelectable: (node: CascaderNode<T>) => boolean
  isSelected: (node: CascaderNode<T>) => boolean
  /** Always `false` without `cascade`: partial selection needs propagation. */
  isIndeterminate: (node: CascaderNode<T>) => boolean
  /**
   * O(1) read of `selectedDescendants`; a memoised row may not subscribe.
   * Unlike `isIndeterminate` this answers in every mode.
   */
  selectedDescendantCount: (node: CascaderNode<T>) => number
}

const CascaderActionsContext = React.createContext<
  CascaderActionsContextValue | undefined
>(undefined)

export function useCascaderActions<
  T = unknown,
>(): CascaderActionsContextValue<T> {
  const context = React.useContext(CascaderActionsContext)
  if (!context) {
    throw new Error("useCascaderActions must be used within a Cascader")
  }
  return context as unknown as CascaderActionsContextValue<T>
}

/* -------------------------------------------------------------------------- */
/*                                Render props                                */
/* -------------------------------------------------------------------------- */

/**
 * Their own context, republished every render. They cannot ride on the actions
 * context: an inline closure read off a memoised object is whichever closure
 * that object captured, so the row would call a stale prop over stale state.
 */
export interface CascaderRenderContextValue<T = unknown> {
  renderItem?: (
    node: CascaderNode<T>,
    state: CascaderItemState<T>
  ) => React.ReactNode
  renderLabel?: (
    node: CascaderNode<T>,
    state: CascaderItemState<T>
  ) => React.ReactNode
}

const CascaderRenderContext = React.createContext<CascaderRenderContextValue>(
  {}
)

export function useCascaderRender<
  T = unknown,
>(): CascaderRenderContextValue<T> {
  return React.useContext(
    CascaderRenderContext
  ) as CascaderRenderContextValue<T>
}

/* -------------------------------------------------------------------------- */
/*                               Highlight store                              */
/* -------------------------------------------------------------------------- */

export interface CascaderHighlight {
  index: number
  value: string | null
}

/**
 * An external store, deliberately NOT React state: `onItemHighlighted` fires on
 * every arrow key AND every pointer move over the list, so `setState` would
 * re-render the whole root at mousemove rate. A store re-renders subscribers
 * only, which inside the primitive is the virtualizer.
 */
export interface CascaderHighlightStore {
  subscribe: (onStoreChange: () => void) => () => void
  getSnapshot: () => CascaderHighlight
  set: (next: CascaderHighlight) => void
}

const NO_HIGHLIGHT: CascaderHighlight = { index: -1, value: null }

export function createCascaderHighlightStore(): CascaderHighlightStore {
  let snapshot: CascaderHighlight = NO_HIGHLIGHT
  const listeners = new Set<() => void>()

  return {
    subscribe(onStoreChange) {
      listeners.add(onStoreChange)
      return () => {
        listeners.delete(onStoreChange)
      }
    },
    // The SAME object until something changes; `useSyncExternalStore` needs it.
    getSnapshot() {
      return snapshot
    },
    set(next) {
      if (next.index === snapshot.index && next.value === snapshot.value) return
      snapshot = next
      for (const listener of listeners) listener()
    },
  }
}

/** Shared and permanently empty, so the hook degrades outside a `Cascader`. */
const FALLBACK_HIGHLIGHT_STORE = createCascaderHighlightStore()

const CascaderHighlightContext = React.createContext<CascaderHighlightStore>(
  FALLBACK_HIGHLIGHT_STORE
)

/** Subscribes to the highlight. Re-renders ONLY the calling component. */
export function useCascaderHighlight(): CascaderHighlight {
  const store = React.useContext(CascaderHighlightContext)
  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  )
}

export {
  CascaderActionsContext,
  CascaderHighlightContext,
  CascaderRenderContext,
  CascaderStateContext,
}
