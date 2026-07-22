// Title: Gantt Nav
// Description: Composable navigation - Today, view selector, prev/next, go-to-date, period title, and a free toolbar slot.

"use client"

import {
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import {
  useGanttNavigation,
  useGanttScale,
  useGanttSettings,
  useGanttViewConfig,
} from "@/registry-reui/bases/radix/reui/gantt/gantt"
import { toZoned } from "@/registry-reui/bases/radix/reui/gantt/gantt-lib"
import type { GanttScale } from "@/registry-reui/bases/radix/reui/gantt/gantt-types"
import { format } from "date-fns"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { Calendar } from "@/registry/bases/radix/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const GANTT_SCALES: GanttScale[] = ["day", "week", "month", "quarter", "year"]

/** Configured nav button variant/size (viewConfig.navButtonVariant/Size). */
function useNavButtonProps(): {
  variant: "ghost" | "outline" | "secondary" | "default"
  size: "sm" | "default"
  iconSize: "icon-sm" | "icon"
} {
  const viewConfig = useGanttViewConfig()
  return {
    variant: viewConfig.navButtonVariant,
    size: viewConfig.navButtonSize,
    iconSize: viewConfig.navButtonSize === "sm" ? "icon-sm" : "icon",
  }
}

type NavButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children?: ReactNode
  /**
   * Tooltip policy (the part that usually goes wrong on clickable elements):
   * tooltips appear ONLY on hover or keyboard focus-visible - a pointer click
   * never re-triggers them, and buttons that open overlays (the period
   * selector, consumer dialog buttons) get NO tooltip at all so nothing
   * flashes when focus returns. Icon-only buttons default to their accessible
   * label; Today defaults to the actual current date. Pass null to disable.
   */
  tooltip?: ReactNode | null
  asChild?: boolean
}

/** Hover/focus-visible tooltip wrapper; renders the bare button when disabled. */
function NavTooltip({
  content,
  children,
}: {
  content: ReactNode | null
  children: React.ReactElement
}) {
  if (content === null || content === undefined) return children
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom">{content}</TooltipContent>
    </Tooltip>
  )
}

function GanttNavToday({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}: NavButtonProps) {
  const { today, isToday } = useGanttNavigation()
  const settings = useGanttSettings()
  const nav = useNavButtonProps()
  // zoned: a system-zone new Date() can name a different day than Today opens
  const defaultTooltip = format(
    toZoned(new Date(), settings.timeZone),
    settings.i18n.formats.dayTitle,
    { locale: settings.locale }
  )
  return (
    <NavTooltip content={tooltip === undefined ? defaultTooltip : tooltip}>
      <Button
        variant={nav.variant}
        size={nav.size}
        data-slot="gantt-nav-today"
        data-active={isToday || undefined}
        className={cn(className)}
        onClick={today}
        asChild={asChild}
        {...props}
      >
        {children ?? settings.i18n.labels.today}
      </Button>
    </NavTooltip>
  )
}

function GanttNavPrev({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}: NavButtonProps) {
  const { prev } = useGanttNavigation()
  const settings = useGanttSettings()
  const nav = useNavButtonProps()
  return (
    <NavTooltip
      content={tooltip === undefined ? settings.i18n.labels.previous : tooltip}
    >
      <Button
        variant={nav.variant}
        size={nav.iconSize}
        data-slot="gantt-nav-prev"
        aria-label={settings.i18n.labels.previous}
        className={cn(className)}
        onClick={prev}
        asChild={asChild}
        {...props}
      >
        {children ?? (
          <IconPlaceholder
            lucide="ChevronLeftIcon"
            tabler="IconChevronLeft"
            hugeicons="ArrowLeft01Icon"
            phosphor="CaretLeftIcon"
            remixicon="RiArrowLeftSLine"
            className="size-4"
            aria-hidden="true"
          />
        )}
      </Button>
    </NavTooltip>
  )
}

function GanttNavNext({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}: NavButtonProps) {
  const { next } = useGanttNavigation()
  const settings = useGanttSettings()
  const nav = useNavButtonProps()
  return (
    <NavTooltip
      content={tooltip === undefined ? settings.i18n.labels.next : tooltip}
    >
      <Button
        variant={nav.variant}
        size={nav.iconSize}
        data-slot="gantt-nav-next"
        aria-label={settings.i18n.labels.next}
        className={cn(className)}
        onClick={next}
        asChild={asChild}
        {...props}
      >
        {children ?? (
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
            className="size-4"
            aria-hidden="true"
          />
        )}
      </Button>
    </NavTooltip>
  )
}

interface GanttTitleProps extends HTMLAttributes<HTMLDivElement> {
  format?: (ctx: { title: string }) => ReactNode
  asChild?: boolean
}

function GanttTitle({
  className,
  asChild = false,
  children,
  format: formatTitle,
  ...props
}: GanttTitleProps) {
  const { title } = useGanttNavigation()
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="gantt-title"
      aria-live="polite"
      className={cn("min-w-0 truncate text-sm font-semibold", className)}
      {...props}
    >
      {children ?? formatTitle?.({ title }) ?? title}
    </Comp>
  )
}

interface GanttScaleSwitcherProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  children?: ReactNode
  /** Hover/focus-visible hint; defaults to the "Select view" label. Pass
   *  null to disable (overlay-opener policy). */
  tooltip?: ReactNode | null
  /** The offered scales, in menu order. Default: all five. */
  scales?: GanttScale[]
  asChild?: boolean
}

