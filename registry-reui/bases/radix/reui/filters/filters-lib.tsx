import { collapseCascaderPath } from "@/registry-reui/bases/radix/reui/cascader/cascader-lib"
import type { CascaderCollapse } from "@/registry-reui/bases/radix/reui/cascader/cascader-types"
import type {
  FilterField,
  FilterIndex,
  FilterOperator,
  FilterOption,
} from "@/registry-reui/bases/radix/reui/filters/filters-types"

/* -------------------------------------------------------------------------- */
/*                                    Menus                                   */
/* -------------------------------------------------------------------------- */

/**
 * One menu size for the chip's kebab and the builder's three menus, which draw
 * the same rows. `w-max` OVERRIDES the shadcn content width, which pins to the
 * anchor and hides horizontal overflow, so a menu hung off a 28px icon button
 * CUT every longer row. Floor 128px, down from 224px: the rows run about 130px,
 * and five of the eight styles already floor a dropdown there (luma, maia and
 * sera sit at 192px). The 24rem cap stops a pathological label pushing the menu
 * off the side of a phone. Past it a row truncates rather than wraps, since a
 * wrapped row changes HEIGHT and would slide the destructive row under the
 * pointer: `min-w-0` lets a row shrink below its content at all (a flex child's
 * floor is its content otherwise) and the label span carries `truncate`, see
 * `FILTER_MENU_LABEL_CLASS`.
 */
export const FILTER_MENU_CLASS =
  "w-max min-w-32 max-w-[min(24rem,calc(100vw-2rem))] [&_[data-slot=dropdown-menu-item]]:min-w-0"

/**
 * What a menu row's LABEL wears, and it has to be a real span: `text-overflow`
 * needs a block container, not the anonymous flex item a bare text child is.
 * `min-w-0` so the span can shrink below its own content.
 */
export const FILTER_MENU_LABEL_CLASS = "min-w-0 truncate"

/**
 * The FIELD PICKER's panel, shared by the Add filter popover and the advanced
 * row's attribute cell so one schema is never drawn at two widths. `w-auto`
 * grows to the longest row, so the 224px floor (down from 256px) only decides
 * the reported case: a flat schema of short names in a mostly empty panel.
 * Measured: 224px still clears the search input, the breadcrumb and a leaf
 * row's icon-plus-label.
 */
export const FILTER_FIELD_PICKER_CLASS = "w-auto min-w-56 p-0"

/* -------------------------------------------------------------------------- */
/*                                    Paths                                   */
/* -------------------------------------------------------------------------- */

/** Root key for `childrenOf`; a control char cannot collide with a field id. */
export const FILTER_ROOT_KEY = "\u0000root"

/** Separator between path segments in the flat map keys. */
const PATH_SEPARATOR = "\u0000"

export function joinFilterPath(path: readonly string[]): string {
  return path.join(PATH_SEPARATOR)
}

export function splitFilterPath(key: string): string[] {
  return key === "" ? [] : key.split(PATH_SEPARATOR)
}

/** The joined key of a path's parent, or `FILTER_ROOT_KEY` at the top level. */
export function parentFilterKey(path: readonly string[]): string {
  return path.length <= 1 ? FILTER_ROOT_KEY : joinFilterPath(path.slice(0, -1))
}

/* -------------------------------------------------------------------------- */
/*                                  Signature                                 */
/* -------------------------------------------------------------------------- */

/**
 * A content hash of the schema, used to skip a rebuild. Identity alone is
 * useless: every block and example declares `fields` as an inline literal, so a
 * memo keyed on the array misses on every parent render. Render props (`icon`,
 * `renderValue`, a component-valued `editor`) are hashed by PRESENCE only,
 * because inline JSX recreates them: swapping one's body keeps serving the
 * previous field objects, so change a structural field or give `fields` a
 * stable identity.
 */
