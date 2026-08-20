import type {
  CascaderCollapse,
  CascaderFlatNode,
  CascaderIndex,
  CascaderNode,
  CascaderPathSegment,
  CascaderSelectable,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

/** Root level key in `childrenOf`. NUL-prefixed so no real value collides. */
export const CASCADER_ROOT_KEY = "\u0000root"

/**
 * Paging pseudo-node prefix. Written as an escape sequence, not a raw 0x00
 * byte: a literal NUL makes this module read as binary and `grep -I` skips it.
 */
export const CASCADER_MORE_PREFIX = "\u0000more:"

/* -------------------------------------------------------------------------- */
/*                                Scroll layout                               */
/* -------------------------------------------------------------------------- */

/**
 * The four scroll classes. In the lib because `cascader-columns.tsx` needs them
 * too and must not import `cascader.tsx`. Shell > bound > scrollport > rows.
 */

/**
 * The bound. `min()` over an undefined custom property is an INVALID
 * declaration that drops the whole max-height, hence the `100vh` fallback: an
 * inline panel has no positioner, so no `--available-height`. `24rem` is the
 * default cap, so the common case sets no variable at all.
 */
export const CASCADER_LIST_HEIGHT_CLASS =
  "max-h-[min(var(--available-height,100vh),var(--cascader-max-height,24rem))]"

/**
 * Each style's list padding: rows take it as `padding`, the scrollport as
 * `scroll-padding` floored at 4px so lyra's `0` does not strand a row.
 * Mirrored per style from `registry/styles/style-*.css`; keep them in step.
 */
export const CASCADER_LIST_PAD_CLASS =
  "style-vega:[--cascader-list-pad:4px] style-nova:[--cascader-list-pad:4px] style-maia:[--cascader-list-pad:4px] style-lyra:[--cascader-list-pad:0px] style-mira:[--cascader-list-pad:4px] style-luma:[--cascader-list-pad:6px] style-rhea:[--cascader-list-pad:4px] style-sera:[--cascader-list-pad:6px]"

/** The scrollport: a `max-h-*` on the ScrollArea ROOT bounds nothing. */
export const CASCADER_SCROLL_CLASS =
  "size-full min-h-0 **:data-[slot=scroll-area-viewport]:h-full **:data-[slot=scroll-area-viewport]:overscroll-contain **:data-[slot=scroll-area-viewport]:scroll-py-[max(var(--cascader-list-pad,4px),4px)]"

/** The rows' box; `data-empty:p-0` keeps an empty state from double inset. */
export const CASCADER_ROWS_CLASS = "p-(--cascader-list-pad,4px) data-empty:p-0"

/* -------------------------------------------------------------------------- */
/*                                  Tab order                                 */
/* -------------------------------------------------------------------------- */

/**
 * What counts as a keyboard stop. Base UI's ScrollArea viewport makes ITSELF
 * tabbable when content overflows (`hiddenState.x && hiddenState.y ? -1 : 0`),
 * an unnamed stop per level that `ui/scroll-area.tsx` will not let us suppress.
 */
const CASCADER_TAB_STOP_SELECTOR =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** The stop to step over: nothing here focuses the scrollport on purpose. */
const CASCADER_TAB_SKIP_SELECTOR = '[data-slot="scroll-area-viewport"]'

/** Out of the tab order whatever they contain; layout is never consulted. */
const CASCADER_TAB_HIDDEN_SELECTOR = "[hidden],[inert],[aria-hidden='true']"

/** The panel's real keyboard stops, in DOM order. */
function getCascaderTabStops(panel: HTMLElement): HTMLElement[] {
  const stops = Array.from(
    panel.querySelectorAll<HTMLElement>(CASCADER_TAB_STOP_SELECTOR)
  )
  return stops.filter(
    (stop) =>
      // Option and trail rows are real `<button>`s with `tabindex="-1"`.
      stop.getAttribute("tabindex") !== "-1" &&
      !stop.matches(CASCADER_TAB_SKIP_SELECTOR) &&
      !stop.closest(CASCADER_TAB_HIDDEN_SELECTOR)
  )
}

/** The footer's own stops; an `aria-disabled` command still counts as one. */
export function getCascaderFooterStops(scope: HTMLElement): HTMLElement[] {
  const footer = scope.matches('[data-slot="cascader-footer"]')
    ? scope
    : scope.querySelector<HTMLElement>('[data-slot="cascader-footer"]')
  if (!footer) return []
  return getCascaderTabStops(footer)
}

/** Where Tab lands, or `null` to let the browser out: focus is never trapped. */
export function getCascaderTabTarget(
  panel: HTMLElement,
  from: Element | null,
  backwards: boolean
): HTMLElement | null {
  const stops = getCascaderTabStops(panel)
  if (stops.length === 0 || !from) return null

  const index = stops.indexOf(from as HTMLElement)
  if (index !== -1) return stops[index + (backwards ? -1 : 1)] ?? null

  if (backwards) {
    for (let i = stops.length - 1; i >= 0; i -= 1) {
      const position = from.compareDocumentPosition(stops[i])
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return stops[i]
    }
    return null
  }

  for (const stop of stops) {
    const position = from.compareDocumentPosition(stop)
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return stop
  }
  return null
}

/**
 * The writing direction at `element`. `DirectionProvider` may only vote yes:
 * unmounted it answers `"ltr"`, which would override a real `<html dir="rtl">`.
 */
export function isCascaderRtl(element: Element, provided: string): boolean {
  if (provided === "rtl") return true
  const explicit = element.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
  if (explicit === "rtl") return true
  if (explicit === "ltr") return false
  return (
    element.ownerDocument?.defaultView?.getComputedStyle(element).direction ===
    "rtl"
  )
}

/**
 * The paging row as a REAL node, not a DOM-only row after the list: every index
 * Base UI hands out indexes the RENDERED array, so a DOM-only row shifts them.
 */
export function createCascaderMoreNode<T = unknown>(
  parentKey: string,
  loadedCount = 0
): CascaderNode<T> {
  return {
    value: `${CASCADER_MORE_PREFIX}${parentKey}`,
    // Empty on purpose: a typeahead letter must never reach the paging row.
    label: "",
    // Feeds the row's "Loading more..." wording, with no second prop to thread.
    count: loadedCount,
  }
}

export function isCascaderMoreNode<T>(node: CascaderNode<T>): boolean {
  return node.value.startsWith(CASCADER_MORE_PREFIX)
}

/** The level key a paging pseudo-node belongs to, or `null` for a real node. */
export function getCascaderMoreParent<T>(node: CascaderNode<T>): string | null {
  if (!isCascaderMoreNode(node)) return null
  return node.value.slice(CASCADER_MORE_PREFIX.length)
}

/** Either input shape into one index. Cycle-guarded depths; first wins. */
export function buildCascaderIndex<T = unknown>(
  items: readonly CascaderNode<T>[] | undefined,
  getParent?: (node: CascaderNode<T>) => string | null | undefined
): CascaderIndex<T> {
  const byValue = new Map<string, CascaderNode<T>>()
  const childrenOf = new Map<string, CascaderNode<T>[]>()
  const parentOf = new Map<string, string | null>()
  const depthOf = new Map<string, number>()
  const all: CascaderNode<T>[] = []

  const push = (parentKey: string, node: CascaderNode<T>) => {
    const bucket = childrenOf.get(parentKey)
    if (bucket) {
      bucket.push(node)
    } else {
      childrenOf.set(parentKey, [node])
    }
  }

  if (getParent) {
    for (const node of items ?? []) {
      // A nullish entry is a data bug: skip it like a duplicate, say so in dev.
      if (node == null) {
        if (process.env.NODE_ENV !== "production") {
          warnCascaderOnce(
            "nullish-entry",
            "Ignored a null or undefined entry in `items` or `children`. Check the arrays you pass in."
          )
        }
        continue
      }
      if (byValue.has(node.value)) continue
      byValue.set(node.value, node)
      all.push(node)
    }

    for (const node of all) {
      const rawParent = getParent(node)
      // An unknown parent makes the node a root rather than dropping the row.
      const parent =
        rawParent != null && byValue.has(rawParent) ? rawParent : null
      parentOf.set(node.value, parent)
      push(parent ?? CASCADER_ROOT_KEY, node)
    }

    for (const node of all) {
      let depth = 0
      let cursor = parentOf.get(node.value) ?? null
      const seen = new Set<string>([node.value])
      while (cursor != null && !seen.has(cursor)) {
        seen.add(cursor)
        depth += 1
        cursor = parentOf.get(cursor) ?? null
      }
      depthOf.set(node.value, depth)
    }
  } else {
    const walk = (
      nodes: readonly CascaderNode<T>[] | undefined,
      parent: string | null,
      depth: number
    ) => {
      for (const node of nodes ?? []) {
        // Same degradation as the flat path above.
        if (node == null) {
          if (process.env.NODE_ENV !== "production") {
            warnCascaderOnce(
              "nullish-entry",
              "Ignored a null or undefined entry in `items` or `children`. Check the arrays you pass in."
            )
          }
          continue
        }
        if (byValue.has(node.value)) continue
        byValue.set(node.value, node)
        parentOf.set(node.value, parent)
        depthOf.set(node.value, depth)
        all.push(node)
        push(parent ?? CASCADER_ROOT_KEY, node)
        if (node.children?.length) walk(node.children, node.value, depth + 1)
      }
    }
    walk(items, null, 0)
  }

  return {
    byValue,
    childrenOf,
    parentOf,
    depthOf,
    roots: childrenOf.get(CASCADER_ROOT_KEY) ?? [],
    all,
  }
}

/**
 * Folds loaded pages into an index built from `items`, so a re-render with a
 * new `items` array keeps what the user drilled into. Static `items` wins;
 * `detached` is `byValue` ONLY, or deep search doubles it and `childrenOf` lies.
 */
export function mergeCascaderIndex<T = unknown>(
  base: CascaderIndex<T>,
  pages: ReadonlyMap<string, readonly CascaderNode<T>[]>,
  detached?: ReadonlyMap<string, CascaderNode<T>>
): CascaderIndex<T> {
  // Identity stability: every downstream `useMemo` is keyed on this index.
  if (pages.size === 0 && !detached?.size) return base

  const byValue = new Map(base.byValue)
  const childrenOf = new Map(base.childrenOf)
  const parentOf = new Map(base.parentOf)
  const depthOf = new Map(base.depthOf)

  // Copy-on-write per bucket: only levels that got a page pay for a new array.
  const copied = new Set<string>()
  const append = (parentKey: string, node: CascaderNode<T>) => {
    let bucket = childrenOf.get(parentKey)
    if (!copied.has(parentKey)) {
      bucket = bucket ? bucket.slice() : []
      childrenOf.set(parentKey, bucket)
      copied.add(parentKey)
    }
    bucket!.push(node)
  }

  const insert = (parentKey: string, nodes: readonly CascaderNode<T>[]) => {
    for (const node of nodes) {
      if (byValue.has(node.value)) continue
      byValue.set(node.value, node)
      parentOf.set(
        node.value,
        parentKey === CASCADER_ROOT_KEY ? null : parentKey
      )
      append(parentKey, node)
      if (node.children?.length) insert(node.value, node.children)
    }
  }

  for (const [parentKey, nodes] of pages) insert(parentKey, nodes)

  for (const value of byValue.keys()) {
    if (depthOf.has(value)) continue
    let depth = 0
    let cursor = parentOf.get(value) ?? null
    const seen = new Set<string>([value])
    while (cursor != null && !seen.has(cursor)) {
      seen.add(cursor)
      depth += 1
      cursor = parentOf.get(cursor) ?? null
    }
    depthOf.set(value, depth)
  }

  const roots = childrenOf.get(CASCADER_ROOT_KEY) ?? []

  // Depth first over the MERGED tree, so `all` keeps document order.
  const all: CascaderNode<T>[] = []
  const visited = new Set<string>()
  const walk = (nodes: readonly CascaderNode<T>[]) => {
    for (const node of nodes) {
      if (visited.has(node.value)) continue
      visited.add(node.value)
      all.push(node)
      const children = childrenOf.get(node.value)
      if (children?.length) walk(children)
    }
  }
  walk(roots)

  // A page whose parent never arrived stays searchable rather than vanishing.
  for (const [value, node] of byValue) {
    if (visited.has(value)) continue
    visited.add(value)
    all.push(node)
  }

  if (detached) {
    for (const [value, node] of detached) {
      if (byValue.has(value)) continue
      byValue.set(value, node)
    }
  }

  return { byValue, childrenOf, parentOf, depthOf, roots, all }
}

/** Children of `parent`, or the root level when `parent` is nullish. */
export function getCascaderChildren<T>(
  index: CascaderIndex<T>,
  parent?: string | null
): CascaderNode<T>[] {
  return index.childrenOf.get(parent ?? CASCADER_ROOT_KEY) ?? []
}

/** A branch has known children, or `hasChildren` for an unfetched level. */
export function isCascaderBranch<T>(
  index: CascaderIndex<T>,
  node: CascaderNode<T>
): boolean {
  if (node.hasChildren) return true
  return (index.childrenOf.get(node.value)?.length ?? 0) > 0
}

/** Trailing count for the default row. Explicit `count` wins over the tree. */
export function getCascaderCount<T>(
  index: CascaderIndex<T>,
  node: CascaderNode<T>
): number {
  if (typeof node.count === "number") return node.count
  return index.childrenOf.get(node.value)?.length ?? 0
}

/** Whether a node may be committed as a selection. */
export function isCascaderSelectable<T>(
  index: CascaderIndex<T>,
  node: CascaderNode<T>,
  selectable: CascaderSelectable<T>
): boolean {
  // Before the branches a consumer controls: `selectable="any"` says yes to
  // every node, and committing the paging row would select a level's name.
  if (isCascaderMoreNode(node)) return false
  if (node.disabled) return false
  // A disabled ANCESTOR refuses the whole subtree: `searchCascaderDeep` still
  // surfaces children of a branch the UI will not let anyone open.
  {
    const seen = new Set<string>([node.value])
    let cursor = index.parentOf.get(node.value) ?? null
    while (cursor != null && !seen.has(cursor)) {
      seen.add(cursor)
      if (index.byValue.get(cursor)?.disabled) return false
      cursor = index.parentOf.get(cursor) ?? null
    }
  }
  if (typeof selectable === "function") return selectable(node)
  if (selectable === "any") return true
  return !isCascaderBranch(index, node)
}

/** Ancestor chain for `value`, root first. Empty while async data loads. */
export function getCascaderPath<T>(
  index: CascaderIndex<T>,
  value: string | null | undefined
): CascaderNode<T>[] {
  if (value == null) return []
  const chain: CascaderNode<T>[] = []
  const seen = new Set<string>()
  let cursor: string | null | undefined = value
  while (cursor != null && !seen.has(cursor)) {
    seen.add(cursor)
    const node = index.byValue.get(cursor)
    if (!node) break
    chain.push(node)
    cursor = index.parentOf.get(cursor) ?? null
  }
  return chain.reverse()
}

/**
 * `toLocaleLowerCase`, not `toLowerCase`: the invariant mapping turns Turkish
 * "I" into "i" not "ı", so "ışık" would never match "IŞIK". Both sides fold here.
 */
export function foldCascaderText(text: string): string {
  return text.toLocaleLowerCase()
}

/** Folds once so callers can hoist the cost out of a per-node loop. */
export function normalizeCascaderQuery(query: string): string {
  return foldCascaderText(query.trim())
}

/** Case-insensitive substring over label and keywords; pre-fold the query. */
export function matchesCascaderQuery<T>(
  node: CascaderNode<T>,
  normalized: string
): boolean {
  if (!normalized) return true
  // Coerced, not trusted: a label-less node is malformed data, not a crash.
  if (foldCascaderText(node.label ?? "").includes(normalized)) return true
  if (node.keywords) {
    for (const keyword of node.keywords) {
      if (foldCascaderText(keyword).includes(normalized)) return true
    }
  }
  return false
}

/** Filters one level in place-order. Returns the input when the query is empty. */
export function filterCascaderLevel<T>(
  nodes: readonly CascaderNode<T>[],
  query: string,
  matches: (
    node: CascaderNode<T>,
    normalized: string
  ) => boolean = matchesCascaderQuery
): CascaderNode<T>[] {
  const normalized = normalizeCascaderQuery(query)
  if (!normalized) return nodes as CascaderNode<T>[]
  return nodes.filter((node) => matches(node, normalized))
}

/** Searches every node, optionally under `within`, in one pass over `all`. */
export function searchCascaderDeep<T>(
  index: CascaderIndex<T>,
  query: string,
  options: {
    within?: string | null
    limit?: number
    matches?: (node: CascaderNode<T>, normalized: string) => boolean
  } = {}
): CascaderNode<T>[] {
  const normalized = normalizeCascaderQuery(query)
  if (!normalized) return []

  const { within, limit = 200, matches = matchesCascaderQuery } = options
  const results: CascaderNode<T>[] = []

  // One memoised ancestry map per query. The provisional `false` written on the
  // way up doubles as the cycle guard; the trail is promoted once `within` hits.
  const ancestry = within == null ? null : new Map<string, boolean>()
  const isWithin = (node: CascaderNode<T>) => {
    if (within == null || !ancestry) return true
    const trail: string[] = []
    let answer = false
    let cursor: string | null | undefined = index.parentOf.get(node.value)
    while (cursor != null) {
      if (cursor === within) {
        answer = true
        break
      }
      const cached = ancestry.get(cursor)
      if (cached !== undefined) {
        answer = cached
        break
      }
      ancestry.set(cursor, false)
      trail.push(cursor)
      cursor = index.parentOf.get(cursor) ?? null
    }
    if (answer) for (const value of trail) ancestry.set(value, true)
    return answer
  }

  for (const node of index.all) {
    if (results.length >= limit) break
    if (!matches(node, normalized)) continue
    if (!isWithin(node)) continue
    results.push(node)
  }

  return results
}

/**
 * Flattens the tree into tree mode's visible rows. A `sentinels` paging row
 * COUNTS as a sibling in `aria-setsize`: it holds an index of its own.
 */
export function flattenCascaderTree<T>(
  index: CascaderIndex<T>,
  expanded: ReadonlySet<string>,
  sentinels?: ReadonlySet<string>
): CascaderFlatNode<T>[] {
  const rows: CascaderFlatNode<T>[] = []

  const walk = (
    nodes: readonly CascaderNode<T>[],
    parentKey: string,
    depth: number
  ) => {
    const sentinel = sentinels?.has(parentKey) ?? false
    const setSize = nodes.length + (sentinel ? 1 : 0)
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i]
      const branch = isCascaderBranch(index, node)
      const isExpanded = branch && expanded.has(node.value)
      rows.push({
        node,
        depth,
        branch,
        expanded: isExpanded,
        setSize,
        posInSet: i + 1,
      })
      if (isExpanded) {
        walk(index.childrenOf.get(node.value) ?? [], node.value, depth + 1)
      }
    }
    if (sentinel) {
      rows.push({
        node: createCascaderMoreNode<T>(parentKey, nodes.length),
        depth,
        branch: false,
        expanded: false,
        setSize,
        posInSet: setSize,
      })
    }
  }

  walk(index.roots, CASCADER_ROOT_KEY, 0)
  return rows
}

