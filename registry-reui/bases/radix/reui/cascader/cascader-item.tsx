"use client"

import * as React from "react"
import {
  useCascaderActions,
  useCascaderRender,
  useCascaderState,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-context"
import {
  getCascaderCount,
  getCascaderMoreParent,
  getCascaderPath,
  isCascaderMoreNode,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-lib"
import type {
  CascaderLoadState,
  CascaderNode,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-types"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Base UI extends its synthetic events with a handler-veto escape hatch.
type VetoableEvent = { preventBaseUIHandler?: () => void }

/** A row press. The veto hook is optional: an `as="button"` row is outside Base
 *  UI's listbox and gets a plain React event. */
export type CascaderRowEvent = React.MouseEvent<HTMLElement> & VetoableEvent

// Each style's inline inset, as a variable: a row and its absolutely positioned
// check have to land on the same number, in LOGICAL properties. These eight
// numbers MIRROR the shared style sheets; keep them in step with
// `registry/styles/style-*.css`.
const ROW_INSET_CLASS =
  "style-vega:[--cascader-row-inset:8px] style-nova:[--cascader-row-inset:6px] style-maia:[--cascader-row-inset:12px] style-lyra:[--cascader-row-inset:8px] style-mira:[--cascader-row-inset:8px] style-luma:[--cascader-row-inset:12px] style-rhea:[--cascader-row-inset:8px] style-sera:[--cascader-row-inset:12px]"

// Both insets equal, for a row with no check. `!` because a consumer may not
// import the sheets into `layer(base)`, where the class would win on order.
const ROW_FLUSH_CLASS =
  "ps-[var(--cascader-row-inset,8px)]! pe-[var(--cascader-row-inset,8px)]!"

// The same start inset plus room for the check. A flat `pr-8` is wrong in five
// of the eight styles: 4px of slack in nova, 8px short in maia, luma and sera,
// and no gutter at all in mira, whose check then overlaps its own label.
const ROW_GUTTER_CLASS =
  "ps-[var(--cascader-row-inset,8px)]! pe-[calc(var(--cascader-row-inset,8px)*2_+_16px)]!"

// The check's box, inset to match the row's. A physical `right-2` neither
// mirrors under RTL nor tracks the style's inset; `right-auto` comes with the
// logical `end-*`, because width + `left` + `right` is over-constrained.
const INDICATOR_CLASS =
  "pointer-events-none absolute flex items-center justify-center style-vega:size-4 style-nova:size-4 style-maia:size-4 style-lyra:size-4 style-mira:size-3.5 style-luma:size-4 style-rhea:size-4 style-sera:size-4 end-[var(--cascader-row-inset,8px)]! rtl:right-auto!"

// The row's type, gap, radius and icon size per style. No horizontal padding:
// every row pairs this with `ROW_FLUSH_CLASS` or `ROW_GUTTER_CLASS`.
const ROW_THEME_CLASS =
  "data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground style-vega:rounded-sm style-vega:py-1.5 style-vega:[&_svg:not([class*='size-'])]:size-4 style-nova:[&_svg:not([class*='size-'])]:size-4 style-nova:rounded-md style-nova:py-1 style-maia:[&_svg:not([class*='size-'])]:size-4 style-maia:rounded-xl style-maia:py-2 style-lyra:[&_svg:not([class*='size-'])]:size-4 style-lyra:py-2 style-lyra:rounded-none style-mira:rounded-md style-mira:py-1 style-mira:min-h-7 style-mira:[&_svg:not([class*='size-'])]:size-3.5 style-luma:[&_svg:not([class*='size-'])]:size-4 style-luma:py-2 style-luma:rounded-2xl style-luma:font-medium style-rhea:py-1.5 style-rhea:[&_svg:not([class*='size-'])]:size-4 style-rhea:rounded-xl style-rhea:min-h-7 style-sera:py-2 style-sera:rounded-none style-sera:[&_svg:not([class*='size-'])]:size-3.5"

/**
 * The row's gap and type, per style, held apart from the rest of the theme.
 *
 * A row that pins its own gap or text size takes `ROW_SHELL_CLASS` and leaves
 * these out, because a `style-<name>:` utility is emitted AFTER the plain one
 * it would have to lose to. Not receiving the token beats overriding it with
 * `!`, which a consumer then has to fight in turn.
 */
const ROW_GAP_CLASS =
  "style-vega:gap-2 style-nova:gap-2 style-maia:gap-2.5 style-lyra:gap-2 style-mira:gap-2 style-luma:gap-2.5 style-rhea:gap-2 style-sera:gap-2.5"

const ROW_TEXT_CLASS =
  "style-vega:text-sm style-nova:text-sm style-maia:text-sm style-lyra:text-xs style-mira:text-xs/relaxed style-luma:text-sm style-rhea:text-sm style-sera:text-sm"

const ROW_SHELL_CLASS = `${ROW_THEME_CLASS} relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${ROW_INSET_CLASS}`

const ROW_CLASS = `${ROW_SHELL_CLASS} ${ROW_GAP_CLASS} ${ROW_TEXT_CLASS}`

const CASCADER_ACTION_INSET_CLASS = `${ROW_INSET_CLASS} ${ROW_FLUSH_CLASS}`

/** A footer COMMAND: the row theme, so it cannot drift from the list, plus the
 *  hover and `focus-visible` fills a plain button never gets. Fills, never a
 *  ring: a ring under rows that all paint with a fill read as a different
 *  widget bolted on. `focus-visible`, not `focus`, so a pointer press does not
 *  leave a command painted as if it were still hovered. Disabled keys off
 *  `aria-disabled`, not `:disabled`, to keep it FOCUSABLE: a footer whose only
 *  row is disabled has no tab stop. */
export const CASCADER_ACTION_CLASS = `${ROW_SHELL_CLASS} ${ROW_TEXT_CLASS} ${ROW_FLUSH_CLASS} hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground cursor-pointer gap-2 transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50`

// The box around the affordances that are not the row. 20px around a 16px icon,
// the outer 2px cancelled at the call site; 24px would set the row height.
const AFFORDANCE_BOX_CLASS =
  "flex size-5 shrink-0 items-center justify-center rounded-sm"

// What makes an affordance read as pressable on an already highlighted row. Not
// `hover:bg-accent`: the row is `bg-accent` under the pointer, so the chip would
// be invisible. `!` and `**:` for the `CHECKBOX_MARK_CLASS` reason.
const AFFORDANCE_HOVER_CLASS =
  "transition-[background-color,box-shadow,color] hover:bg-background hover:text-foreground! hover:**:text-foreground! hover:shadow-xs"

// The selection MARK's colour, pinned so nothing can repaint it: every row
// carries a DESCENDANT highlight rule, and a mark is STATE. Pinned TWICE
// because icon sets draw with `fill`/`stroke="currentColor"`, which the
// `<path>` inherits and resolves against the PATH's own `color`. Both halves
// are asserted in `cascader-behavior.test.tsx`.
const CHECKBOX_MARK_CLASS =
  "text-primary-foreground! **:text-primary-foreground!"
const INDICATOR_MARK_CLASS = "text-foreground! **:text-foreground!"

// Milliseconds the pointer must rest on a branch row before
// `expandTrigger="hover"` drills in: long enough that a pointer crossing the
// column on its way elsewhere opens nothing, short enough to read as immediate.
const CASCADER_HOVER_EXPAND_DELAY = 150

export interface CascaderItemProps extends Omit<
  ComboboxPrimitive.Item.Props,
  "value" | "children" | "className" | "style" | "onClick" | "onMouseUp"
> {
  /** No state callback: the row merges `className` and `style` itself. */
  className?: string
  style?: React.CSSProperties
  onClick?: (event: CascaderRowEvent) => void
  onMouseUp?: (event: CascaderRowEvent) => void
  node: CascaderNode
  /** Explicit render index. Required while virtualized and DELIBERATELY IGNORED
   *  otherwise: it self-registers the row and breaks `aria-activedescendant`. */
  index?: number
  /** Indentation depth. Drives `--cascader-indent` in tree mode. */
  depth?: number
  /** Renders the ancestor chain under the label, for deep-search results. */
  showPath?: boolean
  /** `option` renders a real `Combobox.Item`; `button` renders identical markup
   *  outside the listbox, for the ancestor columns in columns mode. */
  as?: "option" | "button"
  /** Tree mode: this row is an expanded branch. */
  expanded?: boolean
  /** Indent each depth by this many pixels. Tree mode only. */
  indent?: number
  /** Whether the node has children. Defaults to the cascader's own answer, as do
   *  the three below: callers pass them because they already hold the level,
   *  which keeps a memoised row off the volatile context. */
  branch?: boolean
  /** Whether the node may be committed. Defaults to the cascader's own answer. */
  selectable?: boolean
  /** Whether the node is currently selected. Defaults to the cascader's answer. */
  selected?: boolean
  /** Some but not all of the loaded subtree selected. `cascade` only. */
  indeterminate?: boolean
  /** Selected nodes below this one, at any depth. Drives the trailing count. */
  selectedCount?: number
  /** Paging row only: a request for this level is in flight. */
  loading?: boolean
  /** Paging row only: this level's last request failed. */
  error?: boolean
  /** Branch row only: this node's OWN children are being fetched. The chevron
   *  (or, in tree mode, the expander) becomes a spinner IN PLACE, in the same
   *  16px box: no skeleton row appears below, nothing reflows. */
  childrenLoading?: boolean
  /** Branch row only: the last fetch of this node's children failed. The same
   *  box becomes the retry. The press path is unchanged: it goes through
   *  `navigate`, which refires the failed level rather than moving. */
  childrenError?: boolean
  children?: React.ReactNode
}

/** One row. Branch presses navigate instead of selecting, vetoed here with
 *  `preventBaseUIHandler()` on `onClick` (Enter too) and on `onMouseUp`. */
const CascaderItem = React.memo(function CascaderItem({
  node,
  index,
  depth,
  showPath = false,
  as = "option",
  expanded,
  indent = 16,
  branch: branchProp,
  selectable: selectableProp,
  selected: selectedProp,
  indeterminate: indeterminateProp,
  selectedCount: selectedCountProp,
  loading,
  error,
  childrenLoading = false,
  childrenError = false,
  className,
  children,
  onClick,
  onMouseUp,
  style,
  ...props
}: CascaderItemProps) {
  // The ACTIONS context only: the state context republishes on every keystroke.
  const {
    index: treeIndex,
    mode,
    labels,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate,
    selectedDescendantCount,
    multiple,
    branchesSelectable,
    indicator: indicatorEnabled,
    expandTrigger = "click",
    navigate,
    navigateAt,
    toggleExpanded,
    commit,
    virtualized,
    loadMore,
    retryLevel,
  } = useCascaderActions()
  // Render props come from an always-current context, or a closure goes stale.
  const { renderItem, renderLabel } = useCascaderRender()

  const branch = branchProp ?? isBranch(node)
  const selectable = selectableProp ?? isSelectable(node)
  const selected = selectedProp ?? isSelected(node)
  // A selected node is never also partially selected (a dash in a filled box).
  const indeterminate =
    !selected && (indeterminateProp ?? isIndeterminate(node))
  const count = branch ? getCascaderCount(treeIndex, node) : 0
  const nodeDepth = depth ?? treeIndex.depthOf.get(node.value) ?? 0

  // O(1): the cascader publishes a map of selected-descendant counts, because a
  // row walking its own subtree is `rows x descendants`, paid every keystroke.
  const selectedDescendants = branch
    ? (selectedCountProp ?? selectedDescendantCount(node))
    : 0
  // `multiple` only: with a single selection the trigger, the breadcrumb and
  // the leaf's own check already say where it is, so swapping a branch's real
  // child total ("24") for a permanent "1" would trade a useful number away.
  const showsSelectedCount = multiple && selectedDescendants > 0
  const trailingCount = showsSelectedCount ? selectedDescendants : count
  // Shown selected or not: suppressing it under a checked branch read as data
  // loss, and the row's TWO trailing columns mean the count never has to share
  // a slot with the check.
  const showCount = trailingCount > 0

  // Where a multi-select tree puts its checkbox: at the HEAD of the row, since a
  // trailing box does not follow the label stagger. Per-LIST, never per-row, or
  // the labels below an unselectable row step back out.
  const leadingCheckbox = mode === "tree" && multiple

  // Whether this row draws a MARK, and so whether it reserves the gutter one
  // needs. `|| multiple` is the scope of the opt-out: a checkbox is the
  // selection CONTROL, so `indicator={false}` is a no-op in multi-select.
  const showsIndicator = indicatorEnabled || multiple

  const veto = React.useCallback((event: VetoableEvent) => {
    event.preventBaseUIHandler?.()
  }, [])

  const handleClick = React.useCallback(
    (event: CascaderRowEvent) => {
      onClick?.(event)
      if (node.disabled) return
      if (branch && !selectable) {
        veto(event)
        navigate(node)
      }
    },
    [onClick, node, branch, selectable, veto, navigate]
  )

  const handleMouseUp = React.useCallback(
    (event: CascaderRowEvent) => {
      onMouseUp?.(event)
      if (node.disabled) return
      if (branch && !selectable) veto(event)
    },
    [onMouseUp, node, branch, selectable, veto]
  )

  // The tree expander's own press. With `selectable="any"` the row press
  // commits, and under `cascade` that selected a whole subtree while the row
  // stayed collapsed, so expanding needs its own target. `stopPropagation`
  // before the veto, so Base UI's handler never runs, and no role: nesting
  // one in `role="option"` fails axe. `navigate` fetches BEFORE it opens.
  const handleExpanderClick = React.useCallback(
    (event: CascaderRowEvent) => {
      event.stopPropagation()
      veto(event)
      if (node.disabled) return
      if (expanded) toggleExpanded(node.value)
      else navigate(node)
    },
    [veto, node, expanded, toggleExpanded, navigate]
  )

  const handleExpanderMouseUp = React.useCallback(
    (event: CascaderRowEvent) => {
      // Base UI treats a drag-select mouseup as a commit; this is not one.
      event.stopPropagation()
      veto(event)
    },
    [veto]
  )

  const handleChevronClick = React.useCallback(
    (event: CascaderRowEvent) => {
      event.stopPropagation()
      veto(event)
      if (node.disabled) return
      // `navigate` falls through to `pushLevel`, which APPENDS: right in the
      // deepest column, but from an ancestor column it duplicated the level and
      // corrupted the path. `navigateAt` rebuilds the trail from this depth.
      if (as === "button") navigateAt(node, depth ?? 0)
      else navigate(node)
    },
    [veto, node, as, navigateAt, depth, navigate]
  )

  const handleChevronMouseUp = React.useCallback(
    (event: CascaderRowEvent) => veto(event),
    [veto]
  )

  // Keeps focus in the search field: Base UI prevents the mousedown default for
  // option rows, and focusing a `tabindex="-1"` trail row kills every key.
  const handleButtonMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
    },
    []
  )

  const handleButtonClick = React.useCallback(
    (event: CascaderRowEvent) => {
      onClick?.(event)
      if (node.disabled) return
      if (branch && !selectable) {
        // Button rows only exist in the columns trail, where `depth` is the
        // column's own depth, so navigating replaces the trail from here.
        navigateAt(node, depth ?? 0)
        return
      }
      if (selectable) commit(node)
    },
    [onClick, node, branch, selectable, navigateAt, depth, commit]
  )

  // The paging row's press, never a selection, whatever `selectable` says.
  const handleMoreClick = React.useCallback(
    (event: CascaderRowEvent) => {
      onClick?.(event)
      veto(event)
      const parent = getCascaderMoreParent(node)
      if (parent == null) return
      if (error) retryLevel(parent)
      else if (!loading) loadMore(parent)
    },
    [onClick, veto, node, error, loading, retryLevel, loadMore]
  )

  // `expandTrigger="hover"`: resting on a BRANCH row in the ACTIVE column drills
  // in after a delay. The deepest column of columns mode only, and it never
  // commits, so a pointer crossing the panel cannot change the value.
  const hoverNavigates =
    expandTrigger === "hover" &&
    mode === "columns" &&
    as === "option" &&
    branch &&
    !node.disabled
  const hoverTimerRef = React.useRef<number | null>(null)

  const cancelHoverNavigate = React.useCallback(() => {
    if (hoverTimerRef.current == null) return
    window.clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = null
  }, [])

  const handleHoverPointerEnter = React.useCallback(() => {
    cancelHoverNavigate()
    hoverTimerRef.current = window.setTimeout(() => {
      hoverTimerRef.current = null
      navigate(node)
    }, CASCADER_HOVER_EXPAND_DELAY)
  }, [cancelHoverNavigate, navigate, node])

  // Drilling in demotes this column to the trail WITHOUT unmounting the row, so
  // a pending timer has to die or it fires `navigate` from an inactive column.
  React.useEffect(() => {
    if (!hoverNavigates) cancelHoverNavigate()
  }, [hoverNavigates, cancelHoverNavigate])
  React.useEffect(() => cancelHoverNavigate, [cancelHoverNavigate])

  /* ------------------------------- paging row ------------------------------ */

  if (isCascaderMoreNode(node)) {
    const text = error
      ? labels.error
      : loading
        ? node.count
          ? labels.loadingMore
          : labels.loading
        : labels.loadMore

    const moreStyle =
      mode === "tree" && nodeDepth > 0
        ? ({
            ...style,
            "--cascader-indent": `${nodeDepth * indent}px`,
          } as React.CSSProperties)
        : style

    const moreShared = {
      "data-slot": "cascader-item",
      "data-more": "",
      "data-state": error ? "error" : loading ? "loading" : "idle",
      "data-depth": nodeDepth,
      style: moreStyle,
      className: cn(
        ROW_SHELL_CLASS,
        ROW_FLUSH_CLASS,
        "text-muted-foreground justify-center gap-1.5 text-xs",
        !error && !loading && "hover:text-foreground",
        mode === "tree" &&
          "ps-[calc(var(--cascader-row-inset,8px)_+_var(--cascader-indent,0px))]!",
        className
      ),
    }

    const moreBody = children ?? (
      <>
        {loading ? (
          <IconPlaceholder
            lucide="LoaderCircleIcon"
            tabler="IconLoader2"
            hugeicons="Loading02Icon"
            phosphor="CircleNotchIcon"
            remixicon="RiLoader4Line"
            className="size-3.5 animate-spin"
            aria-hidden
          />
        ) : null}
        <span>{text}</span>
        {/* TEXT, not a button: a focusable element inside a `role="option"`
            row is a `nested-interactive` violation. */}
        {error ? (
          <span className="text-foreground font-medium">{labels.retry}</span>
        ) : null}
      </>
    )

    if (as === "button") {
      const buttonProps = { ...(props as React.ComponentProps<"button">) }
      delete buttonProps["aria-setsize"]
      delete buttonProps["aria-posinset"]
      delete buttonProps["aria-level"]

      return (
        <button
          type="button"
          {...moreShared}
          tabIndex={-1}
          onClick={handleMoreClick}
          {...buttonProps}
        >
          {moreBody}
        </button>
      )
    }

    return (
      <ComboboxPrimitive.Item
        {...moreShared}
        value={node}
        {...(virtualized && index != null ? { index } : null)}
        {...(mode === "tree"
          ? { role: "treeitem" as const, "aria-level": nodeDepth + 1 }
          : null)}
        onClick={handleMoreClick}
        onMouseUp={veto}
        {...props}
      >
        {moreBody}
      </ComboboxPrimitive.Item>
    )
  }

  const itemState = {
    branch,
    selected,
    disabled: !!node.disabled,
    depth: nodeDepth,
    count,
    path: showPath ? getCascaderPath(treeIndex, node.value).slice(0, -1) : [],
  }

  const custom = renderItem?.(node, itemState)
  const customLabel = renderLabel?.(node, itemState)

  // What the markup cannot say: a branch would announce "Person 24", a naked
  // number. Trail rows are outside the listbox, so they need words for state.
  const srDetails = [
    branch ? labels.itemCount(count) : null,
    showsSelectedCount ? labels.selectedCount(selectedDescendants) : null,
    branch && mode !== "tree" ? labels.branchAffordance : null,
    as === "button" && selected ? labels.selectedState : null,
    // Option rows say this with `aria-checked="mixed"`; `role="button"` allows
    // neither that nor `aria-selected`, so a trail row says it in words.
    as === "button" && indeterminate ? labels.partiallySelectedState : null,
  ]
    .filter(Boolean)
    .map((detail) => `, ${detail}`)
    .join("")

  // Extracted because tree mode renders it INLINE at the head of the row. It
  // reads `data-selected` off the ROW, so it also works on the trail rows.
  const checkbox = (
    <span
      data-slot="cascader-item-checkbox"
      className="border-input in-data-[selected]:bg-primary in-data-[selected]:border-primary in-data-[selected]:text-primary-foreground in-data-[indeterminate]:bg-primary in-data-[indeterminate]:border-primary in-data-[indeterminate]:text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors"
    >
      {/* Colour declared ON THE ICON with `!`; see `CHECKBOX_MARK_CLASS`. */}
      {indeterminate ? (
        <IconPlaceholder
          lucide="MinusIcon"
          tabler="IconMinus"
          hugeicons="MinusSignIcon"
          phosphor="MinusIcon"
          remixicon="RiSubtractLine"
          data-slot="cascader-item-dash"
          className={cn(CHECKBOX_MARK_CLASS, "size-3")}
        />
      ) : (
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          data-slot="cascader-item-tick"
          className={cn(
            CHECKBOX_MARK_CLASS,
            "size-3 opacity-0 in-data-[selected]:opacity-100"
          )}
        />
      )}
    </span>
  )

  const indicator = (
    <>
      {multiple ? (
        checkbox
      ) : (
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          data-slot="cascader-item-check"
          className={cn("pointer-events-none", INDICATOR_MARK_CLASS)}
        />
      )}
    </>
  )

  const body = custom ?? children ?? (
    <>
      {/* Tree mode expands in place, so the branch marker leads the row. */}
      {mode === "tree" && branch ? (
        <span
          data-slot="cascader-item-expander"
          /* Pure affordance: the row itself carries `aria-expanded`. */
          aria-hidden="true"
          data-state={
            childrenError ? "error" : childrenLoading ? "loading" : "idle"
          }
          onClick={handleExpanderClick}
          onMouseUp={handleExpanderMouseUp}
          className={cn(
            "-ms-0.5",
            childrenError ? "text-destructive" : "text-muted-foreground",
            AFFORDANCE_BOX_CLASS,
            AFFORDANCE_HOVER_CLASS,
            childrenLoading && "pointer-events-none"
          )}
        >
          {childrenLoading ? (
            <Spinner aria-hidden="true" className="size-4" />
          ) : childrenError ? (
            <IconPlaceholder
              lucide="RotateCwIcon"
              tabler="IconRefresh"
              hugeicons="RefreshIcon"
              phosphor="ArrowClockwiseIcon"
              remixicon="RiRefreshLine"
              className="size-4"
            />
          ) : (
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className={cn(
                "size-4 transition-transform",
                /* Collapsed it points INTO the level, so it mirrors; expanded
                   it points DOWN, the same in both writing modes, so the mirror
                   has to come off or `scaleX(-1)` composed with `rotate(90deg)`
                   lands it pointing up. `rtl:rotate-90` beside `rotate-90` was
                   a no-op that only looked like it handled this. */
                expanded ? "rotate-90" : "rtl:-scale-x-100"
              )}
            />
          )}
        </span>
      ) : mode === "tree" ? (
        // A LEAF's expander slot, reserved and empty: without it a leaf's label
        // started 28px off its sibling branches' and read as one level up.
        <span
          data-slot="cascader-item-expander-spacer"
          aria-hidden="true"
          className={cn("-ms-0.5", AFFORDANCE_BOX_CLASS)}
        />
      ) : null}

      {/* Tree + multi-select: the box leads the row, and an unselectable row
          still reserves its width. */}
      {leadingCheckbox ? (
        selectable ? (
          checkbox
        ) : (
          <span
            data-slot="cascader-item-checkbox-spacer"
            aria-hidden="true"
            className="size-4 shrink-0"
          />
        )
      ) : null}

      {node.icon ? (
        <span
          data-slot="cascader-item-icon"
          className="text-muted-foreground flex shrink-0 items-center justify-center"
        >
          {node.icon}
        </span>
      ) : null}

      {/* The row box is sized for pieces side by side; this one stacks, so it
          restates the gap: 8px reads as a paragraph break, not a subtitle. */}
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        {customLabel ?? (
          <>
            <span className="w-full truncate text-start">{node.label}</span>
            {node.description ? (
              <span
                data-slot="cascader-item-description"
                className="text-muted-foreground w-full truncate text-start text-xs"
              >
                {node.description}
              </span>
            ) : null}
          </>
        )}
        {showPath ? <CascaderItemPath node={node} /> : null}
      </span>

      {/* The count is a bare number, and nothing else says a branch opens. */}
      {srDetails ? (
        <span data-slot="cascader-item-details" className="sr-only">
          {srDetails}
        </span>
      ) : null}

      {/* Tree mode expands in place, so it has no drill-in chevron. */}
      {branch && mode !== "tree" ? (
        <span
          data-slot="cascader-item-trailing"
          aria-hidden="true"
          className="text-muted-foreground ms-auto flex shrink-0 items-center gap-1 text-xs tabular-nums"
        >
          {showCount ? (
            <span
              data-slot="cascader-item-count"
              /* The marker a consumer (and a test) reads to tell the two
                 numbers apart without matching on a colour class. */
              {...(showsSelectedCount ? { "data-selected-count": "" } : null)}
              className={cn(showsSelectedCount && "text-primary!")}
            >
              {trailingCount}
            </span>
          ) : null}
          {/* ONLY the chevron is the drill target: sharing a hit area with
              the count made a number pressable. */}
          <span
            data-slot="cascader-item-chevron"
            data-state={
              childrenError ? "error" : childrenLoading ? "loading" : "idle"
            }
            onClick={selectable ? handleChevronClick : undefined}
            onMouseUp={selectable ? handleChevronMouseUp : undefined}
            onMouseDown={as === "button" ? handleButtonMouseDown : undefined}
            className={cn(
              /* Cancels the box's outer slack, so the icon keeps its column. */
              "-me-0.5",
              AFFORDANCE_BOX_CLASS,
              selectable && AFFORDANCE_HOVER_CLASS,
              childrenError && "text-destructive",
              childrenLoading && "pointer-events-none"
            )}
          >
            {childrenLoading ? (
              <Spinner aria-hidden="true" className="size-4" />
            ) : childrenError ? (
              <IconPlaceholder
                lucide="RotateCwIcon"
                tabler="IconRefresh"
                hugeicons="RefreshIcon"
                phosphor="ArrowClockwiseIcon"
                remixicon="RiRefreshLine"
                className="size-4"
              />
            ) : (
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4 rtl:-scale-x-100"
              />
            )}
          </span>
        </span>
      ) : null}

      {branch && mode === "tree" && showCount ? (
        <span
          data-slot="cascader-item-count"
          {...(showsSelectedCount ? { "data-selected-count": "" } : null)}
          /* The count is spoken by the sr-only details span instead. */
          aria-hidden="true"
          className={cn(
            "text-muted-foreground ms-auto shrink-0 text-xs tabular-nums",
            showsSelectedCount && "text-primary!"
          )}
        >
          {trailingCount}
        </span>
      ) : null}

      {/* No trailing indicator when a tree's box led the row, or when
          `indicator={false}` opted out. See `showsIndicator`. */}
      {selectable && !leadingCheckbox && showsIndicator ? (
        as === "button" ? (
          // No ItemIndicator outside Base UI: `data-selected` drives it.
          (multiple || selected) && (
            <span
              data-slot="cascader-item-indicator"
              className={INDICATOR_CLASS}
            >
              {indicator}
            </span>
          )
        ) : (
          <ComboboxPrimitive.ItemIndicator
            /* Kept mounted for a partial selection too: the row is not
               selected, so Base UI would unmount the box the dash lives in. */
            keepMounted={multiple || indeterminate}
            render={
              <span
                data-slot="cascader-item-indicator"
                className={INDICATOR_CLASS}
              />
            }
          >
            {indicator}
          </ComboboxPrimitive.ItemIndicator>
        )
      ) : null}
    </>
  )

  const rowStyle =
    mode === "tree" && nodeDepth > 0
      ? ({
          ...style,
          "--cascader-indent": `${nodeDepth * indent}px`,
        } as React.CSSProperties)
      : style

  const shared = {
    "data-slot": "cascader-item",
    "data-branch": branch || undefined,
    "data-selected": selected || undefined,
    "data-indeterminate": indeterminate || undefined,
    "data-depth": nodeDepth,
    "data-expanded": expanded || undefined,
    // No `aria-level`: `role="option"` allows only `aria-selected`,
    // `aria-checked`, `aria-posinset` and `aria-setsize`, and a `role="button"`
    // trail row allows none of the four. Only tree mode has a role that takes a
    // level, and it adds one below.
    style: rowStyle,
    className: cn(
      ROW_CLASS,
      /* Three separate reasons to hand the check gutter back. A multi-select
         tree's box leads the row, so the gutter would be 24px of dead space;
         `indicator={false}` drops the check, and keeping the gutter would park
         the count and the chevron one gutter in from an edge nothing sits on;
         and for branches the question is per-LIST, not per-row, because the old
         `branch && !selectable` put neighbouring chevrons on 24px and 6px in
         nova. One `pe-*` is emitted either way, so nothing here depends on
         class-merge order. */
      leadingCheckbox || !showsIndicator || (branch && !branchesSelectable)
        ? ROW_FLUSH_CLASS
        : ROW_GUTTER_CLASS,
      /* ADDED to the style's own inset, never substituted: replacing it put
         depth 0 at 12px and depth 1 at 16px in maia, luma and sera, a 4px step.
         `_+_` because Tailwind's parser splits on whitespace. */
      mode === "tree" &&
        "ps-[calc(var(--cascader-row-inset,8px)_+_var(--cascader-indent,0px))]!",
      className
    ),
  }

  if (as === "button") {
    const buttonProps = { ...(props as React.ComponentProps<"button">) }
    // `role="button"` allows none of these, so they are dropped, not passed.
    delete buttonProps["aria-setsize"]
    delete buttonProps["aria-posinset"]
    delete buttonProps["aria-level"]

    return (
      <button
        type="button"
        {...shared}
        /* Focus stays in the search input; the trail uses ArrowLeft. */
        tabIndex={-1}
        disabled={node.disabled}
        aria-disabled={node.disabled || undefined}
        onClick={handleButtonClick}
        onMouseDown={handleButtonMouseDown}
        {...buttonProps}
      >
        {body}
      </button>
    )
  }

  return (
    <ComboboxPrimitive.Item
      {...shared}
      value={node}
      /* THE one gate for the explicit index: supply one outside virtualized mode
         and the first arrow key leaves `aria-activedescendant` pointing at
         nothing. */
      {...(virtualized && index != null ? { index } : null)}
      disabled={node.disabled}
      /* Conditional spread, never `role={... : undefined}`: `mergeProps`
         iterates own keys, so `undefined` would delete `role="option"`. */
      {...(mode === "tree"
        ? {
            role: "treeitem" as const,
            "aria-level": nodeDepth + 1,
            ...(branch ? { "aria-expanded": !!expanded } : null),
          }
        : branch
          ? { "aria-haspopup": "listbox" as const }
          : null)}
      /* Only ever `mixed`: a selected row already says so with `aria-selected`,
         and two selection attributes on one row is noise. */
      {...(indeterminate ? { "aria-checked": "mixed" as const } : null)}
      {...(hoverNavigates
        ? {
            onPointerEnter: handleHoverPointerEnter,
            onPointerLeave: cancelHoverNavigate,
          }
        : null)}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {body}
    </ComboboxPrimitive.Item>
  )
})

/** Ancestor chain under a deep-search result: "Name" alone is ambiguous. */
function CascaderItemPath({ node }: { node: CascaderNode }) {
  const { index, labels } = useCascaderActions()
  const ancestors = getCascaderPath(index, node.value).slice(0, -1)
  if (!ancestors.length) return null

  return (
    <span
      data-slot="cascader-item-path"
      className="text-muted-foreground flex w-full items-center gap-0.5 truncate text-start text-xs"
    >
      {ancestors.map((ancestor, i) => (
        <React.Fragment key={ancestor.value}>
          {i > 0 ? (
            <span aria-hidden="true">{labels.pathSeparator}</span>
          ) : null}
          <span className="truncate">{ancestor.label}</span>
        </React.Fragment>
      ))}
    </span>
  )
}

/** Every load-derived prop a row needs. A PAGING row reports the level it
 *  belongs to, a BRANCH row the level it OWNS; mutually exclusive, so one call
 *  answers both. Exported because a memoised row cannot read them itself. */
export function getCascaderMoreProps(
  node: CascaderNode,
  loadStates: ReadonlyMap<string, CascaderLoadState>
): {
  loading: boolean
  error: boolean
  childrenLoading: boolean
  childrenError: boolean
} {
  const parent = getCascaderMoreParent(node)
  if (parent == null) {
    const own = loadStates.get(node.value)
    return {
      loading: false,
      error: false,
      childrenLoading: !!own?.loading,
      childrenError: !!own?.error,
    }
  }
  const state = loadStates.get(parent)
  return {
    loading: !!state?.loading,
    error: !!state?.error,
    childrenLoading: false,
    childrenError: false,
  }
}

export interface CascaderItemsProps {
  /** Replaces the default row for every item. */
  children?: (node: CascaderNode, index: number) => React.ReactNode
}

/** Whatever the active view is: the current level, the deepest column, or the
 *  flattened tree rows. Lives here so `cascader.tsx` never imports a row
 *  component, which would cycle with the context. `index` is deliberately not
 *  passed; see `CascaderItemProps`. */
function CascaderItems({ children }: CascaderItemsProps) {
  const { mode, isBranch, isSelectable, isSelected, isIndeterminate } =
    useCascaderActions()
  const { renderedItems, deepResults, treeRows, loadStates } =
    useCascaderState()
  const showPath = deepResults !== null

  // Answered once here, as plain booleans, so `React.memo` can skip a row.
  if (mode === "tree") {
    return (
      <>
        {treeRows.map((row, i) =>
          children ? (
            <React.Fragment key={row.node.value}>
              {children(row.node, i)}
            </React.Fragment>
          ) : (
            <CascaderItem
              key={row.node.value}
              node={row.node}
              depth={row.depth}
              expanded={row.expanded}
              branch={row.branch}
              selectable={isSelectable(row.node)}
              selected={isSelected(row.node)}
              indeterminate={isIndeterminate(row.node)}
              {...getCascaderMoreProps(row.node, loadStates)}
              aria-setsize={row.setSize}
              aria-posinset={row.posInSet}
            />
          )
        )}
      </>
    )
  }

  return (
    <>
      {renderedItems.map((node, i) =>
        children ? (
          <React.Fragment key={node.value}>{children(node, i)}</React.Fragment>
        ) : (
          <CascaderItem
            key={node.value}
            node={node}
            showPath={showPath}
            branch={isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            aria-setsize={renderedItems.length}
            aria-posinset={i + 1}
          />
        )
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                          Group / Label / Separator                         */
/* -------------------------------------------------------------------------- */

// Whether a `CascaderLabel` has a group to name: Base UI's `Combobox.GroupLabel`
// THROWS when there is none, and a heading is useful outside a group.
const CascaderGroupContext = React.createContext(false)

// A heading over a run of rows. All eight styles are spelled out because the
// type is not uniform (sera is uppercase), and the inset is the row's own.
const CASCADER_LABEL_CLASS = `text-muted-foreground text-xs style-vega:py-1.5 style-nova:py-1.5 style-maia:py-2.5 style-lyra:py-2 style-mira:py-1.5 style-luma:py-2.5 style-rhea:py-1.5 style-sera:py-2 style-sera:uppercase style-sera:tracking-wider style-sera:font-semibold ${CASCADER_ACTION_INSET_CLASS} block truncate`

// A rule between two runs. The inline margin is not the combobox separator's:
// that cancels the container's padding with a per-style number, wrong in a
// footer and 4px too much in lyra. `--cascader-list-pad` reaches the edge.
const CASCADER_SEPARATOR_CLASS =
  "h-px style-vega:bg-border style-vega:my-1 style-nova:bg-border style-nova:my-1 style-maia:my-1 style-maia:bg-border/50 style-lyra:bg-border style-mira:my-1 style-mira:bg-border/50 style-luma:bg-border style-luma:my-1.5 style-rhea:bg-border style-rhea:my-1 style-sera:bg-border/50 style-sera:my-1.5 mx-[calc(var(--cascader-list-pad,4px)*-1)]! shrink-0"

export interface CascaderGroupProps extends Omit<
  ComboboxPrimitive.Group.Props,
  "className"
> {
  /** Base UI also accepts a state callback here; the group has no state. */
  className?: string
}

/** A run of related rows, named by the `CascaderLabel` inside it: the group is
 *  `role="group"` and Base UI points its `aria-labelledby` at the label, where a
 *  heading alone inside a listbox is dropped from the accessibility tree.
 *  Grouping is composition, not data: `CascaderItems` renders one flat run per
 *  level, so its indices line up with `listRef`. */
function CascaderGroup({ className, ...props }: CascaderGroupProps) {
  return (
    <CascaderGroupContext.Provider value={true}>
      <ComboboxPrimitive.Group
        data-slot="cascader-group"
        className={cn("flex flex-col", className)}
        {...props}
      />
    </CascaderGroupContext.Provider>
  )
}

export interface CascaderLabelProps extends Omit<
  ComboboxPrimitive.GroupLabel.Props,
  "className" | "style"
> {
  /** No state callback; outside a group this is not a Base UI part at all. */
  className?: string
  style?: React.CSSProperties
}

/** Inside a group: the real thing, with the id association Base UI wires up. */
function CascaderGroupLabel({ className, ...props }: CascaderLabelProps) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="cascader-label"
      className={cn(CASCADER_LABEL_CLASS, className)}
      {...props}
    />
  )
}

// Outside a group: the same heading as a plain element. A separate component
// rather than a branch, so the hook count cannot change when a label moves in.
function CascaderPlainLabel({ className, ...props }: CascaderLabelProps) {
  const defaultProps = {
    "data-slot": "cascader-label",
    className: cn(CASCADER_LABEL_CLASS, className),
  }

  return useRender({
    defaultTagName: "div",
    render: props.render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

/** A heading. Inside `CascaderGroup` it is the group's accessible name; outside
 *  one (the footer flyout is a menu, not a listbox) it is decoration only. */
function CascaderLabel(props: CascaderLabelProps) {
  const grouped = React.useContext(CascaderGroupContext)
  return grouped ? (
    <CascaderGroupLabel {...props} />
  ) : (
    <CascaderPlainLabel {...props} />
  )
}

export interface CascaderSeparatorProps extends Omit<
  ComboboxPrimitive.Separator.Props,
  "className"
> {
  /** Base UI also accepts a state callback here; only the orientation varies. */
  className?: string
}

/** Decorative on purpose: Base UI's separator is `role="separator"`, which a
 *  `listbox` may not own, and a run that needs separating for a screen reader
 *  needs a `CascaderGroup`, not a line. A consumer can pass the role back. */
function CascaderSeparator({ className, ...props }: CascaderSeparatorProps) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="cascader-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(CASCADER_SEPARATOR_CLASS, className)}
      {...props}
    />
  )
}

export {
  CascaderGroup,
  CascaderItem,
  CascaderItems,
  CascaderLabel,
  CascaderSeparator,
}