export function computeFilterSchemaSignature<V, O>(
  fields: readonly FilterField<V, O>[]
): string {
  const parts: string[] = []

  const walk = (list: readonly FilterField<V, O>[], depth: number) => {
    for (const field of list) {
      parts.push(
        depth +
          ":" +
          field.id +
          "|" +
          (field.label ?? "") +
          "|" +
          (field.type ?? "") +
          "|" +
          (field.defaultOperator ?? "") +
          "|" +
          (field.column ?? "") +
          "|" +
          (field.selectable ? "1" : "0") +
          (field.disabled ? "1" : "0") +
          (field.icon ? "1" : "0") +
          (field.renderValue ? "1" : "0") +
          (field.loadOptions ? "1" : "0") +
          (field.resolveValues ? "1" : "0") +
          "|" +
          (typeof field.editor === "string"
            ? field.editor
            : field.editor
              ? "fn"
              : "") +
          "|" +
          (field.keywords?.join(",") ?? "") +
          "|" +
          (field.count ?? "") +
          "|" +
          // Options are part of the shape, and `exclusive` rides along: it
          // decides what a pick DOES, so turning it on must force a rebuild.
          (field.options
            ? field.options
                .map(
                  (option) =>
                    option.value +
                    "~" +
                    option.label +
                    (option.exclusive ? "~x" : "")
                )
                .join(",")
            : "") +
          "|" +
          (Array.isArray(field.operators)
            ? field.operators.map((operator) => operator.value).join(",")
            : field.operators
              ? "fn"
              : "")
      )
      if (field.fields?.length) walk(field.fields, depth + 1)
    }
  }

  walk(fields, 0)
  return parts.join("\n")
}

/* -------------------------------------------------------------------------- */
/*                                    Index                                   */
/* -------------------------------------------------------------------------- */

const EMPTY_INDEX: FilterIndex<never, never> = {
  byPath: new Map(),
  childrenOf: new Map(),
  parentOf: new Map(),
  all: [],
  roots: [],
  signature: "",
}

/**
 * Normalizes a field schema into flat maps. When `previous`'s signature
 * matches, the PREVIOUS OBJECT is returned: an equal-but-new one would leave
 * every downstream memo missing exactly as often as before. Duplicate sibling
 * ids are ignored after the first, as the cascader does for node values, and
 * `findFilterSchemaIssues` reports them in development.
 */
export function buildFilterIndex<V = unknown, O = unknown>(
  fields: readonly FilterField<V, O>[],
  previous?: FilterIndex<V, O> | null,
  /** A signature the caller already computed, to avoid walking twice. */
  precomputedSignature?: string
): FilterIndex<V, O> {
  const signature = precomputedSignature ?? computeFilterSchemaSignature(fields)
  if (previous && previous.signature === signature) return previous
  if (fields.length === 0) {
    return { ...(EMPTY_INDEX as unknown as FilterIndex<V, O>), signature }
  }

  const byPath = new Map<string, FilterField<V, O>>()
  const childrenOf = new Map<string, FilterField<V, O>[]>()
  const parentOf = new Map<string, string>()
  const all: { field: FilterField<V, O>; path: string[] }[] = []
  const roots: FilterField<V, O>[] = []

  const walk = (
    list: readonly FilterField<V, O>[],
    parentPath: string[],
    parentKey: string
  ) => {
    const accepted: FilterField<V, O>[] = []
    const seen = new Set<string>()

    for (const field of list) {
      if (seen.has(field.id)) continue
      seen.add(field.id)

      const path = [...parentPath, field.id]
      const key = joinFilterPath(path)
      if (byPath.has(key)) continue

      byPath.set(key, field)
      parentOf.set(key, parentKey === FILTER_ROOT_KEY ? "" : parentKey)
      all.push({ field, path })
      accepted.push(field)

      if (field.fields?.length) walk(field.fields, path, key)
    }

    childrenOf.set(parentKey, accepted)
    if (parentKey === FILTER_ROOT_KEY) roots.push(...accepted)
  }

  walk(fields, [], FILTER_ROOT_KEY)

  return { byPath, childrenOf, parentOf, all, roots, signature }
}