/** Shortens a path; the ellipsis segment still carries the hidden nodes. */
export function collapseCascaderPath<T>(
  path: readonly CascaderNode<T>[],
  options: { maxSegments?: number; collapse?: CascaderCollapse } = {}
): CascaderPathSegment<T>[] {
  const { maxSegments = 3, collapse = "middle" } = options

  const asNodes = (
    nodes: readonly CascaderNode<T>[]
  ): CascaderPathSegment<T>[] =>
    nodes.map((node) => ({ type: "node" as const, node }))

  if (collapse === "none" || maxSegments <= 0 || path.length <= maxSegments) {
    return asNodes(path)
  }

  if (collapse === "start") {
    const tail = path.slice(path.length - maxSegments)
    return [
      { type: "ellipsis", hidden: path.slice(0, path.length - maxSegments) },
      ...asNodes(tail),
    ]
  }

  // "middle": keep the root for orientation and as much of the tail as fits.
  const head = path.slice(0, 1)
  const tailCount = maxSegments - 1
  const tail = path.slice(path.length - tailCount)
  const hidden = path.slice(1, path.length - tailCount)

  if (hidden.length === 0) return asNodes(path)

  return [...asNodes(head), { type: "ellipsis", hidden }, ...asNodes(tail)]
}

/* -------------------------------------------------------------------------- */
/*                              Cascade selection                             */
/* -------------------------------------------------------------------------- */

