import { BLOCK_PREVIEW_DESIGN_PARAM_KEYS } from "@/lib/block-preview-url"

/**
 * Component categories whose examples render inside a same-origin iframe
 * instead of inline in the host document.
 *
 * Why only these four: every DOM mutation forces a style recalculation over
 * the whole document, and the shipped stylesheet carries ~1,200 `:has()`
 * selectors, whose invalidation is not local. A category page like
 * /components/data-grid mounts 30 full grids into ONE document, so a single
 * hover or sort re-evaluates those selectors against a tree of thousands of
 * cells. Giving each example its own document collapses the tree each recalc
 * has to walk from "every example on the page" to "one example". That is an
 * interaction-latency win, not a page-weight win: each frame re-parses the
 * stylesheet and re-evaluates its category bundle in its own realm, so the
 * trade is only worth making where the examples are genuinely heavy.
 *
 * The decision is PER SURFACE, not per category alone. The catalog and the
 * docs mount the same examples under very different pressure: a catalog
 * category page mounts every example in the category into one document, while
 * a docs page mounts a handful. A category can therefore be worth framing on
 * one surface and not the other.
 *
 * cascader is exactly that case. Its examples are a single short trigger row
 * whose panel is closed until pressed, so a catalog card carries almost no
 * static DOM and gains little from its own realm, while the fixed frame height
 * a panel needs would pad every card. The docs still frame it, because a docs
 * page mounts several cascaders plus the surrounding prose and code blocks.
 *
 * KILL SWITCH: empty both arrays. Every surface falls back to the inline
 * preview it used before, with no other code change.
 */
export type ComponentPreviewSurface = "catalog" | "docs"

export const COMPONENT_PREVIEW_FRAME_CATEGORIES: Record<
  ComponentPreviewSurface,
  readonly string[]
> = {
  catalog: ["data-grid", "event-calendar", "filters", "gantt"],
  docs: ["cascader", "data-grid", "event-calendar", "filters", "gantt"],
}

/**
 * `surface` is deliberately REQUIRED rather than defaulted. There are only
 * three call sites, and a default would let a new one silently inherit the
 * wrong surface's framing.
 */
export function shouldFrameComponentPreview(
  category: string | null | undefined,
  surface: ComponentPreviewSurface
): boolean {
  if (!category) {
    return false
  }

  return COMPONENT_PREVIEW_FRAME_CATEGORIES[surface].includes(category)
}

/**
 * Fallback frame heights, used when neither the MDX `previewHeight` prop nor
 * the example's `previewHeight` meta supplies one. Sized from the demos
 * themselves: the gantt and event-calendar examples set their own explicit
 * heights internally, and the data grids run five rows plus toolbar, header
 * and pagination chrome.
 */
/**
 * Per-category fallback heights.
 *
 * Each one is set ABOVE the tallest measured example in its category, because
 * an example that overflows its frame is clipped silently: the frame body
 * scrolls, but `PreviewStyle` hides the scrollbar, so there is no affordance
 * telling the reader anything is cut off. Erring tall costs whitespace; erring
 * short costs correctness.
 *
 * IMPORTANT: heights must be measured NARROW, not at the widest surface. A
 * data grid's toolbar and pagination wrap onto extra rows below roughly 711px,
 * so the same example is materially taller in the 590px docs frame than in the
 * 711px catalog card (c-data-grid-1: 263px wide vs 371px narrow). Height then
 * plateaus, so the narrow value is the safe one for BOTH surfaces and for a
 * shrinking viewport. gantt and event-calendar are width-stable.
 *
 * Measured at a 560px frame width with style=sera (the tallest control ladder):
 *   data-grid       379 to 745  (tallest c-data-grid-29, row pinning)
 *   event-calendar  672 to 713  (tallest c-event-calendar-4)
 *   filters         328 to 559  (tallest c-filters-7, embeds a data grid)
 *   gantt           472 to 552  (tallest c-gantt-1)
 *
 * These are only a backstop, deliberately generous: every current example
 * carries its own `previewHeight`, so a category default is what an
 * as-yet-unauthored example falls back to, and too tall merely wastes space
 * while too short silently clips.
 */
