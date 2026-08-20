"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@/registry-reui/bases/base/reui/cascader/cascader"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/base/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/base/reui/cascader/cascader-types"
import { CascaderVirtualItems } from "@/registry-reui/bases/base/reui/cascader/cascader-virtual"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Spinner } from "@/registry/bases/base/ui/spinner"
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

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

/**
 * `[iso2, country, cities]`.
 *
 * The cities are one comma separated string rather than a nested array so a
 * country stays one readable line. Four real cities each, which is what the
 * generator below needs to fill a country's share of its region without
 * repeating itself, and few enough to stay accurate for small markets as well
 * as large ones. The flag is derived from the code, see `flagOf`.
 */
type CountrySeed = readonly [string, string, string]

/**
 * `[id, label, markets, countries]`. Six regions, ten countries each, plus the
 * number of markets that region carries.
 *
 * The counts are unequal and un-round on purpose. See the sizing note above the
 * component for why they are these numbers rather than one figure repeated.
 */
const REGIONS: readonly (readonly [
  string,
  string,
  number,
  readonly CountrySeed[],
])[] = [
  [
    "europe",
    "Europe",
    612,
    [
      ["DE", "Germany", "Berlin,Munich,Hamburg,Cologne"],
      ["FR", "France", "Paris,Lyon,Marseille,Toulouse"],
      ["GB", "United Kingdom", "London,Manchester,Birmingham,Glasgow"],
      ["IT", "Italy", "Rome,Milan,Naples,Turin"],
      ["ES", "Spain", "Madrid,Barcelona,Valencia,Seville"],
      ["PL", "Poland", "Warsaw,Krakow,Gdansk,Wroclaw"],
      ["NL", "Netherlands", "Amsterdam,Rotterdam,Utrecht,Eindhoven"],
      ["BE", "Belgium", "Brussels,Antwerp,Ghent,Liege"],
      ["SE", "Sweden", "Stockholm,Gothenburg,Malmo,Uppsala"],
      ["PT", "Portugal", "Lisbon,Porto,Braga,Coimbra"],
    ],
  ],
  [
    "americas",
    "Americas",
    528,
    [
      ["US", "United States", "New York,Chicago,Los Angeles,Miami"],
      ["BR", "Brazil", "Sao Paulo,Rio de Janeiro,Belo Horizonte,Recife"],
      ["MX", "Mexico", "Mexico City,Guadalajara,Monterrey,Puebla"],
      ["CO", "Colombia", "Bogota,Medellin,Cali,Barranquilla"],
      ["AR", "Argentina", "Buenos Aires,Cordoba,Rosario,Mendoza"],
      ["CA", "Canada", "Toronto,Montreal,Vancouver,Calgary"],
      ["PE", "Peru", "Lima,Arequipa,Trujillo,Cusco"],
      ["VE", "Venezuela", "Caracas,Maracaibo,Valencia,Barquisimeto"],
      ["CL", "Chile", "Santiago,Valparaiso,Concepcion,Antofagasta"],
      ["EC", "Ecuador", "Quito,Guayaquil,Cuenca,Ambato"],
    ],
  ],
  [
    "apac",
    "Asia Pacific",
    674,
    [
      ["IN", "India", "Mumbai,Delhi,Bengaluru,Chennai"],
      ["CN", "China", "Shanghai,Beijing,Shenzhen,Chengdu"],
      ["ID", "Indonesia", "Jakarta,Surabaya,Bandung,Medan"],
      ["PK", "Pakistan", "Karachi,Lahore,Islamabad,Faisalabad"],
      ["JP", "Japan", "Tokyo,Osaka,Nagoya,Fukuoka"],
      ["PH", "Philippines", "Manila,Cebu,Davao,Quezon City"],
      ["VN", "Vietnam", "Hanoi,Ho Chi Minh City,Da Nang,Can Tho"],
      ["TH", "Thailand", "Bangkok,Chiang Mai,Phuket,Khon Kaen"],
      ["KR", "South Korea", "Seoul,Busan,Incheon,Daegu"],
      ["MY", "Malaysia", "Kuala Lumpur,Penang,Johor Bahru,Ipoh"],
    ],
  ],
  [
    "africa",
    "Africa",
    431,
    [
      ["NG", "Nigeria", "Lagos,Abuja,Kano,Port Harcourt"],
      ["ET", "Ethiopia", "Addis Ababa,Dire Dawa,Mekelle,Hawassa"],
      ["EG", "Egypt", "Cairo,Alexandria,Giza,Luxor"],
      ["CD", "DR Congo", "Kinshasa,Lubumbashi,Goma,Kisangani"],
      ["TZ", "Tanzania", "Dar es Salaam,Dodoma,Mwanza,Arusha"],
      ["ZA", "South Africa", "Johannesburg,Cape Town,Durban,Pretoria"],
      ["KE", "Kenya", "Nairobi,Mombasa,Kisumu,Nakuru"],
      ["SD", "Sudan", "Khartoum,Omdurman,Port Sudan,Nyala"],
      ["MA", "Morocco", "Casablanca,Rabat,Marrakesh,Tangier"],
      ["GH", "Ghana", "Accra,Kumasi,Tamale,Takoradi"],
    ],
  ],
  [
    "mideast",
    "Middle East",
    386,
    [
      ["TR", "Turkiye", "Istanbul,Ankara,Izmir,Bursa"],
      ["IR", "Iran", "Tehran,Mashhad,Isfahan,Shiraz"],
      ["IQ", "Iraq", "Baghdad,Basra,Mosul,Erbil"],
      ["SA", "Saudi Arabia", "Riyadh,Jeddah,Dammam,Mecca"],
      ["YE", "Yemen", "Sanaa,Aden,Taiz,Hodeidah"],
      ["SY", "Syria", "Damascus,Aleppo,Homs,Latakia"],
      ["JO", "Jordan", "Amman,Zarqa,Irbid,Aqaba"],
      ["IL", "Israel", "Tel Aviv,Jerusalem,Haifa,Beersheba"],
      ["AE", "United Arab Emirates", "Dubai,Abu Dhabi,Sharjah,Al Ain"],
      ["OM", "Oman", "Muscat,Salalah,Sohar,Nizwa"],
    ],
  ],
  [
    "oceania",
    "Oceania",
    317,
    [
      ["AU", "Australia", "Sydney,Melbourne,Brisbane,Perth"],
      ["NZ", "New Zealand", "Auckland,Wellington,Christchurch,Hamilton"],
      ["PG", "Papua New Guinea", "Port Moresby,Lae,Mount Hagen,Madang"],
      ["FJ", "Fiji", "Suva,Nadi,Lautoka,Labasa"],
      ["SB", "Solomon Islands", "Honiara,Auki,Gizo,Munda"],
      ["NC", "New Caledonia", "Noumea,Mont-Dore,Dumbea,Paita"],
      ["PF", "French Polynesia", "Papeete,Faaa,Punaauia,Pirae"],
      ["VU", "Vanuatu", "Port Vila,Luganville,Isangel,Lakatoro"],
      ["WS", "Samoa", "Apia,Vaitele,Faleasiu,Salelologa"],
      ["TO", "Tonga", "Nuku'alofa,Neiafu,Haveluloto,Vaini"],
    ],
  ],
] as const