/**
 * Every LOADED node under `value`, root first. Reaching an unfetched descendant
 * would mean a network request per level of the subtree on every selection.
 */
export function collectCascaderSubtree<T>(
  index: CascaderIndex<T>,
  value: string
): CascaderNode<T>[] {
  const root = index.byValue.get(value)
  if (!root) return []

  const out: CascaderNode<T>[] = []
  const seen = new Set<string>()
  const walk = (node: CascaderNode<T>) => {
    if (seen.has(node.value)) return
    seen.add(node.value)
    out.push(node)
    const children = index.childrenOf.get(node.value)
    if (children) for (const child of children) walk(child)
  }
  walk(root)
  return out
}

/**
 * Toggles `value` with its loaded subtree, then reconciles ancestors. One flat
 * array, no hidden "checked" state: a branch is in the selection exactly when
 * every selectable loaded child of it is, which keeps a row's checked state an
 * O(1) lookup. Nodes `isSelectable` rejects are skipped down AND ignored up,
 * the pressed node excepted.
 */
export function applyCascadeSelection<T>(
  index: CascaderIndex<T>,
  selected: readonly string[],
  value: string,
  select: boolean,
  isSelectable: (node: CascaderNode<T>) => boolean = () => true
): string[] {
  const next = new Set(selected)
  const subtree = collectCascaderSubtree(index, value)

  // An unknown value still toggles itself, so an early async selection lands.
  if (subtree.length === 0) {
    if (select) next.add(value)
    else next.delete(value)
  }

  for (const node of subtree) {
    // The pressed node is exempt: it was committed, so it is selectable.
    if (node.value !== value && !isSelectable(node)) continue
    if (select) next.add(node.value)
    else next.delete(node.value)
  }

  // Bottom up: a parent can only answer once its children have.
  const seen = new Set<string>([value])
  let cursor = index.parentOf.get(value) ?? null
  while (cursor != null && !seen.has(cursor)) {
    seen.add(cursor)
    const parent = index.byValue.get(cursor)
    const children = index.childrenOf.get(cursor) ?? []
    const selectable = children.filter((child) => isSelectable(child))
    const full =
      selectable.length > 0 &&
      selectable.every((child) => next.has(child.value)) &&
      // Never promote a node the consumer said may not be committed. Under
      // `selectable="leaf"` no branch qualifies, hence the `cascade` warning.
      !!parent &&
      isSelectable(parent)
    if (full) next.add(cursor)
    else next.delete(cursor)
    cursor = index.parentOf.get(cursor) ?? null
  }

  return Array.from(next)
}

