"use client"

import { useState, type ReactNode } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@/registry-reui/bases/base/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/base/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/base/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/base/reui/cascader/cascader-types"
import { IconTile } from "@/registry-reui/bases/base/reui/icon-tile"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                   Accents                                  */
/* -------------------------------------------------------------------------- */

/**
 * One accent per top-level account: a hue, and the glyph that wears it.
 *
 * The hue is a CLASS STRING rather than a colour value, and it is stated once
 * per account rather than once per element. Three things about it, each of
 * which has bitten this example:
 *
 * 1. **It is a literal.** Tailwind scans source TEXT, so a computed
 *    `text-${hue}-600` compiles to nothing and the list ships uncoloured.
 * 2. **It is a light/dark PAIR.** A 600 that is comfortable on a white card is
 *    muddy on a near-black popup, so the dark half steps up to a 400.
 * 3. **It pins BOTH levels, with `!`.** The shared combobox sheet paints the
 *    highlighted row with `data-highlighted:**:text-accent-foreground`, a
 *    DESCENDANT selector. An icon set draws with `fill="currentColor"` or
 *    `stroke="currentColor"`, and either way the `<path>` inherits it and
 *    resolves it against ITS OWN colour, which the sheet has just repainted.
 *    Pinning the svg alone measures correct and still paints grey, so the
 *    `**:` half is not belt and braces, it is the half that works.
 *
 * The whole string goes on the TILE, not on the glyph. The `**:` half reaches
 * the glyph and its paths from there, so one class covers both, and the tile's
 * own `color` becomes the account hue - which is what lets the selected state
 * below tint from `currentColor` instead of restating eight palettes.
 */
const accents = {
  travel: {
    hue: "text-sky-600! **:text-sky-600! dark:text-sky-400! dark:**:text-sky-400!",
    glyph: (
      <IconPlaceholder
        lucide="PlaneIcon"
        tabler="IconPlane"
        hugeicons="AirplaneModeIcon"
        phosphor="AirplaneTiltIcon"
        remixicon="RiFlightTakeoffLine"
      />
    ),
  },
  software: {
    hue: "text-indigo-600! **:text-indigo-600! dark:text-indigo-400! dark:**:text-indigo-400!",
    glyph: (
      <IconPlaceholder
        lucide="CodeIcon"
        tabler="IconCode"
        hugeicons="SourceCodeIcon"
        phosphor="CodeIcon"
        remixicon="RiCodeLine"
      />
    ),
  },
  marketing: {
    hue: "text-fuchsia-600! **:text-fuchsia-600! dark:text-fuchsia-400! dark:**:text-fuchsia-400!",
    glyph: (
      <IconPlaceholder
        lucide="MegaphoneIcon"
        tabler="IconSpeakerphone"
        hugeicons="Megaphone01Icon"
        phosphor="MegaphoneIcon"
        remixicon="RiMegaphoneLine"
      />
    ),
  },
  people: {
    hue: "text-emerald-600! **:text-emerald-600! dark:text-emerald-400! dark:**:text-emerald-400!",
    glyph: (
      <IconPlaceholder
        lucide="UsersIcon"
        tabler="IconUsers"
        hugeicons="UserGroupIcon"
        phosphor="UsersIcon"
        remixicon="RiTeamLine"
      />
    ),
  },
  workplace: {
    hue: "text-amber-600! **:text-amber-600! dark:text-amber-400! dark:**:text-amber-400!",
    glyph: (
      <IconPlaceholder
        lucide="Building2Icon"
        tabler="IconBuilding"
        hugeicons="Building03Icon"
        phosphor="BuildingsIcon"
        remixicon="RiBuilding2Line"
      />
    ),
  },
  hardware: {
    hue: "text-violet-600! **:text-violet-600! dark:text-violet-400! dark:**:text-violet-400!",
    glyph: (
      <IconPlaceholder
        lucide="LaptopIcon"
        tabler="IconDeviceLaptop"
        hugeicons="LaptopIcon"
        phosphor="LaptopIcon"
        remixicon="RiMacbookLine"
      />
    ),
  },
  services: {
    hue: "text-teal-600! **:text-teal-600! dark:text-teal-400! dark:**:text-teal-400!",
    glyph: (
      <IconPlaceholder
        lucide="BriefcaseBusinessIcon"
        tabler="IconBriefcase"
        hugeicons="Briefcase01Icon"
        phosphor="BriefcaseIcon"
        remixicon="RiBriefcaseLine"
      />
    ),
  },
  logistics: {
    hue: "text-rose-600! **:text-rose-600! dark:text-rose-400! dark:**:text-rose-400!",
    glyph: (
      <IconPlaceholder
        lucide="TruckIcon"
        tabler="IconTruck"
        hugeicons="TruckIcon"
        phosphor="TruckIcon"
        remixicon="RiTruckLine"
      />
    ),
  },
} satisfies Record<string, { hue: string; glyph: ReactNode }>

