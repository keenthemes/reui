"use client"

import { useState } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderSelection,
} from "@/registry-reui/bases/radix/reui/cascader/cascader"
import {
  CascaderAction,
  CascaderFooter,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-footer"
import { CascaderItems } from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface Marker {
  /**
   * The dot's fill. A literal Tailwind class, not a computed string: Tailwind
   * only emits classes it can see in the source, so `bg-${color}-500` compiles
   * to nothing.
   *
   * Each pairs a 500 with a 400 for dark mode - a saturated 500 dot on a near
   * black popup reads muddy, and the lighter step keeps every hue at the same
   * apparent weight in both themes.
   */
  dot: string
  hint?: string
}

const workflow: CascaderNode<Marker>[] = [
  {
    value: "status",
    label: "Status",
    children: [
      {
        value: "status.backlog",
        label: "Backlog",
        data: { dot: "bg-slate-400 dark:bg-slate-500" },
      },
      {
        value: "status.todo",
        label: "Todo",
        data: { dot: "bg-sky-500 dark:bg-sky-400" },
      },
      {
        value: "status.in-progress",
        label: "In progress",
        data: { dot: "bg-amber-500 dark:bg-amber-400" },
      },
      {
        value: "status.in-review",
        label: "In review",
        data: { dot: "bg-violet-500 dark:bg-violet-400" },
      },
      {
        value: "status.done",
        label: "Done",
        data: { dot: "bg-emerald-500 dark:bg-emerald-400" },
      },
      {
        value: "status.cancelled",
        label: "Cancelled",
        data: { dot: "bg-zinc-400 dark:bg-zinc-500" },
      },
    ],
  },
  {
    value: "priority",
    label: "Priority",
    children: [
      {
        value: "priority.urgent",
        label: "Urgent",
        data: { dot: "bg-rose-500 dark:bg-rose-400", hint: "Same day" },
      },
      {
        value: "priority.high",
        label: "High",
        data: { dot: "bg-orange-500 dark:bg-orange-400", hint: "This week" },
      },
      {
        value: "priority.medium",
        label: "Medium",
        data: { dot: "bg-yellow-500 dark:bg-yellow-400", hint: "This sprint" },
      },
      {
        value: "priority.low",
        label: "Low",
        data: { dot: "bg-teal-500 dark:bg-teal-400", hint: "When it fits" },
      },
      {
        value: "priority.none",
        label: "No priority",
        data: { dot: "bg-slate-400 dark:bg-slate-500" },
      },
    ],
  },
  {
    value: "type",
    label: "Type",
    children: [
      {
        value: "type.feature",
        label: "Feature",
        data: { dot: "bg-indigo-500 dark:bg-indigo-400" },
      },
      {
        value: "type.bug",
        label: "Bug",
        data: { dot: "bg-red-500 dark:bg-red-400" },
      },
      {
        value: "type.chore",
        label: "Chore",
        data: { dot: "bg-stone-400 dark:bg-stone-500" },
      },
      {
        value: "type.docs",
        label: "Documentation",
        data: { dot: "bg-cyan-500 dark:bg-cyan-400" },
      },
    ],
  },
  {
    value: "severity",
    label: "Severity",
    children: [
      {
        value: "severity.s1",
        label: "S1 - outage",
        data: { dot: "bg-rose-600 dark:bg-rose-400" },
      },
      {
        value: "severity.s2",
        label: "S2 - degraded",
        data: { dot: "bg-orange-500 dark:bg-orange-400" },
      },
      {
        value: "severity.s3",
        label: "S3 - minor",
        data: { dot: "bg-amber-500 dark:bg-amber-400" },
      },
      {
        value: "severity.s4",
        label: "S4 - cosmetic",
        data: { dot: "bg-lime-500 dark:bg-lime-400" },
      },
    ],
  },
  {
    value: "effort",
    label: "Effort",
    children: [
      {
        value: "effort.xs",
        label: "XS",
        data: { dot: "bg-emerald-500 dark:bg-emerald-400" },
      },
      {
        value: "effort.s",
        label: "S",
        data: { dot: "bg-teal-500 dark:bg-teal-400" },
      },
      {
        value: "effort.m",
        label: "M",
        data: { dot: "bg-sky-500 dark:bg-sky-400" },
      },
      {
        value: "effort.l",
        label: "L",
        data: { dot: "bg-violet-500 dark:bg-violet-400" },
      },
      {
        value: "effort.xl",
        label: "XL",
        data: { dot: "bg-fuchsia-500 dark:bg-fuchsia-400" },
      },
    ],
  },
  {
    value: "stage",
    label: "Release stage",
    children: [
      {
        value: "stage.alpha",
        label: "Alpha",
        data: { dot: "bg-purple-500 dark:bg-purple-400" },
      },
      {
        value: "stage.beta",
        label: "Beta",
        data: { dot: "bg-blue-500 dark:bg-blue-400" },
      },
      {
        value: "stage.ga",
        label: "General availability",
        data: { dot: "bg-green-500 dark:bg-green-400" },
      },
    ],
  },
  {
    value: "risk",
    label: "Risk",
    children: [
      {
        value: "risk.blocked",
        label: "Blocked",
        data: { dot: "bg-red-500 dark:bg-red-400" },
      },
      {
        value: "risk.at-risk",
        label: "At risk",
        data: { dot: "bg-amber-500 dark:bg-amber-400" },
      },
      {
        value: "risk.on-track",
        label: "On track",
        data: { dot: "bg-emerald-500 dark:bg-emerald-400" },
      },
    ],
  },
  {
    value: "confidence",
    label: "Confidence",
    children: [
      {
        value: "confidence.high",
        label: "High",
        data: { dot: "bg-emerald-500 dark:bg-emerald-400" },
      },
      {
        value: "confidence.medium",
        label: "Medium",
        data: { dot: "bg-yellow-500 dark:bg-yellow-400" },
      },
      {
        value: "confidence.low",
        label: "Low",
        data: { dot: "bg-rose-500 dark:bg-rose-400" },
      },
    ],
  },
]

/**
 * The trigger, showing the same dot the row does - so the mark that identified
 * the option in the list is the mark that identifies it once chosen.
 *
 * The three pieces sit on one row of three different natural heights: an 8px
 * dot, a 14px label, and a 12px group name. `items-center` can only centre the
 * BOXES it is given, so with each piece carrying its own font's line-height the
 * two texts came out on line boxes of 20px and 16px, the taller one dragged the
 * row's centre line down, and the dot floated visibly high of the label it
 * belongs to. Pinning one explicit `leading-4` on the row settles both texts on
 * a 16px box - `text-xs` already computes to 16px, so nothing has to fight it -
 * and from there `items-center` puts the dot's centre on the label's centre for
 * real. `shrink-0` on the dot keeps it a circle when a long label squeezes the
 * row, and `min-w-0` is what lets the label truncate instead of pushing.
 */
function WorkflowValue() {
  const { first, firstPath, isEmpty } = useCascaderSelection<Marker>()

  if (isEmpty || !first) {
    return <span className="text-muted-foreground">Set a field</span>
  }

  const group = firstPath[0]

  return (
    <span className="inline-flex min-w-0 items-center gap-2 leading-4">
      <span
        aria-hidden="true"
        className={`size-2 shrink-0 rounded-full ${first.data?.dot}`}
      />
      <span className="min-w-0 truncate">{first.label}</span>
      <span className="text-muted-foreground truncate text-xs">
        {group?.label}
      </span>
    </span>
  )
}

/**
 * The reset as a footer COMMAND, reading the selection out of context instead of
 * being handed it. Nothing in here is specific to this example - composed into
 * any panel it clears that cascader - and `isEmpty` is what stops it offering to
 * undo nothing.
 */
function ResetAction() {
  const { clear, isEmpty } = useCascaderSelection()

  return (
    <CascaderAction
      icon={
        <IconPlaceholder
          lucide="RotateCcwIcon"
          tabler="IconRotate2"
          hugeicons="ArrowTurnBackwardIcon"
          phosphor="ArrowCounterClockwiseIcon"
          remixicon="RiArrowGoBackLine"
          className="size-4"
        />
      }
      disabled={isEmpty}
      onSelect={clear}
    >
      Reset selection
    </CascaderAction>
  )
}

/**
 * Colour dots through `renderLabel`.
 *
 * A status or a priority is a category with no natural ordering in its name, so
 * a colour does the work an icon cannot: "In progress" and "In review" are one
 * glance apart when they are amber and violet, and three words apart when they
 * are not.
 *
 * Two rules keep it honest. The colour never carries meaning on its own - every
 * dot sits beside its written label, so the row still reads for anyone who
 * cannot separate the hues, and the dot is `aria-hidden` rather than announced
 * as a second, colour-shaped copy of the label. And each hue is declared as a
 * LITERAL class pair, `bg-rose-500 dark:bg-rose-400`, because Tailwind only
 * emits what it can see in the source and a template string compiles to
 * nothing.
 *
 * The reset lives in the trigger, where the chevron was, and it is a SIBLING of
 * the trigger rather than a child. `CascaderTrigger` renders a real `<button>`,
 * so a button inside it would be invalid HTML, would fail the
 * `nested-interactive` axe rule, and would open the popup on its way up from
 * its own click. Positioned over the trigger's inline end it gets the same
 * picture and none of that. `showIcon` withdraws the chevron for exactly as
 * long as the reset is standing in for it so the two never stack, `pe-8` holds
 * the space the chevron used to take so the dot and its labels truncate rather
 * than run underneath, and `end-*`/`pe-*` are logical so it all mirrors in RTL.
 *
 * The same reset is then named in the footer, and the two are additive rather
 * than duplicates. The X clears in one press for someone who can already see the
 * field; the footer row is the labelled one, in front of you while the popup is
 * open and a Tab away from the search field now that the panel routes Tab past
 * the scroll area, so it is a usable surface rather than a decoration.
 * `CascaderFooter` draws the rule
 * itself, with a `border-t` that sits exactly on the boundary between the list
 * and the footer. An explicit `CascaderSeparator` in here looked equivalent and
 * was not: it stacks its own block margin on top of BOTH containers' padding,
 * which measured 12px above the rule against 6px below, where the panel's own
 * rhythm is 4px after the search field and 0 between rows. The border needs no
 * arithmetic to be symmetric, because it is the boundary rather than a child of
 * one side of it.
 */
export default function Pattern() {
  const [value, setValue] = useState("")

  return (
    <div className="flex w-full justify-center p-4">
      <Cascader
        items={workflow}
        value={value}
        onValueChange={setValue}
        renderLabel={(node, state) =>
          state.branch ? (
            <span className="w-full truncate text-start font-medium">
              {node.label}
            </span>
          ) : (
            <span className="flex w-full min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rounded-full ${node.data?.dot}`}
              />
              <span className="min-w-0 flex-1 truncate text-start">
                {node.label}
              </span>
              {node.data?.hint ? (
                <span className="text-muted-foreground shrink-0 text-xs">
                  {node.data.hint}
                </span>
              ) : null}
            </span>
          )
        }
      >
        <div className="relative w-72">
          <CascaderTrigger
            aria-label="Workflow field"
            showIcon={!value}
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between gap-2 font-normal",
                  value && "pe-8"
                )}
              />
            }
          >
            <WorkflowValue />
          </CascaderTrigger>

          {value ? (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Reset field"
              onClick={() => setValue("")}
              className="absolute end-1 top-1/2 -translate-y-1/2"
            >
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </Button>
          ) : null}
        </div>

        <CascaderContent className="w-72">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>

            {/* A SIBLING of the list, never a child of it: `CascaderList`'s own
                Enter handler clicks whatever it contains, so a command living
                inside the rows would fire on the keystroke that commits one. */}
            <CascaderFooter>
              <ResetAction />
            </CascaderFooter>

            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  )
}