const DEFAULT_FRAME_HEIGHT: Record<string, number> = {
  "data-grid": 760,
  "event-calendar": 720,
  // Back to the floor: every filters demo except c-filters-7 (which embeds a
  // data grid and carries its own previewHeight) is a short trigger row that
  // the floor already covers.
  filters: 360,
  gantt: 560,
  // A cascader is a short trigger row whose PANEL is the tall part, and the
  // panel is not in the flow: it opens into whatever room the frame's viewport
  // leaves. See the floor below for the arithmetic.
  //
  // cascader is framed on the DOCS surface only (see the surface map above), so
  // this is a docs-only backstop: every documented example sets its own
  // `previewHeight={364}` in the MDX. It is kept generous rather than lowered
  // to 364, because it is what an as-yet-unauthored example would inherit, and
  // too tall only wastes space while too short silently clips. See the floor
  // note below for why that per-example override only works while the floor
  // stays under it.
  cascader: 520,
}

/**
 * Floor applied after every other source, including an explicitly authored
 * height.
 *
 * Filters is the reason this exists. Its popups cap themselves at
 * `max-h-[min(var(--available-height),24rem)]`, and `--available-height` is
 * measured against the viewport of the document the popup lives in. Most
 * filters examples are a single ~32px row of trigger buttons, so framing one
 * at its natural height would leave the dropdown roughly 32px to open into
 * and collapse the filter list to about one row. The floor buys the popup
 * usable room. Raise a specific example past the floor with `previewHeight`
 * when its dropdown needs more.
 */
const MIN_FRAME_HEIGHT: Record<string, number> = {
  filters: 360,
  /**
   * Cascader has the filters problem in a sharper form, because its panel is
   * the whole component rather than a dropdown off to one side.
   *
   * `CASCADER_LIST_HEIGHT_CLASS` caps the list at
   * `min(--available-height, --cascader-max-height)` with a 24rem default, and
   * `--available-height` is what the POSITIONER measures between the trigger
   * and the edge of its own document's viewport. Framed, that document is the
   * iframe, so the frame height is the budget: the list, plus the search
   * header, plus a footer when the example has one, plus the trigger the panel
   * is anchored under, plus the preview's own padding.
   *
   * WHY THIS IS 360 AND NOT THE 520 CATALOG DEFAULT: the floor is applied with
   * `Math.max` AFTER an authored `previewHeight`, so it is a hard clamp on the
   * call site, not just on the fallback. A floor of 520 would silently raise
   * the docs pages' own `previewHeight={364}` back to 520 and make the override
   * a no-op. The floor therefore has to sit below any height the docs intend to
   * ask for, while still being high enough to stop a careless `previewHeight`
   * collapsing the panel to a couple of rows.
   *
   * 360 is the same value filters uses, for the same reason, and is just under
   * the 364 the docs ask for.
   *
   * Unlike a clipped in-flow example, a cascader panel DEGRADES rather than
   * breaks as the budget shrinks: `--available-height` falls, the list caps
   * lower, and the panel shows fewer rows behind its own scrollbar instead of
   * overflowing. Measured in the 590px docs frame across all six documented
   * examples, panels span 273 to 301px at a 364 frame and every one fits,
   * against 273 to 425px at 520. The binding case is tree mode
   * (c-cascader-18): 425px at 520, 301px at 364. Headroom is thin at that size
   * (panels bottom out around 359 of 364), so a further cut would start eating
   * rows rather than whitespace.
   */
  cascader: 360,
}

const FALLBACK_FRAME_HEIGHT = 420