/**
 * How many selected nodes each value has BELOW it, itself excluded. Walks UP
 * from each selection: a per-row subtree scan would be quadratic and re-paid.
 */
export function getCascaderSelectedDescendants<T>(
  index: CascaderIndex<T>,
  selected: readonly string[]
): Map<string, number> {
  const counts = new Map<string, number>()

  for (const value of selected) {
    const seen = new Set<string>([value])
    let cursor = index.parentOf.get(value) ?? null
    while (cursor != null && !seen.has(cursor)) {
      seen.add(cursor)
      counts.set(cursor, (counts.get(cursor) ?? 0) + 1)
      cursor = index.parentOf.get(cursor) ?? null
    }
  }

  return counts
}

/** The PARTIALLY selected values, read off counts the caller already holds. */
export function getCascaderIndeterminateFrom(
  counts: ReadonlyMap<string, number>,
  selected: readonly string[]
): Set<string> {
  const selectedSet = new Set(selected)
  const partial = new Set<string>()

  for (const [value, count] of counts) {
    if (count > 0 && !selectedSet.has(value)) partial.add(value)
  }

  return partial
}

/** The one-call form; the root uses the two halves above and its own counts. */
export function getCascaderIndeterminate<T>(
  index: CascaderIndex<T>,
  selected: readonly string[]
): Set<string> {
  return getCascaderIndeterminateFrom(
    getCascaderSelectedDescendants(index, selected),
    selected
  )
}

