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
import { CascaderItems } from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  CascaderInput,
  CascaderNav,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const globeIcon = (
  <IconPlaceholder
    lucide="GlobeIcon"
    tabler="IconWorld"
    hugeicons="Globe02Icon"
    phosphor="GlobeIcon"
    remixicon="RiGlobalLine"
    className="size-4"
  />
)
const compassIcon = (
  <IconPlaceholder
    lucide="CompassIcon"
    tabler="IconCompass"
    hugeicons="Navigation03Icon"
    phosphor="CompassIcon"
    remixicon="RiCompassLine"
    className="size-4"
  />
)

/**
 * ISO 3166-1 alpha-2 to its regional indicator pair, so "DE" becomes the German
 * flag. Deriving it keeps the table below down to a code and a name per country
 * rather than sixty pasted emoji, and it leaves the code as the single source
 * of the flag: a typo cannot show the right flag beside the wrong country.
 */
function flagOf(iso2: string) {
  return String.fromCodePoint(
    ...[...iso2].map((letter) => letter.charCodeAt(0) + 127397)
  )
}

/**
 * The flag goes in the row's icon slot, not into the label. In a multi-select
 * tree the checkbox leads the row, and the icon is the very next column, so the
 * flag lands exactly where the globe and the compass sit one and two levels up
 * and every depth keeps one label column.
 *
 * Fixed width on purpose. Windows Chrome ships no regional indicator glyphs and
 * falls back to the two letters, whose width changes per pair, so without `w-5`
 * the country names in one level would each start on a slightly different
 * column. `aria-hidden` because the country name is already the row's text, and
 * announcing the flag as well would just read it twice.
 */
function flagIcon(iso2: string) {
  return (
    <span aria-hidden="true" className="w-5 text-center text-base leading-none">
      {flagOf(iso2)}
    </span>
  )
}

/** `[iso2, name]`. The flag is derived from the code, see `flagOf`. */
type CountryTuple = readonly [string, string]
/** `[slug, label, countries]`. */
type RegionTuple = readonly [string, string, readonly CountryTuple[]]
/** `[slug, label, regions]`. */
type ContinentTuple = readonly [string, string, readonly RegionTuple[]]