export function getFilterField<V, O>(
  index: FilterIndex<V, O>,
  path: readonly string[]
): FilterField<V, O> | undefined {
  return index.byPath.get(joinFilterPath(path))
}

/** The ancestor chain for a path, root first and the field itself last. */
export function getFilterFieldChain<V, O>(
  index: FilterIndex<V, O>,
  path: readonly string[]
): FilterField<V, O>[] {
  const chain: FilterField<V, O>[] = []
  for (let i = 1; i <= path.length; i++) {
    const field = index.byPath.get(joinFilterPath(path.slice(0, i)))
    if (!field) break
    chain.push(field)
  }
  return chain
}

/** Child fields of a path. Pass an empty path for the root level. */
export function getFilterChildren<V, O>(
  index: FilterIndex<V, O>,
  path: readonly string[]
): FilterField<V, O>[] {
  const key = path.length === 0 ? FILTER_ROOT_KEY : joinFilterPath(path)
  return index.childrenOf.get(key) ?? []
}

export function isFilterBranch<V, O>(field: FilterField<V, O>): boolean {
  return Boolean(field.fields?.length)
}

/**
 * Whether a field DECLARES itself filterable on: leaves always, a branch only
 * with `selectable`. The shipped pickers ignore it, see `isFilterFieldPickable`.
 */
export function isFilterFieldSelectable<V, O>(
  field: FilterField<V, O>
): boolean {
  if (field.disabled) return false
  return isFilterBranch(field) ? Boolean(field.selectable) : true
}

/**
 * Whether the SHIPPED pickers may commit a field: leaves only. A row that both
 * drills in and commits cannot disambiguate a click - its chevron and child
 * count promise "opens a list", so the press that opened it also filtered on
 * the parent and dismissed the picker. `selectable` stays honoured by
 * `isFilterFieldSelectable` for a chrome that separates the two.
 */
export function isFilterFieldPickable<V, O>(field: FilterField<V, O>): boolean {
  if (field.disabled) return false
  return !isFilterBranch(field)
}

/** Trailing count for a branch row. */
export function getFilterFieldCount<V, O>(field: FilterField<V, O>): number {
  return field.count ?? field.fields?.length ?? 0
}

/** Renders a path as "Name > First" using the caller's separator. */
export function formatFilterPath<V, O>(
  index: FilterIndex<V, O>,
  path: readonly string[],
  separator: string
): string {
  const chain = getFilterFieldChain(index, path)
  if (chain.length === 0) return path.join(separator)
  return chain.map((field) => field.label).join(separator)
}

/** How a path is shortened; the cascader's own union, so the two cannot drift. */
export type FilterPathCollapse = CascaderCollapse

export type FilterPathSegment<V = unknown, O = unknown> =
  | { type: "field"; field: FilterField<V, O> }
  /** The run that was elided, kept so a host can surface it. */
  | { type: "ellipsis"; hidden: FilterField<V, O>[] }

/**
 * Shortens an ancestor chain to at most `maxSegments` names, on the cascader's
 * arithmetic so the chip's path and the builder's attribute cell cannot round
 * differently. The adapter is POSITIONAL because a `FilterField`'s `id` is
 * unique only among its siblings, so the index is the only key that survives a
 * collapser keyed on `value`. Default `"none"`: no upgrade shortens a path.
 */