/**
 * ISO 3166-1 alpha-2 to its regional indicator pair: "DE" becomes the German
 * flag. The offset from an ASCII letter to its indicator is a constant, so
 * sixty flags cost one line rather than sixty pasted emoji.
 *
 * Emoji rather than an icon package on purpose - the repo already carries flags
 * as plain string data, and a decorative glyph is not worth a registry
 * dependency. Windows Chrome ships no regional indicator glyphs and falls back
 * to the two letters, which still reads as the country beside its name.
 */
function flagOf(iso2: string): string {
  return String.fromCodePoint(
    ...[...iso2].map((letter) => letter.charCodeAt(0) + 127397)
  )
}

interface Market {
  /** Territory inside the country, e.g. "Munich Ring". Never a region name. */
  area: string
  /** Reachable subscribers, thousands. */
  subscribers: number
}

/**
 * How a country's markets are split up, in the order a sales directory would
 * add them: the city on its own first, then its metro, then the compass
 * territories, then the ring roads and their segments, then the outskirts.
 *
 * Four cities times these eighteen zones is seventy-two distinct market names
 * per country, and the largest region here gives a country sixty-eight rows -
 * so no row inside a country is ever a duplicate of another, with the margin
 * sitting on the right side of the biggest level rather than the smallest.
 */