/** How `getCascaderCheckedValues` condenses a full-closure selection. */
export type CascaderCheckedStrategy = "all" | "parent" | "child"

/**
 * The cascade selection under a reporting strategy. DERIVED OUTPUT ONLY: the
 * STORED value stays the full closure, which keeps a checked state an O(1)
 * lookup. `"all"` is the closure; `"parent"` drops a value whose parent is
 * selected; `"child"` drops one with a selected child.
 */
export function getCascaderCheckedValues<T>(
  index: CascaderIndex<T>,
  selected: readonly string[],
  strategy: CascaderCheckedStrategy
): readonly string[] {
  if (strategy === "all") return selected

  const set = new Set(selected)
  if (strategy === "parent") {
    return selected.filter((value) => {
      const parent = index.parentOf.get(value)
      return parent == null || !set.has(parent)
    })
  }

  return selected.filter((value) => {
    const children = index.childrenOf.get(value)
    if (!children?.length) return true
    return !children.some((child) => set.has(child.value))
  })
}

/** Values in `nodes` whose label collides, so the chip must show its path. */
export function findAmbiguousCascaderLabels<T>(
  nodes: readonly CascaderNode<T>[]
): Set<string> {
  const firstByLabel = new Map<string, string>()
  const ambiguous = new Set<string>()

  for (const node of nodes) {
    const first = firstByLabel.get(node.label)
    if (first === undefined) {
      firstByLabel.set(node.label, node.value)
      continue
    }
    ambiguous.add(node.value)
    ambiguous.add(first)
  }

  return ambiguous
}

