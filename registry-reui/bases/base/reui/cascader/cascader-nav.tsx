"use client"

import * as React from "react"
import {
  useCascaderActions,
  useCascaderState,
} from "@/registry-reui/bases/base/reui/cascader/cascader-context"
import { resolveCascaderSearchLabel } from "@/registry-reui/bases/base/reui/cascader/cascader-i18n"
import {
  collapseCascaderPath,
  getCascaderFooterStops,
  getCascaderPath,
  isCascaderRtl,
} from "@/registry-reui/bases/base/reui/cascader/cascader-lib"
import type {
  CascaderCollapse,
  CascaderNode,
  CascaderValueDisplay,
} from "@/registry-reui/bases/base/reui/cascader/cascader-types"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { useDirection } from "@base-ui/react/direction-provider"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                  Separator                                 */
/* -------------------------------------------------------------------------- */

function PathChevron() {
  return (
    <IconPlaceholder
      lucide="ChevronRightIcon"
      tabler="IconChevronRight"
      hugeicons="ArrowRight01Icon"
      phosphor="CaretRightIcon"
      remixicon="RiArrowRightSLine"
      className="size-3 shrink-0 opacity-50 rtl:-scale-x-100"
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                     Nav                                    */
/* -------------------------------------------------------------------------- */

export type CascaderNavProps = useRender.ComponentProps<"div">

/**
 * Header: back control, search input, and the separator under them. The
 * breadcrumb belongs with the list below: it describes the rows, not the field.
 */
function CascaderNav({ className, ...props }: CascaderNavProps) {
  const defaultProps = {
    "data-slot": "cascader-nav",
    className: cn(
      // `py-1`, not `py-1.5`: the row inside sets its own per-style height, so
      // even padding read too tall. 6px beside the field, 4px above and below.
      "border-border/60 flex shrink-0 flex-col gap-1 border-b px-1.5 py-1",
      className
    ),
  }

  return useRender({
    defaultTagName: "div",
    render: props.render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

/* -------------------------------------------------------------------------- */
/*                                    Back                                    */
/* -------------------------------------------------------------------------- */

export interface CascaderBackProps extends Omit<
  useRender.ComponentProps<"button">,
  "children"
> {
  children?: React.ReactNode
}

/** Pops one level. Renders nothing at the root, so no dead header space. */
function CascaderBack({ className, children, ...props }: CascaderBackProps) {
  const { popLevel, labels, mode } = useCascaderActions()
  const { path } = useCascaderState()

  // Checked after `useRender`, never before it: an early return would change
  // the hook count between the root level and any deeper one.
  const hidden = mode !== "drill" || path.length === 0

  const defaultProps = {
    "data-slot": "cascader-back",
    type: "button" as const,
    "aria-label": labels.back,
    onClick: () => popLevel(),
    className: cn(
      "text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex shrink-0 items-center justify-center rounded-md outline-hidden transition-colors focus-visible:ring-2",
      // A notch under the row height: an affordance, not a second field.
      "style-vega:size-6 style-nova:size-6 style-maia:size-7 style-lyra:size-6 style-mira:size-5 style-luma:size-6 style-rhea:size-6 style-sera:size-6",
      className
    ),
    children: children ?? (
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        tabler="IconChevronLeft"
        hugeicons="ArrowLeft01Icon"
        phosphor="CaretLeftIcon"
        remixicon="RiArrowLeftSLine"
        className="size-4 rtl:-scale-x-100"
      />
    ),
  }

  const element = useRender({
    defaultTagName: "button",
    render: props.render,
    props: mergeProps<"button">(defaultProps, props),
  })

  return hidden ? null : element
}

/* -------------------------------------------------------------------------- */
/*                                 Breadcrumb                                 */
/* -------------------------------------------------------------------------- */

export interface CascaderBreadcrumbProps extends Omit<
  useRender.ComponentProps<"nav">,
  "children"
> {
  /** Maximum visible node segments before the middle collapses. */
  maxSegments?: number
  collapse?: CascaderCollapse
  /** Clicking a segment navigates back to that level. Defaults to true. */
  interactive?: boolean
}

/**
 * Compact trail of the current level AND its ancestors, collapsed by the same
 * helper as `CascaderValue` so panel and trigger cannot disagree. The current
 * level IS the last crumb: dropping it read as a rendering bug, a trail naming
 * only the places you are not.
 */
function CascaderBreadcrumb({
  className,
  maxSegments = 3,
  collapse = "middle",
  interactive = true,
  ...props
}: CascaderBreadcrumbProps) {
  const { goToDepth, mode, labels } = useCascaderActions()
  const { path, index } = useCascaderState()

  // The WHOLE path, current level included; unresolvable entries drop out.
  const nodes = path
    .map((value) => index.byValue.get(value))
    .filter(Boolean) as CascaderNode[]
  const segments = collapseCascaderPath(nodes, { maxSegments, collapse })
  // `collapseCascaderPath` never collapses the last node away, so this is
  // always the final segment - derived rather than assumed, so a `collapse`
  // mode that ever changes that cannot mark an ancestor as the current page.
  const currentValue = nodes.length ? nodes[nodes.length - 1].value : null

  // See `CascaderBack`: the hide check must not short-circuit past `useRender`.
  const hidden = mode !== "drill" || nodes.length === 0

  const goTo = (node: CascaderNode) => {
    const depth = path.indexOf(node.value)
    if (depth < 0) return
    // `goToDepth`, not a bare `setPath`: it reports `reason: "breadcrumb"`,
    // clears the query and drops any pending navigation.
    goToDepth(depth + 1)
  }

  const defaultProps = {
    "data-slot": "cascader-breadcrumb",
    "aria-label": labels.breadcrumbLabel,
    className: cn(
      "text-muted-foreground flex min-w-0 shrink-0 items-center gap-0.5 pt-1.5 pb-0.5 text-xs",
      // Lines up with the ROWS, not the header: each style's list padding plus
      // its row inset. vega/mira/rhea `p-1`+`pl-2`, nova `p-1`+`pl-1.5`, maia
      // `p-1`+`pl-3`, lyra `pl-2`, luma/sera `p-1.5`+`pl-3`, per style-*.css.
      "style-vega:px-3 style-nova:px-2.5 style-maia:px-4 style-lyra:px-2 style-mira:px-3 style-luma:px-4.5 style-rhea:px-3 style-sera:px-4.5",
      className
    ),
    children: segments.map((segment, i) => (
      <React.Fragment
        key={segment.type === "node" ? segment.node.value : `gap-${i}`}
      >
        {i > 0 ? <PathChevron /> : null}
        {segment.type === "ellipsis" ? (
          <span
            data-slot="cascader-breadcrumb-ellipsis"
            title={segment.hidden
              .map((n) => n.label)
              .join(` ${labels.pathSeparator} `)}
            className="shrink-0"
          >
            &hellip;
          </span>
        ) : interactive && segment.node.value !== currentValue ? (
          <button
            type="button"
            data-slot="cascader-breadcrumb-item"
            onClick={() => goTo(segment.node)}
            className="hover:text-foreground focus-visible:ring-ring/50 max-w-32 truncate rounded-sm outline-hidden transition-colors focus-visible:ring-2"
          >
            {segment.node.label}
          </button>
        ) : (
          <span
            data-slot="cascader-breadcrumb-item"
            /* The level on screen: a span because it goes nowhere, plus
               `aria-current="page"` so it is not read as one of a flat list. */
            {...(segment.node.value === currentValue
              ? { "aria-current": "page" as const }
              : null)}
            className={cn(
              "max-w-32 truncate",
              segment.node.value === currentValue &&
                "text-foreground font-medium"
            )}
          >
            {segment.node.label}
          </span>
        )}
      </React.Fragment>
    )),
  }

  const element = useRender({
    defaultTagName: "nav",
    render: props.render,
    props: mergeProps<"nav">(defaultProps, props),
  })

  return hidden ? null : element
}

/* -------------------------------------------------------------------------- */
/*                                    Input                                   */
/* -------------------------------------------------------------------------- */

export interface CascaderInputProps extends ComboboxPrimitive.Input.Props {
  /** Renders the back control inline, before the field. Defaults to true. */
  showBack?: boolean
}

/** Base UI hands its input handlers an event carrying the veto hook. */
type CascaderInputKeyEvent = Parameters<
  NonNullable<ComboboxPrimitive.Input.Props["onKeyDown"]>
>[0]

/**
 * Search field. MUST render inside the positioner: only there does Base UI skip
 * the refill from the committed selection that would fight every level swap.
 */
function CascaderInput({
  className,
  showBack = true,
  placeholder,
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  ...props
}: CascaderInputProps) {
  const {
    labels,
    popLevel,
    mode,
    getHighlighted,
    isBranch,
    navigate,
    index,
    toggleExpanded,
    inline,
    invalid,
    baseId,
  } = useCascaderActions()
  const direction = useDirection()
  const { currentParent, query, path, renderedItems, treeRows } =
    useCascaderState()

  const resolvedPlaceholder =
    placeholder ?? resolveCascaderSearchLabel(labels, currentParent?.label)

  // Not `showBack`: `CascaderBack` renders nothing at the root or outside
  // drill mode, where the field's own leading `px-1.5` is wanted. Beside the
  // button it stacks with the row's `gap-1` into a 10px hole, hence `ps-0`.
  const backVisible = showBack && mode === "drill" && path.length > 0

  const hintId = `${baseId}-hint`
  // Base UI names no list while inline; columns mode moves the real listbox to
  // the deepest panel, which is the `path.length` one.
  const listId = `${baseId}-column-${mode === "columns" ? path.length : 0}`

  // The direction the HINT is worded for. `handleKeyDown` re-reads
  // `isCascaderRtl` per keystroke; this is text on screen before any key, so
  // the same check runs once against the mounted DOM (on the hint span, so no
  // second ref into Base UI's input). SSR renders the "ltr" default and
  // corrects on hydration. `direction` is the only dep: a `dir` attribute and
  // the stylesheet are declarations, not state, so nothing to resubscribe to.
  const hintRef = React.useRef<HTMLSpanElement>(null)
  const [hintDir, setHintDir] = React.useState<"ltr" | "rtl">("ltr")
  React.useLayoutEffect(() => {
    const hint = hintRef.current
    if (!hint) return
    setHintDir(isCascaderRtl(hint, direction) ? "rtl" : "ltr")
  }, [direction])

  /**
   * Moves the highlight to `targetIndex` in `treeRows`. Base UI has no
   * imperative setter (`actionsRef` is `{ unmount }`), so the move is arrow
   * presses, sound only because `useListNavigation` fires `onItemHighlighted`
   * SYNCHRONOUSLY per keydown. A press that fails to close the gap ends it.
   */
  const moveHighlightTo = (field: HTMLInputElement, targetIndex: number) => {
    const rowIndex = () => {
      const highlighted = getHighlighted()
      if (!highlighted) return -1
      return treeRows.findIndex((row) => row.node.value === highlighted.value)
    }

    let current = rowIndex()
    for (let step = 0; step < treeRows.length; step += 1) {
      if (current === -1 || current === targetIndex) return
      const key = current > targetIndex ? "ArrowUp" : "ArrowDown"
      field.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
      )
      const next = rowIndex()
      const progressed =
        key === "ArrowUp"
          ? next < current && next >= targetIndex
          : next > current && next <= targetIndex
      if (next === -1 || !progressed) return
      current = next
    }
  }

  /**
   * The tree pattern's two level keys; Base UI leaves both alone (list
   * navigation is vertical-only, the chip handler no-ops without
   * `Combobox.Chips`). Passed in rather than hardcoded because RTL swaps them:
   * APG defines them as "toward the children", not as a physical arrow.
   */
  const handleTreeKeyDown = (
    event: CascaderInputKeyEvent,
    field: HTMLInputElement,
    caretAtStart: boolean,
    caretAtEnd: boolean,
    forwardKey: "ArrowLeft" | "ArrowRight",
    backKey: "ArrowLeft" | "ArrowRight"
  ) => {
    const forward = event.key === forwardKey
    if (!forward && event.key !== backKey) return
    if (forward ? !caretAtEnd : !caretAtStart) return

    const highlighted = getHighlighted()
    if (!highlighted) return
    const rowIndex = treeRows.findIndex(
      (row) => row.node.value === highlighted.value
    )
    if (rowIndex < 0) return
    const row = treeRows[rowIndex]

    if (forward) {
      if (!row.branch) return
      event.preventDefault()
      if (!row.expanded) {
        // `navigate`, not `toggleExpanded`: it waits for an unloaded branch's
        // children, so the keyboard path in matches the expander.
        navigate(row.node)
        return
      }
      // `flattenCascaderTree` emits children right after their parent, so the
      // first child is the next row. The depth check covers an empty branch.
      const child = treeRows[rowIndex + 1]
      if (child && child.depth === row.depth + 1) {
        moveHighlightTo(field, rowIndex + 1)
      }
      return
    }

    if (row.branch && row.expanded) {
      event.preventDefault()
      toggleExpanded(row.node.value)
      return
    }

    const parentValue = index.parentOf.get(row.node.value)
    if (!parentValue) return
    const parentIndex = treeRows.findIndex(
      (entry) => entry.node.value === parentValue
    )
    if (parentIndex < 0) return
    event.preventDefault()
    moveHighlightTo(field, parentIndex)
  }

  const handleKeyDown = (event: CascaderInputKeyEvent) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const field = event.currentTarget
    const caretAtStart = field.selectionStart === 0 && field.selectionEnd === 0
    const caretAtEnd =
      field.selectionStart === query.length &&
      field.selectionEnd === query.length

    // ArrowDown at the END of the list hands real focus to the pinned footer,
    // the key a combobox is actually navigated with; Tab still works and still
    // skips the scroll area. An EMPTY list hands off at once, and the footer
    // owns the way back. Counted from state, so a windowed list still answers.
    if (event.key === "ArrowDown" && !event.altKey) {
      const rowCount = mode === "tree" ? treeRows.length : renderedItems.length
      const lastValue =
        mode === "tree"
          ? treeRows[rowCount - 1]?.node.value
          : renderedItems[rowCount - 1]?.value
      const highlighted = getHighlighted()
      const atEnd =
        rowCount === 0 ||
        (highlighted != null && highlighted.value === lastValue)
      if (atEnd) {
        const panel = field.closest<HTMLElement>('[data-slot="cascader-panel"]')
        const stop = panel ? getCascaderFooterStops(panel)[0] : undefined
        if (stop) {
          event.preventDefault()
          // Base UI's handler is deliberately NOT vetoed: its wrap's first
          // press CLEARS the highlight, so no stale row stays active behind the
          // focused command, and the emptied highlight completes the ring.
          stop.focus()
          return
        }
      }
    }

    // The level keys are LOGICAL, not physical: in RTL, ArrowLeft opens a
    // branch and ArrowRight goes back. They act only at the caret edge, and
    // those guards do NOT mirror: `selectionStart === 0` is the logical start.
    const rtl = isCascaderRtl(field, direction)
    const forwardKey = rtl ? "ArrowLeft" : "ArrowRight"
    const backKey = rtl ? "ArrowRight" : "ArrowLeft"

    if (mode === "tree") {
      handleTreeKeyDown(
        event,
        field,
        caretAtStart,
        caretAtEnd,
        forwardKey,
        backKey
      )
      return
    }

    if (event.key === forwardKey && caretAtEnd) {
      const highlighted = getHighlighted()
      if (highlighted && isBranch(highlighted)) {
        event.preventDefault()
        navigate(highlighted)
        return
      }
    }

    // Backspace on an empty query pops a level too, so the keyboard way out of
    // a level is symmetric with typing into it.
    if (
      (event.key === backKey && caretAtStart) ||
      (event.key === "Backspace" && query.length === 0)
    ) {
      if (path.length > 0) {
        event.preventDefault()
        popLevel()
      }
    }
  }

  return (
    <div
      data-slot="cascader-input-row"
      className={cn(
        "flex shrink-0 items-center gap-1",
        /* Each style sizes a combobox search field only as a DIRECT child of
           the popup; this row is nested, so the ladder is mirrored here rather
           than hardcoding one height for all eight styles. */
        "style-vega:h-8 style-nova:h-8 style-maia:h-9 style-lyra:h-8 style-mira:h-7 style-luma:h-8 style-rhea:h-8 style-sera:h-8"
      )}
    >
      {showBack ? <CascaderBack /> : null}
      <ComboboxPrimitive.Input
        data-slot="cascader-input"
        placeholder={resolvedPlaceholder}
        onKeyDown={handleKeyDown}
        /* Nothing on screen says the level keys exist. */
        aria-describedby={[ariaDescribedBy, hintId].filter(Boolean).join(" ")}
        /* Conditional: an explicit `undefined` deletes Base UI's own value. */
        {...(mode === "tree" ? { "aria-haspopup": "tree" as const } : null)}
        /* Base UI omits BOTH `aria-expanded` and `aria-controls` while inline,
           and an embedded panel is permanently expanded, so supply both. */
        {...(inline
          ? { "aria-expanded": true, "aria-controls": listId }
          : null)}
        /* No trigger to carry the invalid state in the `inline` case. */
        {...(invalid ? { "aria-invalid": true, "data-invalid": "" } : null)}
        className={cn(
          "placeholder:text-muted-foreground h-full w-full min-w-0 flex-1 bg-transparent px-1.5 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          backVisible && "ps-0",
          className
        )}
        {...props}
      />
      <span id={hintId} ref={hintRef} className="sr-only">
        {/* `hintDir`, not `direction`: the context alone misses an RTL app that
            uses a `dir` attribute instead of `DirectionProvider`. */}
        {labels.keyboardHint(mode, hintDir)}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Value                                   */
/* -------------------------------------------------------------------------- */

export interface CascaderValueProps extends Omit<
  useRender.ComponentProps<"span">,
  "children"
> {
  /** `path` shows the full trail, `leaf` only the node, `count` only a total. */
  display?: CascaderValueDisplay
  maxSegments?: number
  collapse?: CascaderCollapse
  separator?: React.ReactNode
  /** Renders the selected node's icon before the trail. */
  showIcon?: boolean
  placeholder?: React.ReactNode
  /** Replaces the whole rendering. Receives the resolved selection and path. */
  children?: (selected: CascaderNode[], path: CascaderNode[]) => React.ReactNode
}

/**
 * Trigger display. Defaults to the collapsed selection path rather than a bare
 * leaf label, which in a nested picker is frequently ambiguous.
 */
function CascaderValue({
  className,
  display = "path",
  maxSegments = 3,
  collapse = "middle",
  separator,
  showIcon = true,
  placeholder,
  children,
  ...props
}: CascaderValueProps) {
  const { labels, multiple, resolveNode } = useCascaderActions()
  const { index, selectedValues } = useCascaderState()

  // `resolveNode`, not `index.byValue`: a selection missing from `items` (async
  // children, a removed item) must still render a label, not an empty trigger.
  const selected = selectedValues.map(resolveNode)

  const resolvedPath =
    selectedValues.length === 1 ? getCascaderPath(index, selectedValues[0]) : []
  // No ancestor chain: fall back to the node so `display="path"` shows a leaf.
  const path =
    resolvedPath.length > 0
      ? resolvedPath
      : selected.length === 1
        ? selected
        : []

  let content: React.ReactNode

  if (children) {
    content = children(selected, path)
  } else if (selectedValues.length === 0) {
    content = (
      <span className="text-muted-foreground truncate">{placeholder}</span>
    )
  } else if (display === "count" || (multiple && selectedValues.length > 1)) {
    content = labels.selectedCount(selectedValues.length)
  } else {
    const leaf = path[path.length - 1] ?? selected[0]
    const segments =
      display === "leaf"
        ? [{ type: "node" as const, node: leaf }]
        : collapseCascaderPath(path, { maxSegments, collapse })

    content = (
      <>
        {showIcon && leaf?.icon ? (
          <span
            data-slot="cascader-value-icon"
            className="text-muted-foreground flex shrink-0 items-center"
          >
            {leaf.icon}
          </span>
        ) : null}
        {segments.map((segment, i) => (
          <React.Fragment
            key={segment.type === "node" ? segment.node.value : `gap-${i}`}
          >
            {i > 0 ? (separator ?? <PathChevron />) : null}
            {segment.type === "ellipsis" ? (
              <span
                data-slot="cascader-value-ellipsis"
                title={segment.hidden
                  .map((n) => n.label)
                  .join(` ${labels.pathSeparator} `)}
                className="text-muted-foreground shrink-0"
              >
                &hellip;
              </span>
            ) : (
              <span
                className={cn(
                  "truncate",
                  i < segments.length - 1 && "text-muted-foreground"
                )}
              >
                {segment.node?.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    )
  }

  const defaultProps = {
    "data-slot": "cascader-value",
    className: cn("flex min-w-0 items-center gap-1 truncate", className),
    children: content,
  }

  return useRender({
    defaultTagName: "span",
    render: props.render,
    props: mergeProps<"span">(defaultProps, props),
  })
}

export {
  CascaderNav,
  CascaderBack,
  CascaderBreadcrumb,
  CascaderInput,
  CascaderValue,
}
