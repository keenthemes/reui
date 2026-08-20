"use client"

import * as React from "react"
import { useCascaderActions } from "@/registry-reui/bases/radix/reui/cascader/cascader-context"
import {
  CASCADER_ACTION_CLASS,
  CascaderGroup,
  CascaderLabel,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  CASCADER_LIST_PAD_CLASS,
  getCascaderFooterStops,
  isCascaderRtl,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-lib"
import type { CascaderActionItem } from "@/registry-reui/bases/radix/reui/cascader/cascader-types"
import { Popover as PopoverPrimitive } from "@base-ui/react"
import { useDirection } from "@base-ui/react/direction-provider"

import { cn } from "@/registry/bases/radix/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/**
 * The pinned footer, and the side-anchored flyout a footer row can open. These
 * are COMMANDS: nothing here joins the selection, the filter set or the
 * highlight. The flyout is a Base UI `Popover` rendered as a REACT CHILD of
 * `Combobox.Popup` with its OWN `Portal` and NO `container`: a nested portal
 * resolves to the parent portal node, so it is a DOM sibling of the combobox
 * popup (not clipped, not `aria-hidden`) but a React descendant, which is what
 * the outside-press and focus-out whitelists read. `Combobox` builds no
 * `FloatingTree`, so the flyout is not consulted first and one Escape would
 * dismiss both; hence `CascaderSubmenu` registering with the root to turn one
 * Escape into two. `Combobox.List` clicks its highlighted row on Enter, hence
 * the footer sitting outside `CascaderList`. And a `Positioner` throws without
 * its `Portal`, while `modal` stays `false` on the `Root` so the combobox
 * keeps its own dismissal behaviour.
 */

/* -------------------------------------------------------------------------- */
/*                                   Footer                                   */
/* -------------------------------------------------------------------------- */

/**
 * Keys the option list acts on, swallowed at the footer boundary. Escape and
 * Tab are absent on purpose: Escape must reach the root, Tab must keep moving.
 */
const FOOTER_SWALLOWED_KEYS = new Set([
  "Enter",
  " ",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
])

export type CascaderFooterProps = React.ComponentProps<"div">

/**
 * Actions pinned below the list, a SIBLING of `CascaderList`. Children win
 * over the root's `actions` prop; with neither it renders nothing.
 */
function CascaderFooter({
  className,
  children,
  onKeyDown,
  ...props
}: CascaderFooterProps) {
  const { actions, labels } = useCascaderActions()
  const hasChildren = React.Children.count(children) > 0

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (!FOOTER_SWALLOWED_KEYS.has(event.key)) return
      event.stopPropagation()

      // The strip's own vertical movement, and the way back from the list's
      // hand-off: either end returns focus to the search field, from which
      // Base UI's empty highlight resumes the list. Down wraps to the FIELD,
      // not a command (traps the arrows) or a row (no imperative highlight).
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
      const footer = event.currentTarget
      const stops = getCascaderFooterStops(footer)
      const active = document.activeElement as HTMLElement | null
      const index = active ? stops.indexOf(active) : -1
      if (index === -1) return
      event.preventDefault()
      const next =
        event.key === "ArrowDown" ? stops[index + 1] : stops[index - 1]
      if (next) {
        next.focus()
        return
      }
      if (event.key === "ArrowUp" && index > 0) return
      footer
        .closest<HTMLElement>('[data-slot="cascader-panel"]')
        ?.querySelector<HTMLElement>('[data-slot="cascader-input"]')
        ?.focus()
    },
    [onKeyDown]
  )

  if (!hasChildren && actions.length === 0) return null

  return (
    <div
      data-slot="cascader-footer"
      /* Named, not a bare div: without it a screen reader reaches the actions
         with nothing to say they are not more options. */
      role="group"
      aria-label={labels.actionsLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        "border-border/60 flex shrink-0 flex-col gap-0.5 border-t",
        /* The LIST's padding, not a flat `p-1`: with a padding of its own the
           two columns of text were 2px out in luma and sera and 4px out in
           lyra. It also gives a separator in here a number to cancel. */
        CASCADER_LIST_PAD_CLASS,
        "p-(--cascader-list-pad,4px)",
        className
      )}
      {...props}
    >
      {hasChildren ? children : <CascaderFooterActions actions={actions} />}
    </div>
  )
}