/* -------------------------------------------------------------------------- */
/*                              Development only                              */
/* -------------------------------------------------------------------------- */

/** Warnings already emitted. Module scoped, or they repeat once per render. */
const CASCADER_WARNED = new Set<string>()

/** Warns once per `key`, never in production, never by throwing. */
export function warnCascaderOnce(key: string, message: string): void {
  if (process.env.NODE_ENV === "production") return
  if (CASCADER_WARNED.has(key)) return
  CASCADER_WARNED.add(key)
  console.warn(`[Cascader] ${message}`)
}

/** Empties the ledger. Tests only; a warning is meant to be seen once. */
export function resetCascaderWarnings(): void {
  CASCADER_WARNED.clear()
}

/** What a dev-time scan of the consumer's `items` found wrong with it. */
export interface CascaderDataIssues {
  /** Values appearing more than once. First wins, so a duplicate drops a row. */
  duplicates: string[]
  /** Values on a `getParent` cycle. Depth is clamped, so the tree reads wrong. */
  cycles: string[]
}

/** Dev-time scan, kept out of `buildCascaderIndex` so the build stays hot. */
export function findCascaderDataIssues<T>(
  items: readonly CascaderNode<T>[] | undefined,
  getParent?: (node: CascaderNode<T>) => string | null | undefined
): CascaderDataIssues {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  const flat: CascaderNode<T>[] = []

  const visit = (nodes: readonly CascaderNode<T>[] | undefined) => {
    for (const node of nodes ?? []) {
      // The build skips a nullish entry, and this runs BEFORE its warning.
      if (node == null) continue
      if (seen.has(node.value)) duplicates.add(node.value)
      else seen.add(node.value)
      flat.push(node)
      // Flat mode walks them too: BOTH `children` and `getParent` is a bug.
      if (node.children?.length) visit(node.children)
    }
  }
  visit(items)

  const cycles: string[] = []
  if (getParent) {
    const parentOf = new Map<string, string | null>()
    for (const node of flat) {
      if (parentOf.has(node.value)) continue
      const raw = getParent(node)
      parentOf.set(node.value, raw != null && seen.has(raw) ? raw : null)
    }
    for (const node of flat) {
      const walked = new Set<string>([node.value])
      let cursor = parentOf.get(node.value) ?? null
      while (cursor != null) {
        if (walked.has(cursor)) {
          cycles.push(node.value)
          break
        }
        walked.add(cursor)
        cursor = parentOf.get(cursor) ?? null
      }
    }
  }

  return { duplicates: Array.from(duplicates), cycles }
}