const CONTINENTS: readonly ContinentTuple[] = [
  [
    "europe",
    "Europe",
    [
      [
        "western",
        "Western Europe",
        [
          ["DE", "Germany"],
          ["FR", "France"],
          ["NL", "Netherlands"],
          ["BE", "Belgium"],
          ["AT", "Austria"],
          ["CH", "Switzerland"],
        ],
      ],
      [
        "northern",
        "Northern Europe",
        [
          ["GB", "United Kingdom"],
          ["IE", "Ireland"],
          ["SE", "Sweden"],
          ["NO", "Norway"],
          ["DK", "Denmark"],
          ["FI", "Finland"],
        ],
      ],
      [
        "southern",
        "Southern Europe",
        [
          ["IT", "Italy"],
          ["ES", "Spain"],
          ["PT", "Portugal"],
          ["GR", "Greece"],
        ],
      ],
      [
        "central",
        "Central Europe",
        [
          ["PL", "Poland"],
          ["CZ", "Czechia"],
          ["HU", "Hungary"],
          ["RO", "Romania"],
        ],
      ],
    ],
  ],
  [
    "americas",
    "Americas",
    [
      [
        "north",
        "North America",
        [
          ["US", "United States"],
          ["CA", "Canada"],
          ["MX", "Mexico"],
        ],
      ],
      [
        "south",
        "South America",
        [
          ["BR", "Brazil"],
          ["AR", "Argentina"],
          ["CL", "Chile"],
          ["CO", "Colombia"],
          ["PE", "Peru"],
        ],
      ],
      [
        "central",
        "Central America",
        [
          ["CR", "Costa Rica"],
          ["PA", "Panama"],
          ["GT", "Guatemala"],
          ["DO", "Dominican Republic"],
        ],
      ],
    ],
  ],
  [
    "apac",
    "Asia Pacific",
    [
      [
        "east",
        "East Asia",
        [
          ["JP", "Japan"],
          ["KR", "South Korea"],
          ["CN", "China"],
          ["TW", "Taiwan"],
          ["HK", "Hong Kong"],
        ],
      ],
      [
        "southeast",
        "Southeast Asia",
        [
          ["SG", "Singapore"],
          ["MY", "Malaysia"],
          ["TH", "Thailand"],
          ["VN", "Vietnam"],
          ["ID", "Indonesia"],
          ["PH", "Philippines"],
        ],
      ],
      [
        "south",
        "South Asia",
        [
          ["IN", "India"],
          ["PK", "Pakistan"],
          ["BD", "Bangladesh"],
          ["LK", "Sri Lanka"],
        ],
      ],
    ],
  ],
  [
    "mideast",
    "Middle East",
    [
      [
        "gulf",
        "Gulf States",
        [
          ["AE", "United Arab Emirates"],
          ["SA", "Saudi Arabia"],
          ["QA", "Qatar"],
          ["KW", "Kuwait"],
          ["BH", "Bahrain"],
          ["OM", "Oman"],
        ],
      ],
      [
        "levant",
        "Levant",
        [
          ["IL", "Israel"],
          ["JO", "Jordan"],
          ["LB", "Lebanon"],
        ],
      ],
    ],
  ],
  [
    "africa",
    "Africa",
    [
      [
        "north",
        "North Africa",
        [
          ["MA", "Morocco"],
          ["EG", "Egypt"],
          ["TN", "Tunisia"],
          ["DZ", "Algeria"],
        ],
      ],
      [
        "west",
        "West Africa",
        [
          ["NG", "Nigeria"],
          ["GH", "Ghana"],
          ["SN", "Senegal"],
          ["CI", "Cote d'Ivoire"],
        ],
      ],
      [
        "east",
        "East Africa",
        [
          ["KE", "Kenya"],
          ["TZ", "Tanzania"],
          ["ET", "Ethiopia"],
          ["UG", "Uganda"],
        ],
      ],
      [
        "south",
        "Southern Africa",
        [
          ["ZA", "South Africa"],
          ["BW", "Botswana"],
          ["NA", "Namibia"],
        ],
      ],
    ],
  ],
  [
    "oceania",
    "Oceania",
    [
      [
        "anz",
        "Australia and New Zealand",
        [
          ["AU", "Australia"],
          ["NZ", "New Zealand"],
        ],
      ],
      [
        "pacific",
        "Pacific Islands",
        [
          ["FJ", "Fiji"],
          ["PG", "Papua New Guinea"],
          ["NC", "New Caledonia"],
          ["PF", "French Polynesia"],
        ],
      ],
    ],
  ],
]

const zones: CascaderNode[] = CONTINENTS.map(
  ([continent, continentLabel, regions]) => ({
    value: continent,
    label: continentLabel,
    icon: globeIcon,
    children: regions.map(([region, regionLabel, countries]) => ({
      value: `${continent}.${region}`,
      label: regionLabel,
      icon: compassIcon,
      children: countries.map(([iso2, name]) => ({
        // Exactly three dot separated segments, and no segment carries a dot of
        // its own. That is what lets the summary below tell a country apart
        // from the region and the continent above it by counting separators.
        value: `${continent}.${region}.${iso2.toLowerCase()}`,
        label: name,
        icon: flagIcon(iso2),
        // So the search field finds Germany on "DE" as well as on the name.
        keywords: [iso2],
      })),
    })),
  })
)

