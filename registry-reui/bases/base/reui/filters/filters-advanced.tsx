"use client"

import * as React from "react"
import { FilterFieldPicker } from "@/registry-reui/bases/base/reui/filters/filters-builder"
import {
  FilterMoveToMenuItems,
  FilterOperatorPopover,
  FilterRuleMenuItems,
  FilterValuePopover,
  useFilterRuleDisplay,
} from "@/registry-reui/bases/base/reui/filters/filters-chip"
import {
  filterControlSizes,
  filterReadOnlyProps,
  FilterReorderProvider,
  isFilterLocked,
  useFilterActions,
  useFilterChipAutoOpen,
  useFilterChipFocused,
  useFilterFocusEmpty,
  useFilterFocusStore,
  useFilterRender,
  useFilterReorderable,
  useFilterRowPending,
  useFilterRowStateStore,
  useFilterSegmentFocus,
  useFilterState,
  type FilterActionsContextValue,
} from "@/registry-reui/bases/base/reui/filters/filters-context"
import {
  FILTER_ROW_SELECTOR,
  useFilterRowDrag,
} from "@/registry-reui/bases/base/reui/filters/filters-dnd"
import { filterIssueLabel } from "@/registry-reui/bases/base/reui/filters/filters-i18n"
import {
  FILTER_FIELD_PICKER_CLASS,
  FILTER_MENU_CLASS,
  FILTER_MENU_LABEL_CLASS,
  filterCombinatorSlot,
  getFilterField,
  isFilterFieldPickable,
  joinFilterPath,
} from "@/registry-reui/bases/base/reui/filters/filters-lib"
import {
  getFilterArity,
  getFilterOperator,
  operatorTakesValue,
} from "@/registry-reui/bases/base/reui/filters/filters-operators"
import {
  collectFilterIssues,
  createFilterRule,
  isFilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-query"
import type {
  FilterCombinator,
  FilterEmptyStateContext,
  FilterField,
  FilterGroupNode,
  FilterIssue,
  FilterNode,
  FilterOperator,
  FilterQuery,
  FilterRule,
} from "@/registry-reui/bases/base/reui/filters/filters-types"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Input } from "@/registry/bases/base/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                  Columns                                   */
/* -------------------------------------------------------------------------- */

const CONTENT_COLUMNS = ["combinator", "field", "operator", "value"] as const

const ACTION_COLUMNS = ["drag", "menu", "add", "remove"] as const

/** Every column a row may draw, in two bands. Navigation is by COLUMN NAME and
 * never position: the BANDS keep ArrowDown off a group's footer button. */
type FilterColumn =
  | (typeof CONTENT_COLUMNS)[number]
  | (typeof ACTION_COLUMNS)[number]

/** The nearest column in `band` that `available` has; backward wins a tie. */
function nearestColumn(
  band: readonly FilterColumn[],
  from: FilterColumn,
  available: Map<string | null, HTMLElement>
): HTMLElement | undefined {
  const at = band.indexOf(from)
  if (at === -1) return undefined
  for (let step = 0; step < band.length; step++) {
    const before = step === 0 ? undefined : available.get(band[at - step] ?? "")
    if (before) return before
    const after = available.get(band[at + step] ?? "")
    if (after) return after
  }
  return undefined
}

/** Marks a focusable cell control, read by the keyboard walker. Not
 * `data-slot`: a cell control is handed to a Base UI trigger through `render`,
 * which stamps its own, so a slot here would be two owners on one attribute. */
const CELL_ATTRIBUTE = "data-filter-cell"

/** Marks a cell the user TYPES into: the builder claims the arrows, Home, End
 * and Delete, and each means something else in a text box. */
const CELL_INPUT_ATTRIBUTE = "data-filter-cell-input"

const ROW_SELECTOR = FILTER_ROW_SELECTOR

/** Hands every row's handle its pointer wiring: only the panel, which owns the
 * body element, can measure a drop. */

const FilterDragContext = React.createContext<ReturnType<
  typeof useFilterRowDrag
> | null>(null)

/** What each node is missing, by id. An empty map by default, so a row mounted
 * outside the shipped panel gets "nothing is wrong" instead of a throw. */
const FilterIssueContext = React.createContext<
  ReadonlyMap<string, FilterIssue>
>(new Map())

function cellProps(column: FilterColumn, active: FilterColumn | null) {
  return {
    "data-filter-cell": column,
    // ONE tab stop for the whole builder; the arrows move within it.
    tabIndex: active === column ? 0 : -1,
  }
}

/** What an INVALID cell wears: `aria-invalid` to announce it, `data-invalid`
 * to style it, `aria-description` for the sentence. */
function issueProps(
  issue: FilterIssue | undefined,
  column: FilterIssue["column"],
  message: string
) {
  if (!issue || issue.column !== column) return null
  return {
    "aria-invalid": true,
    "data-invalid": "",
    "aria-description": message,
    // NO `title`: the hint icon carries the sentence in a real tooltip, and a
    // native one would clobber the truncation `title` beside it.
  } as const
}

/** Sera's uppercase and wide tracking cost about a third of a cell, so where
 * every other style drew "migration" sera drew "MIGRATI...". */
const SERA_TEXT_CLASS = "style-sera:normal-case style-sera:tracking-normal"

const CELL_CLASS = cn(
  "w-full min-w-0 justify-between gap-1.5 font-normal",
  // `>svg` is the caret and only the caret: a field's own type icon sits in a
  // nested span, where it keeps full strength because it is content.
  "[&>svg]:text-muted-foreground",
  // WHAT A CELL GIVES UP FIRST: padding, icon and caret cost about 44px before
  // a character is drawn, and the name is what nothing else can reconstruct.
  // Container queries and not a viewport breakpoint: the question is how wide
  // THIS cell is, and one panel holds a 300px cell and a 40px one.
  "@max-[7rem]/cell:gap-0 @max-[7rem]/cell:[&>svg]:hidden",
  "@max-[5rem]/cell:[&_span>svg]:hidden",
  SERA_TEXT_CLASS
)

/** What an invalid cell looks like. A ring, not a border: a border changes the
 * box, so a cell turning invalid would nudge every cell beside it. */
const CELL_INVALID_CLASS =
  "data-invalid:ring-destructive/40 data-invalid:ring-1"

/** Width of the leading combinator column. The 58.72px pill put this track at
 * 4rem and it does not shrink now the pill has: it is sized for the longest of
 * the three things in it, "Where", 51.44px in every style. */
const COMBINATOR_CLASS = cn(
  "w-16 shrink-0 items-center justify-center",
  // 6px of its own on TOP of the band's `gap-1.5`: this column is the
  // sentence's connective, not a fourth control butted against the attribute.
  "me-1.5"
)

/** The two static words in that column, CENTRED because the pill's own
 * `justify-center` centres its word. `w-full`, or `truncate` has no box. */
const COMBINATOR_TEXT_CLASS = cn(
  "text-muted-foreground w-full truncate px-1 text-center text-sm",
  SERA_TEXT_CLASS
)

/** A row is TWO BANDS. The trailing pair of every row at every depth shares one
 * vertical axis - 0.00px of spread from 1104px to 240px, eight styles, depth
 * three - and only because the content band may shrink to nothing. */
const ROW_BAND_CLASS = "flex min-w-0 items-center gap-1.5"

const CONTENT_BAND_CLASS = "flex min-w-0 flex-1 items-center gap-1.5"

/** FLEX and not a block: a `Button` is `inline-flex`, so a block wrapper builds
 * a line box as tall as its font's strut - 28px buttons in 28.141px wrappers. */
const CELL_BOX_CLASS = "@container/cell flex min-w-0 shrink grow-0"

/** THE DEFAULT WIDTH OF EACH CONTENT CELL. An INLINE FALLBACK and not a
 * declaration on the panel: declared, the panel would beat anything an ANCESTOR
 * set, which is where a consumer sets it in popover mode. So all four work:
 *
 *   <Filters variant="advanced" className="[--filter-field-width:14rem]" />
 *   <FiltersAdvancedPanel className="[--filter-operator-width:7rem]" />
 *   <Card className="[--filter-value-width:16rem]"><Filters … /></Card>
 *   [data-slot="filters-advanced"] { --filter-field-width: 14rem } */
const FIELD_CELL_CLASS = "basis-[var(--filter-field-width,11rem)]"
const OPERATOR_CELL_CLASS = "basis-[var(--filter-operator-width,9rem)]"
const VALUE_CELL_CLASS = "basis-[var(--filter-value-width,12rem)]"

/** The trailing band. `pe-1` is on the BAND and not the gutter, since a group
 * card is `pe-0`; the footer and `DROP_SLOT_INDICATOR` restate the same four. */
const ACTION_BAND_CLASS = cn(
  "text-muted-foreground flex shrink-0 items-center gap-0.5 pe-1"
)