function CascaderFooterActions({ actions }: { actions: CascaderActionItem[] }) {
  return (
    <>
      {actions.map((action, i) =>
        action.items?.length ? (
          <CascaderSubmenu key={actionKey(action, i)}>
            <CascaderSubmenuTrigger
              icon={action.icon}
              disabled={action.disabled}
            >
              {action.label}
            </CascaderSubmenuTrigger>
            <CascaderSubmenuContent>
              <CascaderActionList items={action.items} />
            </CascaderSubmenuContent>
          </CascaderSubmenu>
        ) : (
          <CascaderAction
            key={actionKey(action, i)}
            icon={action.icon}
            disabled={action.disabled}
            onSelect={action.onSelect}
          >
            {action.label}
          </CascaderAction>
        )
      )}
    </>
  )
}

function actionKey(action: CascaderActionItem, index: number): string {
  if (action.value != null) return action.value
  if (typeof action.label === "string") return action.label
  return String(index)
}

/**
 * Consecutive entries sharing a `group`, as runs not buckets: two separated
 * runs with the same name stay two, so the author's order survives.
 */
function groupActionRuns(
  items: CascaderActionItem[]
): { group?: string; items: CascaderActionItem[] }[] {
  const runs: { group?: string; items: CascaderActionItem[] }[] = []
  for (const item of items) {
    const last = runs[runs.length - 1]
    if (last && last.group === item.group) last.items.push(item)
    else runs.push({ group: item.group, items: [item] })
  }
  return runs
}

/**
 * Flyout body for a data-driven submenu. A named run becomes a real
 * `CascaderGroup`; unnamed runs stay unwrapped, as an unnamed group is noise.
 */