/**
 * A headless trigger, because a cascade cannot be summarised by listing what is
 * in the value.
 *
 * Two things go wrong if you try. The count is inflated: ticking Western Europe
 * commits the region AND its six countries, so the honest number of shipping
 * destinations is the leaves alone. And the labels are the wrong ones: the six
 * countries under a fully committed region were never pressed individually, and
 * naming them back at the user hides the one press that actually happened.
 *
 * `useCascaderSelection` hands back one ancestor chain per selected node, which
 * is enough to fix both without parsing a single value string. A leaf is a chain
 * whose last node has no children. The sample keeps only the TOP of the
 * selection - a node whose parent is committed too is already spoken for by
 * that parent - so six countries collapse back into "Western Europe" and a lone
 * country still speaks for itself.
 *
 * ## What the line says, and why it is ONE size
 *
 * It used to read "6 countries" in the control's own type with the names beside
 * it in `text-xs` muted, which is the trigger equivalent of a footnote: the
 * user's actual choice was set in the smallest type on the control, under the
 * one fact they could have worked out themselves. So the sizes are gone and
 * the order is reversed. The line now names the SELECTION first, at the
 * control's own size, and closes with the leaf total.
 *
 * Both facts are needed and neither replaces the other. The names alone cannot
 * say how big the selection is once a region stands in for six countries; the
 * count alone cannot say which six. The deepest common ancestor was the other
 * candidate and it was rejected: it reads beautifully for one branch and
 * collapses to "everywhere" the moment a second continent is ticked, which is
 * exactly the selection worth describing.
 *
 * The "+N" is gone with the small type. A truncated list already says there is
 * more, and a "+4" sitting next to a "12 countries" was two numbers counting
 * different things a few pixels apart. So the names take `min-w-0 truncate` and
 * give way, and the count is `shrink-0` and survives any trigger width - the
 * middle dot travels with it so the line never ends on a dangling separator.
 */
function ZoneValue() {
  const { selected, paths, isEmpty } = useCascaderSelection()

  const committed = new Set(selected.map((node) => node.value))
  // A value the tree does not hold resolves to an EMPTY chain, so the guard
  // comes before anything reads the last node of one.
  const chains = paths.filter((path) => path.length > 0)

  // `isEmpty` covers the usual case; `chains` covers the one where every value
  // in the selection is a stale id the tree can no longer resolve, which would
  // otherwise render a confident "0 countries" beside nothing at all.
  if (isEmpty || chains.length === 0) {
    return (
      <span className="text-muted-foreground truncate">
        Select shipping destinations
      </span>
    )
  }

  const countries = chains.filter(
    (path) => !path[path.length - 1].children?.length
  ).length

  const covering = chains
    .filter((path) => {
      const parent = path[path.length - 2]
      return !parent || !committed.has(parent.value)
    })
    .map((path) => path[path.length - 1].label)

  return (
    <span className="flex min-w-0 flex-1 items-center gap-1.5 text-start">
      <span className="min-w-0 truncate">{covering.join(", ")}</span>
      <span className="text-muted-foreground shrink-0">
        · {countries} {countries === 1 ? "country" : "countries"}
      </span>
    </span>
  )
}

/**
 * A cascading tree in a POPOVER.
 *
 * Shipping zones are the case for the cascade: "everywhere in Western Europe"
 * is one press, not six, and dropping a single country has to demote the region
 * from fully selected to partial rather than leaving a checkbox that lies. The
 * comment deliberately avoids the shorter phrasing there: `verify-registry`
 * scans for `from "..."` to collect a file's imports, and a quoted word after
 * `from` inside a COMMENT is read as an undeclared dependency. Continent,
 * region, country is the shallowest tree where that is worth showing. At two
 * levels a branch is full or empty at a glance and the partial state carries
 * nothing.
 *
 * Three things make the selection work together. `cascade` propagates a commit
 * over the pressed node's subtree and reconciles its ancestors afterwards.
 * `selectable="any"` is what lets a branch be pressed at all - without it there
 * is nothing for a cascade to start from. And tree mode keeps the whole shape
 * visible, which is the only way a partial state means anything.
 *
 * The popup is the reason this exists as its own example rather than as a
 * variant of an inline one. A tree is the single mode whose height is under the
 * USER's control: every disclosure adds or removes rows while the panel is
 * already anchored to the trigger, so expanding Africa asks the popup to
 * re-measure on a press that had nothing to do with opening it. Get the bound
 * wrong and the last rows land off the bottom of the screen, or the popup flips
 * to the other side of the trigger mid-interaction.
 *
 * Which is the whole height contract: `CascaderList` takes NO `maxHeight` here.
 * Inline there is no positioner, nothing publishes `--available-height`, and an
 * explicit cap is the only bound in existence - which is why this example
 * carried `maxHeight={260}` while it was inline. Under `CascaderContent` the
 * positioner publishes the distance from the trigger to the edge of the
 * viewport, the list bounds itself at `min(--available-height, 24rem)`, and the
 * scroll area inside absorbs everything past that. The popup stops at the
 * viewport, and expanding a branch scrolls the rows rather than growing it.
 *
 * It opens with nothing picked and Western Europe already expanded, so the
 * first country ticked is also the first indeterminate region. The number on a
 * branch is the primitive's own: children until something inside is selected,
 * then the selected total in the accent colour, which is the second reading of
 * "some" for anyone who cannot see the box's third state.
 *
 * The heading over the control is gone. It said "Countries this store ships
 * to" above a trigger whose empty state already says "Select shipping
 * destinations" and whose filled state names what was picked, so it was the
 * same sentence twice with the field between them. A real form has a `Field`
 * and a `Label` doing accessible-name work; a one-control example has neither,
 * and a bare `<p>` is decoration that only pretends to.
 */