/**
 * Scale switcher ("Select view"): Day / Week / Month / Quarter / Year, a ghost
 * dropdown button (same shape as the event-calendar view switcher).
 */
function GanttScaleSwitcher({
  className,
  asChild,
  children,
  tooltip,
  scales = GANTT_SCALES,
  ...props
}: GanttScaleSwitcherProps) {
  const { scale, setScale } = useGanttScale()
  const settings = useGanttSettings()
  const nav = useNavButtonProps()
  const labels = settings.i18n.labels
  // Controlled open: selecting a scale swaps the whole track subtree in the
  // same click, so closing must not depend on the menu's internal handler.
  const [open, setOpen] = useState(false)
  // Hover-only tooltip: when the menu closes, Radix focuses the trigger
  // again and a focus-opened tooltip would flash - Radix has no open reason,
  // so focus opens are suppressed at the trigger via preventDefault.
  const [tipOpen, setTipOpen] = useState(false)

  const selectScale = (next: GanttScale) => {
    setOpen(false)
    setScale(next)
  }

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next: boolean) => {
        setOpen(next)
        if (next) setTipOpen(false)
      }}
    >
      {/* Tooltip on an overlay-opener: hover-only (focus opens ignored) and
          force-closed while the menu is up, so it never lingers or flashes
          when focus returns on close. */}
      <Tooltip
        open={tipOpen && !open}
        onOpenChange={(next: boolean) => setTipOpen(next)}
      >
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
            <Button
              variant={nav.variant}
              size={nav.size}
              data-slot="gantt-scale-switcher"
              aria-label={labels.selectView}
              className={cn("gap-1", className)}
              {...props}
            >
              {children ?? (
                <>
                  {labels.scales[scale]}
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                    className="size-4 opacity-60"
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        {tipOpen && !open && tooltip !== null && (
          <TooltipContent side="bottom">
            {tooltip ?? labels.selectView}
          </TooltipContent>
        )}
      </Tooltip>
      <DropdownMenuContent align="start" className="min-w-36">
        {/* Keep the label inside the group so it stays associated with its items */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground font-normal">
            {labels.selectView}
          </DropdownMenuLabel>
          {scales.map((value) => (
            <DropdownMenuItem
              key={value}
              data-active={scale === value || undefined}
              onClick={() => selectScale(value)}
            >
              {labels.scales[value]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface GanttDatePickerProps {
  className?: string
}

/**
 * Compact go-to-date picker (shadcn Calendar in a popover). No tooltip by
 * design: it opens an overlay (see the NavButtonProps tooltip policy).
 */
function GanttDatePicker({ className }: GanttDatePickerProps) {
  const { date, goTo } = useGanttNavigation()
  const settings = useGanttSettings()
  const nav = useNavButtonProps()
  const [open, setOpen] = useState(false)
  const zoned = toZoned(date, settings.timeZone)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={nav.variant}
          size={nav.iconSize}
          data-slot="gantt-date-picker"
          aria-label={settings.i18n.labels.goToDate}
          className={cn(className)}
        >
          <IconPlaceholder
            lucide="CalendarIcon"
            tabler="IconCalendarEvent"
            hugeicons="Calendar04Icon"
            phosphor="CalendarBlankIcon"
            remixicon="RiCalendarLine"
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0!">
        <Calendar
          mode="single"
          selected={zoned}
          defaultMonth={zoned}
          locale={settings.locale}
          weekStartsOn={settings.weekStartsOn}
          onSelect={(next: Date | undefined) => {
            if (next) {
              goTo(next)
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

interface GanttToolbarProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

/** Free slot for consumer toolbar buttons; pure layout shell. */
function GanttToolbar({
  className,
  asChild = false,
  children,
  ...props
}: GanttToolbarProps) {
  const viewConfig = useGanttViewConfig()
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="gantt-toolbar"
      className={cn(
        "flex items-center gap-2",
        viewConfig.classNames?.toolbar,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

interface GanttNavProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

/**
 * Default composed nav (event-calendar parity): Today, time-period switcher,
 * prev/next, title, spacer. GanttDatePicker stays available for custom
 * compositions. Pass children to use it as a pure layout shell instead.
 */
function GanttNav({
  className,
  asChild = false,
  children,
  ...props
}: GanttNavProps) {
  const viewConfig = useGanttViewConfig()
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="gantt-nav"
      className={cn(
        // px so the toolbar controls do not hug the container edge; border-b
        // separates the toolbar from the column header below it
        "flex min-w-0 flex-wrap items-center gap-2 border-b px-3 py-2",
        viewConfig.stickyNav && "bg-background sticky top-0 z-30",
        viewConfig.classNames?.nav,
        className
      )}
      {...props}
    >
      {children ?? (
        // Shared provider: first tooltip waits, moving between buttons is instant
        <TooltipProvider delayDuration={600} skipDelayDuration={300}>
          <GanttNavToday />
          <GanttScaleSwitcher />
          <div className="flex items-center">
            <GanttNavPrev />
            <GanttNavNext />
          </div>
          <GanttTitle />
          <div className="grow" />
        </TooltipProvider>
      )}
    </Comp>
  )
}

export {
  GANTT_SCALES,
  GanttDatePicker,
  GanttNav,
  GanttNavNext,
  GanttNavPrev,
  GanttNavToday,
  GanttScaleSwitcher,
  GanttTitle,
  GanttToolbar,
}
export type {
  GanttNavProps,
  GanttScaleSwitcherProps,
  GanttTitleProps,
  GanttToolbarProps,
}
