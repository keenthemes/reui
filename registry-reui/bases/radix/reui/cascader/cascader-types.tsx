// Title: Cascader
// Description: Nested multi-level combobox with drill-down, columns and tree modes.

import type * as React from "react"

/**
 * A node in the cascader tree. Two input shapes normalize to one internal
 * index: nested (nodes carry `children`), or flat adjacency plus the root's
 * `getParent`, which skips the re-nesting step for large datasets.
 */
export interface CascaderNode<T = unknown> {
  /** Stable id. Also the committed selection value. */
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
  children?: CascaderNode<T>[]
  /** Declares a branch before load; async nodes read as leaves without it. */
  hasChildren?: boolean
  /** Trailing count. Defaults to known children; set it for async nodes. */
  count?: number
  disabled?: boolean
  keywords?: string[]
  /**
   * Only read on a node nested inside a `getChildren` result. For the level a
   * node OWNS the authoritative signal is that level's `CascaderLoadResult`.
   */
  hasMore?: boolean
  data?: T
}

/**
 * One footer ACTION. Deliberately not a `CascaderNode`, so a command can never
 * be passed where an option is expected and join the ring, filter or selection.
 */
export interface CascaderActionItem {
  /** Stable key. Falls back to the label when it is a string, then the index. */
  value?: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  /** Ignored when `items` is present - a flyout opens instead. */
  onSelect?: () => void
  /** Turns the row into a submenu trigger. One level deep on purpose. */
  items?: CascaderActionItem[]
  /** Consecutive entries sharing a heading are drawn under one. */
  group?: string
}

/** Panel layout. See the docs for the keyboard map of each. */
export type CascaderMode = "drill" | "columns" | "tree"

export type CascaderSearchScope = "level" | "deep"

/**
 * Which nodes may be committed. The predicate arm is generic over the payload
 * rather than quantified per call: a per-call `<T>` would force every predicate
 * to accept EVERY payload, so `(node: CascaderNode<Member>) => boolean` could
 * never satisfy it.
 */
export type CascaderSelectable<T = unknown> =
  | "leaf"
  | "any"
  | ((node: CascaderNode<T>) => boolean)

export type CascaderCollapse = "middle" | "start" | "none"

export type CascaderValueDisplay = "path" | "leaf" | "count"

export type CascaderChangeReason = "select" | "deselect" | "clear"

/** Second argument to `onValueChange`: resolved nodes, so no re-lookup. */
export interface CascaderChangeDetails<T = unknown> {
  /** The node committed or toggled. Null when the selection was cleared. */
  node: CascaderNode<T> | null
  /** Ancestor chain of `node`, root first, node last. */
  path: CascaderNode<T>[]
  nodes: CascaderNode<T>[]
  reason: CascaderChangeReason
}

/** Normalized tree, built once per `items` identity, shared by every mode. */
export interface CascaderIndex<T = unknown> {
  byValue: Map<string, CascaderNode<T>>
  /** Children by parent value. Root children are keyed by `ROOT_KEY`. */
  childrenOf: Map<string, CascaderNode<T>[]>
  parentOf: Map<string, string | null>
  /** Zero-based depth by node value. */
  depthOf: Map<string, number>
  /** Top level nodes, in input order. */
  roots: CascaderNode<T>[]
  /** Every node in a stable, depth-first order. Used by deep search. */
  all: CascaderNode<T>[]
}

export interface CascaderFlatNode<T = unknown> {
  node: CascaderNode<T>
  depth: number
  /** Known children, or a declared `hasChildren`. */
  branch: boolean
  expanded: boolean
  /** Sibling count, plus one when the level has a paging row. */
  setSize: number
  /** One-based index among siblings. */
  posInSet: number
}

/** One segment of a rendered path, after collapsing. */
export type CascaderPathSegment<T = unknown> =
  | { type: "node"; node: CascaderNode<T> }
  | { type: "ellipsis"; hidden: CascaderNode<T>[] }

/**
 * Async load state for one node's children. Deliberately WITHOUT a `status`
 * field: "declared a branch, never fetched" and "fetched and genuinely empty"
 * are told apart by MAP MEMBERSHIP, and a second source of that truth would
 * eventually disagree with the first.
 */
export interface CascaderLoadState {
  loading: boolean
  error: boolean
  hasMore: boolean
  /** Opaque cursor handed back to `getChildren` for the next page. */
  cursor?: string
}

/** Why a level was fetched. `resolve`: `resolveValue` hit an unloaded node. */
export type CascaderLoadReason =
  | "level"
  | "more"
  | "prefetch"
  | "retry"
  | "resolve"

/** Argument handed to `getChildren`. */
export interface CascaderLoadContext {
  /** Aborted when the request is superseded or the popup closes. */
  signal: AbortSignal
  cursor?: string
  reason?: CascaderLoadReason
}

/** Value returned by `getChildren`. A bare array is also accepted. */
export interface CascaderLoadResult<T = unknown> {
  items: CascaderNode<T>[]
  nextCursor?: string
  /** Defaults to whether `nextCursor` was supplied. */
  hasMore?: boolean
}

/** Argument handed to `onSearch`. */
export interface CascaderSearchContext {
  signal: AbortSignal
  /** The path the user is searching within, deepest last. */
  path: string[]
}

/**
 * Every user facing string, so the primitive ships no hardcoded copy. The
 * callbacks take plain labels, not nodes: a `CascaderNode<T>` parameter would
 * force this object to carry the item generic. `*Announcement` is live-region.
 */
export interface CascaderLabels {
  search: string | ((parentLabel?: string) => string)
  back: string
  /** A level's FIRST page. `loadingMore` is the next, `loadMore` its idle row. */
  loading: string
  loadingMore: string
  loadMore: string
  error: string
  retry: string
  empty: string
  /** Rendered by `CascaderValue` when `display="count"`. */
  selectedCount: (count: number) => string
  breadcrumbLabel: string
  chipsLabel: string
  removeChip: (label: string) => string
  /** Trail separator. Not every locale writes one with a slash. */
  pathSeparator: string
  /** Names the root level wherever there is no parent node to name it. */
  rootLevel: string
  itemCount: (count: number) => string
  /** Appended to a branch row's name outside tree mode: it opens another list. */
  branchAffordance: string
  /** Columns-trail rows are plain buttons, so they carry no `aria-selected`. */
  selectedState: string
  /** Same for the mixed state, which a `role="button"` row may not carry. */
  partiallySelectedState: string
  columnsLabel: string
  actionsLabel: string
  submenuAffordance: string
  panelLabel: string
  /** Read per mode AND per direction: the level keys mirror in RTL. */
  keyboardHint: (mode: CascaderMode, dir: "ltr" | "rtl") => string
  rootAnnouncement: (count: number) => string
  expandedAnnouncement: (label: string, count: number) => string
  collapsedAnnouncement: (label: string) => string
  levelAnnouncement: (
    parentLabel: string,
    depth: number,
    count: number
  ) => string
  resultsAnnouncement: (count: number) => string
  maxReachedAnnouncement: (max: number) => string
  /** `count` is the descendants swept along; `selecting` is the direction. */
  cascadeAnnouncement: (
    label: string,
    count: number,
    selecting: boolean
  ) => string
  searchingAnnouncement: string
}