/** What the grip and the kebab wear while open. TWO ATTRIBUTES, because Radix
 * sets `data-state="open"` and Base UI `data-popup-open`, so one selector alone
 * would be dead in one twin, silently, in a byte-locked file. */
const ACTION_CONTROL_CLASS = cn(
  "hover:inset-ring hover:inset-ring-border",
  // Base UI.
  "data-popup-open:inset-ring data-popup-open:inset-ring-border",
  // Radix.
  "data-[state=open]:inset-ring data-[state=open]:inset-ring-border"
)

/** The gap between sibling rows, one third of one measurement:
 * `FILTER_ROW_SEAM_PX` is HALF of it and the footer's `-mt-*` cancels it. */
const FILTER_ROW_GAP_CLASS = "gap-3"
const FILTER_ROW_GAP_CANCEL_CLASS = "-mt-3"
const FILTER_ROW_HALF_GAP_CLASS = {
  // The slot names the BOUNDARY between two rows, which is the middle of the
  // gap: 6px of it less HALF the rule's own 2px, so its CENTRE lands there.
  before: "data-[drop-edge=before]:after:mb-[5px]",
  after: "data-[drop-edge=after]:after:mt-[5px]",
} as const

/** POPOVER: the popover content is `p-0`, so this IS the popup's own inner
 * padding. INLINE there is no popup, and a panel that pads itself as well is a
 * second inset the page did not ask for. */
const PANEL_PAD_VAR = "--filter-panel-pad"
const PANEL_PAD_POPOVER = "0.75rem"
const PANEL_PAD_INLINE = "0px"

/** The panel's ONE horizontal rhythm: a row's trailing controls sit at the
 * content edge, which IS this padding, so a footer that disagrees breaks it. */
const PANEL_GUTTER_CLASS = "px-(--filter-panel-pad)"

const PANEL_CLASS = "flex w-full min-w-0 flex-col gap-2 py-(--filter-panel-pad)"

/** A RING and not a border, the whole answer to the staggered trailing
 * controls: a border pushes the content edge inward a pixel per level. */
const GROUP_CARD_CLASS = cn(
  "bg-muted/40 min-w-0 flex-1 rounded-md",
  "inset-ring inset-ring-border",
  "ps-2 pe-0",
  "data-invalid:inset-ring-destructive/50",
  // The DESTINATION of a drop into this group, told apart from the insertion
  // slot by STYLE and not size: dashed is not there yet, solid exists.
  "data-drop-into:bg-muted/60",
  "data-drop-into:outline-1 data-drop-into:outline-solid",
  "data-drop-into:outline-border data-drop-into:-outline-offset-2"
)

/** THE CONTAINER a row measures its own room against, on the panel body and on
 * every group's list, so a row asks how wide the list it is IN is. */
const TRACK_CONTAINER_CLASS = "@container/track"

/** When a group stops putting its combinator BESIDE the card. A DEPTH budget
 * was wrong both ways: at 380px the depth-three row painted zero pixels of
 * field, operator and value and fanned the kebab column out by up to 119px.
 * 26rem is what a row MEASURES: 134px of fixed cost plus about 200px of cells. */
const GROUP_COMBINATOR_WRAP_CLASS = "@max-[26rem]/track:w-full"

/** The combinator itself, once its wrapper has a whole line. Pinned to the
 * same 4rem the gutter track is, so it is the same control at every width. */
const GROUP_COMBINATOR_WRAPPED_CLASS = "@max-[26rem]/track:w-16"

/** How a row shows where a dragged node would land. `data-drop-edge` is an
 * insertion BETWEEN rows, drawn here; `data-drop-into` is painted on the CARD,
 * so "inside this group" and "after this group" are not one picture. */
const DROP_SLOT_INDICATOR = cn(
  // The SOURCE in flight, faded rather than hidden. THREE FIFTHS is a contrast
  // measurement: at 35 under a `blur-[1px]` the text composited to #a9a9a9,
  // 2.35:1 on the light panel, under even the 3:1 line for a non-text mark.
  "relative rounded-md",
  "data-dragging:opacity-60",
  // THE INSERTION LINE lives in the gap rather than overlaying a real row.
  // `end-1` and not `end-0`: four pixels of `pe-1` are the kebab column.
  "data-drop-edge:after:absolute",
  "data-drop-edge:after:start-0 data-drop-edge:after:end-1",
  "data-drop-edge:after:h-0.5 data-drop-edge:after:rounded-full",
  "data-drop-edge:after:bg-primary",
  "data-drop-edge:after:z-10",
  "data-[drop-edge=before]:after:bottom-full",
  FILTER_ROW_HALF_GAP_CLASS.before,
  "data-[drop-edge=after]:after:top-full",
  FILTER_ROW_HALF_GAP_CLASS.after
)

/** What a CONDITION row draws, which is what a group's row draws: the slot and
 * nothing else. It used to add a faint dashed outline of its own, a second
 * dashed rectangle a few pixels from the first saying what it already said. */
const DROP_INDICATOR = DROP_SLOT_INDICATOR

/** How the footer says "append to the top level": the same RULE the rows draw.
 * `data-drop-into` and not `data-drop-edge`, because an explicit zone is a
 * DESTINATION. Both ends restate the padding VARIABLE, since `inset` resolves
 * against the PADDING box and `inset-x-0` overran every rule above it. */
const FOOTER_DROP_CLASS = cn(
  "data-drop-into:after:absolute",
  "data-drop-into:after:start-(--filter-panel-pad)",
  "data-drop-into:after:end-[calc(var(--filter-panel-pad)+4px)]",
  "data-drop-into:after:top-0 data-drop-into:after:h-0.5",
  "data-drop-into:after:rounded-full data-drop-into:after:bg-primary"
)

/** The cells a row owns ITSELF: a group's row contains its children's rows, so
 * a bare `querySelectorAll` would let ArrowRight walk into the first of them. */
function ownCells(row: HTMLElement): HTMLElement[] {
  return Array.from(
    row.querySelectorAll<HTMLElement>(`[${CELL_ATTRIBUTE}]`)
  ).filter((cell) => cell.closest<HTMLElement>(ROW_SELECTOR) === row)
}

/* -------------------------------------------------------------------------- */
/*                                Shared cells                                */
/* -------------------------------------------------------------------------- */

interface RowPosition {
  index: number
  parentId: string
  combinator: FilterCombinator
  depth: number
}

/** The leading and/or slot: one group is joined by ONE operator, and mixing is
 * what a nested group is FOR. */
