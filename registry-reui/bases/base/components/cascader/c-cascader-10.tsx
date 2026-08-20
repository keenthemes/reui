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
} from "@/registry-reui/bases/base/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/base/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/base/reui/cascader/cascader-nav"
import type {
  CascaderLabels,
  CascaderNode,
} from "@/registry-reui/bases/base/reui/cascader/cascader-types"

import { Button } from "@/registry/bases/base/ui/button"

/* -------------------------------------------------------------------------- */
/*                                    Flags                                   */
/* -------------------------------------------------------------------------- */

/**
 * A flag, straight in the row's icon slot.
 *
 * Fixed width on purpose, and that is the whole of it. A flag is drawn by the
 * platform's own colour font, and Windows Chrome ships no regional indicator
 * glyphs at all: it falls back to the two ISO letters, whose width changes per
 * pair. Without `w-5` the country names in one level would each start on a
 * slightly different column, and `text-center` keeps the glyph in the middle of
 * that fixed box whichever of the two it turns out to be.
 *
 * The size is stated here rather than inherited, so the flag stays one size
 * across all eight styles instead of tracking each style's own row type.
 *
 * `aria-hidden` because the country is named in words right beside it, and a
 * flag announced as well would read the same fact twice.
 *
 * It needs none of the `!` colour pins a semantic glyph does: every cascader
 * row repaints its descendants on highlight with
 * `data-highlighted:**:text-accent-foreground`, and a colour font ignores
 * `color`, so there is nothing for that rule to take away.
 */
