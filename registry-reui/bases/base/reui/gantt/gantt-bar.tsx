// Title: Gantt Bar
// Description: The interactive gantt bar - selection, clicks, drag + resize wiring, and the consumer render slot.

"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  useGantt,
  useGanttSelector,
  useGanttViewConfig,
} from "@/registry-reui/bases/base/reui/gantt/gantt"
import {
  useGanttGestures,
  wasRecentDrag,
} from "@/registry-reui/bases/base/reui/gantt/gantt-dnd"
import {
  flattenResources,
  toZoned,
} from "@/registry-reui/bases/base/reui/gantt/gantt-lib"
import type {
  GanttOccurrence,
  GanttSegment,
} from "@/registry-reui/bases/base/reui/gantt/gantt-types"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/registry/bases/base/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/registry/bases/base/ui/context-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/**
 * Effective Tailwind palette presets for bar colors; every entry works on
 * light and dark surfaces through the bar's alpha background + accent border.
 */
const GANTT_COLORS: Array<{ name: string; value: string }> = [
  { name: "Blue", value: "var(--color-blue-500)" },
  { name: "Emerald", value: "var(--color-emerald-500)" },
  { name: "Violet", value: "var(--color-violet-500)" },
  { name: "Rose", value: "var(--color-rose-500)" },
  { name: "Amber", value: "var(--color-amber-500)" },
  { name: "Cyan", value: "var(--color-cyan-500)" },
  { name: "Orange", value: "var(--color-orange-500)" },
  { name: "Pink", value: "var(--color-pink-500)" },
  { name: "Teal", value: "var(--color-teal-500)" },
  { name: "Indigo", value: "var(--color-indigo-500)" },
]

interface GanttBarContextValue<TData = unknown> {
  occurrence: GanttOccurrence<TData>
  segment: GanttSegment<TData>
  isDragging: boolean
  isSelected: boolean
}

const GanttBarContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<GanttBarContextValue<any> | null>(null)

/** The bar's subject; usable inside renderEvent content and bar children. */
function useGanttBarContext<TData = unknown>(): GanttBarContextValue<TData> {
  const ctx = useContext(GanttBarContext)
  if (!ctx) {
    throw new Error("useGanttBarContext must be used within <GanttBar>")
  }
  return ctx as GanttBarContextValue<TData>
}

interface GanttBarProps<TData = unknown> extends Omit<
  useRender.ComponentProps<"button">,
  "children"
> {
  segment: GanttSegment<TData>
  /** Replaces the default bar CONTENT; the wrapper stays gantt-owned. */
  children?: ReactNode
  /**
   * The title renders beside the bar (view-owned), so the default inner
   * content is suppressed. Explicit children and renderEvent still win.
   */
  labelOutside?: boolean
  /**
   * The owning row's title for the aria-label. Pass it when the row is in
   * scope (the internal view does); omitting falls back to a tree lookup.
   */
  rowTitle?: string
}

/**
 * The one interactive bar element. The wrapper owns positioning hooks, a11y,
 * selection, drag/resize listeners, and data attributes; content comes from
 * children, the root renderEvent override, or the built-in default.
 */