export function collapseFilterPath<V, O>(
  chain: readonly FilterField<V, O>[],
  options: { maxSegments?: number; collapse?: FilterPathCollapse } = {}
): FilterPathSegment<V, O>[] {
  const segments = collapseCascaderPath(
    chain.map((field, index) => ({ value: String(index), label: field.label })),
    { maxSegments: options.maxSegments, collapse: options.collapse ?? "none" }
  )
  return segments.map((segment) =>
    segment.type === "node"
      ? { type: "field" as const, field: chain[Number(segment.node.value)] }
      : {
          type: "ellipsis" as const,
          hidden: segment.hidden.map((node) => chain[Number(node.value)]),
        }
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Combinator                                 */
/* -------------------------------------------------------------------------- */

export type FilterCombinatorSlot = "where" | "toggle" | "echo"

/**
 * Which of the three forms the combinator slot before rule `index` takes. A
 * group has exactly ONE combinator, so only one slot may be interactive: three
 * editable "and"s down a column would imply three independent choices.
 */
export function filterCombinatorSlot(index: number): FilterCombinatorSlot {
  if (index === 0) return "where"
  return index === 1 ? "toggle" : "echo"
}

/* -------------------------------------------------------------------------- */
/*                                   Matching                                 */
/* -------------------------------------------------------------------------- */

/** `toLocaleLowerCase`, so Turkish dotted and dotless i fold as a reader expects. */
export function foldFilterText(text: string): string {
  return text.toLocaleLowerCase()
}

export function normalizeFilterQuery(query: string): string {
  return foldFilterText(query.trim())
}

/** Whether a field matches a normalized query, by label or keywords. */
export function matchesFilterQuery<V, O>(
  field: FilterField<V, O>,
  normalizedQuery: string
): boolean {
  if (normalizedQuery === "") return true
  if (foldFilterText(field.label).includes(normalizedQuery)) return true
  if (field.keywords) {
    for (const keyword of field.keywords) {
      if (foldFilterText(keyword).includes(normalizedQuery)) return true
    }
  }
  return false
}

/**
 * Filters one level, preserving input order. Unused here like
 * `searchFilterDeep`: kept so a consumer's own picker need not re-implement the
 * fold and the keyword matching.
 */
export function filterFilterLevel<V, O>(
  fields: readonly FilterField<V, O>[],
  normalizedQuery: string
): FilterField<V, O>[] {
  if (normalizedQuery === "") return fields as FilterField<V, O>[]
  return fields.filter((field) => matchesFilterQuery(field, normalizedQuery))
}

/**
 * Searches every SELECTABLE field at any depth, because a result the user
 * cannot pick is a dead end. Unused here - the shipped picker is the cascader
 * and delegates deep search to it - but it keeps a consumer's own picker from
 * re-implementing the fold, the keyword matching and the selectable rule.
 */
export function searchFilterDeep<V, O>(
  index: FilterIndex<V, O>,
  normalizedQuery: string,
  limit = 200
): { field: FilterField<V, O>; path: string[] }[] {
  if (normalizedQuery === "") return []
  const results: { field: FilterField<V, O>; path: string[] }[] = []
  for (const entry of index.all) {
    if (results.length >= limit) break
    if (!isFilterFieldSelectable(entry.field)) continue
    if (matchesFilterQuery(entry.field, normalizedQuery)) results.push(entry)
  }
  return results
}

/** Filters an option list by a normalized query, by label or keywords. */
export function filterFilterOptions<O>(
  options: readonly FilterOption<O>[],
  normalizedQuery: string
): FilterOption<O>[] {
  if (normalizedQuery === "") return options as FilterOption<O>[]
  return options.filter((option) => {
    if (foldFilterText(option.label).includes(normalizedQuery)) return true
    if (option.keywords) {
      for (const keyword of option.keywords) {
        if (foldFilterText(keyword).includes(normalizedQuery)) return true
      }
    }
    return false
  })
}

/* -------------------------------------------------------------------------- */
/*                              Exclusive options                             */
/* -------------------------------------------------------------------------- */

/**
 * The None rule, as pure algebra over two selections: pick the `exclusive`
 * option and it is the only pick, pick anything else and it goes. Written
 * against the DELTA, not the result, which is what makes it total: an empty
 * delta is a removal, including UNTICKING the exclusive row; an exclusive
 * arrival is the whole answer; an ordinary arrival drops every exclusive value,
 * restored ones included; both at once gives it to the LAST exclusive.
 * `isExclusive` is a lookup, not an array, because a query hiding the None row
 * while it stays SELECTED would answer "not exclusive" for the value the click
 * must clear. Never applied on read - a saved view is the consumer's data - so
 * it heals on the first ordinary pick, and only while `isExclusive` can ANSWER:
 * a None row on a `loadOptions` field belongs in the static `options`.
 */
export function applyFilterExclusiveSelection(
  next: readonly string[],
  previous: readonly string[],
  isExclusive: (value: string) => boolean
): string[] {
  const held = new Set(previous)
  const added = next.filter((value) => !held.has(value))
  if (added.length === 0) return next as string[]

  let arrived: string | null = null
  for (const value of added) {
    if (isExclusive(value)) arrived = value
  }
  if (arrived !== null) return [arrived]

  const kept = next.filter((value) => !isExclusive(value))
  // The same array when nothing was exclusive, which is nearly every call: a
  // fresh one would commit a new value on every toggle of an ordinary row.
  return kept.length === next.length ? (next as string[]) : kept
}

/* -------------------------------------------------------------------------- */
/*                                     Ids                                    */
/* -------------------------------------------------------------------------- */

/**
 * Builds a deterministic id generator. `Date.now()` and `Math.random()`, as the
 * old `createFilter` used, give the server and the client different ids for the
 * same query, so any page shipping default filters hydrated mismatched.
 */
export function createFilterIdFactory(seed: string): () => string {
  let counter = 0
  return () => {
    counter += 1
    return `${seed}${counter}`
  }
}

/* -------------------------------------------------------------------------- */
/*                              Development checks                            */
/* -------------------------------------------------------------------------- */

const warned = new Set<string>()

/** Warns once per key. Never throws, and is a no-op in production. */
export function warnFilterOnce(key: string, message: string): void {
  if (process.env.NODE_ENV === "production") return
  if (warned.has(key)) return
  warned.add(key)
  console.warn(`[filters] ${message}`)
}

/** Clears the warn-once memory. For tests. */
export function resetFilterWarnings(): void {
  warned.clear()
}

export interface FilterSchemaIssues {
  /** Ids that are empty, or that collide with a sibling. */
  duplicatePaths: string[]
  emptyIds: string[]
  /** Branches that declare `selectable` but hold no children. */
  emptyBranches: string[]
  /** Fields whose `defaultOperator` is not in their operator list. */
  unknownDefaultOperators: string[]
}

/** Reported, never thrown: a bad schema must degrade, not blank the page. */
export function findFilterSchemaIssues<V, O>(
  fields: readonly FilterField<V, O>[],
  resolveOperators: (field: FilterField<V, O>) => FilterOperator[]
): FilterSchemaIssues {
  const duplicatePaths: string[] = []
  const emptyIds: string[] = []
  const emptyBranches: string[] = []
  const unknownDefaultOperators: string[] = []

  const walk = (list: readonly FilterField<V, O>[], parentPath: string[]) => {
    const seen = new Set<string>()
    for (const field of list) {
      const label = [...parentPath, field.id].join(".")
      if (!field.id) emptyIds.push(label)
      else if (seen.has(field.id)) duplicatePaths.push(label)
      seen.add(field.id)

      if (field.selectable && field.fields && field.fields.length === 0) {
        emptyBranches.push(label)
      }

      if (field.defaultOperator) {
        const operators = resolveOperators(field)
        if (!operators.some((op) => op.value === field.defaultOperator)) {
          unknownDefaultOperators.push(`${label} -> ${field.defaultOperator}`)
        }
      }

      if (field.fields?.length) walk(field.fields, [...parentPath, field.id])
    }
  }

  walk(fields, [])
  return { duplicatePaths, emptyIds, emptyBranches, unknownDefaultOperators }
}