const MARKET_ZONES = [
  "",
  "Metro",
  "North",
  "South",
  "East",
  "West",
  "Central",
  "Northeast",
  "Northwest",
  "Southeast",
  "Southwest",
  "Ring",
  "Corridor",
  "Inner Ring",
  "Outer Ring",
  "North Ring",
  "South Ring",
  "Outskirts",
] as const

const TOTAL_MARKETS = REGIONS.reduce(
  (total, [, , markets]) => total + markets,
  0
)

const REGION_SIZES = REGIONS.map(([, , markets]) => markets)
const SMALLEST_REGION = Math.min(...REGION_SIZES)
const LARGEST_REGION = Math.max(...REGION_SIZES)

const COUNTRY_COUNT = REGIONS.reduce(
  (total, [, , , countries]) => total + countries.length,
  0
)

/**
 * Reach tiers, and the one rule the trailing badge follows: the tone is what
 * the NUMBER means, never a colour picked to break up the list. Read down a
 * level and the ladder is the sales ladder.
 *
 * | reach       | tone    | what it says                            |
 * | ----------- | ------- | --------------------------------------- |
 * | under 250k  | warning | under the floor a territory is sold at  |
 * | 250 to 499k | primary | the standard market                     |
 * | 500 to 749k | info    | large enough to staff on its own        |
 * | 750k and up | success | top tier, carries the country           |
 *
 * `pin` is not decoration. A cascader row carries
 * `data-highlighted:**:text-accent-foreground`, a DESCENDANT rule, so the row
 * under the cursor repaints every element inside it - and a badge whose colour
 * IS the tier would go the same grey as its neighbours exactly when the reader
 * is looking hardest at it. `!` holds the tier through the highlight. The dark
 * half needs its own because the `*-light` variants swap token there.
 *
 * No `size`, so the badge is the default h-5. That is the same twenty pixels
 * `text-sm` already gives the label in six of the eight styles, and in the two
 * that set a smaller type scale the padding still lands the row at or under the
 * 36 the virtualizer estimates - so the estimate below stays honest.
 */
const REACH_TIERS = [
  {
    floor: 750,
    variant: "success-light",
    pin: "text-success-foreground! dark:text-success!",
  },
  {
    floor: 500,
    variant: "info-light",
    pin: "text-info-foreground! dark:text-info!",
  },
  {
    floor: 250,
    variant: "primary-light",
    pin: "text-primary! dark:text-primary!",
  },
  {
    floor: 0,
    variant: "warning-light",
    pin: "text-warning-foreground! dark:text-warning!",
  },
] as const

function reachTier(subscribers: number) {
  return (
    REACH_TIERS.find((tier) => subscribers >= tier.floor) ??
    REACH_TIERS[REACH_TIERS.length - 1]
  )
}

/**
 * Deterministic 32 bit mix. The badge number has to survive scrolling:
 * `Math.random` here would give a windowed row a new metric every time it left
 * the window and came back, which reads as a bug rather than as data.
 */
function mix(n: number): number {
  let h = (n ^ 0x9e3779b9) >>> 0
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}

function buildDirectory(): CascaderNode<Market>[] {
  return REGIONS.map(([regionId, regionLabel, markets, countries], r) => {
    // One flag element per COUNTRY, hoisted out of the row loop: sixty shared
    // elements rather than one throwaway per market. `leading-none` stops the
    // emoji, which carries a generous line box of its own, from setting the
    // height of every row in the list.
    const flags = countries.map(([iso2]) => (
      <span aria-hidden="true" className="text-base leading-none">
        {flagOf(iso2)}
      </span>
    ))
    const cities = countries.map(([, , list]) => list.split(","))

    return {
      value: regionId,
      label: regionLabel,
      icon: globeIcon,
      children: Array.from({ length: markets }, (_, i) => {
        // Round robin over the countries rather than a country's whole run and
        // then the next one's, so any screenful of rows carries ten flags and
        // ten country names instead of one repeated eight times. A region whose
        // count does not divide by ten simply leaves the first few countries
        // one row longer, which is what an uneven catalogue looks like.
        const c = i % countries.length
        const [iso2, country] = countries[c]
        const list = cities[c]
        // Per-country ordinal. The city cycles fastest and the zone advances
        // once the cities have been through, so a country's rows read Berlin,
        // Munich, ..., then Berlin Metro, Munich Metro, and so on.
        const k = Math.floor(i / countries.length)
        // Wrapped rather than indexed straight in, so a country seeded with a
        // shorter city list still lands on a zone instead of on `undefined`.
        const zone =
          MARKET_ZONES[Math.floor(k / list.length) % MARKET_ZONES.length]
        const city = list[k % list.length]
        const area = zone ? `${city} ${zone}` : city

        return {
          value: `${regionId}.${iso2.toLowerCase()}.${k}`,
          label: country,
          icon: flags[c],
          // Typing "Munich" or "DE" finds the row even though neither word is
          // its label: keywords are matched alongside it.
          keywords: [area, iso2],
          data: {
            area,
            // The region index is folded into the seed as well as the row's, or
            // the same ordinal in two regions whose countries happen to share a
            // first letter would report the same reach.
            subscribers:
              40 + (mix(r * 7919 + i * 31 + iso2.charCodeAt(0)) % 960),
          },
        }
      }),
    }
  })
}