export default function Pattern() {
  const [value, setValue] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([
    "europe",
    "europe.western",
  ])

  return (
    <div className="flex w-full justify-center p-4">
      <div className="w-full max-w-sm">
        <Cascader
          multiple
          cascade
          selectable="any"
          mode="tree"
          items={zones}
          value={value}
          onValueChange={setValue}
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          <CascaderTrigger
            aria-label="Shipping destinations"
            render={
              <Button
                variant="outline"
                className="w-full justify-between gap-2 font-normal"
              />
            }
          >
            <ZoneValue />
          </CascaderTrigger>

          {/* WIDER THAN THE TRIGGER, on purpose, and the one measurement that
              fixes the deepest level.

              Where a country row's width goes, in nova, with the popup at the
              trigger's own 384px: 8px of list padding, then a 6px start inset
              plus 32px of indent (two levels at the row's default 16), a 6px
              end inset, an 18px expander slot the leaf reserves but cannot
              use, a 16px checkbox, a 20px flag and three 8px gaps. 130px of
              the 384 is gone before the country name starts, and in a narrow
              embed - a catalog card, a phone - the popup falls back to its own
              floor and the name is down to about 190px.

              `w-80` was that floor, and at this demo's width it was INERT:
              320px never beats the `min-w-(--anchor-width)` the popup already
              takes from a 384px trigger, so the class changed no pixel anyone
              ever saw. `CascaderContent` deliberately does not clamp to the
              anchor - a cascade is routinely wider than the control that opens
              it - so the fix is to name a width ABOVE the anchor. 416px puts
              every one of those 32px into the label column at every depth and
              raises the narrow-embed floor by the same amount. It stays
              bounded: `max-w-(--available-width)` still clamps it on a small
              viewport.

              Three alternatives were rejected. A smaller per-depth `indent` is
              the tempting one, but `CascaderItem` only takes it from a row you
              render yourself, and `CascaderItems`' tree-mode render prop hands
              back a node and an index - no `expanded`, no `aria-setsize` or
              `aria-posinset`. `depth` still resolves itself off the tree
              index, `expanded` has no such fallback, so every branch would
              draw a collapsed chevron and the tree would lose its position
              metadata. That is accessibility traded for 8px a level. Trimming
              the row has nothing left to take: the flag IS the icon slot, the
              name IS the label, and the empty expander slot and the leading
              checkbox are per-list decisions that keep one label column per
              depth. And widening the CONTROL to `max-w-md` buys the same
              pixels by changing what the example is about - a normal-width
              field with a big tree behind it. */}
          <CascaderContent className="w-[26rem]">
            <CascaderPanel>
              <CascaderNav>
                {/* Tree mode never drills, so there is no level to go back to. */}
                <CascaderInput showBack={false} />
              </CascaderNav>
              <CascaderEmpty />
              <CascaderList>
                <CascaderItems />
              </CascaderList>
              <CascaderStatus />
            </CascaderPanel>
          </CascaderContent>
        </Cascader>
      </div>
    </div>
  )
}