type Account = keyof typeof accents

/** The one payload a row needs past its name: its chart-of-accounts code. */
type Ledger = { code: string }

/**
 * How a selected row says so, now that the built-in check is gone.
 *
 * `indicator={false}` on the root drops the single-select check AND the
 * inline-end gutter every style reserves for it, so the count and the chevron
 * end where the tile starts on the other edge. What it does not do is decide
 * how selection reads instead - that is this, and the row is what publishes the
 * state: `data-selected` lands on the row in every mode, and `in-data-[selected]`
 * is how a child paints from an ancestor's attribute. The primitive's own
 * checkbox is wired the same way, from the same attribute, one element deeper.
 *
 * The tile is the right thing to change because it is already the row's
 * identity column: the eye starts there, and one filled tile in a column of
 * outlined ones is unmissable in a way a tinted row is not once the pointer is
 * painting rows anyway.
 *
 * Two channels, not one. The FILL and the RING are geometry - a box that was
 * empty is now full, and has gained an edge it did not have - and the label
 * steps from `font-medium` to `font-semibold` under it. Someone who cannot
 * separate sky from teal still sees which row is marked. The colour is the
 * account's own hue rather than `primary`, which is what keeps the mark part
 * of the identity system this example is about.
 *
 * Everything derives from `currentColor`, which the accent above has already
 * pinned with `!` - so the mark survives the row being highlighted, in light
 * and in dark, without eight more literals. The `!` here is for the other
 * reason: `IconTile`'s `outline` variant states `bg-background` and
 * `dark:bg-input/32`, and a `dark:` utility and an `in-*:` one have no
 * guaranteed order between them.
 */
const TILE_SELECTED_CLASS =
  "in-data-[selected]:border-current/45! in-data-[selected]:bg-current/10! in-data-[selected]:ring-2 in-data-[selected]:ring-current/25"

/**
 * The account's mark, at whichever size the surface can hold.
 *
 * The tile is a real component rather than a `div` because it carries the
 * per-style radius. A literal radius would be wrong in lyra and sera (square)
 * and wrong again in maia and luma (much rounder).
 *
 * The glyph carries no `size-*`. `IconTile` sizes its children through
 * `--icon-tile-icon-size` with a `[&_svg:not([class*=size-])]` selector, so any
 * `size-` class on the svg opts that child out of the tile's own scale and the
 * glyph stops tracking the tile when the size token changes. That is exactly
 * why one component can serve both the 32px tile in a row and the 24px one on
 * the trigger: the size token moves and the glyph follows it.
 */
function AccountTile({
  account,
  size = "sm",
  className,
}: {
  account: Account
  size?: "xs" | "sm"
  className?: string
}) {
  return (
    <IconTile
      variant="outline"
      size={size}
      className={cn(accents[account].hue, className)}
    >
      {accents[account].glyph}
    </IconTile>
  )
}