function GanttBar<TData = unknown>({
  segment,
  className,
  render,
  children,
  labelOutside,
  rowTitle: rowTitleProp,
  ...props
}: GanttBarProps<TData>) {
  const instance = useGantt<TData>()
  const viewConfig = useGanttViewConfig<TData>()
  const gestures = useGanttGestures<TData>()
  const { settings } = instance
  const occurrence = segment.occurrence
  const event = occurrence.event

  const isSelected = useGanttSelector<TData, boolean>(
    (state) => state.selection.eventKeys.includes(occurrence.key),
    { calendar: instance }
  )
  const isDragging = useGanttSelector<TData, boolean>(
    (state) => state.drag?.occurrence.key === occurrence.key,
    { calendar: instance }
  )
  // Which gesture owns this bar: a move hides the original (the smooth clone
  // stands in for it); a resize keeps it as a faint placeholder behind the
  // dashed preview so you can see the original extent.
  const dragKind = useGanttSelector<TData, string | null>(
    (state) =>
      state.drag?.occurrence.key === occurrence.key ? state.drag.kind : null,
    { calendar: instance }
  )
  // Hover-only range tooltip. Focus opens are ignored (the known button+
  // tooltip flash: clicking a bar opens a dialog, focus returns, and a
  // focus-triggered tooltip would pop). Hidden while dragging/resizing.
  const [tipOpen, setTipOpen] = useState(false)
  // Gated on tipOpen: with the tooltip closed the selector returns a stable
  // false, so gesture start/end doesn't re-render every mounted bar.
  const anyInteracting = useGanttSelector<TData, boolean>(
    (state) => tipOpen && (state.drag !== null || state.slotDraft !== null),
    { calendar: instance }
  )

  const progress =
    typeof event.progress === "number"
      ? Math.min(Math.max(Math.round(event.progress), 0), 100)
      : null

  const defaultContent = (
    <>
      {occurrence.isRecurring && (
        <IconPlaceholder
          lucide="RepeatIcon"
          tabler="IconRepeat"
          hugeicons="RepeatIcon"
          phosphor="RepeatIcon"
          remixicon="RiRepeatLine"
          className="size-2.5 shrink-0 opacity-70"
          aria-hidden="true"
        />
      )}
      <span className="truncate font-medium">{event.title}</span>
      {!occurrence.allDay && segment.isStart && (
        <span className="text-muted-foreground hidden truncate @[8rem]:inline">
          {settings.i18n.functions.formatEventTime(
            toZoned(occurrence.start, settings.timeZone),
            toZoned(occurrence.end, settings.timeZone),
            occurrence.allDay,
            settings.locale
          )}
        </span>
      )}
    </>
  )

  const renderProps = { occurrence, segment, isDragging, isSelected }
  const content =
    children ??
    viewConfig.renderEvent?.(renderProps) ??
    (labelOutside ? null : defaultContent)
  // Consumer-owned content owns the WHOLE inner visualization: the built-in
  // progress fill and done mark yield so custom bars start from a blank
  // canvas (progress stays readable via data-progress/data-completed).
  const consumerOwnsContent = children !== undefined || !!viewConfig.renderEvent

  const timeLabel = settings.i18n.functions.formatEventTime(
    toZoned(occurrence.start, settings.timeZone),
    toZoned(occurrence.end, settings.timeZone),
    occurrence.allDay,
    settings.locale
  )
  // name the row too: the split-pane layout carries no grid semantics.
  // The prop path is O(1); the lookup fallback is memoized so external
  // GanttBar usage never flattens the tree per render.
  const fallbackRowTitle = useMemo(
    () =>
      rowTitleProp === undefined && event.resourceId
        ? flattenResources(settings.resources).find(
            ({ resource }) => resource.id === event.resourceId
          )?.resource.title
        : undefined,
    [rowTitleProp, event.resourceId, settings.resources]
  )
  const rowTitle = rowTitleProp ?? fallbackRowTitle

  const showResize = gestures.canResize(segment)
  const resizeHandles = showResize && (
    <>
      {segment.isStart && (
        <span
          data-slot="gantt-resize-handle"
          data-edge="start"
          // grip hugs the start edge (justify-start + tight inset) so the
          // indicator reads as "resize this end", not a centered pill.
          // pointer-coarse keeps it visible on touch, where hover never fires
          className="absolute inset-y-0 start-0.5 flex w-2 cursor-ew-resize items-center justify-start opacity-0 group-hover/gantt-bar-group:opacity-100 pointer-coarse:opacity-100"
          onPointerDown={(e) => gestures.beginResize(e, segment, "start")}
        >
          <span
            aria-hidden
            className="bg-foreground/40 h-2.5 w-0.5 rounded-full"
          />
        </span>
      )}
      {segment.isEnd && (
        <span
          data-slot="gantt-resize-handle"
          data-edge="end"
          // grip hugs the end edge (justify-end + tight inset) so the
          // indicator reads as "resize this end", not a centered pill.
          // pointer-coarse keeps it visible on touch, where hover never fires
          className="absolute inset-y-0 end-0.5 flex w-2 cursor-ew-resize items-center justify-end opacity-0 group-hover/gantt-bar-group:opacity-100 pointer-coarse:opacity-100"
          onPointerDown={(e) => gestures.beginResize(e, segment, "end")}
        >
          <span
            aria-hidden
            className="bg-foreground/40 h-2.5 w-0.5 rounded-full"
          />
        </span>
      )}
    </>
  )

  const defaultProps = {
    type: "button" as const,
    "data-slot": "gantt-bar",
    "data-all-day": occurrence.allDay || undefined,
    "data-recurring": occurrence.isRecurring || undefined,
    "data-selected": isSelected || undefined,
    "data-dragging": isDragging || undefined,
    "data-drag-kind": dragKind ?? undefined,
    "data-past": occurrence.end.getTime() < Date.now() || undefined,
    "data-label-outside": labelOutside || undefined,
    "data-progress": progress ?? undefined,
    "data-completed": progress === 100 || undefined,
    "aria-label": settings.i18n.functions.formatEventAriaLabel({
      title: event.title,
      timeLabel,
      rowTitle,
      progressLabel:
        progress !== null ? settings.i18n.labels.progress(progress) : undefined,
      continues: segment.continuesBefore || segment.continuesAfter,
    }),
    style: {
      "--gantt-event-color": event.color ?? "var(--color-primary)",
    } as CSSProperties,
    onPointerDown: (e: React.PointerEvent) => {
      e.stopPropagation()
      gestures.beginMove(e, segment)
    },
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      if (wasRecentDrag()) return
      instance.api.selectEvent(occurrence.key)
      settings.onEventClick?.(occurrence, e)
    },
    onDoubleClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      settings.onEventDoubleClick?.(occurrence, e)
    },
    className: cn(
      "group/gantt-bar-group text-foreground @container relative flex w-full min-w-0 cursor-pointer touch-none items-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-0.5 text-start leading-normal select-none",
      "focus-visible:ring-ring/50 outline-none focus-visible:ring-2",
      // the unfilled remainder has to be legible on its own - at /12 a bar
      // with a progress fill read as a floating segment with no basement
      "bg-(--gantt-event-color)/20 hover:bg-(--gantt-event-color)/30",
      // move: hide the original (the smooth cursor clone represents it)
      "data-[drag-kind=move]:opacity-0",
      // resize: keep the original event exactly, just fade it to a soft
      // placeholder behind the dashed preview - no dramatic restyle
      "data-[drag-kind=resize-start]:opacity-40 data-[drag-kind=resize-end]:opacity-40",
      "data-selected:bg-(--gantt-event-color)/30",
      segment.continuesBefore && "rounded-s-none",
      segment.continuesAfter && "rounded-e-none",
      viewConfig.classNames?.event,
      className
    ),
    children: (
      <>
        {progress !== null && (
          // Chrome, not content: it is an absolutely-positioned layer BEHIND
          // whatever the bar renders, so a consumer bar (renderEvent) keeps
          // its completion fill instead of silently losing it. The inline
          // done-mark below stays gated, because that one really is content.
          <span
            aria-hidden
            data-slot="gantt-bar-progress"
            className="pointer-events-none absolute inset-y-0 start-0 border-e border-(--gantt-event-color)/65 bg-(--gantt-event-color)/40 data-full:border-e-0"
            data-full={progress === 100 || undefined}
            style={{ width: `${progress}%` }}
          />
        )}
        {progress === 100 && !consumerOwnsContent && (
          // done mark: completion chrome like the fill itself, so it shows
          // for outside-label bars too (where the inner content is empty)
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
            className="relative size-2.5 shrink-0 opacity-80"
            aria-hidden="true"
          />
        )}
        {content}
        {resizeHandles}
      </>
    ),
  }

  const barButton = useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(defaultProps, props),
  })

  // Consumer-owned right-click menu (headless): the primitive only wires the
  // ContextMenu; the items and their handlers come entirely from the block.
  const menu = viewConfig.renderEventMenu?.(renderProps)

  // The bar is simultaneously the tooltip trigger and (when a menu exists)
  // the context-menu trigger; Base UI composes both via render props.
  const trigger = menu ? (
    <ContextMenuTrigger render={<TooltipTrigger render={barButton} />} />
  ) : (
    <TooltipTrigger render={barButton} />
  )

  const barTree = (
    <TooltipProvider delay={500} closeDelay={0} timeout={300}>
      <Tooltip
        open={tipOpen && !anyInteracting}
        onOpenChange={(next: boolean, details: { reason?: string }) => {
          // opens only on hover; focus/press opens are dropped
          if (next && details?.reason !== "trigger-hover") return
          setTipOpen(next)
        }}
      >
        {trigger}
        {tipOpen && !anyInteracting && (
          <TooltipContent side="top" className="pointer-events-none">
            <div className="font-medium">{event.title}</div>
            <div className="opacity-80">{timeLabel}</div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <GanttBarContext.Provider
      value={{ occurrence, segment, isDragging, isSelected }}
    >
      {menu ? (
        <ContextMenu>
          {barTree}
          <ContextMenuContent data-slot="gantt-bar-menu" className="min-w-44">
            {menu}
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        barTree
      )}
    </GanttBarContext.Provider>
  )
}

export { GANTT_COLORS, GanttBar, useGanttBarContext }
export type { GanttBarContextValue, GanttBarProps }