/**
 * Windowed levels.
 *
 * `CascaderVirtualItems` is a drop-in replacement for `CascaderItems`: below
 * `virtualizeThreshold` rows it renders exactly what `CascaderItems` renders,
 * and above it, it windows. The region level here is six rows and stays plain
 * DOM; drilling into one switches the same list to windowing without touching
 * the keyboard model, the search or the row component.
 *
 * ## The row
 *
 * A windowed row is the one row a demo cannot fake, so it is worth making it a
 * real one: a flag, a country, the market inside it and a reach figure, all on
 * a single line. The composition is the data grid's - a leading glyph, a label
 * that gives way, a trailing metric - translated to a list row, where
 * "trailing" has to be earned by `flex-1` on the label rather than granted by a
 * column. Only the country and the market give way; the badge holds its width,
 * because a cut number is worse than a shortened name.
 *
 * The COUNTRY is the label and the market territory is the muted second slot,
 * which is the way round a reader scans it: the country is what tells you where
 * you are, and the territory only separates the several dozen rows that share
 * it. The region is named once, by the breadcrumb above the list, and never
 * repeated down the rows - a level whose every row re-states the level it is in
 * wastes the widest part of the row on the one word already on screen.
 *
 * The flag goes on `node.icon` rather than into `renderLabel`. The primitive's
 * icon slot is already the leading, `shrink-0` position the pattern wants, and
 * putting it there means the closed trigger shows the flag beside the chosen
 * market for free.
 *
 * The badge is toned by reach rather than left neutral, on the rule tabled at
 * `REACH_TIERS`. A metric that is always the same grey is a metric the reader
 * has to actually read before it means anything; four tones let a scroll answer
 * "where are the big markets" without stopping on a single row.
 *
 * Rows are one line tall, so the estimate is 36 - but only until they mount.
 * Every row is measured after it renders, which is what keeps the scroll
 * position and the highlight in agreement across the eight styles, each of
 * which sets its own row height.
 *
 * ## Why the regions are the sizes they are
 *
 * The earlier version of this example booted with a deep initial value and a
 * 2,500-row level, and it opened badly: a blank frame, a long freeze, then
 * rows. Neither half of that was the windowing.
 *
 * `revealSelected` (on by default) navigates to the level holding the current
 * selection IN THE SAME COMMIT that opens the popup, so with a deep initial
 * value the popup's very first mount lands on the big level rather than on the
 * six-row root. Measured in jsdom, at 2,500 rows per level:
 *
 * | what                                  | cost   |
 * | ------------------------------------- | ------ |
 * | open, deep preselection, reveal on     | 865 ms |
 * | open, deep preselection, reveal off    | 16 ms  |
 * | open at the root, then drill into it   | 13 ms  |
 * | type into the 2,500-row level          | 9 ms   |
 *
 * So the level itself is cheap to render, to filter and to window - it is
 * mounting the popup ONTO it that is not, and the cost is Base UI's per-item
 * work at mount rather than the DOM (plain rows measured 453 ms against the
 * window's 668 ms on the same data). The blank frame is the level-swap reset
 * that has to render one empty list to clamp the highlighted index, which is
 * exactly the "flickering" part.
 *
 * Two consequences, both applied here. Starting unselected means the first open
 * is the six-row root. And because `CascaderContent` unmounts on close, every
 * REOPEN after a deep pick pays that mount again - 483 ms at 2,500 rows against
 * 85 ms at 500 - so the constraint is on the LARGEST level, not on the total.
 * Asia Pacific's 674 is the largest here, which sits with the 500 that measured
 * 85 ms rather than anywhere near the 2,500 that measured 483.
 *
 * Under that ceiling the counts differ per region, because a real catalogue's
 * do. The previous revision gave all six the same round 500, and the one number
 * a reader could actually check - the child count the primitive prints on each
 * region row - came out identical six times down the root level, which reads as
 * a placeholder rather than as a directory. Each region now carries its own
 * figure, 317 through 674, still every one of them multiples past
 * `virtualizeThreshold` and 2,948 rows overall: far past the point where plain
 * DOM rows stop being viable, and windowing is visibly working on the smallest
 * level as well as on the biggest.
 */
