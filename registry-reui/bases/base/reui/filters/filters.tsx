"use client"

import * as React from "react"
import { FiltersAdvanced } from "@/registry-reui/bases/base/reui/filters/filters-advanced"
import { FiltersBuilder } from "@/registry-reui/bases/base/reui/filters/filters-builder"
import { FilterChip } from "@/registry-reui/bases/base/reui/filters/filters-chip"
import {
  createFilterFocusStore,
  createFilterResolutionStore,
  createFilterRowStateStore,
  FilterActionsContext,
  filterControlSizes,
  FilterFocusContext,
  filterReadOnlyProps,
  FilterRenderContext,
  FilterRowStateProvider,
  FilterStateContext,
  isFilterLocked,
  useFilterActions,
  useFilterFocusStore,
  useFilterState,
  type FilterActionsContextValue,
} from "@/registry-reui/bases/base/reui/filters/filters-context"
import {
  filterDraftReducer,
  isFilterDraftCommittable,
  type FilterDraftAction,
} from "@/registry-reui/bases/base/reui/filters/filters-draft"
import {
  DEFAULT_FILTER_EDITORS,
  resolveFilterEditor,
  type FilterEditorRegistry,
} from "@/registry-reui/bases/base/reui/filters/filters-editors"
import { resolveFilterLabels } from "@/registry-reui/bases/base/reui/filters/filters-i18n"
import {
  buildFilterIndex,
  computeFilterSchemaSignature,
  createFilterIdFactory,
  findFilterSchemaIssues,
  formatFilterPath,
  getFilterField,
  warnFilterOnce,
  type FilterPathCollapse,
} from "@/registry-reui/bases/base/reui/filters/filters-lib"
import {
  createFilterOperators,
  DEFAULT_FILTER_OPERATOR_LABELS,
  DEFAULT_FILTER_OPERATORS,
  getFilterOperator,
  negateFilterOperator,
  operatorTakesValue,
  resolveFilterOperators,
  type FilterOperatorLabels,
} from "@/registry-reui/bases/base/reui/filters/filters-operators"
import {
  clearFilterQuery,
  copyFilterNodeTo,
  countFilterRules,
  createFilterGroup,
  createFilterQuery,
  createFilterRule,
  duplicateFilterNode,
  findFilterNode,
  findFilterRule,
  flattenFilterRules,
  insertFilterNode,
  isFilterRule,
  moveFilterNode,
  moveFilterNodeTo,
  removeFilterNode,
  setFilterCombinator,
  toggleFilterCombinator,
  unwrapFilterGroup,
  updateFilterRule,
  wrapFilterNodeInGroup,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterChangeDetails,
  FilterCombinator,
  FilterDraft,
  FilterDraftStep,
  FilterEditor,
  FilterEmptyStateContext,
  FilterField,
  FilterLabels,
  FilterQuery,
  FilterRule,
  FilterValueDisplayContext,
} from "@/registry-reui/bases/base/reui/filters/filters-types"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const filtersBarVariants = cva("flex flex-wrap items-center", {
  variants: {
    // The rungs `FILTER_CONTROL_SIZES` holds, fed the RESOLVED rung at both
    // call sites, which is what keeps the two ladders in step: a cva default
    // only applies to a value nobody passed, so a raw `"lg"` reaching here
    // would leave the bar with no gap at all.
    size: {
      sm: "gap-1.5",
      default: "gap-2",
    },
  },
  defaultVariants: { size: "default" },
})

/* -------------------------------------------------------------------------- */
/*                                 Controllable                               */
/* -------------------------------------------------------------------------- */

