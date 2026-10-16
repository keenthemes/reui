"use client"

import * as React from "react"
import { useCascaderState } from "@/registry-reui/bases/radix/reui/cascader/cascader-context"
import {
  CASCADER_ROOT_KEY,
  isCascaderMoreNode,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-lib"
import type {
  CascaderIndex,
  CascaderLoadContext,
  CascaderLoadReason,
  CascaderLoadResult,
  CascaderLoadState,
  CascaderNode,
  CascaderSearchContext,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

/**
 * Async data for the cascader. Loaded pages live in their own store and are
 * MERGED onto the index built from `items`, never folded into that build:
 * `items` changes identity on any parent re-render, and folding would discard
 * every level the user drilled into. Map membership is the load discriminator:
 * no `states` entry means never fetched, while an entry with no `loading`, no
 * `error` and no children means empty for real.
 */

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

/**
 * Fetches one level. `node` is `null` for the root level, and only
 * `{ value, label: value }`, no `data`, for a level on screen whose node has
 * not loaded: a deep link before the level above loads, or a page-loaded
 * level after a `loadKey` change.
 */
export type CascaderGetChildren<T = unknown> = (
  node: CascaderNode<T> | null,
  context: CascaderLoadContext
) =>
  | CascaderNode<T>[]
  | CascaderLoadResult<T>
  | Promise<CascaderNode<T>[] | CascaderLoadResult<T>>

/** Server-side search, replacing the local index scan while the query is set. */
export type CascaderOnSearch<T = unknown> = (
  query: string,
  context: CascaderSearchContext
) =>
  | CascaderNode<T>[]
  | CascaderLoadResult<T>
  | Promise<CascaderNode<T>[] | CascaderLoadResult<T>>

/** Resolves a selected value to its ancestor chain, root first, node last. */
export type CascaderResolveValue<T = unknown> = (
  value: string,
  context: CascaderLoadContext
) => CascaderNode<T>[] | Promise<CascaderNode<T>[]>

export interface CascaderLoaderStore<T = unknown> {
  /** Keyed by LEVEL: a parent's value, or `CASCADER_ROOT_KEY` for the root. */
  pages: Map<string, CascaderNode<T>[]>
  states: Map<string, CascaderLoadState>
  /** Keyed by node value: search hits and resolved selections, level-less. */
  detached: Map<string, CascaderNode<T>>
  /**
   * A resolved chain's parent links, node value to level key. Kept apart from
   * `pages`: a level's first real page replaced a chain stub there, and a node
   * that page left out lost its parent, and the trigger its path.
   */
  links: Map<string, string>
}

export interface UseCascaderLoaderOptions<T = unknown> {
  /** The index built from `items`, before any pages are merged in. */
  base: CascaderIndex<T>
  getChildren?: CascaderGetChildren<T>
  onSearch?: CascaderOnSearch<T>
  resolveValue?: CascaderResolveValue<T>
  /** Milliseconds of quiet before `onSearch` fires. */
  searchDebounce?: number
  /** Changing this drops every cached page, state and detached node. */
  loadKey?: unknown
  /** Speculatively fetch a branch's children when it is highlighted. */
  prefetch?: boolean
  /** Called when a request fails. Never for an aborted or superseded one. */
  onLoadError?: (
    error: unknown,
    context: { parent: string | null; reason: string }
  ) => void
  /**
   * Whether the panel is live: the popup is open, or the cascader is inline.
   * Gates levels, paging and search. `resolveValue` runs regardless, and
   * retries a failed value when this turns true.
   */
  enabled: boolean
  query: string
  /** Level keys that are currently on screen. Root is `CASCADER_ROOT_KEY`. */
  levels: string[]
  /** Handed to `onSearch` as its scope and read for nothing else: the
   * navigation path, or `[]` when the search covers the whole tree. */
  path: string[]
  /** Current selection, for `resolveValue`. */
  values: string[]
}

export interface CascaderLoader<T = unknown> {
  /** Whether a `getChildren` loader is configured at all. */
  active: boolean
  store: CascaderLoaderStore<T>
  states: ReadonlyMap<string, CascaderLoadState>
  /**
   * Async search hits, `null` when no `onSearch` is running. EMPTY while the
   * first request is in flight, so the level behind is not shown as the answer.
   */
  searchResults: CascaderNode<T>[] | null
  searchState: CascaderLoadState | null
  /**
   * Fetches a level's FIRST page. No-ops on a `states` entry (in flight,
   * loaded or failed) or when `items` fills the level. The level effect fires
   * only for on-screen levels, so a branch merely PRESSED is asked for by hand.
   */
  ensureLevel: (parentKey: string, reason: CascaderLoadReason) => void
  /** Fetches the next page of a level. No-ops unless one is available. */
  loadMore: (parentKey: string) => void
  /** Refires a failed level. No-ops unless that level is in an error state. */
  retryLevel: (parentKey: string) => void
  /** Refires the server search for the current query. No-ops without one. */
  retrySearch: () => void
  /** Schedules a speculative fetch. Safe to call on every highlight move. */
  prefetchNode: (node: CascaderNode<T> | null | undefined) => void
  /**
   * Evicts ONE level: aborts its request, drops its `states`/`pages` entries
   * and paging latch, so the level effect refetches it. `null` = root level.
   */
  invalidateLevel: (value: string | null) => void
}

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

/**
 * Highlight dwell before `prefetch` fetches: long enough that holding ArrowDown
 * does not fire a request per row, short enough to beat the ArrowRight press.
 */
const PREFETCH_DELAY = 150

/** Request keys for the two non-level requests. Never collide with a value. */
const SEARCH_KEY = "\u0000search"
const RESOLVE_PREFIX = "\u0000resolve:"

const NO_STATE: CascaderLoadState = {
  loading: false,
  error: false,
  hasMore: false,
}

/** Stable empty result, so an idle search never churns the state context. */
const NO_RESULTS: CascaderNode<never>[] = []

function createStore<T>(): CascaderLoaderStore<T> {
  return {
    pages: new Map(),
    states: new Map(),
    detached: new Map(),
    links: new Map(),
  }
}

function sameLoadState(a: CascaderLoadState, b: CascaderLoadState): boolean {
  return (
    a.loading === b.loading &&
    a.error === b.error &&
    a.hasMore === b.hasMore &&
    a.cursor === b.cursor
  )
}

/* -------------------------------------------------------------------------- */
/*                              Store transitions                             */
/* -------------------------------------------------------------------------- */

/**
 * Copy-on-write, and a NO-OP when nothing changed: the merged index is memoised
 * on store identity, so a fresh object for an unchanged state would rebuild it.
 */
function withLoadState<T>(
  store: CascaderLoaderStore<T>,
  key: string,
  update: (state: CascaderLoadState) => CascaderLoadState
): CascaderLoaderStore<T> {
  const current = store.states.get(key) ?? NO_STATE
  const next = update(current)
  if (store.states.has(key) && sameLoadState(current, next)) return store
  const states = new Map(store.states)
  states.set(key, next)
  return { ...store, states }
}

function withPage<T>(
  store: CascaderLoaderStore<T>,
  key: string,
  items: readonly CascaderNode<T>[],
  options: { append: boolean; hasMore: boolean; cursor?: string }
): CascaderLoaderStore<T> {
  const previous = options.append ? (store.pages.get(key) ?? []) : []
  const seen = new Set(previous.map((node) => node.value))
  const merged = previous.slice()
  for (const item of items) {
    if (seen.has(item.value)) continue
    seen.add(item.value)
    merged.push(item)
  }

  const pages = new Map(store.pages)
  pages.set(key, merged)
  const states = new Map(store.states)
  states.set(key, {
    loading: false,
    error: false,
    hasMore: options.hasMore,
    cursor: options.cursor,
  })
  return { ...store, pages, states }
}

function withDetached<T>(
  store: CascaderLoaderStore<T>,
  items: readonly CascaderNode<T>[]
): CascaderLoaderStore<T> {
  let detached: Map<string, CascaderNode<T>> | null = null
  for (const item of items) {
    if (store.detached.get(item.value) === item) continue
    detached = detached ?? new Map(store.detached)
    detached.set(item.value, item)
  }
  if (!detached) return store
  return { ...store, detached }
}

/**
 * Records a resolved ancestor chain, root first, as `detached` nodes plus
 * `links`, never as rows in `pages`: a stub there made an unloaded level read
 * as loaded. Writes no `states`, so every level on it still fetches for real.
 */
function withChain<T>(
  store: CascaderLoaderStore<T>,
  chain: readonly CascaderNode<T>[]
): CascaderLoaderStore<T> {
  if (chain.length === 0) return store
  const detached = new Map(store.detached)
  const links = new Map(store.links)
  let parentKey = CASCADER_ROOT_KEY

  for (const node of chain) {
    detached.set(node.value, node)
    links.set(node.value, parentKey)
    parentKey = node.value
  }

  return { ...store, detached, links }
}

/* -------------------------------------------------------------------------- */
/*                                    Hook                                    */
/* -------------------------------------------------------------------------- */

interface CascaderLoaderLatest<T> {
  base: CascaderIndex<T>
  store: CascaderLoaderStore<T>
  getChildren?: CascaderGetChildren<T>
  onSearch?: CascaderOnSearch<T>
  resolveValue?: CascaderResolveValue<T>
  onLoadError?: (
    error: unknown,
    context: { parent: string | null; reason: string }
  ) => void
  prefetch: boolean
  path: string[]
  query: string
}

interface CascaderSearchSlice<T> {
  query: string
  results: CascaderNode<T>[]
  loading: boolean
  error: boolean
}

/**
 * The loader. A SIBLING of the `buildCascaderIndex` memo, never inside it: the
 * build stays pure in `items`, the merge pure in that build plus this store.
 */
export function useCascaderLoader<T = unknown>({
  base,
  getChildren,
  onSearch,
  resolveValue,
  searchDebounce = 250,
  loadKey,
  prefetch = false,
  onLoadError,
  enabled,
  query,
  levels,
  path,
  values,
}: UseCascaderLoaderOptions<T>): CascaderLoader<T> {
  const [store, setStore] = React.useState<CascaderLoaderStore<T>>(createStore)
  const [search, setSearch] = React.useState<CascaderSearchSlice<T> | null>(
    null
  )

  /**
   * Latest callbacks, WRITTEN IN AN EFFECT: `getChildren` is inline in most
   * consumers, so closing over it would refire every in-flight request per
   * re-render. The ref is what keeps the request machinery `[]`-dep. Declared
   * FIRST, since effects run in declaration order, so the level effect below
   * already sees the current commit.
   */
  const latest = React.useRef<CascaderLoaderLatest<T>>({
    base,
    store,
    getChildren,
    onSearch,
    resolveValue,
    onLoadError,
    prefetch,
    path,
    query,
  })

  React.useEffect(() => {
    latest.current = {
      base,
      store,
      getChildren,
      onSearch,
      resolveValue,
      onLoadError,
      prefetch,
      path,
      query,
    }
  })

  /** One AbortController PER KEY: columns mode runs several levels at once. */
  const controllers = React.useRef(new Map<string, AbortController>())
  /** Monotonic per key. The stale guard for out-of-order responses. */
  const requestIds = React.useRef(new Map<string, number>())
  /** In-flight `(level, cursor)` signatures, so a duplicate ask is free. */
  const inflight = React.useRef(new Map<string, string>())
  /**
   * The `(child count, cursor)` signature at the last paging fire, per level.
   * Guards what `hasMore` cannot: a page of zero new items while the server
   * still says `hasMore`. Cursor is IN the signature because an all-duplicates
   * page advances it while the count stands still - real progress, which a
   * count-only latch would brick forever.
   */
  const moreLatch = React.useRef(new Map<string, string>())
  /** Values `resolveValue` has already been asked about, so it asks once. */
  const attempted = React.useRef(new Set<string>())
  /**
   * Values whose resolve failed. They stay `attempted` until the next open
   * rather than the next values pass: with inline `items` every parent render
   * is one, and an `onLoadError` that set parent state looped at network speed.
   */
  const failed = React.useRef(new Set<string>())
  /** Every node the loader has seen, so a level key can name its own node. */
  const known = React.useRef(new Map<string, CascaderNode<T>>())
  const timers = React.useRef<{
    prefetch: ReturnType<typeof setTimeout> | null
  }>({ prefetch: null })
  /** Bumped by a `loadKey` change, so responses from before it are dropped. */
  const epoch = React.useRef(0)

  const remember = React.useCallback((nodes: readonly CascaderNode<T>[]) => {
    const map = known.current
    const walk = (list: readonly CascaderNode<T>[]) => {
      for (const node of list) {
        map.set(node.value, node)
        if (node.children?.length) walk(node.children)
      }
    }
    walk(nodes)
  }, [])

  const abortKey = React.useCallback((key: string) => {
    const controller = controllers.current.get(key)
    if (!controller) return
    controllers.current.delete(key)
    inflight.current.delete(key)
    controller.abort()
  }, [])

  /* ------------------------------- level load ------------------------------ */

  const runLoad = React.useCallback(
    (
      key: string,
      reason: CascaderLoadReason,
      cursor: string | undefined,
      append: boolean
    ) => {
      const { getChildren: loader, base: currentBase } = latest.current
      if (!loader) return

      const signature = `${append ? "1" : "0"}:${cursor ?? ""}`
      if (inflight.current.get(key) === signature) return

      abortKey(key)
      const controller = new AbortController()
      controllers.current.set(key, controller)
      inflight.current.set(key, signature)

      const requestId = (requestIds.current.get(key) ?? 0) + 1
      requestIds.current.set(key, requestId)
      const startEpoch = epoch.current

      // A deep link (`path`, `expanded`) can put a level on screen before the
      // level above it loads, and a `loadKey` reset forgets every node. `null`
      // is the ROOT's argument, and a loader answered it with the root rows,
      // so the level gets its value instead.
      const node =
        key === CASCADER_ROOT_KEY
          ? null
          : (currentBase.byValue.get(key) ??
            known.current.get(key) ?? { value: key, label: key })

      setStore((prev) =>
        withLoadState(prev, key, (state) => ({
          ...state,
          loading: true,
          error: false,
        }))
      )

      const settle = () => {
        if (inflight.current.get(key) === signature)
          inflight.current.delete(key)
        if (controllers.current.get(key) === controller) {
          controllers.current.delete(key)
        }
      }

      const stale = () =>
        controller.signal.aborted ||
        startEpoch !== epoch.current ||
        requestId !== requestIds.current.get(key)

      // `Promise.resolve().then(...)`, not a direct call: it normalises a
      // SYNCHRONOUS throw into a rejection instead of taking the render down.
      Promise.resolve()
        .then(() => loader(node, { signal: controller.signal, cursor, reason }))
        .then((result) => {
          settle()
          if (stale()) return
          const items = Array.isArray(result) ? result : result.items
          const nextCursor = Array.isArray(result)
            ? undefined
            : result.nextCursor
          const hasMore = Array.isArray(result)
            ? false
            : (result.hasMore ?? nextCursor != null)

          if (!append) moreLatch.current.delete(key)
          remember(items)
          setStore((prev) =>
            withPage(prev, key, items, { append, hasMore, cursor: nextCursor })
          )
        })
        .catch((error: unknown) => {
          settle()
          if (stale()) return
          setStore((prev) =>
            withLoadState(prev, key, (state) => ({
              ...state,
              loading: false,
              error: true,
            }))
          )
          // Behind the stale guard: an abort is navigation, not a failure.
          latest.current.onLoadError?.(error, {
            parent: key === CASCADER_ROOT_KEY ? null : key,
            reason,
          })
        })
    },
    [abortKey, remember]
  )

  const ensureLevel = React.useCallback(
    (key: string, reason: CascaderLoadReason) => {
      const {
        getChildren: loader,
        store: current,
        base: index,
      } = latest.current
      if (!loader) return
      if (current.states.has(key)) return
      // A level `items` already fills is not the loader's business: that is how
      // a static root plus `getChildren` for the branches works with no flag.
      if (index.childrenOf.has(key)) return
      runLoad(key, reason, undefined, false)
    },
    [runLoad]
  )

  const loadMore = React.useCallback(
    (key: string) => {
      const { getChildren: loader, store: current } = latest.current
      if (!loader) return
      const state = current.states.get(key)
      if (!state || state.loading || !state.hasMore) return

      const loaded = current.pages.get(key)?.length ?? 0
      const signature = `${loaded}:${state.cursor ?? ""}`
      if (moreLatch.current.get(key) === signature) return
      moreLatch.current.set(key, signature)

      runLoad(key, "more", state.cursor, true)
    },
    [runLoad]
  )

  const retryLevel = React.useCallback(
    (key: string) => {
      const { getChildren: loader, store: current } = latest.current
      if (!loader) return
      const state = current.states.get(key)
      if (!state?.error) return

      const loaded = current.pages.get(key)?.length ?? 0
      // A retry must be able to re-fire the page the latch just blocked.
      moreLatch.current.delete(key)
      runLoad(key, "retry", loaded > 0 ? state.cursor : undefined, loaded > 0)
    },
    [runLoad]
  )

  /**
   * `detached` and `links` are deliberately untouched: chains and search hits
   * belong to no level, and the trigger needs their path while the new page is
   * in flight.
   */
  const invalidateLevel = React.useCallback(
    (value: string | null) => {
      const key = value ?? CASCADER_ROOT_KEY
      abortKey(key)
      // Bump the id too: a response past its signal check must still be stale.
      requestIds.current.set(key, (requestIds.current.get(key) ?? 0) + 1)
      moreLatch.current.delete(key)
      setStore((prev) => {
        if (!prev.states.has(key) && !prev.pages.has(key)) return prev
        const states = new Map(prev.states)
        states.delete(key)
        const pages = new Map(prev.pages)
        pages.delete(key)
        return { ...prev, pages, states }
      })
    },
    [abortKey]
  )

  const prefetchNode = React.useCallback(
    (node: CascaderNode<T> | null | undefined) => {
      const {
        prefetch: on,
        getChildren: loader,
        store: current,
      } = latest.current
      if (!on || !loader || !node) return
      if (isCascaderMoreNode(node)) return
      if (!node.hasChildren) return
      if (current.states.has(node.value)) return

      const holder = timers.current
      if (holder.prefetch) clearTimeout(holder.prefetch)
      // A TIMEOUT, not a direct call: `onItemHighlighted` fires from a layout
      // effect, where a synchronous setState is a render-phase cascade.
      holder.prefetch = setTimeout(() => {
        holder.prefetch = null
        ensureLevel(node.value, "prefetch")
      }, PREFETCH_DELAY)
    },
    [ensureLevel]
  )

  /* --------------------------------- search -------------------------------- */

  const runSearch = React.useCallback(
    (text: string) => {
      const { onSearch: searcher, path: currentPath } = latest.current
      if (!searcher) return

      abortKey(SEARCH_KEY)
      const controller = new AbortController()
      controllers.current.set(SEARCH_KEY, controller)
      const requestId = (requestIds.current.get(SEARCH_KEY) ?? 0) + 1
      requestIds.current.set(SEARCH_KEY, requestId)
      const startEpoch = epoch.current

      setSearch((prev) => ({
        query: text,
        results: prev?.results ?? [],
        loading: true,
        error: false,
      }))

      const settle = () => {
        if (controllers.current.get(SEARCH_KEY) === controller) {
          controllers.current.delete(SEARCH_KEY)
        }
      }
      const stale = () =>
        controller.signal.aborted ||
        startEpoch !== epoch.current ||
        requestId !== requestIds.current.get(SEARCH_KEY)

      Promise.resolve()
        .then(() =>
          searcher(text, { signal: controller.signal, path: currentPath })
        )
        .then((result) => {
          settle()
          if (stale()) return
          const items = Array.isArray(result) ? result : result.items
          remember(items)
          // Search hits go to `detached`, never a level: a hit lives anywhere in
          // the tree, and filing it under the open level would misplace it.
          setStore((prev) => withDetached(prev, items))
          setSearch({
            query: text,
            results: items,
            loading: false,
            error: false,
          })
        })
        .catch((error: unknown) => {
          settle()
          if (stale()) return
          setSearch((prev) => ({
            query: text,
            results: prev?.results ?? [],
            loading: false,
            error: true,
          }))
          latest.current.onLoadError?.(error, {
            parent: null,
            reason: "search",
          })
        })
    },
    [abortKey, remember]
  )

  const retrySearch = React.useCallback(() => {
    const text = latest.current.query.trim()
    if (text) runSearch(text)
  }, [runSearch])

  /* --------------------------------- resolve ------------------------------- */

  const runResolve = React.useCallback(
    (value: string) => {
      const { resolveValue: resolver } = latest.current
      if (!resolver) return

      const key = `${RESOLVE_PREFIX}${value}`
      abortKey(key)
      const controller = new AbortController()
      controllers.current.set(key, controller)
      const startEpoch = epoch.current

      const settle = () => {
        if (controllers.current.get(key) === controller) {
          controllers.current.delete(key)
        }
      }

      Promise.resolve()
        .then(() =>
          resolver(value, { signal: controller.signal, reason: "resolve" })
        )
        .then((chain) => {
          settle()
          if (controller.signal.aborted || startEpoch !== epoch.current) return
          if (!chain?.length) return
          remember(chain)
          setStore((prev) => withChain(prev, chain))
        })
        .catch((error: unknown) => {
          // Read BEFORE `settle`. A newer ask or a reset that replaced this
          // request owns the value's retry, so only a live failure is parked.
          const live = controllers.current.get(key) === controller
          settle()
          if (live) failed.current.add(value)
          if (controller.signal.aborted || startEpoch !== epoch.current) return
          latest.current.onLoadError?.(error, {
            parent: null,
            reason: "resolve",
          })
        })
    },
    [abortKey, remember]
  )

  /* --------------------------------- resets -------------------------------- */

  // Aborts what the PANEL asked for. A resolve keeps running: it feeds the
  // trigger, which shows with the popup closed.
  const cancelPanel = React.useCallback(() => {
    const keys = Array.from(controllers.current.keys()).filter(
      (key) => !key.startsWith(RESOLVE_PREFIX)
    )
    for (const key of keys) {
      controllers.current.get(key)?.abort()
      controllers.current.delete(key)
    }
    inflight.current.clear()

    const holder = timers.current
    if (holder.prefetch) {
      clearTimeout(holder.prefetch)
      holder.prefetch = null
    }
    if (keys.length === 0) return

    setStore((prev) => {
      let states: Map<string, CascaderLoadState> | null = null
      for (const key of keys) {
        const state = prev.states.get(key)
        if (!state?.loading) continue
        states = states ?? new Map(prev.states)
        if ((prev.pages.get(key)?.length ?? 0) > 0) {
          states.set(key, { ...state, loading: false })
        } else {
          // No entry AT ALL: membership is what says "loaded", so a stranded
          // `loading: true` would read as loaded-and-empty forever.
          states.delete(key)
        }
      }
      return states ? { ...prev, states } : prev
    })
    setSearch((prev) => (prev?.loading ? { ...prev, loading: false } : prev))
  }, [])

  // A `loadKey` change drops everything. Declared BEFORE the level effect, so
  // a reset always lands before the levels are asked for again.
  const loadKeyRef = React.useRef<{ key: unknown } | null>(null)
  React.useEffect(() => {
    const previous = loadKeyRef.current
    loadKeyRef.current = { key: loadKey }
    if (!previous || Object.is(previous.key, loadKey)) return

    epoch.current += 1
    for (const controller of controllers.current.values()) controller.abort()
    controllers.current.clear()
    inflight.current.clear()
    // `requestIds` is deliberately NOT cleared: the ids are stale-response
    // guards, not cache. Reusing an aborted predecessor's id would leave only
    // the epoch bump and the abort to reject the old response; monotonic per
    // key keeps all three guards independent. The unmount cleanup clears them.
    moreLatch.current.clear()
    attempted.current.clear()
    failed.current.clear()
    known.current.clear()

    const holder = timers.current
    if (holder.prefetch) {
      clearTimeout(holder.prefetch)
      holder.prefetch = null
    }

    setStore(createStore)
    setSearch(null)
  }, [loadKey])

  // Closing the popup aborts the panel's requests but does NOT drop the cache:
  // reopening onto an already-loaded level is the point of keeping it.
  React.useEffect(() => {
    if (enabled) return
    if (controllers.current.size === 0) return
    cancelPanel()
  }, [enabled, cancelPanel])

  React.useEffect(() => {
    const active = controllers.current
    const holder = timers.current
    const pending = inflight.current
    const ids = requestIds.current
    const tried = attempted.current
    const parked = failed.current
    return () => {
      for (const controller of active.values()) controller.abort()
      active.clear()
      // Cleared WITH the controllers, for StrictMode's dev remount: a stale
      // inflight signature would make `runLoad` skip the refetch forever, and
      // a value still marked as asked would never be resolved again. The
      // aborted promises are stale-guarded, so emptying the ids is safe.
      pending.clear()
      ids.clear()
      tried.clear()
      parked.clear()
      if (holder.prefetch) clearTimeout(holder.prefetch)
    }
  }, [])

  /* ------------------------------- the effects ----------------------------- */

  const hasLoader = typeof getChildren === "function"
  const hasSearch = typeof onSearch === "function"
  const hasResolve = typeof resolveValue === "function"
  const trimmed = query.trim()

  // Serialised so the effects key on CONTENT, not on the array identity.
  const levelsKey = JSON.stringify(levels)
  const valuesKey = JSON.stringify(values)

  // THE load trigger: one declarative effect on the levels on screen, not a
  // call from `pushLevel`/`navigate`, which a controlled `path` never touches.
  React.useEffect(() => {
    if (!enabled || !hasLoader) return
    for (const key of levels) ensureLevel(key, "level")
    // `levels` enters through `levelsKey`; `store` re-runs after a load lands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, hasLoader, levelsKey, store, ensureLevel])

  React.useEffect(() => {
    if (!hasSearch) return undefined
    if (!enabled || !trimmed) {
      abortKey(SEARCH_KEY)
      setSearch((prev) => (prev === null ? prev : null))
      return undefined
    }
    const timer = setTimeout(() => runSearch(trimmed), searchDebounce)
    return () => {
      clearTimeout(timer)
      abortKey(SEARCH_KEY)
    }
  }, [hasSearch, enabled, trimmed, searchDebounce, abortKey, runSearch])

  // Opening is the retry point for a failed resolve: un-ask it here, and the
  // values pass below, which also re-runs on `enabled`, asks again.
  React.useEffect(() => {
    if (!enabled || failed.current.size === 0) return
    for (const value of failed.current) attempted.current.delete(value)
    failed.current.clear()
  }, [enabled])

  // NOT gated on `enabled`: the trigger shows the selection with the popup
  // closed, so a saved value is pathed on load, not on the first open.
  // `loadKey` re-runs it, because the reset dropped every resolved chain.
  React.useEffect(() => {
    if (!hasResolve) return
    for (const value of values) {
      if (!value) continue
      if (attempted.current.has(value)) continue
      if (base.byValue.has(value) || known.current.has(value)) continue
      attempted.current.add(value)
      runResolve(value)
    }
    // `values` is depended on through `valuesKey`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, hasResolve, valuesKey, base, runResolve, loadKey])

  /* -------------------------------- the value ------------------------------ */

  const searchResults = React.useMemo(() => {
    if (!hasSearch || !trimmed) return null
    if (!search || search.query !== trimmed) {
      return NO_RESULTS as CascaderNode<T>[]
    }
    return search.results
  }, [hasSearch, trimmed, search])

  const searchState = React.useMemo<CascaderLoadState | null>(() => {
    if (!hasSearch || !trimmed) return null
    const settled = search?.query === trimmed
    return {
      loading: !settled || !!search?.loading,
      error: settled && !!search?.error,
      hasMore: false,
    }
  }, [hasSearch, trimmed, search])

  return React.useMemo(
    () => ({
      active: hasLoader,
      store,
      states: store.states,
      searchResults,
      searchState,
      ensureLevel,
      loadMore,
      retryLevel,
      retrySearch,
      invalidateLevel,
      prefetchNode,
    }),
    [
      hasLoader,
      store,
      searchResults,
      searchState,
      ensureLevel,
      loadMore,
      retryLevel,
      retrySearch,
      invalidateLevel,
      prefetchNode,
    ]
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Consumers                                 */
/* -------------------------------------------------------------------------- */

/** One level's load state, `null` when never fetched. Omit for the root. */
export function useCascaderLoadState(
  parent?: string | null
): CascaderLoadState | null {
  const { loadStates } = useCascaderState()
  return loadStates.get(parent ?? CASCADER_ROOT_KEY) ?? null
}