export default function Pattern() {
  // Built off the render path: ~3,000 nodes is ~10ms of allocation, and
  // blocking the first paint with it is exactly the "nothing happened" moment
  // this example is supposed to be free of.
  const [items, setItems] = useState<CascaderNode<Market>[] | null>(null)
  const [value, setValue] = useState("")

  useEffect(() => {
    const frame = requestAnimationFrame(() => setItems(buildDirectory()))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="flex w-full flex-col items-center gap-2 p-4">
      <Cascader
        items={items ?? []}
        value={value}
        onValueChange={setValue}
        disabled={items === null}
        estimateRowSize={36}
        renderLabel={(node, state) => {
          if (state.branch) {
            return (
              <span className="w-full truncate text-start font-medium">
                {node.label}
              </span>
            )
          }

          const subscribers = node.data?.subscribers ?? 0
          const tier = reachTier(subscribers)

          return (
            <span className="flex w-full min-w-0 items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-start">
                {node.label}
              </span>
              <span className="text-muted-foreground min-w-0 truncate text-xs">
                {node.data?.area}
              </span>
              <Badge
                variant={tier.variant}
                className={cn("shrink-0 tabular-nums", tier.pin)}
              >
                {subscribers}k
                {/* The row's accessible name is its text, and a bare "612k"
                    read out after a country name means nothing. */}
                <span className="sr-only"> subscribers</span>
              </Badge>
            </span>
          )
        }}
      >
        <CascaderTrigger
          aria-label="Market"
          render={
            <Button
              variant="outline"
              className="w-80 justify-between gap-2 font-normal"
            />
          }
        >
          {items === null ? (
            <span className="text-muted-foreground flex items-center gap-2">
              <Spinner className="size-4" />
              Loading {TOTAL_MARKETS.toLocaleString()} markets...
            </span>
          ) : (
            /* The default trigger renders the whole path, which here would say
               "Europe > Germany": the region again, then a country that dozens
               of rows share. So it names what was actually picked instead, on
               the row's own terms - country first, territory after it. */
            <CascaderValue className="gap-2">
              {(selected) => {
                // The render slot hands back a plain `CascaderNode`, so the
                // payload is re-narrowed here rather than inferred from `items`
                // the way it is in `renderLabel`.
                const node = selected[0] as CascaderNode<Market> | undefined
                if (!node) {
                  return (
                    <span className="text-muted-foreground truncate">
                      Select a market
                    </span>
                  )
                }
                return (
                  <>
                    {node.icon}
                    <span className="min-w-0 truncate">{node.label}</span>
                    <span className="text-muted-foreground min-w-0 truncate text-xs">
                      {node.data?.area}
                    </span>
                  </>
                )
              }}
            </CascaderValue>
          )}
        </CascaderTrigger>

        <CascaderContent className="w-80">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            {/* Kept deliberately. The windowing IS the subject here, and a
                windowed list needs a scrollport with a height it can divide
                into rows - so the cap is part of the demonstration rather than
                a stand-in for one. */}
            <CascaderList maxHeight={288}>
              <CascaderVirtualItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>

      <p className="text-muted-foreground text-xs">
        {TOTAL_MARKETS.toLocaleString()} markets in {COUNTRY_COUNT} countries,{" "}
        {SMALLEST_REGION.toLocaleString()} to {LARGEST_REGION.toLocaleString()}{" "}
        per region across {REGIONS.length} regions.
      </p>
    </div>
  )
}