function useControllableQuery<V, O>(
  controlled: FilterQuery<V> | undefined,
  uncontrolledDefault: FilterQuery<V> | undefined,
  onChange:
    | ((query: FilterQuery<V>, details: FilterChangeDetails<V, O>) => void)
    | undefined
) {
  const isControlled = controlled !== undefined
  const [internal, setInternal] = React.useState<FilterQuery<V>>(
    () => uncontrolledDefault ?? createFilterQuery<V>()
  )

  const query = isControlled ? controlled : internal
  const queryRef = React.useRef(query)
  React.useEffect(() => {
    queryRef.current = query
  })

  const setQuery = React.useCallback(
    (next: FilterQuery<V>, details: FilterChangeDetails<V, O>) => {
      if (next === queryRef.current) return
      queryRef.current = next
      if (!isControlled) setInternal(next)
      onChange?.(next, details)
    },
    [isControlled, onChange]
  )

  return { query, queryRef, setQuery }
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

export interface FiltersProps<V = unknown, O = unknown> {
  /** The field schema. Nested via each field's own `fields`. */
  fields: FilterField<V, O>[]

  query?: FilterQuery<V>
  defaultQuery?: FilterQuery<V>
  onQueryChange?: (
    query: FilterQuery<V>,
    details: FilterChangeDetails<V, O>
  ) => void

  labels?: Partial<FilterLabels>
  /** Operator wording, overridden independently of the chrome copy. */
  operatorLabels?: FilterOperatorLabels
  /** Extra or replacement value editors, resolved by a field's `editor` name. */
  editors?: FilterEditorRegistry

  /**
   * Which chrome draws the query. `"basic"` is the flat chip row, joined by an
   * implicit AND and drawing no combinator, because a chip row has nowhere to
   * put a parenthesis, and it draws a nested rule at any depth as a flat chip.
   */
  variant?: "basic" | "advanced"
  /** Where the advanced builder lives. `"inline"` renders the panel in place. */
  advancedMode?: "popover" | "inline"
  /**
   * Where the panel sits against its trigger. Stating it settles a twin split:
   * on overflow Base UI flips edges, Radix only shifts along the axis.
   */
  advancedAlign?: "start" | "center" | "end"
  /**
   * Whether the advanced builder's rows can be REORDERED. Off by default: a
   * move changes nothing about what the query MEANS, and costs a grip on every
   * row plus a gesture a touch screen starts by accident. On, drag and
   * Alt+Arrow move any row but the lone root.
   */
  reorderable?: boolean

  /**
   * The density of the whole bar, chips included. TWO RUNGS and no `lg`,
   * resolved through `filterControlSizes` to whatever the ACTIVE STYLE calls
   * that rung (nova 7/8, sera 9/10, mira 6/7, maia and luma 8/9, lyra and rhea
   * 7/8, vega 8/9). Chips need no `ButtonGroup` variant: `items-stretch` gives
   * the pill the height of its one definite-height child, the kebab.
   */
  size?: "sm" | "default"
  disabled?: boolean
  readOnly?: boolean

  /**
   * ONE VETO POINT for every change the BAR makes to the query, and only those.
   * Return `false` to refuse; anything else commits, and `details.reason` names
   * the action. One hook and not fourteen because every write goes through
   * `emit`: the Delete key, Alt+Arrow and a drag alike. It can only refuse, and
   * it sits BEHIND the lock, so a locked bar never asks it. Returning a
   * REPLACEMENT tree was rejected: the announcement is already computed from
   * the proposed tree, so the bar would say one thing and commit another.
   */
  onBeforeQueryChange?: (
    query: FilterQuery<V>,
    details: FilterChangeDetails<V, O>
  ) => boolean | void

  /**
   * Offers "Convert to advanced filter" in every chip's kebab; its presence IS
   * the switch, since `variant` belongs to the consumer. Not drawn in advanced.
   */
  onConvertToAdvanced?: () => void

  /**
   * Classes for the dropdown MENUS and the field PICKER panel, one prop each
   * rather than one per mount point. Merged after the default, so `w-*` wins.
   */
  menuClassName?: string
  fieldPickerClassName?: string

  /**
   * How a NESTED attribute path is shortened when too deep to read. `"none"` is
   * the default, so an upgrade changes nothing under a consumer; the collapser
   * is the cascader's, and the full path survives as the accessible NAME.
   */
  pathCollapse?: FilterPathCollapse
  /**
   * How many names survive the collapse, the elided run not counted. Inert
   * while `pathCollapse` is `"none"`. Three is the cascader's own default.
   */
  maxPathSegments?: number

  /** Replaces the default Add filter button. */
  trigger?: React.ReactNode
  /** Renders a Clear button once the query holds anything. */
  showClear?: boolean

  renderValue?: (context: FilterValueDisplayContext<V, O>) => React.ReactNode
  renderChip?: (rule: FilterRule<V>) => React.ReactNode
  /**
   * Replaces the advanced builder's empty state, which exists at all because a
   * builder with no rows is a footer floating in blank space. `null` for none.
   */
  renderEmpty?: (context: FilterEmptyStateContext) => React.ReactNode

  className?: string
  children?: React.ReactNode
}

export function Filters<V = unknown, O = unknown>({
  fields,
  query: controlledQuery,
  defaultQuery,
  onQueryChange,
  labels: labelsProp,
  operatorLabels: operatorLabelsProp,
  editors: editorsProp,
  variant = "basic",
  advancedMode = "popover",
  advancedAlign = "start",
  reorderable = false,
  size = "default",
  disabled = false,
  readOnly = false,
  onBeforeQueryChange,
  onConvertToAdvanced,
  menuClassName,
  fieldPickerClassName,
  pathCollapse = "none",
  maxPathSegments = 3,
  trigger,
  showClear = false,
  renderValue,
  renderChip,
  renderEmpty,
  className,
  children,
}: FiltersProps<V, O>) {
  const { query, queryRef, setQuery } = useControllableQuery<V, O>(
    controlledQuery,
    defaultQuery,
    onQueryChange
  )

  const [draft, dispatchDraftRaw] = React.useReducer(
    filterDraftReducer<V>,
    null as FilterDraft<V> | null
  )
  // Text AND a counter: `aria-live` fires on a DOM mutation and React writes
  // nothing when the string is already there, so a repeat was silent. Measured
  // with a MutationObserver: "Group added" three times, one mutation.
  const [announced, setAnnounced] = React.useState({ seq: 0, text: "" })
  const announcement = announced.text
  const setAnnouncement = React.useCallback((text: string) => {
    setAnnounced((prev) => ({ seq: prev.seq + 1, text }))
  }, [])

  // Seeded from useId: ids from Date.now() plus Math.random() broke hydration.
  const idSeed = React.useId()
  const nextId = React.useMemo(
    () => createFilterIdFactory(`${idSeed}f`),
    [idSeed]
  )

  const focusStore = React.useMemo(() => createFilterFocusStore(), [])
  const rowStateStore = React.useMemo(() => createFilterRowStateStore(), [])
  // One per root: the value-to-label store every `useFilterOptions` shares.
  const resolutionStore = React.useMemo(() => createFilterResolutionStore(), [])

  /* -------------------------------- derived ------------------------------- */

  // `fields` is an inline literal at every real call site, so the CHEAP walk
  // runs every render and the EXPENSIVE index memoizes on its result. Not a
  // ref caching the previous index: writing a ref during render is the
  // impurity this rewrite removed, and it misbehaves under StrictMode.
  const signature = computeFilterSchemaSignature(fields)
  const index = React.useMemo(
    () => buildFilterIndex<V, O>(fields, null, signature),
    // Not `fields`: its identity changes every render at every real call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature]
  )

  const labels = React.useMemo(
    () => resolveFilterLabels(labelsProp),
    [labelsProp]
  )

  const operatorCatalog = React.useMemo(() => {
    if (!operatorLabelsProp) return DEFAULT_FILTER_OPERATORS
    return createFilterOperators({
      ...DEFAULT_FILTER_OPERATOR_LABELS,
      ...operatorLabelsProp,
    })
  }, [operatorLabelsProp])

  const editors = React.useMemo(
    () => ({ ...DEFAULT_FILTER_EDITORS, ...editorsProp }),
    [editorsProp]
  )

  const resolveOperators = React.useCallback(
    (field: FilterField<V, O>) =>
      resolveFilterOperators(field, operatorCatalog),
    [operatorCatalog]
  )

  const ruleCount = React.useMemo(() => countFilterRules(query), [query])

  /* --------------------------- latest-props ref --------------------------- */

  const latest = React.useRef({
    index,
    labels,
    operatorCatalog,
    resolveOperators,
    draft,
    nextId,
    setQuery,
    queryRef,
    disabled,
    readOnly,
    onBeforeQueryChange,
  })
  React.useEffect(() => {
    latest.current = {
      index,
      labels,
      operatorCatalog,
      resolveOperators,
      draft,
      nextId,
      setQuery,
      queryRef,
      disabled,
      readOnly,
      onBeforeQueryChange,
    }
  })

  /* -------------------------------- actions ------------------------------- */

  // Every mutator below reads state through `latest`, so no keystroke rebuilds
  // one. The lock flags are the ONE exception, for the reason on `locked`.

  /**
   * THE MUTATION BOUNDARY, asked here and not at the nine buttons, because the
   * routes into a query are not only buttons. It needs BOTH the closure and
   * the ref: `latest` is written in a passive effect and effects run
   * child-first, so a consumer effect in the commit that turns `readOnly` on
   * runs BEFORE the ref learns of it, while the ref is what a stale handler
   * reads afterwards.
   */
  const locked = React.useCallback(
    () => disabled || readOnly || isFilterLocked(latest.current),
    [disabled, readOnly]
  )

  // Reports whether the write LANDED: `onBeforeQueryChange` is discoverable
  // only here, and a vetoed remove that still announced a count would lie.
  const emit = React.useCallback(
    (
      next: FilterQuery<V>,
      reason: FilterChangeDetails<V, O>["reason"],
      rule: FilterRule<V> | null
    ): boolean => {
      // The backstop, redundant with each mutator's own early return, and
      // FIRST, so the consumer hook cannot approve what the lock refused.
      if (locked()) return false
      const field = rule
        ? (getFilterField(latest.current.index, rule.path) ?? null)
        : null
      const details: FilterChangeDetails<V, O> = { reason, rule, field }
      // Strictly `false`, so a handler that forgets to return is not a veto.
      if (latest.current.onBeforeQueryChange?.(next, details) === false) {
        return false
      }
      latest.current.setQuery(next, details)
      return true
    },
    [locked]
  )

  /**
   * Drops the roving tab stop when the node holding it no longer exists: a cell
   * claims it when the store names it, and the "row one takes it" fallback
   * fires only when the store is EMPTY, so a deleted id left twenty cells at
   * `tabindex="-1"` with focus on the BODY. Keyed on the committed `query`, so
   * a consumer's Reset or saved-view load is repaired too: add a condition,
   * press Reset, and 25 cells stayed untabbable in both twins.
   */
  React.useEffect(() => {
    const { id } = focusStore.getSnapshot()
    if (!id || findFilterNode(query, id)) return
    focusStore.set({ id: null, segment: null, autoOpen: false })
  }, [query, focusStore])

  const addRule = React.useCallback(
    (rule: FilterRule<V>, parentId?: string) => {
      if (locked()) return
      const next = insertFilterNode(
        latest.current.queryRef.current,
        rule,
        parentId
      )
      if (!emit(next, "add", rule)) return
      setAnnouncement(
        latest.current.labels.countAnnouncement(countFilterRules(next))
      )
    },
    [emit, locked, setAnnouncement]
  )

  const addGroup = React.useCallback(
    (parentId?: string, combinator: FilterCombinator = "or") => {
      // Before `nextId`, so a LOCKED bar cannot drift the SSR-seeded sequence.
      if (locked()) return ""
      const id = latest.current.nextId()
      // `or` by default: `a AND (b AND c)` is just `a AND b AND c`.
      const next = insertFilterNode(
        latest.current.queryRef.current,
        createFilterGroup<V>({ id, combinator }),
        parentId
      )
      // `""` on a veto: every caller moves focus onto the id it gets back, and
      // focusing a group that was never created strands the tab stop. The id
      // is already burnt, deliberately: a veto is a client-time decision the
      // server never took part in.
      if (!emit(next, "add", null)) return ""
      setAnnouncement(latest.current.labels.groupAnnouncement(true))
      return id
    },
    [emit, locked, setAnnouncement]
  )

  const updateRule = React.useCallback(
    (id: string, updates: Partial<Omit<FilterRule<V>, "id" | "type">>) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = updateFilterRule(current, id, updates)
      if (next === current) return
      // THE VALUE, not the field or the operator: picking an attribute leaves
      // the value empty, so arming there reddens the flow the primitive itself
      // walks a user through. A field re-pick sends `value: undefined` in the
      // SAME patch, so `path` and not the presence of `value` tells the two
      // apart. Clearing a typed value still arms it: no `path` in that patch.
      if ("path" in updates) rowStateStore.unmark(id)
      else if ("value" in updates) rowStateStore.mark(id)
      emit(next, "update", findFilterRule(next, id))
    },
    [emit, locked, rowStateStore]
  )

  const removeNode = React.useCallback(
    (id: string) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const removed = findFilterRule(current, id)
      const next = removeFilterNode(current, id)
      if (next === current) return
      if (!emit(next, "remove", removed)) return
      // A rule removal reports the COUNT; a group has no rule to report and
      // takes an unknown number of conditions with it, so it says so instead.
      setAnnouncement(
        removed
          ? latest.current.labels.countAnnouncement(countFilterRules(next))
          : latest.current.labels.groupAnnouncement(false)
      )
    },
    [emit, locked, setAnnouncement]
  )

  const duplicateNode = React.useCallback(
    (id: string) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = duplicateFilterNode(current, id, latest.current.nextId)
      if (next === current) return
      if (!emit(next, "duplicate", findFilterRule(current, id))) return
      // The count, not "duplicated": a GROUP adds an unknown number of rows.
      setAnnouncement(
        latest.current.labels.countAnnouncement(countFilterRules(next))
      )
    },
    [emit, locked, setAnnouncement]
  )

  const negateRule = React.useCallback(
    (id: string) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const rule = findFilterRule(current, id)
      if (!rule) return
      const field = getFilterField(latest.current.index, rule.path)
      if (!field) return
      const operators = latest.current.resolveOperators(field)
      const flipped = negateFilterOperator(
        getFilterOperator(operators, rule.operator),
        operators,
        rule.negated
      )
      const next = updateFilterRule(current, id, {
        operator: flipped.operator ?? rule.operator,
        negated: flipped.negated || undefined,
      })
      emit(next, "negate", findFilterRule(next, id))
    },
    [emit, locked]
  )

  // Says where a node LANDED, the one mutator a screen reader hears nothing
  // else about: focus stays on the handle and the name does not change. Reads
  // the tree AFTER the move: the position and sibling count announced are the
  // ones the user has just arrived at.
  const announceReorder = React.useCallback(
    (next: FilterQuery<V>, id: string, fromParentId: string | null) => {
      const found = findFilterNode(next, id)
      if (!found || !found.parent) return
      const label = isFilterRule(found.node)
        ? formatFilterPath(
            latest.current.index,
            found.node.path,
            latest.current.labels.pathSeparator
          )
        : found.node.combinator === "and"
          ? latest.current.labels.groupAll
          : latest.current.labels.groupAny
      const position = found.index + 1
      const total = found.parent.rules.length

      // A move that changed the node's CONTAINER is a different event, named by
      // the group's own headline, or the bar's label at the top level.
      if (fromParentId && fromParentId !== found.parent.id) {
        const destination =
          found.parent.id === next.id
            ? latest.current.labels.filtersLabel
            : found.parent.combinator === "and"
              ? latest.current.labels.groupAll
              : latest.current.labels.groupAny
        setAnnouncement(
          latest.current.labels.moveAnnouncement(
            label,
            destination,
            position,
            total
          )
        )
        return
      }

      setAnnouncement(
        latest.current.labels.reorderAnnouncement(label, position, total)
      )
    },
    [setAnnouncement]
  )

  const moveNode = React.useCallback(
    (id: string, delta: number) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = moveFilterNode(current, id, delta)
      if (next === current) return
      if (!emit(next, "reorder", findFilterRule(next, id))) return
      // Within the owning group by construction, so there is no destination.
      announceReorder(next, id, null)
    },
    [emit, announceReorder, locked]
  )

  // Also the drag layer's drop commit, so a drag and Alt+Arrow say the same.
  const moveNodeTo = React.useCallback(
    (id: string, parentId: string, index: number) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      // BEFORE the move: the only place the old parent still exists.
      const fromParentId = findFilterNode(current, id)?.parent?.id ?? null
      const next = moveFilterNodeTo(current, id, parentId, index)
      if (next === current) return
      if (!emit(next, "reorder", findFilterRule(next, id))) return
      announceReorder(next, id, fromParentId)
    },
    [emit, announceReorder, locked]
  )

  const copyNodeTo = React.useCallback(
    (id: string, parentId: string, index: number) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = copyFilterNodeTo(
        current,
        id,
        parentId,
        index,
        latest.current.nextId
      )
      if (next === current) return
      if (!emit(next, "duplicate", findFilterRule(current, id))) return
      // The count again: an Alt-drag of a GROUP adds an unknown number of rows.
      setAnnouncement(
        latest.current.labels.countAnnouncement(countFilterRules(next))
      )
    },
    [emit, locked, setAnnouncement]
  )

  const wrapNodeInGroup = React.useCallback(
    (id: string, combinator: FilterCombinator = "or") => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = wrapFilterNodeInGroup(
        current,
        id,
        latest.current.nextId(),
        combinator
      )
      if (next === current) return
      if (!emit(next, "add", findFilterRule(next, id))) return
      setAnnouncement(latest.current.labels.groupAnnouncement(true))
    },
    [emit, locked, setAnnouncement]
  )

  const unwrapGroup = React.useCallback(
    (groupId: string) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = unwrapFilterGroup(current, groupId)
      if (next === current) return
      // The conditions survive in place, so the count has not changed.
      if (!emit(next, "remove", null)) return
      setAnnouncement(latest.current.labels.groupAnnouncement(false))
    },
    [emit, locked, setAnnouncement]
  )

  // What a combinator change SOUNDS like: the pill's name changes with it, but
  // a name change on the FOCUSED element is not re-announced by NVDA or JAWS.
  // The group's own headline, not the bare word: it says what the query MEANS
  // now, which is the thing that changed.
  const announceCombinator = React.useCallback(
    (combinator: FilterCombinator) => {
      setAnnouncement(
        combinator === "and"
          ? latest.current.labels.groupAll
          : latest.current.labels.groupAny
      )
    },
    [setAnnouncement]
  )

  const setCombinatorAction = React.useCallback(
    (groupId: string, combinator: FilterCombinator) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = setFilterCombinator(current, groupId, combinator)
      if (next === current) return
      if (!emit(next, "combinator", null)) return
      announceCombinator(combinator)
    },
    [emit, locked, announceCombinator]
  )

  const toggleCombinatorAction = React.useCallback(
    (groupId: string) => {
      if (locked()) return
      const current = latest.current.queryRef.current
      const next = toggleFilterCombinator(current, groupId)
      if (next === current) return
      if (!emit(next, "combinator", null)) return
      // Read off the COMMITTED tree, so the sentence cannot disagree with it.
      const group = findFilterNode(next, groupId)?.node
      if (group && !isFilterRule(group)) announceCombinator(group.combinator)
    },
    [emit, locked, announceCombinator]
  )

  const clearQueryAction = React.useCallback(() => {
    if (locked()) return
    const current = latest.current.queryRef.current
    const next = clearFilterQuery(current)
    if (next === current) return
    if (!emit(next, "clear", null)) return
    setAnnouncement(latest.current.labels.countAnnouncement(0))
  }, [emit, locked, setAnnouncement])

  // The live region, opened to the chrome inside the bar. The setter itself is
  // not published: it is a channel anything could write anything to.
  const announce = React.useCallback(
    (message: string) => {
      if (!message) return
      setAnnouncement(message)
    },
    [setAnnouncement]
  )

  // A draft is a MUTATION in progress, so it locks with the rest, except
  // `close`: a panel open when the bar turned read only must still dismiss.
  const dispatchDraft = React.useCallback(
    (action: FilterDraftAction<V>) => {
      if (action.type !== "close" && locked()) return
      dispatchDraftRaw(action)
    },
    [locked]
  )

  const openCreate = React.useCallback(() => {
    if (locked()) return
    dispatchDraftRaw({ type: "openCreate" })
  }, [locked])

  const openAmend = React.useCallback(
    (id: string, step: FilterDraftStep) => {
      if (locked()) return
      const rule = findFilterRule(latest.current.queryRef.current, id)
      if (!rule) return
      dispatchDraftRaw({
        type: "openAmend",
        ruleId: id,
        step,
        path: rule.path,
        operator: rule.operator,
        value: rule.value,
      })
    },
    [locked]
  )

  const closeDraft = React.useCallback(
    () => dispatchDraftRaw({ type: "close" }),
    []
  )

  const getQuery = React.useCallback(() => latest.current.queryRef.current, [])
  const getDraft = React.useCallback(() => latest.current.draft, [])

  /* ------------------------- draft -> query commit ------------------------ */

  // The draft becomes a rule exactly once, when the reducer says it is ready.
  // Here rather than in each click handler, which is what lets the "arity none
  // skips the value step" branch live in the pure reducer.
  React.useEffect(() => {
    if (!draft || draft.status !== "ready") return
    if (!isFilterDraftCommittable(draft)) return

    if (draft.ruleId) {
      updateRule(draft.ruleId, {
        path: draft.path,
        operator: draft.operator ?? "",
        value: draft.value,
      })
    } else if (!locked()) {
      // Asked here too: this branch burns an id and points the focus store at
      // it, and a store naming a chip that never existed eats the tab stop.
      const id = nextId()
      addRule(
        createFilterRule<V>({
          id,
          path: draft.path,
          // Empty on purpose: the chip renders "Select condition" and opens.
          operator: "",
          value: undefined,
        })
      )
      focusStore.set({ id, segment: "operator", autoOpen: true })
    }
    dispatchDraftRaw({ type: "close" })
  }, [draft, addRule, updateRule, nextId, focusStore, locked])

  /* ---------------------------- dev diagnostics --------------------------- */

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    const issues = findFilterSchemaIssues(fields, (field) =>
      resolveFilterOperators(field, operatorCatalog)
    )
    if (issues.duplicatePaths.length) {
      warnFilterOnce(
        `dup:${issues.duplicatePaths.join(",")}`,
        `duplicate sibling field ids are ignored after the first: ${issues.duplicatePaths.join(", ")}`
      )
    }
    if (issues.emptyIds.length) {
      warnFilterOnce("empty-id", "every field needs a non-empty id")
    }
    if (issues.unknownDefaultOperators.length) {
      warnFilterOnce(
        `op:${issues.unknownDefaultOperators.join(",")}`,
        `defaultOperator names an operator the field does not offer: ${issues.unknownDefaultOperators.join(", ")}`
      )
    }
  }, [fields, operatorCatalog])

  /* ------------------------------- contexts ------------------------------- */

  const actions = React.useMemo<FilterActionsContextValue<V, O>>(
    () => ({
      index,
      labels,
      operatorCatalog,
      editors,
      size,
      disabled,
      readOnly,
      variant,
      menuClassName,
      fieldPickerClassName,
      convertToAdvanced: onConvertToAdvanced,
      pathCollapse,
      maxPathSegments,
      resolveOperators,
      // The same lookup the chrome uses, so a headless consumer can ask it too.
      resolveEditor: (field, operator) =>
        resolveFilterEditor(field, operator, editors) as
          | FilterEditor<V, O>
          | undefined,
      resolution: resolutionStore,
      addRule,
      addGroup,
      updateRule,
      removeNode,
      duplicateNode,
      negateRule,
      moveNode,
      moveNodeTo,
      copyNodeTo,
      wrapNodeInGroup,
      unwrapGroup,
      setCombinator: setCombinatorAction,
      toggleCombinator: toggleCombinatorAction,
      clearQuery: clearQueryAction,
      openCreate,
      openAmend,
      closeDraft,
      dispatchDraft,
      announce,
      getQuery,
      getDraft,
      nextId,
    }),
    // Every input is memoized and every action `[]`-stable, so this
    // republishes on a real schema or config change, never on a keystroke.
    [
      index,
      labels,
      operatorCatalog,
      editors,
      size,
      disabled,
      readOnly,
      variant,
      menuClassName,
      fieldPickerClassName,
      onConvertToAdvanced,
      pathCollapse,
      maxPathSegments,
      resolveOperators,
      resolutionStore,
      addRule,
      addGroup,
      updateRule,
      removeNode,
      duplicateNode,
      negateRule,
      moveNode,
      moveNodeTo,
      copyNodeTo,
      wrapNodeInGroup,
      unwrapGroup,
      setCombinatorAction,
      toggleCombinatorAction,
      clearQueryAction,
      openCreate,
      openAmend,
      closeDraft,
      dispatchDraft,
      announce,
      getQuery,
      getDraft,
      nextId,
    ]
  )

  const state = React.useMemo(
    () => ({
      query,
      draft,
      ruleCount,
      announcement,
      announcementSeq: announced.seq,
    }),
    [query, draft, ruleCount, announcement, announced.seq]
  )

  const renderContext = React.useMemo(
    () => ({ renderValue, renderChip, renderEmpty }),
    [renderValue, renderChip, renderEmpty]
  )

  return (
    <FilterActionsContext.Provider
      value={actions as unknown as FilterActionsContextValue}
    >
      <FilterStateContext.Provider value={state as never}>
        <FilterRenderContext.Provider value={renderContext as never}>
          <FilterRowStateProvider value={rowStateStore}>
            <FilterFocusContext.Provider value={focusStore}>
              {children ??
                (variant === "advanced" ? (
                  <FiltersAdvanced<V, O>
                    mode={advancedMode}
                    align={advancedAlign}
                    trigger={trigger}
                    reorderable={reorderable}
                    className={className}
                  />
                ) : (
                  <FiltersRow
                    trigger={trigger}
                    showClear={showClear}
                    className={className}
                  />
                ))}
            </FilterFocusContext.Provider>
          </FilterRowStateProvider>
        </FilterRenderContext.Provider>
      </FilterStateContext.Provider>
    </FilterActionsContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Row                                     */
/* -------------------------------------------------------------------------- */

export interface FiltersRowProps {
  trigger?: React.ReactNode
  showClear?: boolean
  className?: string
}

/**
 * The chip row: a toolbar with a roving tabindex, where the predecessor made
 * every segment of every chip its own tab stop. There is NO combinator here,
 * because a chip row can draw a word between two pills but not a parenthesis.
 */
export function FiltersRow({ trigger, showClear, className }: FiltersRowProps) {
  const actions = useFilterActions()
  const sizes = filterControlSizes(actions)
  const { query, ruleCount, announcement, announcementSeq } = useFilterState()
  const focusStore = useFilterFocusStore()
  const rootRef = React.useRef<HTMLDivElement>(null)
  // The keys consult this even though the actions already refuse: an ungated
  // Enter would ARM `autoOpen` for a popover that then refuses to open. Gated
  // per branch, never at the top of `onKeyDown`: the arrows, Home and End are
  // how a read-only bar is read.
  const locked = isFilterLocked(actions)

  // Flattened, not `query.rules.filter(isFilterRule)`: a query built in the
  // advanced builder would otherwise hide nested conditions that still filter.
  const rules = React.useMemo(() => flattenFilterRules(query), [query])

  const chips = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(
        '[data-slot="filter-chip"]'
      ) ?? []
    )

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-slot="filter-chip"]'
    )
    if (!target) return
    // A key pressed inside an open popover belongs to that popover.
    if (event.target !== target) return

    const all = chips()
    const current = all.indexOf(target)
    if (current === -1) return

    const rtl = getComputedStyle(target).direction === "rtl"
    const forward = rtl ? "ArrowLeft" : "ArrowRight"
    const backward = rtl ? "ArrowRight" : "ArrowLeft"

    const focusAt = (index: number) => {
      const next = all[Math.max(0, Math.min(index, all.length - 1))]
      if (!next) return
      event.preventDefault()
      next.focus()
    }

    const ruleId = target.dataset.ruleId
    if (!ruleId) return

    if (event.altKey && (event.key === forward || event.key === backward)) {
      if (locked) return
      event.preventDefault()
      actions.moveNode(ruleId, event.key === forward ? 1 : -1)
      return
    }
    if (event.key === forward) return focusAt(current + 1)
    if (event.key === backward) return focusAt(current - 1)
    if (event.key === "Home") return focusAt(0)
    if (event.key === "End") return focusAt(all.length - 1)

    if (event.key === "Backspace" || event.key === "Delete") {
      if (locked) return
      event.preventDefault()
      actions.removeNode(ruleId)
      // The neighbour taking this chip's place, so a run of deletes keeps focus.
      requestAnimationFrame(() => {
        const remaining = chips()
        remaining[Math.min(current, remaining.length - 1)]?.focus()
      })
      return
    }

    if (event.key === "Enter" || event.key === " ") {
      if (locked) return
      event.preventDefault()
      // Enter RESUMES the chip: the attribute segment is display only, so the
      // target is whichever step the flow has not reached, never nothing.
      const rule = findFilterRule(actions.getQuery(), ruleId)
      if (!rule) return
      const field = getFilterField(actions.index, rule.path)
      // No popover to open, so autoOpen would sit armed until another chip
      // spent it. The chip stays reachable and Delete still removes it.
      if (!field) return
      const operator = getFilterOperator(
        actions.resolveOperators(field),
        rule.operator
      )
      const segment =
        rule.operator && operatorTakesValue(operator) ? "value" : "operator"
      focusStore.set({ id: ruleId, segment, autoOpen: true })
    }
  }

  return (
    <div
      ref={rootRef}
      data-slot="filters"
      data-empty={rules.length === 0 || undefined}
      /* A presence hook, so a consumer can tint the whole read-only bar. */
      data-readonly={actions.readOnly || undefined}
      className={cn(
        /* `sizes.button` and not `actions.size`: the gap ladder and the control
           ladder must answer for the same rung, normalized in one place. */
        filtersBarVariants({ size: sizes.button }),
        /* An empty toolbar is still a flex child, so it took a gap with no
           width. The gap goes, not the toolbar, which owns the row's name. */
        rules.length === 0 && "gap-0",
        className
      )}
    >
      <div
        role="toolbar"
        aria-label={actions.labels.filtersLabel}
        aria-orientation="horizontal"
        /* `role=toolbar` disallows `aria-readonly`, and `aria-disabled` would
           deny arrowing; a description is legal here and spoken on entry. */
        {...(actions.readOnly
          ? { "aria-description": actions.labels.readOnly }
          : null)}
        className={cn(filtersBarVariants({ size: sizes.button }))}
        onKeyDown={onKeyDown}
      >
        {rules.map((rule, index) => (
          <FilterChip key={rule.id} rule={rule} index={index} />
        ))}
      </div>

      <FiltersBuilder trigger={trigger} />

      {showClear && ruleCount > 0 ? (
        // `ms-auto` and not `ml-auto`, so Clear stays on the trailing edge
        // under RTL, where the whole bar mirrors.
        <Button
          variant="outline"
          /* The same rung as the Add filter trigger beside it. */
          size={sizes.button}
          className="ms-auto"
          /* `disabled` for the hard flag, `aria-disabled` for the soft one, so
             a read-only Clear keeps its tab stop and can still be found. */
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={() => actions.clearQuery()}
        >
          {actions.labels.clear}
        </Button>
      ) : null}

      {/* Keyed on the sequence, so the same sentence twice is two
          announcements (see `announced` for the measurement). A replaced live
          element stops being watched. */}
      <div aria-live="polite" role="status" className="sr-only">
        <span key={announcementSeq}>{announcement}</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

// The full pure READ surface, so one import reaches everything a predicate, a
// saved view or a backend query needs. It stops at the query TREE and compiles
// nothing: `flattenFilterConditions` is the hand-off a server compiles from.
// No SQL emitter, because a server has to re-validate anything a browser sends
// and should compile from the tree rather than parse a client's string. SQL is
// one target of that hand-off beside Prisma, Drizzle, a REST query string and
// Elasticsearch.
export {
  // The panel does not DRAW the built-in reasons, so this is the only way to
  // surface "missing value", "empty group" and the rest.
  collectFilterIssues,
  copyFilterNodeTo,
  createFilterGroup,
  createFilterQuery,
  createFilterRule,
  countFilterRules,
  flattenFilterConditions,
  flattenFilterRules,
  isFilterQueryEmpty,
  isFilterRuleComplete,
  moveFilterNodeTo,
  pruneFilterQuery,
  unwrapFilterGroup,
  wrapFilterNodeInGroup,
} from "@/registry-reui/bases/base/reui/filters/filters-query"

// The two resolver signatures `collectFilterIssues` takes.
export type {
  FilterArityResolver,
  FilterValidateResolver,
} from "@/registry-reui/bases/base/reui/filters/filters-query"

export {
  // The read-only contract: the gate, and the props a mutating control wears.
  filterReadOnlyProps,
  isFilterLocked,
  useFilterActions,
  useFilterState,
  useFilterFocus,
  // What a custom chip needs to rebuild the roving scheme `renderChip` drops.
  useFilterChipAutoOpen,
  useFilterChipFocused,
  useFilterFocusEmpty,
  useFilterFocusStore,
  useFilterRender,
  useFilterSegmentFocus,
} from "@/registry-reui/bases/base/reui/filters/filters-context"

export {
  FilterChip,
  FilterOperatorPopover,
  FilterRuleMenuItems,
  FilterValuePopover,
  useFilterRuleDisplay,
} from "@/registry-reui/bases/base/reui/filters/filters-chip"
export {
  FiltersAdvanced,
  FiltersAdvancedPanel,
  FilterAdvancedRow,
} from "@/registry-reui/bases/base/reui/filters/filters-advanced"
export {
  FiltersBuilder,
  FilterFieldPicker,
} from "@/registry-reui/bases/base/reui/filters/filters-builder"
export { DEFAULT_FILTER_LABELS } from "@/registry-reui/bases/base/reui/filters/filters-i18n"
export {
  DEFAULT_FILTER_OPERATORS,
  DEFAULT_FILTER_OPERATOR_LABELS,
} from "@/registry-reui/bases/base/reui/filters/filters-operators"
export {
  DEFAULT_FILTER_EDITORS,
  useFilterOptions,
  useFilterValueResolution,
} from "@/registry-reui/bases/base/reui/filters/filters-editors"

export type * from "@/registry-reui/bases/base/reui/filters/filters-types"