function CascaderActionList({ items }: { items: CascaderActionItem[] }) {
  const { close } = useCascaderSubmenu()
  const runs = React.useMemo(() => groupActionRuns(items), [items])

  const renderAction = (item: CascaderActionItem, i: number) => (
    <CascaderAction
      key={actionKey(item, i)}
      icon={item.icon}
      disabled={item.disabled}
      onSelect={() => {
        item.onSelect?.()
        /* Closes behind the command, or the entries would read as toggles. */
        close()
      }}
    >
      {item.label}
    </CascaderAction>
  )

  return (
    <>
      {runs.map((run, runIndex) =>
        run.group ? (
          <CascaderGroup key={`${run.group}-${runIndex}`} className="gap-0.5">
            <CascaderLabel>{run.group}</CascaderLabel>
            {run.items.map(renderAction)}
          </CascaderGroup>
        ) : (
          <React.Fragment key={`run-${runIndex}`}>
            {run.items.map(renderAction)}
          </React.Fragment>
        )
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Action                                   */
/* -------------------------------------------------------------------------- */

export interface CascaderActionProps extends Omit<
  React.ComponentProps<"button">,
  "onSelect"
> {
  icon?: React.ReactNode
  /** Fires on press, after `onClick`, and not at all when disabled. */
  onSelect?: () => void
}

/**
 * The cascader popup's panel per style, spelled with `style-<name>:` variants
 * rather than ReUI theme CSS so an installed footer needs only Tailwind.
 */
const FLYOUT_SURFACE_CLASS =
  "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-72 overflow-hidden ring-1 duration-100 style-vega:ring-foreground/10 style-vega:rounded-md style-vega:shadow-md style-nova:ring-foreground/10 style-nova:shadow-md style-nova:rounded-lg style-maia:ring-foreground/5 style-maia:rounded-2xl style-maia:shadow-2xl style-lyra:ring-foreground/10 style-lyra:shadow-md style-lyra:rounded-none style-mira:ring-foreground/10 style-mira:shadow-md style-mira:rounded-lg style-mira:dark:bg-popover style-luma:ring-foreground/5 style-luma:dark:ring-foreground/10 style-luma:rounded-3xl style-luma:shadow-lg style-rhea:ring-foreground/5 style-rhea:rounded-2xl style-rhea:dark:ring-foreground/10 style-rhea:shadow-lg style-sera:ring-foreground/10 style-sera:shadow-md style-sera:rounded-none"

/**
 * One footer command, shaped like a row and deliberately NOT one. A real
 * `<button>`, never a `Combobox.Item`: an item would join the arrow-key ring,
 * appear in `filteredItems`, and vanish the moment a query matched nothing -
 * exactly when "Create new attribute" is most useful. Disabled is
 * `aria-disabled`, never the native attribute: that one is not a tab stop and
 * the panel's Tab order reads `button:not([disabled])`, so a footer whose ONLY
 * row is a disabled command had no stop after the search field (measured on
 * `c-cascader-8`). Staying focusable costs the guards below, plus the
 * greyed-out look: `CASCADER_ACTION_CLASS` keys that off `aria-disabled`
 * instead of `:disabled`.
 */
function CascaderAction({
  className,
  icon,
  children,
  onSelect,
  onClick,
  onKeyDown,
  disabled,
  ...props
}: CascaderActionProps) {
  // Set by `CascaderSubmenuContent`: a plain button in the footer's Tab ring,
  // a roving-focus `menuitem` inside a flyout, never both.
  const inMenu = React.useContext(CascaderMenuContext)

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Before the consumer's handler: a disabled command runs none of them.
      if (disabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
      if (event.defaultPrevented) return
      onSelect?.()
    },
    [disabled, onClick, onSelect]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        // The two keys a `<button>` activates on, and only those.
        if (event.key === "Enter" || event.key === " ") event.preventDefault()
        return
      }
      onKeyDown?.(event)
    },
    [disabled, onKeyDown]
  )

  return (
    <button
      type="button"
      data-slot="cascader-action"
      /* Conditional spread: `false` would publish `aria-disabled="false"`. */
      {...(disabled ? { "aria-disabled": true, "data-disabled": "" } : null)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      /* Conditional spread, so a consumer's own `role` or `tabIndex` wins. */
      {...(inMenu ? { role: "menuitem" as const, tabIndex: -1 } : null)}
      className={cn(CASCADER_ACTION_CLASS, className)}
      {...props}
    >
      {icon ? (
        <span
          data-slot="cascader-action-icon"
          className="text-muted-foreground flex shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-start">{children}</span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Submenu                                   */
/* -------------------------------------------------------------------------- */

interface CascaderSubmenuContextValue {
  rowRef: React.RefObject<HTMLButtonElement | null>
  open: boolean
  setOpen: (open: boolean) => void
  close: () => void
  /** Names the flyout: a menu is labelled by the control that opens it. */
  triggerId: string
  /**
   * Whether the pending open came from the KEYBOARD. Base UI's own `openType`
   * calls the opening arrow a POINTER open, because the trigger intercepts it
   * and calls `setOpen` (measured: focus landed on the popup, not the first
   * entry). A ref, so reading it in the focus phase cannot render.
   */
  keyboardRef: React.RefObject<boolean>
}

/** Marks the subtree INSIDE a flyout. See `inMenu` in `CascaderAction`. */
const CascaderMenuContext = React.createContext(false)

/**
 * Every entry a menu's roving focus may land on, in DOM order, read from the
 * DOM because the entries are whatever the consumer composed. A disabled
 * `CascaderAction` is INCLUDED: it carries `aria-disabled`, not the native
 * attribute, so `:not([disabled])` excludes only a consumer's own natively
 * disabled `menuitem`, which cannot take focus.
 */
function menuItems(popup: HTMLElement | null): HTMLElement[] {
  if (!popup) return []
  return Array.from(
    popup.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
  )
}

const CascaderSubmenuContext = React.createContext<
  CascaderSubmenuContextValue | undefined
>(undefined)

/** The flyout's own state. `close()` is the one a custom entry usually wants. */
export function useCascaderSubmenu(): CascaderSubmenuContextValue {
  const context = React.useContext(CascaderSubmenuContext)
  if (!context) {
    throw new Error("useCascaderSubmenu must be used within a CascaderSubmenu")
  }
  return context
}

export interface CascaderSubmenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

/**
 * A footer row plus the flyout it opens. Registers with the cascader root
 * while open, which turns one Escape into two. Cleared in an EFFECT, so the
 * flyout still reads as open during the event that closed it.
 */
function CascaderSubmenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: CascaderSubmenuProps) {
  const { setFlyoutOpen } = useCascaderActions()
  const key = React.useId()
  const triggerId = React.useId()
  const rowRef = React.useRef<HTMLButtonElement | null>(null)
  const keyboardRef = React.useRef(false)
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolled

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp == null) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const close = React.useCallback(() => setOpen(false), [setOpen])

  React.useEffect(() => {
    setFlyoutOpen(key, open)
    return () => setFlyoutOpen(key, false)
  }, [setFlyoutOpen, key, open])

  const context = React.useMemo<CascaderSubmenuContextValue>(
    () => ({ rowRef, open, setOpen, close, triggerId, keyboardRef }),
    [open, setOpen, close, triggerId]
  )

  return (
    <CascaderSubmenuContext.Provider value={context}>
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        /* NEVER modal: it would disable the combobox that owns it. */
        modal={false}
      >
        {children}
      </PopoverPrimitive.Root>
    </CascaderSubmenuContext.Provider>
  )
}

export interface CascaderSubmenuTriggerProps extends Omit<
  React.ComponentProps<"button">,
  "onSelect"
> {
  icon?: React.ReactNode
}

/** Carries the handler-veto hook, derived so a Base UI bump cannot drift. */
type CascaderSubmenuTriggerClickEvent = Parameters<
  NonNullable<PopoverPrimitive.Trigger.Props["onClick"]>
>[0]

/**
 * The footer row that opens the flyout, and its anchor. `aria-haspopup="menu"`
 * rather than the `dialog` Base UI would announce: what opens is a list of
 * commands with roving focus. `disabled` is intercepted, not forwarded:
 * `Popover.Trigger` runs it through `useButton`, which writes the NATIVE
 * attribute for a native `<button>` and takes the row out of the panel's Tab
 * ring, the defect `CascaderAction` documents, and this component exposes no
 * `focusableWhenDisabled` to opt out. Published as `aria-disabled`, with the
 * arrow keys, Enter and Space, and the click closed by hand (`useClick`
 * ignores `defaultPrevented`).
 */
function CascaderSubmenuTrigger({
  className,
  icon,
  children,
  onKeyDown,
  onClick,
  disabled,
  ...props
}: CascaderSubmenuTriggerProps) {
  const { labels } = useCascaderActions()
  const { rowRef, setOpen, triggerId, keyboardRef } = useCascaderSubmenu()
  const direction = useDirection()

  const handleClick = React.useCallback(
    (event: CascaderSubmenuTriggerClickEvent) => {
      if (disabled) {
        // `mergeProps` runs right to left, so this drops Base UI's own handler.
        event.preventDefault()
        event.preventBaseUIHandler()
        return
      }
      onClick?.(event)
    },
    [disabled, onClick]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        if (event.key === "Enter" || event.key === " ") event.preventDefault()
        return
      }

      onKeyDown?.(event)
      if (event.defaultPrevented) return

      // The opening key points AT the flyout, so it flips with the writing
      // direction; ArrowDown stays "next command". Resolved per keydown, never
      // `useDirection()` alone: with no provider that answers "ltr" in RTL.
      const openKey = isCascaderRtl(event.currentTarget, direction)
        ? "ArrowLeft"
        : "ArrowRight"

      // Enter and Space open through the button's own click, so only FLAGGED.
      if (event.key === "Enter" || event.key === " ") {
        keyboardRef.current = true
        return
      }

      if (event.key !== openKey) return

      event.preventDefault()
      keyboardRef.current = true
      setOpen(true)
    },
    [disabled, onKeyDown, direction, setOpen, keyboardRef]
  )

  return (
    <PopoverPrimitive.Trigger
      ref={rowRef}
      id={triggerId}
      data-slot="cascader-submenu-trigger"
      aria-haspopup="menu"
      /* NOT `disabled={disabled}`: Base UI writes the native attribute. */
      {...(disabled ? { "aria-disabled": true, "data-disabled": "" } : null)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        CASCADER_ACTION_CLASS,
        /* Painted while the flyout is open, as shadcn paints a SubTrigger.
           Keyed off `aria-expanded`, not shadcn's `data-[state=open]`: the
           popover trigger carries `aria-expanded` in both states. */
        "aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        className
      )}
      {...props}
    >
      {icon ? (
        <span
          data-slot="cascader-action-icon"
          className="text-muted-foreground flex shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-start">{children}</span>
      {/* Nothing else says the row opens a MENU, not another tree level. */}
      <span className="sr-only">, {labels.submenuAffordance}</span>
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        aria-hidden="true"
        /* Static: a rotating chevron is the DISCLOSURE convention, and this
           one opens to the SIDE and keeps pointing there the whole time. */
        className="text-muted-foreground -me-0.5 size-4 shrink-0 rtl:-scale-x-100"
      />
    </PopoverPrimitive.Trigger>
  )
}

export interface CascaderSubmenuContentProps
  extends
    PopoverPrimitive.Popup.Props,
    Pick<
      PopoverPrimitive.Positioner.Props,
      "side" | "align" | "sideOffset" | "alignOffset"
    > {}

/** Carries Base UI's handler-veto hook, so a plain React event will not do. */
type CascaderSubmenuKeyEvent = Parameters<
  NonNullable<PopoverPrimitive.Popup.Props["onKeyDown"]>
>[0]

/**
 * The flyout itself. `Portal` with NO `container`: a nested portal resolves to
 * the parent portal node, the mechanism the file header describes.
 */
function CascaderSubmenuContent({
  className,
  children,
  onKeyDown,
  side = "inline-end",
  align = "end",
  sideOffset = 8,
  alignOffset = 0,
  ...props
}: CascaderSubmenuContentProps) {
  const { rowRef, close, triggerId, keyboardRef } = useCascaderSubmenu()
  const direction = useDirection()
  const popupRef = React.useRef<HTMLDivElement | null>(null)
  const typeaheadRef = React.useRef({ buffer: "", at: 0 })

  /**
   * Keyboard opens land on the first entry; a pointer open falls through to
   * Base UI's default, the popup, so a click paints no focus ring. Not an
   * effect of our own: Base UI's focus manager runs on open and wins the race.
   */
  const initialFocus = React.useCallback(() => {
    const byKeyboard = keyboardRef.current
    keyboardRef.current = false
    if (!byKeyboard) return true
    return menuItems(popupRef.current)[0] ?? true
  }, [keyboardRef])

  const closeAndReturn = React.useCallback(() => {
    close()
    rowRef.current?.focus()
  }, [close, rowRef])

  const handleKeyDown = React.useCallback(
    (event: CascaderSubmenuKeyEvent) => {
      onKeyDown?.(event)
      // A DOM sibling of the combobox popup but a REACT descendant, so keys in
      // here reach its handlers unless stopped. Enter would commit a row.
      event.stopPropagation()
      if (event.defaultPrevented) return

      const popup = popupRef.current
      const items = menuItems(popup)
      if (items.length === 0) return

      const active = document.activeElement as HTMLElement | null
      const index = active ? items.indexOf(active) : -1
      const move = (next: number) => {
        event.preventDefault()
        items[(next + items.length) % items.length]?.focus()
      }

      // Mirrors the open key on the SAME per-keydown answer as the trigger.
      const closeKey = isCascaderRtl(event.currentTarget, direction)
        ? "ArrowRight"
        : "ArrowLeft"

      switch (event.key) {
        case "ArrowDown":
          return move(index + 1)
        case "ArrowUp":
          // From the popup itself (a pointer open) Up means the LAST entry.
          return move(index === -1 ? items.length - 1 : index - 1)
        case "Home":
          return move(0)
        case "End":
          return move(items.length - 1)
        case closeKey:
          event.preventDefault()
          return closeAndReturn()
        case "Tab":
          // A menu never holds Tab: it closes and focus carries on from its row.
          close()
          rowRef.current?.focus()
          return
        default:
          break
      }

      // Typeahead, after the switch so it can never swallow a navigation key.
      if (
        event.key.length !== 1 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return
      const now = event.timeStamp
      const state = typeaheadRef.current
      state.buffer = now - state.at > 500 ? event.key : state.buffer + event.key
      state.at = now
      const prefix = state.buffer.toLowerCase()
      const from = index === -1 ? 0 : index
      // Starts AFTER the current entry so one letter cycles rather than sticks.
      const ordered = [
        ...items.slice(state.buffer.length > 1 ? from : from + 1),
        ...items.slice(0, state.buffer.length > 1 ? from : from + 1),
      ]
      const hit = ordered.find((item) =>
        (item.textContent ?? "").trim().toLowerCase().startsWith(prefix)
      )
      if (hit) {
        event.preventDefault()
        hit.focus()
      }
    },
    [onKeyDown, direction, close, closeAndReturn, rowRef]
  )

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        /* The ROW, not whatever Base UI last treated as the trigger. */
        anchor={rowRef}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          ref={popupRef}
          initialFocus={initialFocus}
          data-slot="cascader-submenu-content"
          /* Roving focus, named by the row that opens it. `tabIndex={-1}` lets
             a pointer open park focus here without adding a Tab stop. */
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={triggerId}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          /* Marks a menu surface for the docs design-system picker, which
             repaints menus by walking the DOM. An attribute, not a class. */
          data-menu-target=""
          className={cn(
            FLYOUT_SURFACE_CLASS,
            "flex max-w-(--available-width) min-w-48 flex-col gap-0.5 outline-hidden",
            CASCADER_LIST_PAD_CLASS,
            "p-(--cascader-list-pad,4px)",
            className
          )}
          {...props}
        >
          <CascaderMenuContext.Provider value={true}>
            {children}
          </CascaderMenuContext.Provider>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

/**
 * Whether the footer would render anything, for a wrapper (a separator, a grid
 * row) that has to make the same call `CascaderFooter` already makes.
 */
export function useCascaderHasActions(): boolean {
  const { actions } = useCascaderActions()
  return actions.length > 0
}

export {
  CascaderAction,
  CascaderFooter,
  CascaderSubmenu,
  CascaderSubmenuContent,
  CascaderSubmenuTrigger,
}