function flagIcon(flag: string) {
  return (
    <span aria-hidden="true" className="w-5 text-center text-base leading-none">
      {flag}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

/**
 * Regions, then the countries inside them - written in German, because the UI
 * strings around them are. A picker whose DATA is still English under a
 * translated shell is the most common way a half-done localisation ships, so
 * this example does not demonstrate it.
 *
 * A region has no flag of its own, so it takes the hemisphere globe instead:
 * same slot, same fixed column, and the leading edge of the row never sits
 * empty on the way in.
 */
const laender: CascaderNode[] = [
  {
    value: "europa",
    label: "Europa",
    icon: flagIcon("🌍"),
    children: [
      { value: "europa.de", label: "Deutschland", icon: flagIcon("🇩🇪") },
      { value: "europa.fr", label: "Frankreich", icon: flagIcon("🇫🇷") },
      { value: "europa.it", label: "Italien", icon: flagIcon("🇮🇹") },
      { value: "europa.nl", label: "Niederlande", icon: flagIcon("🇳🇱") },
      { value: "europa.at", label: "Österreich", icon: flagIcon("🇦🇹") },
      { value: "europa.pl", label: "Polen", icon: flagIcon("🇵🇱") },
      { value: "europa.pt", label: "Portugal", icon: flagIcon("🇵🇹") },
      { value: "europa.se", label: "Schweden", icon: flagIcon("🇸🇪") },
      { value: "europa.ch", label: "Schweiz", icon: flagIcon("🇨🇭") },
      { value: "europa.es", label: "Spanien", icon: flagIcon("🇪🇸") },
    ],
  },
  {
    value: "asien",
    label: "Asien",
    icon: flagIcon("🌏"),
    children: [
      { value: "asien.cn", label: "China", icon: flagIcon("🇨🇳") },
      { value: "asien.in", label: "Indien", icon: flagIcon("🇮🇳") },
      { value: "asien.id", label: "Indonesien", icon: flagIcon("🇮🇩") },
      { value: "asien.jp", label: "Japan", icon: flagIcon("🇯🇵") },
      { value: "asien.kr", label: "Südkorea", icon: flagIcon("🇰🇷") },
      { value: "asien.th", label: "Thailand", icon: flagIcon("🇹🇭") },
      { value: "asien.vn", label: "Vietnam", icon: flagIcon("🇻🇳") },
    ],
  },
  {
    value: "afrika",
    label: "Afrika",
    icon: flagIcon("🌍"),
    children: [
      { value: "afrika.eg", label: "Ägypten", icon: flagIcon("🇪🇬") },
      { value: "afrika.gh", label: "Ghana", icon: flagIcon("🇬🇭") },
      { value: "afrika.ke", label: "Kenia", icon: flagIcon("🇰🇪") },
      { value: "afrika.ma", label: "Marokko", icon: flagIcon("🇲🇦") },
      { value: "afrika.ng", label: "Nigeria", icon: flagIcon("🇳🇬") },
      { value: "afrika.za", label: "Südafrika", icon: flagIcon("🇿🇦") },
    ],
  },
  {
    value: "nordamerika",
    label: "Nordamerika",
    icon: flagIcon("🌎"),
    children: [
      { value: "nordamerika.ca", label: "Kanada", icon: flagIcon("🇨🇦") },
      { value: "nordamerika.mx", label: "Mexiko", icon: flagIcon("🇲🇽") },
      {
        value: "nordamerika.us",
        label: "Vereinigte Staaten",
        icon: flagIcon("🇺🇸"),
      },
    ],
  },
  {
    value: "mittelamerika",
    label: "Mittelamerika",
    icon: flagIcon("🌎"),
    children: [
      { value: "mittelamerika.bz", label: "Belize", icon: flagIcon("🇧🇿") },
      { value: "mittelamerika.cr", label: "Costa Rica", icon: flagIcon("🇨🇷") },
      { value: "mittelamerika.gt", label: "Guatemala", icon: flagIcon("🇬🇹") },
      { value: "mittelamerika.pa", label: "Panama", icon: flagIcon("🇵🇦") },
    ],
  },
  {
    value: "suedamerika",
    label: "Südamerika",
    icon: flagIcon("🌎"),
    children: [
      { value: "suedamerika.ar", label: "Argentinien", icon: flagIcon("🇦🇷") },
      { value: "suedamerika.br", label: "Brasilien", icon: flagIcon("🇧🇷") },
      { value: "suedamerika.cl", label: "Chile", icon: flagIcon("🇨🇱") },
      { value: "suedamerika.co", label: "Kolumbien", icon: flagIcon("🇨🇴") },
      { value: "suedamerika.pe", label: "Peru", icon: flagIcon("🇵🇪") },
      { value: "suedamerika.uy", label: "Uruguay", icon: flagIcon("🇺🇾") },
    ],
  },
  {
    value: "ozeanien",
    label: "Ozeanien",
    icon: flagIcon("🌏"),
    children: [
      { value: "ozeanien.au", label: "Australien", icon: flagIcon("🇦🇺") },
      { value: "ozeanien.fj", label: "Fidschi", icon: flagIcon("🇫🇯") },
      { value: "ozeanien.nz", label: "Neuseeland", icon: flagIcon("🇳🇿") },
      {
        value: "ozeanien.pg",
        label: "Papua-Neuguinea",
        icon: flagIcon("🇵🇬"),
      },
    ],
  },
]

/**
 * The whole localisation surface, in one object.
 *
 * `labels` is the ONLY place the cascader takes copy from. Nothing is hardcoded
 * in the primitive, so a translated build needs no wrapper component and no
 * fork - and that goes past the strings you can see. The placeholder, the empty
 * state and the loading line are the obvious half; the other half is the part a
 * screen reader hears and a sighted user never does: the panel's own name, the
 * name of the root level, the "n Länder" a branch row carries, the arrow-key
 * hint, and every announcement the live region reads out on a level change or
 * after filtering. Translate only the visible half and the control still speaks
 * English to the one user who depends on it most.
 *
 * Every key is a plain string or a function of plain values, so plurals stay
 * the translator's decision rather than being assembled from an English
 * template: German counts "1 Land" against "2 Länder" here, and a locale with
 * three plural forms writes three.
 *
 * The keys left out are the ones this example cannot render - paging, load
 * errors, chips, tree expansion, columns - and they fall back to the English
 * defaults. A real build translates those too; `Partial<CascaderLabels>` is
 * what lets a demo say so honestly instead of restating strings it never shows.
 */
const labels: Partial<CascaderLabels> = {
  search: (parentLabel) =>
    parentLabel ? `${parentLabel} durchsuchen...` : "Land suchen...",
  back: "Zurück",
  empty: "Keine Ergebnisse gefunden.",
  loading: "Wird geladen...",
  selectedCount: (count) => `${count} ausgewählt`,
  breadcrumbLabel: "Navigationspfad",
  panelLabel: "Länderauswahl",
  rootLevel: "Alle Regionen",
  itemCount: (count) => `${count} ${count === 1 ? "Land" : "Länder"}`,
  branchAffordance: "Untermenü",
  keyboardHint: (mode) =>
    mode === "tree"
      ? "Mit der Pfeiltaste nach rechts aufklappen, mit der Pfeiltaste nach links zuklappen."
      : mode === "columns"
        ? "Mit der Pfeiltaste nach rechts die nächste Spalte öffnen, mit der Pfeiltaste nach links zurück."
        : "Mit der Pfeiltaste nach rechts eine Ebene öffnen, mit der Pfeiltaste nach links zurück.",
  rootAnnouncement: (count) =>
    `Alle Regionen, ${count} ${count === 1 ? "Region" : "Regionen"}`,
  levelAnnouncement: (parentLabel, depth, count) =>
    `${parentLabel}, Ebene ${depth}, ${count} ${
      count === 1 ? "Land" : "Länder"
    }`,
  resultsAnnouncement: (count) =>
    count === 1 ? "1 Ergebnis" : `${count} Ergebnisse`,
}

/**
 * The i18n surface, shown on the thing that always needs one.
 *
 * A country picker is where localisation stops being a checklist: the data is
 * translated as well as the chrome, the sort order is the target language's
 * rather than English's, and the labels carry their own plurals. Everything the
 * user reads or hears here - placeholder, breadcrumb, empty state, the panel's
 * accessible name, the arrow-key hint and every live-region announcement -
 * comes out of the one `labels` object above.
 *
 * The flags are decoration on purpose. They speed the list up for someone
 * scanning it, and they carry nothing the label does not already say, so the
 * example still reads with emoji turned off, in a font that has no flags, and
 * to a screen reader that skips them.
 */
export default function Pattern() {
  const [value, setValue] = useState("")

  return (
    <div className="flex w-full justify-center p-4">
      <Cascader
        items={laender}
        value={value}
        onValueChange={setValue}
        labels={labels}
      >
        <CascaderTrigger
          // German like every other string here: the field's name is announced
          // in the same language as the value it introduces.
          aria-label="Land"
          render={
            <Button
              variant="outline"
              className="w-72 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue placeholder="Land wählen" />
        </CascaderTrigger>

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
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  )
}