function parseHeight(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }

  if (!value) {
    return null
  }

  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Resolve the frame height for one example. Precedence, highest first:
 *
 *   1. `previewHeight` authored at the call site (the MDX prop on docs)
 *   2. `metaPreviewHeight` from the example's meta.json, carried through the
 *      component manifest by scripts/build-components.mts
 *   3. the per-category default above
 *
 * The result is then raised to the category floor, so a too-small authored
 * value cannot reintroduce the collapsed-dropdown problem.
 */
export function resolveComponentPreviewFrameHeight({
  category,
  previewHeight,
  metaPreviewHeight,
}: {
  category: string | null | undefined
  previewHeight?: string | number | null
  metaPreviewHeight?: string | number | null
}): number {
  const authored = parseHeight(previewHeight) ?? parseHeight(metaPreviewHeight)
  const fallback =
    (category && DEFAULT_FRAME_HEIGHT[category]) || FALLBACK_FRAME_HEIGHT
  const floor = (category && MIN_FRAME_HEIGHT[category]) || 0

  return Math.max(authored ?? fallback, floor)
}

/**
 * Design-system keys seeded into the frame URL, per host surface.
 *
 * The catalog surface (/components/[category]) mounts `DesignSystemProvider`
 * with `effectsOnly`, which applies all of these to the host document, so the
 * frame must match all of them or the example would not look like its
 * surroundings.
 *
 * The docs surface applies far less: `DocsDesignSystemSync` only swaps the
 * `style-*` class and the two font variables. Seeding the full set there
 * would render a preview with a baseColor, radius or theme that the docs page
 * around it never applied, so a visitor who once changed those on /components
 * would get previews that clash with the docs chrome and the code sample
 * beside them.
 */
export const CATALOG_FRAME_DESIGN_KEYS = BLOCK_PREVIEW_DESIGN_PARAM_KEYS

export const DOCS_FRAME_DESIGN_KEYS = [
  "base",
  "style",
  "font",
  "fontHeading",
  "iconLibrary",
] as const

/**
 * Docs preview boxes default to a fixed `h-72`. A framed preview owns its own
 * height, so the box has to grow to fit it. Authored padding is left alone so
 * the frame stays inset exactly as the inline preview was.
 *
 * Lives in this module, NOT next to the slot component: `DocsComponentPreview`
 * is a Server Component and calls this directly, and a function exported from
 * a "use client" module cannot be invoked from the server (it can only be
 * rendered as a component or passed as a prop).
 */
export function resolveDocsPreviewClassName(
  category: string | null | undefined,
  previewClassName: string | undefined
) {
  if (!shouldFrameComponentPreview(category, "docs")) {
    return previewClassName
  }

  return [previewClassName, "h-auto"].filter(Boolean).join(" ")
}

export interface ComponentPreviewFramePathOptions {
  /** Frozen snapshot of the design config; only the allowed keys are read. */
  designParams?: Readonly<Record<string, unknown>>
  /** Which keys to serialize. Defaults to the catalog set. */
  designKeys?: readonly string[]
}

/**
 * Build the frame `src`.
 *
 * This is a dedicated route rather than an `embed` flag on
 * /preview/[base]/components/[name], because that route is published as the
 * `previewUrl` for roughly a thousand examples by the MCP index
 * (apps/mcp/scripts/build-index.mts), so its rendered output has to stay
 * exactly as it is.
 *
 * Keys are serialized in a fixed order so two callers with the same config
 * produce a byte-identical URL and therefore share one HTTP cache entry.
 */
export function getComponentPreviewFramePath(
  base: string,
  name: string,
  options: ComponentPreviewFramePathOptions = {}
) {
  const search = new URLSearchParams()
  const keys = options.designKeys ?? CATALOG_FRAME_DESIGN_KEYS

  if (options.designParams) {
    for (const key of keys) {
      const value = options.designParams[key]
      if (typeof value === "string" && value) {
        search.set(key, value)
      }
    }
  }

  const queryString = search.toString()

  return `/preview/${encodeURIComponent(base)}/example/${encodeURIComponent(
    name
  )}${queryString ? `?${queryString}` : ""}`
}