/**
 * One tile per top-level account, reused by every node beneath it.
 *
 * `sm`, a 32px tile, which is the one step that fits this row. The row carries
 * two lines of type - a name, and a code plus an amount - which stack to about
 * 38px. `xs` at 24px reads as a stray glyph glued to the top line, and the 40px
 * default is TALLER than the text beside it, so the tile stops being the row's
 * identity column and starts being the thing that sets the row's height. At
 * 32px the text is what the row is tall for again, and the row gives back the
 * couple of pixels it was carrying for the tile alone.
 *
 * Nothing here has to align anything by hand. The row is `items-center` and the
 * icon slot is a `shrink-0` flex box inside it, so a 32px tile centres against
 * the whole two-line block rather than hanging off the title - and the count
 * and chevron on the far edge centre against the same block.
 *
 * `IconTile`'s `outline` variant is a plain bordered surface: one border, one
 * background, no tint of its own. That is still the point at rest. The colour
 * is a per-account IDENTIFIER, not a status, and a column of eight filled
 * swatches reads as eight alerts - so the chrome stays neutral, only the GLYPH
 * carries the hue, and the eye has one variable to track instead of two. The
 * one tile that does fill is the selected one, which is the whole reason the
 * rest stay quiet.
 */
const tiles = {
  travel: <AccountTile account="travel" className={TILE_SELECTED_CLASS} />,
  software: <AccountTile account="software" className={TILE_SELECTED_CLASS} />,
  marketing: (
    <AccountTile account="marketing" className={TILE_SELECTED_CLASS} />
  ),
  people: <AccountTile account="people" className={TILE_SELECTED_CLASS} />,
  workplace: (
    <AccountTile account="workplace" className={TILE_SELECTED_CLASS} />
  ),
  hardware: <AccountTile account="hardware" className={TILE_SELECTED_CLASS} />,
  services: <AccountTile account="services" className={TILE_SELECTED_CLASS} />,
  logistics: (
    <AccountTile account="logistics" className={TILE_SELECTED_CLASS} />
  ),
} satisfies Record<Account, ReactNode>

/**
 * Which account a value belongs to.
 *
 * Every value is dotted with the account first - "travel.airfare.domestic" -
 * so the root segment IS the key and the trigger needs no second lookup table
 * to colour itself. The membership check is what makes the cast honest rather
 * than hopeful.
 */
function accountOf(value: string): Account | null {
  const key = value.split(".")[0]
  return key in accents ? (key as Account) : null
}

/**
 * Stamps a whole subtree with its account's tile.
 *
 * This is the entire mechanism, and it is what makes the colour a TRAIL rather
 * than a label on the first row only: three levels into Travel, the sky plane
 * is still on every row, so the panel says which account you are spending
 * against without anyone having to read the breadcrumb.
 *
 * The tile is one element instance shared by every node under the account.
 * React elements are immutable, so reusing one is free, and it means the colour
 * cannot drift between a parent and its children by mistake.
 */