function CombinatorCell({
  index,
  parentId,
  combinator,
  active,
  onFocus,
  className,
}: {
  index: number
  parentId: string
  combinator: FilterCombinator
  active: FilterColumn | null
  onFocus: (column: FilterColumn) => () => void
  className?: string
}) {
  const actions = useFilterActions()
  const sizes = filterControlSizes(actions)
  const slot = filterCombinatorSlot(index)
  const word = combinator === "and" ? actions.labels.and : actions.labels.or

  if (slot === "where") {
    return (
      <span className={cn(COMBINATOR_TEXT_CLASS, className)}>
        {actions.labels.where}
      </span>
    )
  }

  if (slot === "echo") {
    return <span className={cn(COMBINATOR_TEXT_CLASS, className)}>{word}</span>
  }

  const name = actions.labels.combinatorLabel(word)

  return (
    <Button
      variant="outline"
      size={sizes.button}
      /* The WORD is in the name: the track is fixed, so a locale whose
         word overflows draws "a...". */
      aria-label={name}
      title={name}
      disabled={actions.disabled}
      {...filterReadOnlyProps(actions)}
      className={cn(
        "group/combinator relative w-full min-w-0 justify-center px-1.5 font-normal",
        SERA_TEXT_CLASS,
        className
      )}
      {...cellProps("combinator", active)}
      onFocus={onFocus("combinator")}
      onClick={() => actions.toggleCombinator(parentId)}
    >
      <span className="truncate">{word}</span>
      {/* ABSOLUTELY POSITIONED, so the word still centres at 0.00px. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute end-1 opacity-0 transition-opacity",
          "group-hover/combinator:opacity-60",
          "group-focus-visible/combinator:opacity-60",
          "[&_svg]:size-3"
        )}
      >
        <IconPlaceholder
          lucide="RefreshCwIcon"
          tabler="IconRefresh"
          hugeicons="RefreshIcon"
          phosphor="ArrowsClockwiseIcon"
          remixicon="RiRefreshLine"
        />
      </span>
    </Button>
  )
}

/** Whether dragging this node could change the tree at all; the grip is drawn
 * only when it could. Every destination outside the footer zone lives inside
 * some row and the drop layer discards any inside the dragged one, so the sole
 * child of the root is the one case with nowhere to go. A pure function of the
 * QUERY, deliberately blind to `disabled` and `readOnly`: a locked bar keeps
 * its grip, because "you may not move this" and "there is nowhere to move it"
 * are different sentences. */
function canFilterNodeMove(
  query: FilterQuery<unknown>,
  position: { parentId: string }
) {
  if (position.parentId !== query.id) return true
  return query.rules.length > 1
}

/** The error, as a QUIET mark the pointer can ask about: ONE per ROW, and
 * `aria-hidden`, since the cell carries it as `aria-description`. */
function RowIssueHint({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  if (!message) return null
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              data-slot="filter-row-issue"
              /* Focusable so a keyboard user can summon it, but OUT of the
                 tab order: the sentence is already on the invalid cell. */
              tabIndex={-1}
              aria-hidden="true"
              className={cn(
                "text-destructive flex shrink-0 items-center justify-center [&_svg]:size-3.5",
                className
              )}
            >
              <IconPlaceholder
                lucide="CircleAlertIcon"
                tabler="IconAlertCircle"
                hugeicons="Alert02Icon"
                phosphor="WarningCircleIcon"
                remixicon="RiErrorWarningLine"
              />
            </span>
          }
        />
        <TooltipContent side="top">{message}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/** The drag handle: what ARMS the gesture, since arming the row would turn
 * every text selection into a drag, and the only thing a screen reader can be
 * told about, which is why Alt+arrow hangs off it. */
function RowHandle({
  nodeId,
  active,
  onFocus,
}: {
  nodeId: string
  active: FilterColumn | null
  onFocus: (column: FilterColumn) => () => void
}) {
  const actions = useFilterActions()
  const sizes = filterControlSizes(actions)
  const dragProps = React.useContext(FilterDragContext)
  const locked = isFilterLocked(actions)

  return (
    <Button
      variant="ghost"
      size={sizes.icon}
      aria-label={actions.labels.reorder}
      /* The activation is the DRAG, which no click performs, so without these
         a screen reader finds a "Reorder" button that appears broken. */
      aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
      aria-description={actions.labels.reorderHint}
      disabled={actions.disabled}
      {...filterReadOnlyProps(actions)}
      /* `touch-none`, or a finger on the handle becomes a page scroll the
         gesture then fights. Muted at rest, never hidden. */
      className={cn(
        "focus-visible:text-foreground cursor-grab touch-none",
        "active:cursor-grabbing",
        ACTION_CONTROL_CLASS
      )}
      {...cellProps("drag", active)}
      onFocus={onFocus("drag")}
      /* Not armed at all while locked; the engine refuses it again. */
      {...(locked ? null : dragProps?.(nodeId))}
    >
      <IconPlaceholder
        lucide="GripVerticalIcon"
        tabler="IconGripVertical"
        hugeicons="DragDropVerticalIcon"
        phosphor="DotsSixVerticalIcon"
        remixicon="RiDraggable"
      />
    </Button>
  )
}

/** Which cell of a row owns the builder's single tab stop. An operator change
 * can take the value column out from under the focus pointing at it. */
function useActiveColumn(
  nodeId: string,
  columns: FilterColumn[],
  isFirstRow: boolean
): FilterColumn | null {
  const focused = useFilterChipFocused(nodeId)
  const segment = useFilterSegmentFocus(nodeId)
  const noFocus = useFilterFocusEmpty()

  if (focused) {
    return segment && columns.includes(segment as FilterColumn)
      ? (segment as FilterColumn)
      : columns[0]
  }
  return noFocus && isFirstRow ? columns[0] : null
}

function useFilterIssue(nodeId: string): FilterIssue | undefined {
  return React.useContext(FilterIssueContext).get(nodeId)
}

/* -------------------------------------------------------------------------- */
/*                              Inline free text                              */
/* -------------------------------------------------------------------------- */

/** Whether a value is FREE TEXT, and therefore typed in the row itself. The
 * CHIP row keeps its popover for every value, deliberately, which is why this
 * lives here and not in the shared display hook. NUMBER is in: empty clears,
 * and anything unparseable snaps back to the last committed number. */
function usesInlineTextEditor<V, O>(
  field: FilterField<V, O>,
  operator: FilterOperator | undefined,
  hasCustomDisplay: boolean
): boolean {
  if (field.editor) return false
  if (field.options || field.loadOptions) return false
  if (field.renderValue || field.valueText || hasCustomDisplay) return false
  const type = field.type ?? "text"
  if (type !== "text" && type !== "number") return false
  return getFilterArity(operator) === "one"
}

/** The value cell as a real text box. COMMIT IS BLUR AND ENTER: per keystroke
 * makes the ROOT the source of truth for every character, and debouncing only
 * adds a window where the cell and the query disagree with no event. */
function FilterInlineValueCell<V, O>({
  rule,
  field,
  issue,
  issueText,
  active,
  onFocus,
}: {
  rule: FilterRule<V>
  field: FilterField<V, O>
  issue: FilterIssue | undefined
  issueText: string
  active: FilterColumn | null
  onFocus: (column: FilterColumn) => () => void
}) {
  const actions = useFilterActions<V, O>()
  const focusStore = useFilterFocusStore()
  const locked = isFilterLocked(actions)
  const numeric = (field.type ?? "text") === "number"
  // The handoff the value POPOVER honours, answered by taking the caret.
  const autoOpen = useFilterChipAutoOpen(rule.id) === "value"
  const inputRef = React.useRef<HTMLInputElement>(null)

  const committed =
    rule.value === undefined || rule.value === null ? "" : String(rule.value)
  const [draft, setDraft] = React.useState(committed)
  // STATE and not a ref: the sync below runs during render.
  const [seed, setSeed] = React.useState(committed)

  // Adjusting state during render; an effect would paint the stale text.
  if (seed !== committed) {
    setSeed(committed)
    setDraft(committed)
  }

  // CONSUMED as it is honoured: a flag left standing is spent by the next row.
  React.useEffect(() => {
    if (!autoOpen) return
    if (!locked) {
      const input = inputRef.current
      input?.focus()
      // SELECTED: the condition step may have coerced a value across.
      input?.select()
    }
    focusStore.set({ id: rule.id, segment: "value", autoOpen: false })
  }, [autoOpen, locked, focusStore, rule.id])

  const commit = () => {
    if (draft === seed) return

    if (numeric) {
      const text = draft.trim()
      // Empty clears rather than writing 0, which silently matches rows.
      if (text === "") {
        actions.updateRule(rule.id, { value: undefined as V })
        return
      }
      const parsed = Number(text)
      // Revert, do not write: a NaN compares false against every row.
      if (!Number.isFinite(parsed)) {
        setDraft(seed)
        return
      }
      actions.updateRule(rule.id, { value: parsed as V })
      return
    }

    actions.updateRule(rule.id, { value: draft as V })
  }

  return (
    /* A FRAGMENT, not a wrapper: the positioning context for the error mark
       is the CELL itself, which already carries the column's basis. */
    <>
      <Input
        ref={inputRef}
        aria-label={field.label}
        placeholder={field.placeholder ?? actions.labels.valuePlaceholder}
        /* The RIGHT KEYPAD only: `type="number"` brings spinners. */
        inputMode={numeric ? "decimal" : undefined}
        value={draft}
        /* `h-full` and no size class: `Input` has ONE height per style, so
           at `size="sm"` it was a pixel taller in nova and two in sera. */
        className={cn("h-full", issueText && "pe-7", CELL_INVALID_CLASS)}
        /* Native `readOnly`, not `disabled`: it keeps its tab stop. */
        readOnly={locked}
        disabled={actions.disabled}
        {...filterReadOnlyProps(actions)}
        {...cellProps("value", active)}
        {...{ [CELL_INPUT_ATTRIBUTE]: "" }}
        {...issueProps(issue, "value", issueText)}
        onFocus={onFocus("value")}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault()
            commit()
            return
          }
          if (event.key === "Escape") {
            /* Only when there is something to revert; Escape belongs to the
               surface the builder sits in. */
            if (draft === seed) return
            event.preventDefault()
            event.stopPropagation()
            setDraft(seed)
          }
        }}
      />
      <RowIssueHint
        message={issueText}
        /* `pointer-events-none`, so a click still lands in the input. */
        className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 [&>*]:pointer-events-auto"
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Rule row                                  */
/* -------------------------------------------------------------------------- */

export interface FilterAdvancedRowProps<V = unknown> {
  rule: FilterRule<V>
  position: RowPosition
}

function FilterAdvancedRowImpl<V, O>({
  rule,
  position,
}: FilterAdvancedRowProps<V>) {
  const actions = useFilterActions<V, O>()
  const render = useFilterRender<V, O>()
  const sizes = filterControlSizes(actions)
  const focusStore = useFilterFocusStore()
  const locked = isFilterLocked(actions)
  const { query } = useFilterState<V>()

  const field = getFilterField(actions.index, rule.path)
  const operators = field ? actions.resolveOperators(field) : []
  const operator = getFilterOperator(operators, rule.operator)
  const takesValue = Boolean(rule.operator) && operatorTakesValue(operator)
  const inlineValue =
    takesValue && field
      ? usesInlineTextEditor(field, operator, Boolean(render.renderValue))
      : false

  const issue = useFilterIssue(rule.id)
  const issueText = issue ? filterIssueLabel(issue, actions.labels) : ""

  const {
    pathText,
    pathLabel,
    pathCollapsed,
    operatorLabel,
    valueLabel,
    valueText,
    valueFullText,
    valueEmpty,
  } = useFilterRuleDisplay<V, O>(rule, field, operator)

  /* ------------------------------ field cell ------------------------------ */

  const fieldAutoOpen = useFilterChipAutoOpen(rule.id) === "field"
  const [pickerOpen, setPickerOpen] = React.useState(false)
  // Controlled so both can REFUSE to open while locked.
  const [menuOpen, setMenuOpen] = React.useState(false)
  // Seeded from the rule's own level, so amending opens beside its siblings.
  const [pickerPath, setPickerPath] = React.useState<string[]>(() =>
    rule.path.slice(0, -1)
  )
  const [pickerQuery, setPickerQuery] = React.useState("")

  // A new row arrives with a GUESS at its field, so the one choice not yet the
  // user's own opens itself. CONSUMED as it is honoured: `pickerOpen` is a
  // dependency, so a flag left standing reopened the picker in the frame it
  // closed, a keyboard trap on the one row a user creates most.
  React.useEffect(() => {
    if (!fieldAutoOpen || pickerOpen) return
    if (!locked) setPickerOpen(true)
    focusStore.set({ id: rule.id, segment: "field", autoOpen: false })
  }, [fieldAutoOpen, pickerOpen, locked, focusStore, rule.id])

  // Re-seed on each open, so a browse that was abandoned last time does not
  // decide where this one starts.
  React.useEffect(() => {
    if (!pickerOpen) return
    setPickerPath(rule.path.slice(0, -1))
    setPickerQuery("")
  }, [pickerOpen, rule.path])

  /* ------------------------------- tab stop ------------------------------- */

  const slot = filterCombinatorSlot(position.index)
  const reorderable = useFilterReorderable()
  const canMove = reorderable && canFilterNodeMove(query, position)
  const rowStateStore = useFilterRowStateStore()
  // Still waiting for its attribute, so neither later cell is drawn.
  const pending = useFilterRowPending(rule.id)

  const columns = React.useMemo(() => {
    const list: FilterColumn[] = []
    if (slot === "toggle") list.push("combinator")
    list.push("field")
    if (!pending) {
      list.push("operator")
      if (takesValue) list.push("value")
    }
    // The grip is only a tab stop when it is drawn.
    if (canMove) list.push("drag")
    list.push("menu")
    return list
  }, [slot, takesValue, canMove, pending])

  const active = useActiveColumn(
    rule.id,
    columns,
    position.depth === 1 && position.index === 0
  )

  const onCellFocus = React.useCallback(
    (column: FilterColumn) => () =>
      focusStore.set({ id: rule.id, segment: column, autoOpen: false }),
    [focusStore, rule.id]
  )

  /* -------------------------------- render -------------------------------- */

  if (!field) return null

  return (
    <div
      /* A GROUP, not a grid row: four depths of grid describes to no
         assistive technology at all. */
      role="group"
      aria-label={actions.labels.rowLabel(
        `${pathText} ${operatorLabel}`,
        position.depth
      )}
      data-slot="filter-row"
      data-node-id={rule.id}
      data-parent-id={position.parentId}
      data-index={position.index}
      data-depth={position.depth}
      className={cn("group/row", ROW_BAND_CLASS, DROP_INDICATOR)}
    >
      <div className={cn(COMBINATOR_CLASS, CELL_BOX_CLASS)}>
        <CombinatorCell
          index={position.index}
          parentId={position.parentId}
          combinator={position.combinator}
          active={active}
          onFocus={onCellFocus}
        />
      </div>

      {/* THE CONTENT BAND: sized to itself, not to a share of the row. */}
      <div className={CONTENT_BAND_CLASS}>
        <div className={cn(CELL_BOX_CLASS, FIELD_CELL_CLASS)}>
          <Popover
            open={pickerOpen}
            onOpenChange={(next) => {
              if (next && locked) return
              setPickerOpen(next)
            }}
          >
            <PopoverTrigger
              disabled={actions.disabled}
              {...filterReadOnlyProps(actions)}
              render={
                <Button
                  variant="outline"
                  size={sizes.button}
                  /* The path is truncated on screen, so the name carries all
                     of it: "Primary loca... > State" identifies nothing. */
                  aria-label={pathText}
                  /* And as a `title` - unless the path is COLLAPSED, where the
                     ellipsis inside already carries this exact sentence. */
                  title={pathCollapsed ? undefined : pathText}
                  className={CELL_CLASS}
                  {...cellProps("field", active)}
                  onFocus={onCellFocus("field")}
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    {field.icon}
                    <span className="truncate">{pathLabel}</span>
                  </span>
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                  />
                </Button>
              }
            />
            <PopoverContent
              align="start"
              className={cn(
                FILTER_FIELD_PICKER_CLASS,
                actions.fieldPickerClassName
              )}
            >
              <FilterFieldPicker<V, O>
                path={pickerPath}
                onPathChange={setPickerPath}
                query={pickerQuery}
                onQueryChange={setPickerQuery}
                onSelect={(path, defaultOperator) => {
                  setPickerOpen(false)
                  // BUILDING versus AMENDING, the fork of the stepped
                  // flow. Naming `operator` retires the field handoff.
                  focusStore.set({
                    id: rule.id,
                    segment: pending ? "operator" : "field",
                    autoOpen: pending,
                  })
                  // BEFORE the same-path early return, or a row minted
                  // on a guessed field the user then picks stays pending.
                  rowStateStore.resolvePending(rule.id)
                  // Re-picking the field it has is a dismissal.
                  if (joinFilterPath(path) === joinFilterPath(rule.path)) return
                  // On the create path the condition stays UNSET, so the
                  // menu opening next has nothing selected.
                  actions.updateRule(rule.id, {
                    path,
                    operator: pending ? "" : (defaultOperator ?? ""),
                    value: undefined,
                  })
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {pending ? null : (
          <div className={cn(CELL_BOX_CLASS, OPERATOR_CELL_CLASS)}>
            <FilterOperatorPopover
              rule={rule}
              field={field}
              trigger={
                <Button
                  variant="outline"
                  size={sizes.button}
                  /* No `aria-label`: the label IS the name. */
                  title={operatorLabel}
                  className={cn(
                    CELL_CLASS,
                    CELL_INVALID_CLASS,
                    "text-muted-foreground"
                  )}
                  {...cellProps("operator", active)}
                  {...issueProps(issue, "operator", issueText)}
                  onFocus={onCellFocus("operator")}
                >
                  <span className="truncate">{operatorLabel}</span>
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                  />
                </Button>
              }
            />
          </div>
        )}

        {/* The cell stays even with no value: dropping it would shift the
            trailing buttons into the value column on that row alone. It goes
            ENTIRELY while the row is PENDING, the one case that argument does
            not cover: a row choosing its attribute has no column count yet. */}
        {pending ? null : (
          <div
            className={cn(
              CELL_BOX_CLASS,
              VALUE_CELL_CLASS,
              /* The positioning context for an inline editor's error mark. */
              "relative",
              /* What lets an inline box match the buttons beside it: as tall as
                 the row, so `h-full` inside resolves to the button height. */
              "self-stretch"
            )}
          >
            {takesValue ? (
              inlineValue ? (
                <FilterInlineValueCell<V, O>
                  rule={rule}
                  field={field}
                  issue={issue}
                  issueText={issueText}
                  active={active}
                  onFocus={onCellFocus}
                />
              ) : (
                <FilterValuePopover
                  rule={rule}
                  field={field}
                  operator={operator}
                  trigger={
                    <Button
                      variant="outline"
                      size={sizes.button}
                      /* The VALUE is the name, never the attribute.
                         Locked, it grows to the whole list. */
                      aria-label={locked ? valueFullText : valueText}
                      title={valueFullText}
                      className={cn(
                        CELL_CLASS,
                        CELL_INVALID_CLASS,
                        "h-full",
                        valueEmpty && "text-muted-foreground"
                      )}
                      {...cellProps("value", active)}
                      {...issueProps(issue, "value", issueText)}
                      onFocus={onCellFocus("value")}
                    >
                      {/* FREE OUTPUT: whatever the field draws. */}
                      <span className="min-w-0 flex-1 truncate text-start">
                        {valueLabel}
                      </span>
                      {/* The error, INSIDE the control that failed. */}
                      <RowIssueHint message={issueText} />
                    </Button>
                  }
                />
              )
            ) : null}
          </div>
        )}
      </div>

      {/* The WEIGHT is on the CLUSTER: a `ghost` button names no colour, so
          the kebab took the full `--foreground`. */}
      <div className={ACTION_BAND_CLASS}>
        {canMove ? (
          <RowHandle nodeId={rule.id} active={active} onFocus={onCellFocus} />
        ) : null}
        <DropdownMenu
          open={menuOpen}
          onOpenChange={(next) => {
            if (next && locked) return
            setMenuOpen(next)
          }}
        >
          <DropdownMenuTrigger
            disabled={actions.disabled}
            {...filterReadOnlyProps(actions)}
            render={
              <Button
                variant="ghost"
                size={sizes.icon}
                aria-label={actions.labels.chipMenu(field.label)}
                className={ACTION_CONTROL_CLASS}
                {...cellProps("menu", active)}
                onFocus={onCellFocus("menu")}
              />
            }
          >
            <IconPlaceholder
              lucide="EllipsisVerticalIcon"
              tabler="IconDotsVertical"
              hugeicons="MoreVerticalIcon"
              phosphor="DotsThreeVerticalIcon"
              remixicon="RiMoreLine"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(FILTER_MENU_CLASS, actions.menuClassName)}
          >
            {/* Grouping is HERE, not on a chip: the keyboard path to
                `a AND (b OR c)`. */}
            <FilterRuleMenuItems ruleId={rule.id} allowGrouping />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/** One rule, as a row, memoized: the query tree shares structure, so editing
 * one row of twenty re-renders one. */
export const FilterAdvancedRow = React.memo(
  FilterAdvancedRowImpl
) as typeof FilterAdvancedRowImpl

/** A rule whose field the schema no longer has: dropping it would lose a saved
 * view's data, rendering nothing would leave it filtering invisibly. */
function FilterUnknownRow<V>({
  rule,
  position,
}: {
  rule: FilterRule<V>
  position: RowPosition
}) {
  const actions = useFilterActions()
  const sizes = filterControlSizes(actions)
  return (
    <div
      role="group"
      aria-label={actions.labels.rowLabel(
        rule.path.join(actions.labels.pathSeparator),
        position.depth
      )}
      data-slot="filter-row"
      data-node-id={rule.id}
      data-parent-id={position.parentId}
      data-index={position.index}
      data-depth={position.depth}
      data-unknown=""
      /* The DROP language too: the hit test pushes every row carrying
         `data-parent-id` into the surface, and this row carries one. */
      className={cn(ROW_BAND_CLASS, DROP_INDICATOR)}
    >
      <span className="text-muted-foreground min-w-0 flex-1 truncate text-sm">
        {rule.path.join(actions.labels.pathSeparator)}
      </span>
      {/* The same trailing band, so the broken row lands on the kebab column. */}
      <div className={ACTION_BAND_CLASS}>
        <Button
          variant="ghost"
          size={sizes.icon}
          aria-label={actions.labels.remove}
          className={ACTION_CONTROL_CLASS}
          /* Outside the roving scheme: a real tab stop keeps it removable. */
          data-filter-cell="remove"
          /* It had no gate, so the one row whose purpose is to be removed
             could be removed from a read-only bar. */
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={() => actions.removeNode(rule.id)}
        >
          <IconPlaceholder
            lucide="XIcon"
            tabler="IconX"
            hugeicons="Cancel01Icon"
            phosphor="XIcon"
            remixicon="RiCloseLine"
          />
        </Button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Group                                   */
/* -------------------------------------------------------------------------- */

/** A nested group: an indented card, its conditions, and one way to add
 * another. The HEADLINE went; the pill outside already says "or". */
function FilterAdvancedGroup<V, O>({
  group,
  position,
}: {
  group: FilterGroupNode<V>
  position: RowPosition
}) {
  const actions = useFilterActions<V, O>()
  const sizes = filterControlSizes(actions)
  const focusStore = useFilterFocusStore()

  const { query } = useFilterState<V>()

  const issue = useFilterIssue(group.id)
  const issueText = issue ? filterIssueLabel(issue, actions.labels) : ""

  const reorderable = useFilterReorderable()
  const canMove = reorderable && canFilterNodeMove(query, position)
  const rowStateStore = useFilterRowStateStore()

  const slot = filterCombinatorSlot(position.index)
  const columns = React.useMemo(() => {
    const list: FilterColumn[] = []
    if (slot === "toggle") list.push("combinator")
    // DOM order, which the arrow walker reads: a group's own controls are all
    // in its footer now, add first and the trailing pair after it.
    list.push("add")
    if (canMove) list.push("drag")
    list.push("menu")
    return list
  }, [slot, canMove])

  const active = useActiveColumn(
    group.id,
    columns,
    position.depth === 1 && position.index === 0
  )

  const onCellFocus = React.useCallback(
    (column: FilterColumn) => () =>
      focusStore.set({ id: group.id, segment: column, autoOpen: false }),
    [focusStore, group.id]
  )

  const description =
    group.combinator === "and"
      ? actions.labels.groupAll
      : actions.labels.groupAny

  const addInto = () => {
    const id = addFilterRow(actions, group.id)
    if (!id) return
    rowStateStore.markPending(id)
    focusStore.set({ id, segment: "field", autoOpen: true })
  }

  return (
    <div
      role="group"
      aria-label={actions.labels.groupLabel(description, position.depth)}
      data-slot="filter-row"
      data-node-id={group.id}
      data-parent-id={position.parentId}
      data-index={position.index}
      data-depth={position.depth}
      /* `flex-wrap` is the whole of the narrow-panel fix. `items-center`
         measures the flex line, so the pill centres on the card. */
      className={cn("flex flex-wrap items-center gap-1.5", DROP_SLOT_INDICATOR)}
    >
      <div
        className={cn(
          COMBINATOR_CLASS,
          CELL_BOX_CLASS,
          GROUP_COMBINATOR_WRAP_CLASS
        )}
      >
        <CombinatorCell
          index={position.index}
          parentId={position.parentId}
          combinator={position.combinator}
          active={active}
          onFocus={onCellFocus}
          className={GROUP_COMBINATOR_WRAPPED_CLASS}
        />
      </div>

      {/* The CARD lights up as the drop destination, not the header strip the
          engine measured. This `data-invalid` only styles; the announcement
          rides the footer's add button, which is the focusable control. */}
      <div
        data-slot="filter-group"
        data-invalid={issue ? "" : undefined}
        className={GROUP_CARD_CLASS}
      >
        {/* Eight pixels, because it is a DROP TARGET and a zone beats a row. */}
        <div
          data-slot="filter-group-header"
          className="flex h-2 items-center"
          /* The TOP of the card means the top of the list: index 0 PREPENDS.
             It used to append, so the one place a pointer can aim to say "into
             this group" put the row at the far other end of it. */
          data-drop-parent={group.id}
          data-drop-index={0}
        />

        {/* A CONTAINER: the box every child row divides up. */}
        <div
          className={cn(
            TRACK_CONTAINER_CLASS,
            "flex flex-col",
            FILTER_ROW_GAP_CLASS
          )}
        >
          {group.rules.length === 0 ? (
            <p
              className={cn(
                /* 70% foreground, not the muted token: on the card's tint the
                   muted foreground measured 4.35:1 in light, under 4.5:1 AA. */
                "text-foreground/70 rounded-md border border-dashed px-2 py-3",
                "text-center text-xs",
                "data-drop-into:border-primary/60 data-drop-into:bg-primary/5",
                "data-drop-into:text-primary"
              )}
              data-slot="filter-group-empty"
              data-drop-parent={group.id}
              data-drop-index={0}
            >
              {actions.labels.groupPlaceholder}
            </p>
          ) : (
            group.rules.map((node, index) => (
              <FilterAdvancedNode<V, O>
                key={node.id}
                node={node}
                position={{
                  index,
                  parentId: group.id,
                  combinator: group.combinator,
                  depth: position.depth + 1,
                }}
              />
            ))
          )}
        </div>

        {/* `flex-nowrap`, or the group's kebab leaves the kebab column. */}
        <div
          data-slot="filter-group-footer"
          className="text-muted-foreground flex flex-nowrap items-center gap-2 pt-2 pb-2"
          data-drop-parent={group.id}
          data-drop-index={group.rules.length}
        >
          <Button
            variant="outline"
            size={sizes.button}
            aria-label={actions.labels.addToGroup}
            className={cn(
              /* `shrink` and not merely `min-w-0`: `shrink-0` is baked into
                 the shadcn button's own base class. */
              "min-w-0 shrink font-normal",
              "overflow-hidden",
              CELL_INVALID_CLASS
            )}
            disabled={actions.disabled}
            {...filterReadOnlyProps(actions)}
            {...cellProps("add", active)}
            /* An EMPTY group is flagged on the control that fills it. */
            {...issueProps(issue, "group", issueText)}
            onFocus={onCellFocus("add")}
            onClick={addInto}
          >
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
            {actions.labels.addCondition}
          </Button>

          <div className={cn("ms-auto", ACTION_BAND_CLASS)}>
            {canMove ? (
              <RowHandle
                nodeId={group.id}
                active={active}
                onFocus={onCellFocus}
              />
            ) : null}
            <FilterGroupMenu
              group={group}
              active={active}
              onFocus={onCellFocus}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/** A group's kebab. A menu row affords six words, where two icons said none. */
function FilterGroupMenu<V>({
  group,
  active,
  onFocus,
}: {
  group: FilterGroupNode<V>
  active: FilterColumn | null
  onFocus: (column: FilterColumn) => () => void
}) {
  const actions = useFilterActions()
  const sizes = filterControlSizes(actions)
  const locked = isFilterLocked(actions)
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        if (next && locked) return
        setOpen(next)
      }}
    >
      <DropdownMenuTrigger
        disabled={actions.disabled}
        {...filterReadOnlyProps(actions)}
        render={
          <Button
            variant="ghost"
            size={sizes.icon}
            aria-label={actions.labels.groupMenu}
            className={ACTION_CONTROL_CLASS}
            {...cellProps("menu", active)}
            onFocus={onFocus("menu")}
          />
        }
      >
        <IconPlaceholder
          lucide="EllipsisVerticalIcon"
          tabler="IconDotsVertical"
          hugeicons="MoreVerticalIcon"
          phosphor="DotsThreeVerticalIcon"
          remixicon="RiMoreLine"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(FILTER_MENU_CLASS, actions.menuClassName)}
      >
        <DropdownMenuItem
          disabled={locked}
          onClick={() => actions.duplicateNode(group.id)}
        >
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy01Icon"
            phosphor="CopyIcon"
            remixicon="RiFileCopyLine"
            aria-hidden="true"
          />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.duplicate}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={locked}
          onClick={() => actions.unwrapGroup(group.id)}
        >
          {/* The inverse of the row menu's layers glyph. */}
          <IconPlaceholder
            lucide="UngroupIcon"
            tabler="IconStackPop"
            hugeicons="UngroupItemsIcon"
            phosphor="StackMinusIcon"
            remixicon="RiSplitCellsHorizontal"
            aria-hidden="true"
          />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.ungroup}
          </span>
        </DropdownMenuItem>
        <FilterMoveToMenuItems nodeId={group.id} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={locked}
          onClick={() => actions.removeNode(group.id)}
        >
          {/* No colour: the destructive variant paints the row's svgs. */}
          <IconPlaceholder
            lucide="Trash2Icon"
            tabler="IconTrash"
            hugeicons="Delete02Icon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
            aria-hidden="true"
          />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.removeGroup}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function FilterAdvancedNode<V, O>({
  node,
  position,
}: {
  node: FilterNode<V>
  position: RowPosition
}) {
  const actions = useFilterActions<V, O>()

  if (!isFilterRule(node)) {
    return <FilterAdvancedGroup<V, O> group={node} position={position} />
  }
  if (!getFilterField(actions.index, node.path)) {
    return <FilterUnknownRow<V> rule={node} position={position} />
  }
  return <FilterAdvancedRow<V, O> rule={node} position={position} />
}

/* -------------------------------------------------------------------------- */
/*                                   Adding                                   */
/* -------------------------------------------------------------------------- */

/** Appends a condition on the first attribute anyone may filter on, at any
 * depth. `isFilterFieldPickable` is the picker's own rule. */
function addFilterRow<V, O>(
  actions: FilterActionsContextValue<V, O>,
  parentId?: string
): string | null {
  // Before `nextId` and before `addRule`: while the store points at a row that
  // was never created, the whole panel drops out of the tab order.
  if (isFilterLocked(actions)) return null

  const entry = actions.index.all.find((candidate) =>
    isFilterFieldPickable(candidate.field)
  )
  if (!entry) return null

  const id = actions.nextId()
  actions.addRule(
    createFilterRule<V>({
      id,
      path: entry.path,
      // Deliberately empty: the row arrives PENDING, and a seeded default
      // would open the next menu with its own answer highlighted.
      operator: "",
    }),
    parentId
  )
  return id
}

/* -------------------------------------------------------------------------- */
/*                                    Panel                                   */
/* -------------------------------------------------------------------------- */

/** The panel draws NO border, NO background and NO radius, and takes no
 * element to be drawn as: a surface is the page's decision. */
export interface FiltersAdvancedPanelProps {
  /** Which of the two boxes the panel sits in, the only thing deciding whether
   * it pads itself: a popover's content is `p-0`, so this padding IS its
   * inner padding, and `"inline"` is a page that owns its own. */
  mode?: "popover" | "inline"
  /** Replaces the empty state for this panel only. Wins over
   * `Filters.renderEmpty`, the precedence a field has over the root's. */
  renderEmpty?: (context: FilterEmptyStateContext) => React.ReactNode
  /** Whether rows can be reordered. See `FiltersProps.reorderable`. */
  reorderable?: boolean
  className?: string
}

/** The builder itself: nested groups over the query tree the chips read. A
 * group is a parenthesised list joined by ONE operator, so nesting is a real
 * tree: a flat model cannot represent `a AND (b OR c)` without inventing
 * precedence, and invented precedence returns the wrong rows. */
export function FiltersAdvancedPanel<V, O>({
  mode = "popover",
  renderEmpty,
  reorderable = false,
  className,
}: FiltersAdvancedPanelProps) {
  const actions = useFilterActions<V, O>()
  const panelRender = useFilterRender<V, O>()
  const sizes = filterControlSizes(actions)
  const { query, ruleCount, announcement, announcementSeq } =
    useFilterState<V>()
  const focusStore = useFilterFocusStore()
  const rowStateStore = useFilterRowStateStore()
  // A version counter, because the store is mutable and stable by identity.
  const rowStateVersion = React.useSyncExternalStore(
    rowStateStore.subscribe,
    () => rowStateStore.version(),
    () => 0
  )
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const locked = isFilterLocked(actions)

  /* ------------------------------ validation ------------------------------ */

  /** What is unfinished, computed ONCE: an empty group is a fact about a
   * group, not about any row inside it. */
  const issues = React.useMemo(
    () =>
      collectFilterIssues(
        query,
        (rule) => {
          const field = getFilterField(actions.index, rule.path)
          if (!field) return null
          return getFilterArity(
            getFilterOperator(actions.resolveOperators(field), rule.operator)
          )
        },
        // The same normalisation the display callbacks get.
        (rule) => {
          const field = getFilterField(actions.index, rule.path)
          if (!field?.validate) return null
          const operator = getFilterOperator(
            actions.resolveOperators(field),
            rule.operator
          )
          if (!operator) return null
          return field.validate({
            value: rule.value,
            values:
              rule.value === undefined || rule.value === null
                ? []
                : Array.isArray(rule.value)
                  ? (rule.value as unknown[])
                  : [rule.value],
            field,
            operator,
            arity: getFilterArity(operator) ?? "one",
            rule,
            labels: actions.labels,
          })
        }
      ),
    [query, actions]
  )

  /** Every issue, keyed by node: what the tree IS, drawn or not. */
  const issueMap = React.useMemo(
    () => new Map(issues.map((issue) => [issue.nodeId, issue])),
    [issues]
  )

  /** The issues a row may DRAW: the ones on a value committed once. */
  const visibleIssueMap = React.useMemo(() => {
    const visible = new Map<string, FilterIssue>()
    for (const issue of issues) {
      // CUSTOM ONLY. The built-in reasons describe a row as HALF BUILT,
      // so every Add filter produced a red row on the happy path.
      if (issue.reason !== "custom") continue
      if (rowStateStore.has(issue.nodeId)) visible.set(issue.nodeId, issue)
    }
    return visible
  }, [issues, rowStateStore, rowStateVersion])

  /** Says out loud that a VISIBLE error has appeared, which would
   * otherwise happen in silence. The DRAWN issues, on a RISE only. */
  const announcedIssues = React.useRef({
    count: visibleIssueMap.size,
    seq: announcementSeq,
  })
  React.useEffect(() => {
    const before = announcedIssues.current
    announcedIssues.current = {
      count: visibleIssueMap.size,
      seq: announcementSeq,
    }
    if (announcementSeq !== before.seq) return
    if (visibleIssueMap.size <= before.count) return
    actions.announce(actions.labels.issueSummary(visibleIssueMap.size))
  }, [visibleIssueMap, announcementSeq, actions])

  /** Sends focus to the first thing that needs it. Walked and not selected
   * by id: a node id is consumer-supplied, and `CSS.escape` is not
   * optional in a hand-built selector. */
  const focusFirstIssue = React.useCallback(() => {
    const first = issues[0]
    const body = bodyRef.current
    if (!first || !body) return
    const row = Array.from(
      body.querySelectorAll<HTMLElement>(ROW_SELECTOR)
    ).find((candidate) => candidate.dataset.nodeId === first.nodeId)
    if (!row) return
    // A group's issue is drawn on the add button that resolves it.
    const column = first.column === "group" ? "add" : first.column
    const target = ownCells(row).find(
      (cell) => cell.getAttribute(CELL_ATTRIBUTE) === column
    )
    target?.focus()
  }, [issues])

  /* ---------------------------- focus recovery ---------------------------- */

  /** Whether the panel, or a menu of its own, held focus a moment ago. A
   * blur WITH a `relatedTarget` is focus arriving somewhere real; a blur
   * with none, or none at all when the element is simply removed, is what
   * this exists to repair. */
  const heldFocus = React.useRef(false)
  const addRowRef = React.useRef<HTMLButtonElement>(null)

  /** Puts focus back after a mutation that destroyed the thing holding it:
   * measured at 50, 200, 600 and 1200ms after Convert to group, Remove,
   * Ungroup and Move to group, `document.activeElement` was the BODY,
   * because a menu restores focus to a trigger the action unmounted. */
  const restoreFocus = React.useCallback(() => {
    // A handoff is mid-air and owns focus: between one step being answered
    // and the next opening `document.activeElement` IS the body.
    if (focusStore.getSnapshot().autoOpen) return
    if (!heldFocus.current) return
    const active = document.activeElement
    if (active && active !== document.body) return
    const rows = Array.from(
      bodyRef.current?.querySelectorAll<HTMLElement>(ROW_SELECTOR) ?? []
    )
    const { id, segment } = focusStore.getSnapshot()
    const row = id
      ? rows.find((candidate) => candidate.dataset.nodeId === id)
      : undefined
    const cells = row ? ownCells(row) : []
    const target =
      cells.find((entry) => entry.getAttribute(CELL_ATTRIBUTE) === segment) ??
      cells[0] ??
      (rows[0] ? ownCells(rows[0])[0] : undefined) ??
      addRowRef.current ??
      undefined
    target?.focus()
  }, [focusStore])

  // In the passive effect, not a frame later: React removes the control in
  // the mutation phase, so a menu's restore then aims at a detached node.
  React.useEffect(() => {
    restoreFocus()
  }, [query, announcementSeq, restoreFocus])

  /* -------------------------------- adding -------------------------------- */

  const addRow = React.useCallback(() => {
    const id = addFilterRow(actions)
    if (!id) return
    // PENDING until the attribute is chosen, the first of three questions.
    rowStateStore.markPending(id)
    focusStore.set({ id, segment: "field", autoOpen: true })
  }, [actions, focusStore, rowStateStore])

  const addGroup = React.useCallback(() => {
    const id = actions.addGroup()
    // An empty id means it refused, and focusing a group never created
    // would strand the tab stop.
    if (!id) return
    // Onto the group's own chrome, not into it: it arrives empty.
    focusStore.set({ id, segment: "add", autoOpen: false })
  }, [actions, focusStore])

  /* ------------------------------- keyboard ------------------------------- */

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      `[${CELL_ATTRIBUTE}]`
    )
    // A key pressed inside an open popover belongs to that popover; its
    // content is portaled out, so this is belt and braces.
    //
    // ArrowDown never reaches here: Base UI stops it at the menu trigger.
    if (!cell || event.target !== cell) return

    const body = bodyRef.current
    const row = cell.closest<HTMLElement>(ROW_SELECTOR)
    if (!body || !row) return

    /* A cell the user TYPES into keeps the keys that edit text; only the
       VERTICAL keys stay. */
    const editing = cell.hasAttribute(CELL_INPUT_ATTRIBUTE)

    // DOM order for the two places that mean "the whole builder".
    const rows = Array.from(body.querySelectorAll<HTMLElement>(ROW_SELECTOR))
    const cells = ownCells(row)
    const rowIndex = rows.indexOf(row)
    const cellIndex = cells.indexOf(cell)

    const rtl = getComputedStyle(cell).direction === "rtl"
    const forward = rtl ? "ArrowLeft" : "ArrowRight"
    const backward = rtl ? "ArrowRight" : "ArrowLeft"

    const focus = (target: HTMLElement | undefined) => {
      if (!target) return
      event.preventDefault()
      target.focus()
    }

    const from = cell.getAttribute(CELL_ATTRIBUTE) as FilterColumn
    const band = (CONTENT_COLUMNS as readonly FilterColumn[]).includes(from)
      ? CONTENT_COLUMNS
      : ACTION_COLUMNS

    /* The rows that draw a cell in this BAND, in cell order: by ROW it went
       BACKWARDS at +212, -166, +122, -76, +38 pixels once a group's own
       controls moved to its footer. */
    const bandRows: HTMLElement[] = []
    const seen = new Set<HTMLElement>()
    for (const entry of body.querySelectorAll<HTMLElement>(
      `[${CELL_ATTRIBUTE}]`
    )) {
      const column = entry.getAttribute(CELL_ATTRIBUTE) as FilterColumn
      if (!(band as readonly FilterColumn[]).includes(column)) continue
      const owner = entry.closest<HTMLElement>(ROW_SELECTOR)
      if (!owner || seen.has(owner)) continue
      seen.add(owner)
      bandRows.push(owner)
    }
    const bandIndex = bandRows.indexOf(row)

    const focusRow = (step: number) => {
      const nextRow = bandRows[bandIndex + step]
      if (!nextRow) return
      const cellsThere = ownCells(nextRow)
      const byColumn = new Map(
        cellsThere.map((entry) => [entry.getAttribute(CELL_ATTRIBUTE), entry])
      )
      // The band, then anything at all, which keeps a consumer's cell
      // reachable.
      focus(nearestColumn(band, from, byColumn) ?? cellsThere[0])
    }

    const nodeId = row.dataset.nodeId
    if (!nodeId) return

    // Alt reorders rather than navigates, within the owning group only:
    // changing depth with an arrow would make one gesture mean two things.
    if (
      event.altKey &&
      (event.key === "ArrowUp" || event.key === "ArrowDown")
    ) {
      // Plain arrows, Home and End are deliberately NOT gated.
      if (locked || !reorderable) return
      event.preventDefault()
      actions.moveNode(nodeId, event.key === "ArrowDown" ? 1 : -1)
      return
    }

    if (event.key === "ArrowDown") return focusRow(1)
    if (event.key === "ArrowUp") return focusRow(-1)
    if (editing) return

    if (event.key === forward) return focus(cells[cellIndex + 1])
    if (event.key === backward) return focus(cells[cellIndex - 1])
    if (event.key === "Home") {
      return focus(event.ctrlKey ? ownCells(rows[0])[0] : cells[0])
    }
    if (event.key === "End") {
      const scope = event.ctrlKey ? ownCells(rows[rows.length - 1]) : cells
      return focus(scope[scope.length - 1])
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      if (locked) return
      event.preventDefault()
      actions.removeNode(nodeId)
      // Focus the row that takes this one's place, so removing several
      // does not throw focus to the body.
      requestAnimationFrame(() => {
        const remaining = Array.from(
          bodyRef.current?.querySelectorAll<HTMLElement>(ROW_SELECTOR) ?? []
        )
        const target = remaining[Math.min(rowIndex, remaining.length - 1)]
        if (target) ownCells(target)[0]?.focus()
      })
    }
  }

  /* --------------------------------- drag --------------------------------- */

  /** Pointer drag, not HTML5 drag and drop: its drag image is a
   * browser-owned snapshot no copy badge can be drawn on, and a nested
   * drop would mean hit-testing on every `dragover`. */
  const dragProps = useFilterRowDrag({
    // THE PANEL, reached through the body, because the top level's append
    // zone is in the FOOTER and the footer is the body's sibling.
    root: () => bodyRef.current?.parentElement ?? null,
    disabled: locked,
    onDrop: (nodeId, drop) => {
      if (drop.copy) actions.copyNodeTo(nodeId, drop.parentId, drop.index)
      else actions.moveNodeTo(nodeId, drop.parentId, drop.index)
    },
  })

  /* -------------------------------- render -------------------------------- */

  const panelProps = {
    // The panel's programmatic NAME. `group`, because the rows inside are
    // groups too, so the tree reads as a query rather than as a landmark.
    role: "group",
    "aria-label": actions.labels.advancedFilter,
    // WHAT IS IN IT, on entry, for a reader who did not press the trigger.
    // The read-only half rides along: `aria-readonly` is illegal here.
    "aria-description": actions.readOnly
      ? `${actions.labels.countAnnouncement(ruleCount)} ${actions.labels.readOnly}`
      : actions.labels.countAnnouncement(ruleCount),
    "data-slot": "filters-advanced",
    "data-readonly": actions.readOnly || undefined,
    // Capture, and on the PANEL, so portaled menus report too.
    onFocusCapture: () => {
      heldFocus.current = true
    },
    onBlurCapture: (event: React.FocusEvent) => {
      if (event.relatedTarget) heldFocus.current = false
    },
  } as const

  /** The empty state, resolved once: the panel's own prop, else the root's.
   * Assembled here so a replacement gets the SAME two actions the footer
   * calls, focus handoff included. */
  const renderEmptyState = renderEmpty ?? panelRender.renderEmpty
  const emptyState = renderEmptyState
    ? renderEmptyState({
        labels: actions.labels,
        readOnly: Boolean(actions.readOnly),
        mode,
        addFilter: addRow,
        addGroup,
      })
    : null

  const body = (
    <>
      {/* VISIBLE, not an ARIA attribute: `aria-readonly` is illegal on every
          role here, and dimmed controls owe the reader a reason. */}
      {actions.readOnly ? (
        <p
          data-slot="filters-readonly"
          className={cn("text-muted-foreground text-xs", PANEL_GUTTER_CLASS)}
        >
          {actions.labels.readOnly}
        </p>
      ) : null}

      {query.rules.length > 0 ? (
        <div
          ref={bodyRef}
          data-slot="filters-advanced-body"
          /* NO `overflow-x`: nothing here is ever wider than its box. */
          className={cn(
            TRACK_CONTAINER_CLASS,
            "flex min-w-0 flex-col",
            FILTER_ROW_GAP_CLASS,
            PANEL_GUTTER_CLASS
          )}
          onKeyDown={onKeyDown}
        >
          <FilterReorderProvider value={reorderable}>
            <FilterDragContext.Provider value={reorderable ? dragProps : null}>
              <FilterIssueContext.Provider value={visibleIssueMap}>
                {query.rules.map((node, index) => (
                  <FilterAdvancedNode<V, O>
                    key={node.id}
                    node={node}
                    position={{
                      index,
                      parentId: query.id,
                      combinator: query.combinator,
                      depth: 1,
                    }}
                  />
                ))}
              </FilterIssueContext.Provider>
            </FilterDragContext.Provider>
          </FilterReorderProvider>
        </div>
      ) : /*
          THE EMPTY STATE, a real state and not a missing one: with no rules
          the body renders nothing, so the panel used to open as a footer
          floating in a blank popover. The HINT is withheld when the bar is
          locked, since it points at two disabled buttons.
        */
      // The CALLBACK's presence decides, not its result: a consumer returning
      // null wants a blank panel, and `??` would hand them the default back.
      renderEmptyState ? (
        emptyState
      ) : (
        <div
          data-slot="filters-advanced-empty"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-8 text-center",
            PANEL_GUTTER_CLASS
          )}
        >
          <span
            aria-hidden="true"
            /* `rounded-full` is the one radius literal safe in every
               style, square or round. */
            className="bg-muted text-muted-foreground mb-1 flex size-9 items-center justify-center rounded-full [&_svg]:size-4"
          >
            <IconPlaceholder
              lucide="ListFilterIcon"
              tabler="IconFilter2"
              hugeicons="FilterMailIcon"
              phosphor="FunnelSimpleIcon"
              remixicon="RiFilter3Line"
            />
          </span>
          <p className="text-sm font-medium">{actions.labels.builderEmpty}</p>
          {actions.readOnly ? null : (
            <p className="text-muted-foreground text-xs">
              {actions.labels.builderEmptyHint}
            </p>
          )}
        </div>
      )}

      {/* `shrink-0` on all three: a button clips its label rather than
          reflowing it, so Clear all read as "ear all filters". */}
      <div
        data-slot="filters-advanced-footer"
        /* THE APPEND TARGET FOR THE TOP LEVEL, which every group's footer had
           and the root did not: at depth the strip under the last row is a 48px
           "put it here", while at the root it was 47px of `no-drop`. */
        data-drop-parent={query.id}
        data-drop-index={query.rules.length}
        className={cn(
          "relative flex flex-wrap items-center gap-2",
          PANEL_GUTTER_CLASS,
          /* FOUR PIXELS MORE than the gutter, which is what a row's action
             band spends after its kebab. */
          "pe-[calc(var(--filter-panel-pad)+4px)]",
          FOOTER_DROP_CLASS,
          /* The strip's BOX reaches the body's bottom edge and pads its
             content back down, so the append zone TILES with the last row.
             `pt-5` and not `pt-2`: the row above already grows 4px into this
             strip, so at `pt-2` the toolbar read as the last filter's tail. */
          query.rules.length > 0 && cn(FILTER_ROW_GAP_CANCEL_CLASS, "pt-5")
        )}
      >
        <Button
          /* The last resort of `restoreFocus`: the only control that exists
             at every query. */
          ref={addRowRef}
          /* OUTLINE, and the only pair in the panel with a box: they are
             what the footer is FOR. */
          variant="outline"
          size={sizes.button}
          className="shrink-0 font-normal"
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={addRow}
        >
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
          />
          {actions.labels.addCondition}
        </Button>

        <Button
          variant="outline"
          size={sizes.button}
          className="shrink-0 font-normal"
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={addGroup}
        >
          <IconPlaceholder
            lucide="FolderPlusIcon"
            tabler="IconFolderPlus"
            hugeicons="FolderAddIcon"
            phosphor="FolderPlusIcon"
            remixicon="RiFolderAddLine"
          />
          {actions.labels.addConditionGroup}
        </Button>

        {/* NO PANEL-LEVEL SUMMARY: a validator's no belongs on the cell. */}
        {ruleCount > 0 ? (
          <Button
            variant="ghost"
            size={sizes.button}
            className="text-muted-foreground hover:text-foreground ms-auto shrink-0"
            disabled={actions.disabled}
            {...filterReadOnlyProps(actions)}
            onClick={() => actions.clearQuery()}
          >
            {actions.labels.clearAll}
          </Button>
        ) : null}
      </div>

      {/* The `key` is what makes a REPEATED sentence audible: `aria-live`
          fires on a mutation and React writes nothing when the string is
          unchanged, so three presses mutated the region once. */}
      <div aria-live="polite" role="status" className="sr-only">
        <span key={announcementSeq}>{announcement}</span>
      </div>
    </>
  )

  return (
    <div
      {...panelProps}
      /* An inline style because it is a VALUE: one declaration to beat
         rather than three classes in three places. */
      style={
        {
          [PANEL_PAD_VAR]:
            mode === "inline" ? PANEL_PAD_INLINE : PANEL_PAD_POPOVER,
        } as React.CSSProperties
      }
      className={cn(PANEL_CLASS, className)}
    >
      {body}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

export interface FiltersAdvancedProps {
  /** Where the builder lives. `"popover"` hangs it off a trigger; `"inline"`
   * renders the same panel with no popup, for a sidebar or a settings page. */
  mode?: "popover" | "inline"
  /** Replaces the default trigger. Ignored inline. */
  trigger?: React.ReactNode
  /** Whether rows can be reordered. See `FiltersProps.reorderable`. */
  reorderable?: boolean
  /** Popover placement. */
  align?: "start" | "center" | "end"
  className?: string
}

export function FiltersAdvanced<V, O>({
  mode = "popover",
  trigger,
  reorderable = false,
  align = "start",
  className,
}: FiltersAdvancedProps) {
  const actions = useFilterActions<V, O>()
  const sizes = filterControlSizes(actions)
  const { ruleCount } = useFilterState<V>()
  const [open, setOpen] = React.useState(false)

  if (mode === "inline") {
    return (
      <FiltersAdvancedPanel<V, O>
        mode="inline"
        reorderable={reorderable}
        className={className}
      />
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* `actions.disabled` alone, and READ ONLY DELIBERATELY DOES NOT
          GATE IT: opening this panel is reading, not writing. */}
      <PopoverTrigger
        /* On the TRIGGER rather than the button below it, so a consumer's own
           trigger wears the same state. Still `actions.disabled` alone. */
        disabled={actions.disabled}
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button
              variant="outline"
              size={sizes.button}
              /* THE COUNT IN THE NAME, not only in the box: a consumer who
                 replaces `trigger` never had the badge, which is hidden. */
              aria-label={
                ruleCount > 0
                  ? `${actions.labels.advancedFilter}, ${actions.labels.countAnnouncement(ruleCount)}`
                  : undefined
              }
            >
              <IconPlaceholder
                lucide="ListFilterIcon"
                tabler="IconFilter2"
                hugeicons="FilterMailIcon"
                phosphor="FunnelSimpleIcon"
                remixicon="RiFilter3Line"
              />
              {actions.labels.advancedFilter}
              {ruleCount > 0 ? (
                <span
                  aria-hidden="true"
                  className="bg-muted text-muted-foreground rounded-sm px-1.5 text-xs tabular-nums"
                >
                  {ruleCount}
                </span>
              ) : null}
            </Button>
          )
        }
      />
      {/* Wide enough for a nested group to keep real words at depth three;
          the rows truncate rather than wrap. */}
      <PopoverContent
        align={align}
        /* THE POPUP'S OWN NAME: it is a `role="dialog"`, and the panel's is
           one level in, on its `role="group"`. */
        aria-label={actions.labels.advancedFilter}
        className={cn("w-[42rem] max-w-[95vw] p-0", className)}
      >
        {/* `mode` defaults to "popover", which keeps the panel's padding. */}
        <FiltersAdvancedPanel<V, O> reorderable={reorderable} />
      </PopoverContent>
    </Popover>
  )
}
