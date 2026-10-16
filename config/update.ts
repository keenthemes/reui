// The blue "recently updated" dot: the docs sidebar and the components sidebar.
//
// ── The rule ──
// These lists describe the CURRENT release and nothing else. They answer "what
// is new since I was last here", so an entry that outlives its release stops
// being news and starts being noise - the dot means nothing once everything
// wears one. When a release ships, clear these out and write the new one from
// `content/docs/(root)/changelog.mdx`, which is the source of truth for what
// shipped and when.
//
// Membership is the signal. The value is the tooltip and the screen-reader
// label, so it has to read as a sentence on its own.
//
// CURRENTLY REFLECTING: v2.8.1 - 15 October, 2026.
//   The Data Grid, Event Calendar, Gantt and Date Selector docs carry the dot
//   for their React Compiler fixes, the Cascader for its closed-trigger
//   resolveValue fix, and File Type for its 72 new formats (also in the
//   components sidebar, with its new example). The new Trace category carries
//   it in the components sidebar; it is a shadcn component, so it has no docs
//   page here.
//   Everything the previous release marked is cleared, per the rule above.

/** Which DOCS pages carry the dot. Keys are doc slugs. */
export const DOCS_MENU_UPDATES = {
  "data-grid":
    "Data Grid works in apps that run React Compiler, with resizing, edits and callbacks kept live",
  "event-calendar":
    "Event Calendar keeps today and the agenda current in apps that run React Compiler",
  gantt:
    "Gantt keeps its Today button and tooltip current in apps that run React Compiler",
  "date-selector":
    "Date Selector keeps its year list and Today button current in apps that run React Compiler",
  cascader:
    "Cascader keeps a saved selection's full path, popup open or closed",
  "file-type": "File Type knows 171 formats, .env and Dockerfile included",
} as const

/** Which COMPONENT categories carry the dot. Keys are category slugs. */
export const COMPONENTS_MENU_UPDATES = {
  trace: "New Trace category with 22 examples",
  "file-type":
    "Added 72 developer file formats and a Dotfiles & Build Names example",
} as const

/**
 * Which BLOCK categories carry the dot upstream. Blocks are not part of the
 * open-source surface, so this stays empty here.
 *
 * EMPTY IS A VALID STATE. Clearing this list means emptying the object, never
 * deleting the export: nothing in this repo imports it today, but a synced
 * file that does would fail the production build with "Export
 * BLOCKS_MENU_UPDATES doesn't exist in target module". `next build` catches
 * that; `next dev` does not.
 */
export const BLOCKS_MENU_UPDATES = {} as const