function account(
  name: Account,
  node: CascaderNode<Ledger>
): CascaderNode<Ledger> {
  return {
    ...node,
    icon: tiles[name],
    children: node.children?.map((child) => account(name, child)),
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

/**
 * A chart of accounts: a code, a name, and the quarter-to-date spend against
 * it. Every parent is the sum of its children, because a picker that shows
 * numbers which do not add up teaches the reader to stop trusting them.
 *
 * The codes are the real second half of an account's identity, and they are
 * shaped the way a ledger shapes them: X00 for a top-level account, XY0 for a
 * sub-account, XYZ for a leaf. Four fixed digits down the whole list is what
 * makes them worth showing in `tabular-nums` - the column is straight without
 * anything being aligned by hand.
 *
 * The amount goes in `description` rather than beside the label. The row
 * already has a number at its far edge - the count of what a branch opens - and
 * an earlier version of this example put a second, differently-meaning number
 * right next to it, so "1,204 items" and "3" sat side by side and neither one
 * read as anything.
 */
const accounts: CascaderNode<Ledger>[] = [
  account("travel", {
    value: "travel",
    label: "Travel",
    description: "$38,900",
    data: { code: "6100" },
    children: [
      {
        value: "travel.airfare",
        label: "Airfare",
        description: "$19,480",
        data: { code: "6110" },
        children: [
          {
            value: "travel.airfare.domestic",
            label: "Domestic",
            description: "$6,400",
            data: { code: "6111" },
          },
          {
            value: "travel.airfare.international",
            label: "International",
            description: "$11,900",
            data: { code: "6112" },
          },
          {
            value: "travel.airfare.changes",
            label: "Change fees",
            description: "$1,180",
            data: { code: "6113" },
          },
        ],
      },
      {
        value: "travel.lodging",
        label: "Lodging",
        description: "$12,350",
        data: { code: "6120" },
        children: [
          {
            value: "travel.lodging.hotels",
            label: "Hotels",
            description: "$9,240",
            data: { code: "6121" },
          },
          {
            value: "travel.lodging.rentals",
            label: "Short-term rentals",
            description: "$3,110",
            data: { code: "6122" },
          },
        ],
      },
      {
        value: "travel.ground",
        label: "Ground transport",
        description: "$7,070",
        data: { code: "6130" },
        children: [
          {
            value: "travel.ground.rideshare",
            label: "Rideshare",
            description: "$2,860",
            data: { code: "6131" },
          },
          {
            value: "travel.ground.rail",
            label: "Rail",
            description: "$1,940",
            data: { code: "6132" },
          },
          {
            value: "travel.ground.rental",
            label: "Car rental",
            description: "$2,270",
            data: { code: "6133" },
          },
        ],
      },
    ],
  }),
  account("software", {
    value: "software",
    label: "Software",
    description: "$22,230",
    data: { code: "6200" },
    children: [
      {
        value: "software.design",
        label: "Design tools",
        description: "$4,320",
        data: { code: "6210" },
      },
      {
        value: "software.developer",
        label: "Developer tools",
        description: "$11,760",
        data: { code: "6220" },
      },
      {
        value: "software.analytics",
        label: "Analytics",
        description: "$6,150",
        data: { code: "6230" },
      },
    ],
  }),
  account("marketing", {
    value: "marketing",
    label: "Marketing",
    description: "$58,570",
    data: { code: "6300" },
    children: [
      {
        value: "marketing.ads",
        label: "Paid advertising",
        description: "$35,350",
        data: { code: "6310" },
        children: [
          {
            value: "marketing.ads.search",
            label: "Search",
            description: "$18,400",
            data: { code: "6311" },
          },
          {
            value: "marketing.ads.social",
            label: "Social",
            description: "$12,650",
            data: { code: "6312" },
          },
          {
            value: "marketing.ads.display",
            label: "Display",
            description: "$4,300",
            data: { code: "6313" },
          },
        ],
      },
      {
        value: "marketing.events",
        label: "Events",
        description: "$15,800",
        data: { code: "6320" },
        children: [
          {
            value: "marketing.events.conferences",
            label: "Conferences",
            description: "$9,800",
            data: { code: "6321" },
          },
          {
            value: "marketing.events.sponsorships",
            label: "Sponsorships",
            description: "$6,000",
            data: { code: "6322" },
          },
        ],
      },
      {
        value: "marketing.content",
        label: "Content",
        description: "$7,420",
        data: { code: "6330" },
      },
    ],
  }),
  account("people", {
    value: "people",
    label: "People",
    description: "$279,950",
    data: { code: "6400" },
    children: [
      {
        value: "people.salaries",
        label: "Salaries",
        description: "$214,600",
        data: { code: "6410" },
      },
      {
        value: "people.contractors",
        label: "Contractors",
        description: "$38,900",
        data: { code: "6420" },
      },
      {
        value: "people.benefits",
        label: "Benefits",
        description: "$26,450",
        data: { code: "6430" },
      },
    ],
  }),
  account("workplace", {
    value: "workplace",
    label: "Workplace",
    description: "$38,020",
    data: { code: "6500" },
    children: [
      {
        value: "workplace.rent",
        label: "Rent",
        description: "$31,200",
        data: { code: "6510" },
      },
      {
        value: "workplace.utilities",
        label: "Utilities",
        description: "$4,180",
        data: { code: "6520" },
      },
      {
        value: "workplace.supplies",
        label: "Supplies",
        description: "$2,640",
        data: { code: "6530" },
      },
    ],
  }),
  account("hardware", {
    value: "hardware",
    label: "Hardware",
    description: "$35,070",
    data: { code: "6600" },
    children: [
      {
        value: "hardware.laptops",
        label: "Laptops",
        description: "$24,300",
        data: { code: "6610" },
      },
      {
        value: "hardware.displays",
        label: "Displays",
        description: "$7,650",
        data: { code: "6620" },
      },
      {
        value: "hardware.peripherals",
        label: "Peripherals",
        description: "$3,120",
        data: { code: "6630" },
      },
    ],
  }),
  account("services", {
    value: "services",
    label: "Professional services",
    description: "$38,550",
    data: { code: "6700" },
    children: [
      {
        value: "services.legal",
        label: "Legal",
        description: "$16,900",
        data: { code: "6710" },
      },
      {
        value: "services.accounting",
        label: "Accounting",
        description: "$12,400",
        data: { code: "6720" },
      },
      {
        value: "services.consulting",
        label: "Consulting",
        description: "$9,250",
        data: { code: "6730" },
      },
    ],
  }),
  account("logistics", {
    value: "logistics",
    label: "Logistics",
    description: "$21,410",
    data: { code: "6800" },
    children: [
      {
        value: "logistics.freight",
        label: "Freight",
        description: "$12,900",
        data: { code: "6810" },
      },
      {
        value: "logistics.courier",
        label: "Courier",
        description: "$5,240",
        data: { code: "6820" },
      },
      {
        value: "logistics.packaging",
        label: "Packaging",
        description: "$3,270",
        data: { code: "6830" },
      },
    ],
  }),
]

/* -------------------------------------------------------------------------- */
/*                                   Pattern                                  */
/* -------------------------------------------------------------------------- */

/**
 * Colour that means something: an expense account picker.
 *
 * Each top-level account owns a colour, and that colour is the same one the
 * account has everywhere else in a spend tool - its slice of the pie chart, its
 * dot in the ledger, its band on the budget bar. That is what makes it worth
 * putting in a picker at all. A palette applied to rows because rows look nicer
 * in colour is decoration, and it costs a reader more than it gives them.
 *
 * ## The row
 *
 * Four columns, and each one answers a different question. The tile says which
 * account. The label block says which line, twice over: the name on top, and
 * under it the code and the amount, which is the pair an approver actually
 * files against. The trailing number says how much is inside a branch, and the
 * chevron is the way in.
 *
 * The two halves of the label are separated by a hairline rather than by
 * colour, because colour is the one distinction that does NOT survive here: the
 * style sheets repaint every descendant of a highlighted row to
 * `accent-foreground`, so a muted code and a foreground amount become the same
 * grey under the pointer. A one-pixel rule is a background, and backgrounds are
 * left alone.
 *
 * `renderLabel` replaces only the label block, so the tile stays in the
 * primitive's own `icon` slot and the count and chevron stay where the
 * primitive puts them. An even earlier version built the whole row inside
 * `renderLabel`, which put the tile INSIDE the label column and left the icon
 * slot empty: nothing aligned, and the accent read as a bullet rather than a
 * marker.
 *
 * ## Marking the selection
 *
 * `indicator={false}`. By default a single-select cascader draws a check on a
 * row's inline end and every row reserves that gutter whether anything is
 * selected or not - which is what keeps a level's counts and chevrons on one
 * straight line. Here the tile already carries the selection (see
 * `TILE_SELECTED_CLASS`), so the gutter was 24px of nothing, holding the real
 * trailing content one gutter in from an edge no mark ever appeared on. The
 * prop drops the check and the gutter together, and the count and chevron now
 * end exactly where the tile begins on the other side.
 *
 * `aria-selected` is untouched by any of this: it is Base UI's and it stays on
 * every row, so a screen reader announces the selection exactly as before. Only
 * the visual mark moved.
 *
 * `selectable="any"` because a receipt may well be filed against "Travel"
 * itself rather than against a leaf. The chevron stays the way into the level,
 * so pressing the row commits and pressing the chevron drills.
 *
 * ## The trigger
 *
 * The tile follows the selection out of the panel, one size down. A 32px tile
 * is right beside two lines of type and fills a button that is 32px in most
 * styles edge to edge, so `CascaderValue` renders without the node's own icon
 * and a 24px tile is composed beside it instead. Same component, same accent,
 * same lookup - `accountOf` reads the account back out of the value - and no
 * second palette to keep in step.
 *
 * The clear control sits inside the trigger's frame, where the chevron sits,
 * but it is a SIBLING of the trigger and not a child of it. `CascaderTrigger`
 * renders a real `<button>`, so a button nested in it would be invalid HTML,
 * would fail the `nested-interactive` axe rule, and would reopen the panel on
 * its own click on the way up. Absolute positioning over the trigger's inline
 * end gets the picture without any of that. `showIcon` takes the chevron away
 * for exactly as long as the clear button is standing in for it so the two
 * never stack, `pe-8` keeps the space the chevron used to hold so a long
 * account name truncates instead of running under the button, and `end-*` and
 * `pe-*` are logical, so the arrangement mirrors in RTL.
 */
export default function Pattern() {
  const [value, setValue] = useState("")
  const selectedAccount = value ? accountOf(value) : null

  return (
    <div className="flex w-full justify-center p-4">
      <Cascader
        items={accounts}
        value={value}
        onValueChange={setValue}
        selectable="any"
        indicator={false}
        renderLabel={(node, state) => (
          <>
            <span
              className={cn(
                "w-full truncate text-start",
                // The second channel. A fill is geometry and a weight is
                // geometry; between them the marked row is legible without
                // anyone having to tell sky from teal.
                state.selected ? "font-semibold" : "font-medium"
              )}
            >
              {node.label}
            </span>
            <span className="flex w-full min-w-0 items-center gap-1.5 text-xs">
              <span className="text-muted-foreground shrink-0 tabular-nums">
                {/* A naked four-digit number after a name is not a fact, it is
                    a riddle. The row's accessible name is its text, so the one
                    word that makes it a fact is said there and nowhere else. */}
                <span className="sr-only">account code </span>
                {node.data?.code}
              </span>
              {/* A background, not a colour: the row's highlight rule repaints
                  text and leaves this alone, so the two halves stay two halves
                  under the pointer. */}
              <span
                aria-hidden="true"
                className="bg-border h-2.5 w-px shrink-0"
              />
              <span className="truncate tabular-nums">{node.description}</span>
            </span>
          </>
        )}
      >
        <div className="relative w-80">
          <CascaderTrigger
            aria-label="Expense account"
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
            {selectedAccount ? (
              <AccountTile account={selectedAccount} size="xs" />
            ) : null}
            {/* `showIcon={false}`: the node's own icon is the row-sized tile,
                which no style's button is tall enough to hold. `flex-1` so the
                path takes the space the tile leaves and truncates in it. */}
            <CascaderValue
              showIcon={false}
              placeholder="Assign an expense account"
              className="min-w-0 flex-1"
            />
          </CascaderTrigger>

          {value ? (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Clear account"
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

        <CascaderContent className="w-80">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput placeholder="Search accounts..." />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  )
}
