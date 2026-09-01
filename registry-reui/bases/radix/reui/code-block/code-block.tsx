"use client"

// Title: Code Block
// Description: Shadcn code block with Shiki highlighting, streaming, diffs, folding and per-line interaction for AI chat UIs.
import {
  Children,
  createContext,
  isValidElement,
  memo,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from "react"
import {
  highlightCode,
  markdownCodeProps,
  markdownFences,
  resolveCodeBlockLanguage,
  stripNotationComments,
  toPlainLines,
} from "@/registry-reui/bases/radix/reui/code-block/code-block-highlight"
import type {
  CodeBlockDiffSpec,
  CodeBlockLevelSpec,
  CodeBlockLine,
  CodeBlockLineActionsRender,
  CodeBlockLineSpec,
  CodeBlockThemes,
  CodeBlockToken,
  CodeBlockTransformer,
  CodeBlockWordSpec,
} from "@/registry-reui/bases/radix/reui/code-block/code-block-highlight"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"

/* -------------------------------------------------------------------------- */
/*                                   Context                                   */
/* -------------------------------------------------------------------------- */

/**
 * Two contexts: the document changes on every streamed chunk, the config does
 * not. Splitting them keeps a stream from re-rendering the chrome per chunk.
 */
type CodeBlockConfigValue = {
  language?: string
  resolvedLanguage?: string
  showLineNumbers: boolean
  wrap: boolean
  setWrap: (wrap: boolean) => void
  wrapControlled: boolean
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  collapsible: boolean
  streaming: boolean
  contentId: string
}

type CodeBlockDocumentValue = {
  code: string
  lines: CodeBlockLine[]
  selected: Set<number>
  selectable: boolean
  toggleLine: (line: number, extend: boolean) => void
  clearSelection: () => void
  foldable: boolean
  foldRegions: CodeBlockFoldRegion[]
  folded: Set<number>
  toggleFold: (start: number) => void
  setFolded: (folded: number[]) => void
}

const CodeBlockConfigContext = createContext<CodeBlockConfigValue | null>(null)
const CodeBlockDocumentContext = createContext<CodeBlockDocumentValue | null>(
  null
)

/** Lets the copy button tell a header placement from a floating one. */
const CodeBlockHeaderContext = createContext(false)

/**
 * The root prepares every prop the code surface needs and publishes the
 * bundle here. `CodeBlockContent` reads it to render the surface wherever the
 * consumer composed it - typically inside their own ScrollArea - and the root
 * renders its built-in scrolling surface only when no `CodeBlockContent` is
 * found among its children.
 */
const CodeBlockSurfacePropsContext =
  createContext<CodeBlockSurfaceProps | null>(null)

/**
 * `CodeBlockLineActions` renders nothing itself: it registers its render prop
 * here and the ACTIVE ROW renders it, so actions stay aligned when soft wrap
 * gives lines different heights.
 */
export type CodeBlockLineActionsSide = "end" | "gutter"

const CodeBlockActionsContext = createContext<{
  register: (
    owner: object,
    render: CodeBlockLineActionsRender | null,
    side?: CodeBlockLineActionsSide
  ) => void
} | null>(null)

/* Next still server-renders "use client" files, and a bare useLayoutEffect
   logs on every SSR pass. Same alias the event calendar ships. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

function useInternalConfig(part: string): CodeBlockConfigValue {
  const context = useContext(CodeBlockConfigContext)
  if (!context) {
    throw new Error(`${part} must be used within a CodeBlock`)
  }
  return context
}

function useCodeBlockConfig(
  part: string
): CodeBlockConfigValue & { code: string } {
  const context = useContext(CodeBlockConfigContext)
  const document = useContext(CodeBlockDocumentContext)
  if (!context || !document) {
    throw new Error(`${part} must be used within a CodeBlock`)
  }
  /* `code` lives on the DOCUMENT context (it changes per streamed chunk);
     keeping it out of the config is what lets chrome that ignores the source
     skip those re-renders. The public hook still returns it. */
  return useMemo(
    () => ({ ...context, code: document.code }),
    [context, document.code]
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Styling                                   */
/* -------------------------------------------------------------------------- */

/* Radius per style. Every style is named, including the zero rungs: a missing
   rung is a style someone forgot. The parity suite enforces all-eight-or-one. */
const ROOT_GHOST_CLASS = "[--code-block-bg:transparent]"

const ROOT_RADIUS_CLASS =
  "style-vega:[--code-block-radius:var(--radius-lg)] style-nova:[--code-block-radius:var(--radius-lg)] style-maia:[--code-block-radius:var(--radius-2xl)] style-lyra:[--code-block-radius:0px] style-mira:[--code-block-radius:var(--radius-lg)] style-luma:[--code-block-radius:var(--radius-2xl)] style-rhea:[--code-block-radius:var(--radius-xl)] style-sera:[--code-block-radius:0px]"

/*
 * Colour vars use the BASE theme tokens (--card, --primary, ...), never the
 * --color-* twins: those are static @theme literals that ignore a nested
 * `.dark` scope, which once painted a white gutter cell on a forced-dark
 * block. Tints are one system, 8% light / 12% dark (yellow a touch more),
 * matching the *-light badge weights. This item ships the same cssVars.
 */
const ROOT_TOKEN_CLASS = [
  "[--code-block-padding:--spacing(3)]",
  "[--code-block-gutter-width:--spacing(9)]",
  "[--code-block-gutter-gap:--spacing(2.5)]",
  /* The fold channel sits between the numbers and the code, so both the number
     cell's padding and the gutter width are expressed against it and a block
     without folding pays nothing for it. */
  "[--code-block-fold-width:--spacing(4.5)]",
  "[--code-block-number-pad:var(--code-block-gutter-gap)]",
  "data-[gutter-channel]:[--code-block-number-pad:calc(var(--code-block-gutter-gap)+var(--code-block-fold-width))]",
  /* A diff column breathes: the +/- glyph gets a wider channel. */
  "data-[has-diff]:[--code-block-gutter-gap:--spacing(4)]",
  "[--code-block-line-height:1.5rem]",
  "[--code-block-font-size:0.8125rem]",
  "[--code-block-copy-inset:--spacing(2)]",
  /* Where a PINNED control starts. With a header composed in, the root's top
     edge is the header, so an unadjusted inset drops the copy button onto the
     title row instead of the code. The header's own `min-h-9` is the height
     assumed here, plus its 1px bottom border; override the variable for a
     header built taller than one row. */
  "[--code-block-header-height:--spacing(9)]",
  "[--code-block-copy-top:var(--code-block-copy-inset)]",
  "data-[has-header]:[--code-block-copy-top:calc(var(--code-block-header-height)+1px+var(--code-block-copy-inset))]",
  /* Room the expanded block keeps under the last line for the floating
     "Show less" control. */
  "[--code-block-expand-clearance:--spacing(9)]",
  /* What sits behind a sticky line number while the code scrolls under it.
     `ghost` blanks it, because there the surface belongs to the wrapper. */
  "[--code-block-bg:var(--card)]",
  "[--code-block-highlight-bg:color-mix(in_oklch,var(--primary)_6%,transparent)]",
  "dark:[--code-block-highlight-bg:color-mix(in_oklch,var(--primary)_12%,transparent)]",
  "[--code-block-highlight-bar:color-mix(in_oklch,var(--primary)_60%,transparent)]",
  "[--code-block-diff-add-bg:color-mix(in_oklch,var(--success)_8%,transparent)]",
  "dark:[--code-block-diff-add-bg:color-mix(in_oklch,var(--success)_12%,transparent)]",
  "[--code-block-diff-remove-bg:color-mix(in_oklch,var(--destructive)_8%,transparent)]",
  "dark:[--code-block-diff-remove-bg:color-mix(in_oklch,var(--destructive)_12%,transparent)]",
  "[--code-block-error-bg:color-mix(in_oklch,var(--destructive)_8%,transparent)]",
  "dark:[--code-block-error-bg:color-mix(in_oklch,var(--destructive)_12%,transparent)]",
  "[--code-block-warning-bg:color-mix(in_oklch,var(--warning)_10%,transparent)]",
  "dark:[--code-block-warning-bg:color-mix(in_oklch,var(--warning)_14%,transparent)]",
  "[--code-block-info-bg:color-mix(in_oklch,var(--info)_8%,transparent)]",
  "dark:[--code-block-info-bg:color-mix(in_oklch,var(--info)_12%,transparent)]",
  "[--code-block-caret-color:var(--primary)]",
].join(" ")

const ROOT_BASE_CLASS =
  "group/code-block relative flex min-w-0 flex-col rounded-(--code-block-radius) text-left"

const ROOT_SURFACE_CLASS =
  "border border-border bg-card text-card-foreground bg-clip-padding"

/**
 * The token colour switch: tokens carry only `--cb-c` / `--cb-cd`, and these
 * two rules recolour the whole block per theme instead of a `dark:` utility on
 * every span. The `color:` hint is load-bearing: `text-[var(--x)]` is
 * type-ambiguous to Tailwind and emits NO rule at all, which renders as a
 * highlighter that silently failed. Same reason the font size uses `length:`.
 */
const TOKEN_COLOR_CLASS =
  "[&_[data-slot=code-block-token]]:text-[color:var(--cb-c,currentColor)] dark:[&_[data-slot=code-block-token]]:text-[color:var(--cb-cd,currentColor)]"

/**
 * Line numbers are a CSS counter, never DOM: a pseudo-element cannot join a
 * text selection, so copying yields exact source, and the gutter costs zero
 * elements. `startLine` is a counter reset on the pre.
 */
const LINE_NUMBER_CLASS = [
  "[[data-code-line-numbers]_&]:before:pointer-events-none",
  "[[data-code-line-numbers]_&]:before:sticky",
  "[[data-code-line-numbers]_&]:before:left-0",
  "[[data-code-line-numbers]_&]:before:z-10",
  "[[data-code-line-numbers]_&]:before:-ml-(--code-block-gutter-width)",
  "[[data-code-line-numbers]_&]:before:inline-block",
  "[[data-code-line-numbers]_&]:before:w-(--code-block-gutter-width)",
  "[[data-code-line-numbers]_&]:before:pl-(--code-block-padding)",
  "[[data-code-line-numbers]_&]:before:pr-(--code-block-number-pad)",
  "[[data-code-line-numbers]_&]:before:bg-(--code-block-bg)",
  "[[data-code-line-numbers]_&]:before:text-right",
  "[[data-code-line-numbers]_&]:before:tabular-nums",
  "[[data-code-line-numbers]_&]:before:text-muted-foreground/50",
  "[[data-code-line-numbers]_&]:before:select-none",
  "[[data-code-line-numbers]_&]:before:[counter-increment:cb-line]",
  "[[data-code-line-numbers]_&]:before:content-[counter(cb-line)]",
  /* A line carrying its own gutter label (a patch's dual numbers, a hunk
     marker) renders that instead of the counter. */
  "[[data-code-line-numbers]_&[data-gutter]]:before:content-[attr(data-gutter)]",
  "[[data-code-line-numbers]_&[data-gutter]]:before:whitespace-pre",
].join(" ")

/** Diff glyphs ride in the same pseudo-element family, so they never copy. */
/**
 * The diff glyph gets its own channel, centred in the left padding (no
 * numbers) or in the number-to-code gap. A fixed `left-1` had ~1px of
 * clearance and would land on the first character.
 */
const LINE_DIFF_CLASS = [
  "data-[diff]:after:absolute",
  /* Above the number cell. That cell is sticky with an opaque backdrop at z-10,
     so a glyph sharing its column is painted out at the default z. */
  "data-[diff]:after:z-20",
  "data-[diff]:after:left-0",
  "data-[diff]:after:w-(--code-block-padding)",
  "data-[diff]:after:text-center",
  "[[data-code-line-numbers]_&]:data-[diff]:after:-left-(--code-block-gutter-gap)",
  "[[data-code-line-numbers]_&]:data-[diff]:after:w-(--code-block-gutter-gap)",
  "data-[diff]:after:select-none",
  "data-[diff=add]:after:text-success",
  "data-[diff=remove]:after:text-destructive",
  "data-[diff=add]:after:content-['+']",
  "data-[diff=remove]:after:content-['-']",
].join(" ")

const LINE_STATE_CLASS = [
  "data-[highlighted]:bg-(--code-block-highlight-bg)",
  "data-[highlighted]:shadow-[inset_2px_0_0_0_var(--code-block-highlight-bar)]",
  "data-[diff=add]:bg-(--code-block-diff-add-bg)",
  "data-[diff=remove]:bg-(--code-block-diff-remove-bg)",
  "data-[level=error]:bg-(--code-block-error-bg)",
  "data-[level=warning]:bg-(--code-block-warning-bg)",
  "data-[level=info]:bg-(--code-block-info-bg)",
  "data-[selected]:bg-accent",
  /* Arrow navigation needs a visible position (WCAG 2.4.7); gated on the
     selectable listbox so plain blocks stay inert on hover. */
  "[[data-selectable]_&]:data-[active]:bg-muted/40",
].join(" ")

/**
 * Focus mode dims the rest and clears on hover.
 *
 * Blur alone makes a snippet unreadable if the reader wanted the surrounding
 * context after all, so hovering the block restores everything.
 */
/**
 * Motion is streaming-only and compositor-only: rows keep identity across
 * chunks, so the entry animation fires once per NEW line and a static block
 * never animates. Tokens deliberately do not animate (the plain tail gaining
 * colour remounts them mid-read). Reduced motion disables the row entry.
 */
const LINE_MOTION_CLASS =
  "[[data-streaming]_&]:animate-in [[data-streaming]_&]:fade-in-0 [[data-streaming]_&]:slide-in-from-bottom-1 [[data-streaming]_&]:duration-150 [[data-streaming]_&]:ease-out motion-reduce:animate-none"

/**
 * Deliberately no per-token animation. The highlighter runs a chunk behind
 * the stream and REPLACES the plain-text fallback lines with tokenised ones,
 * which remounts every token span; a mount-keyed fade therefore re-flashed
 * whole lines that were already readable, 300ms behind the caret. Colour
 * arriving instantly reads as highlighting; re-fading reads as a glitch.
 */
const TOKEN_MOTION_CLASS = ""

const LINE_FOCUS_CLASS =
  "data-[blurred]:opacity-40 data-[blurred]:blur-[1.5px] data-[blurred]:transition-[opacity,filter] group-hover/code-block:data-[blurred]:opacity-100 group-hover/code-block:data-[blurred]:blur-none"

/**
 * `data-code-line`, not `data-line`: rehype-pretty-code apps ship a global
 * `[data-line] span { color !important }` rule, and reusing its attribute
 * rendered every token monochrome. Cost a real investigation.
 */
const LINE_BASE_CLASS = cn(
  "relative block min-h-(--code-block-line-height) w-full px-(--code-block-padding) leading-(--code-block-line-height)",
  /* With numbers on, the left inset lives inside the sticky cell instead, so
     paying it here too would restore the double count the gutter just lost. */
  "[[data-code-line-numbers]_&]:pl-0"
)

/* -------------------------------------------------------------------------- */
/*                                    Folding                                  */
/* -------------------------------------------------------------------------- */

export type CodeBlockFoldRegion = {
  /** Source line that owns the toggle and stays visible when folded. */
  start: number
  /** Last source line the region swallows. */
  end: number
}

const INDENT_RE = /^[ \t]*/

/**
 * Regions come from indentation, not the grammar: shiki returns tokens, no
 * AST, and indentation is language-agnostic where a brace matcher is not.
 * A tab counts as two columns; only self-consistency matters.
 */
function computeFoldRegions(lines: CodeBlockLine[]): CodeBlockFoldRegion[] {
  const indent = (text: string) =>
    (INDENT_RE.exec(text)?.[0] ?? "").replace(/\t/g, "  ").length
  const blank = (text: string) => text.trim().length === 0

  /* One pass with an open-region stack instead of a nested scan per line:
     the old shape was quadratic on monotonically indenting files and re-ran
     per streamed chunk. A region closes when a non-blank line returns to its
     opener's indent; trailing blanks belong to whatever follows. */
  const regions: CodeBlockFoldRegion[] = []
  const stack: { start: number; indent: number; last: number }[] = []
  let previous: { number: number; indent: number } | null = null

  for (const line of lines) {
    if (blank(line.text)) continue
    const own = indent(line.text)

    while (stack.length && own <= stack[stack.length - 1].indent) {
      const open = stack.pop()!
      if (open.last > open.start) {
        regions.push({ start: open.start, end: open.last })
      }
    }
    for (const open of stack) open.last = line.number

    if (previous && own > previous.indent) {
      stack.push({
        start: previous.number,
        indent: previous.indent,
        last: line.number,
      })
    }
    previous = { number: line.number, indent: own }
  }

  while (stack.length) {
    const open = stack.pop()!
    if (open.last > open.start)
      regions.push({ start: open.start, end: open.last })
  }

  return regions.sort((a, b) => a.start - b.start)
}

/** Frozen so the disabled path keeps a stable identity across renders. */
const EMPTY_FOLD_REGIONS: CodeBlockFoldRegion[] = []

/* -------------------------------------------------------------------------- */
/*                                    Tokens                                   */
/* -------------------------------------------------------------------------- */

type TokenStyle = CSSProperties & Record<"--cb-c" | "--cb-cd", string>

function tokenStyle(token: CodeBlockToken): CSSProperties | undefined {
  if (!token.color && !token.colorDark && !token.fontStyle) return undefined

  const style: Partial<TokenStyle> = {}
  if (token.color) style["--cb-c"] = token.color
  if (token.colorDark) style["--cb-cd"] = token.colorDark
  if (token.fontStyle === "italic") style.fontStyle = "italic"
  if (token.fontStyle === "bold") style.fontWeight = 700
  if (token.fontStyle === "underline") style.textDecoration = "underline"
  return style as CSSProperties
}

function CodeBlockTokens({ tokens }: { tokens: CodeBlockToken[] }) {
  return (
    <>
      {tokens.map((token, index) => {
        const style = tokenStyle(token)

        /* An unstyled token needs no element at all. Whitespace and
           punctuation are most of a file, so this removes most of the spans. */
        if (!style && !token.word) {
          return <span key={index}>{token.content}</span>
        }

        return (
          <span
            key={index}
            data-slot="code-block-token"
            data-word={token.word || undefined}
            className={cn(
              token.word &&
                "bg-primary/10 ring-primary/20 rounded-sm px-0.5 py-px ring-1 ring-inset"
            )}
            style={style}
          >
            {token.content}
          </span>
        )
      })}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                     Line                                    */
/* -------------------------------------------------------------------------- */

type CodeBlockLineRowProps = {
  line: CodeBlockLine
  selectable: boolean
  selected: boolean
  focusMode: boolean
  active: boolean
  caret: boolean
  actions?: CodeBlockLineActionsRender | null
  actionsSide?: CodeBlockLineActionsSide
  domIdBase?: string
  startLine?: number
  onSelect?: (line: number, extend: boolean) => void
  foldable?: boolean
  foldRegion?: CodeBlockFoldRegion
  folded?: boolean
  onToggleFold?: (start: number) => void
}

/**
 * Plain reference-equality `memo`, on purpose: the highlighter returns the
 * SAME object for an unchanged line, so a streamed chunk re-renders one row.
 * A custom comparator would spend that win walking every token.
 */
const CodeBlockLineRow = memo(function CodeBlockLineRow({
  line,
  selectable,
  selected,
  focusMode,
  active,
  caret,
  actions,
  actionsSide = "end",
  domIdBase,
  startLine = 1,
  onSelect,
  foldable,
  foldRegion,
  folded,
  onToggleFold,
}: CodeBlockLineRowProps) {
  const state = line.state
  const blurred = focusMode && !state?.focused
  const lineDomId = domIdBase ? `${domIdBase}-L${line.number}` : undefined
  const hiddenCount = foldRegion ? foldRegion.end - foldRegion.start : 0
  /* The fold toggle owns the channel, so a fold-start row keeps its chevron
     and sends the action back to the row end. */
  const inGutter = actionsSide === "gutter" && !foldRegion

  return (
    <span
      data-slot="code-block-line"
      data-code-line={line.number}
      data-gutter={line.gutter}
      id={lineDomId}
      data-active={active || undefined}
      data-highlighted={state?.highlighted || undefined}
      data-diff={state?.diff}
      data-focused={state?.focused || undefined}
      data-blurred={blurred || undefined}
      data-level={state?.level}
      data-selected={selected || undefined}
      role={selectable ? "option" : undefined}
      aria-selected={selectable ? selected : undefined}
      tabIndex={selectable ? -1 : undefined}
      onMouseDown={
        /* Shift-click is line-range selection here, but the browser also reads
           it as "extend the text selection", which paints a stray highlight
           across the block. Suppressing it only for the shift case leaves plain
           drag-to-select, and therefore copying, untouched. */
        selectable
          ? (event) => {
              if (event.shiftKey) event.preventDefault()
            }
          : undefined
      }
      onClick={
        selectable && onSelect
          ? (event) => onSelect(line.number, event.shiftKey)
          : undefined
      }
      className={cn(
        LINE_BASE_CLASS,
        LINE_NUMBER_CLASS,
        LINE_STATE_CLASS,
        LINE_DIFF_CLASS,
        LINE_FOCUS_CLASS,
        LINE_MOTION_CLASS,
        selectable && "cursor-pointer"
      )}
      /**
       * Every row re-seeds the counter, making its number absolute rather
       * than ordinal. That serves two features at once: folding can remove
       * rows without renumbering the tail, and `content-visibility` can skip
       * offscreen rows - a style-contained row cannot read a shared counter,
       * which once rendered every gutter number as 1.
       */
      style={{ counterReset: `cb-line ${line.number - 1}` }}
    >
      {foldRegion && onToggleFold ? (
        <button
          type="button"
          /* Inside a role="option" row a focusable descendant is invalid ARIA,
             so the toggle leaves the tab order when the block is selectable;
             pointer use is unaffected. */
          tabIndex={selectable ? -1 : undefined}
          data-slot="code-block-fold-toggle"
          data-state={folded ? "folded" : "unfolded"}
          aria-expanded={!folded}
          aria-label={
            folded
              ? `Unfold lines ${foldRegion.start + startLine - 1} to ${foldRegion.end + startLine - 1}`
              : `Fold lines ${foldRegion.start + startLine - 1} to ${foldRegion.end + startLine - 1}`
          }
          onClick={(event) => {
            /* The row itself may be a selection target, and a fold is not a
               selection. */
            event.stopPropagation()
            onToggleFold(foldRegion.start)
          }}
          className={cn(
            /* Styled as a ghost xs button rather than composed from Button:
               the ghost variant paints aria-expanded:bg-muted, which would
               keep every UNFOLDED toggle lit, and its icon rungs do not fit
               an 18px channel. Hover feedback only; folded state reads
               through color. */
            /* Square, centred in the line box: height matches the width and
               the translate makes up the difference to the 24px line. Open
               regions read darker than folded ones. */
            "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 sticky z-20 inline-flex size-(--code-block-fold-width) shrink-0 translate-y-[calc((var(--code-block-line-height)-var(--code-block-fold-width))/2)] cursor-pointer items-center justify-center rounded-[4px] align-top outline-none focus-visible:ring-2",
            /* Margins cancel: -(4px + width) then +4px, so the toggle paints
               in the channel, sits 4px from the code, and the code still
               starts where a row without a toggle does. An uncancelled
               margin slid every foldable row and clipped characters. The
               spacing() shorthand is written as a rem literal because
               `mr-(--spacing(1))` is not valid Tailwind and generates no
               rule at all - measured live as a 4px drift. */
            "-ml-[calc(var(--code-block-fold-width)+0.25rem)]",
            "mr-[0.25rem]",
            "left-[calc(var(--code-block-gutter-width)-var(--code-block-fold-width)-0.25rem)]",
            folded && "text-muted-foreground/60"
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3"
          >
            <path d={folded ? "m9 18 6-6-6-6" : "m6 9 6 6 6-6"} />
          </svg>
        </button>
      ) : null}
      {actions && active ? (
        <span
          data-slot="code-block-line-actions"
          data-side={inGutter ? "gutter" : "end"}
          contentEditable={false}
          /* An action is a control, not line content. Without this the click
             bubbles to a selectable row and toggles the very selection the
             action just consumed, so "add these 6 lines" left line 6 selected
             behind it. The consumer's own handler has already run by here. */
          onClick={(event) => event.stopPropagation()}
          className={cn(
            /* Inside the <pre>, so the code surface's mono face, pre
               whitespace and token color would cascade into real buttons
               placed here. Reset to app typography at the boundary. */
            "text-foreground z-20 items-center gap-1 font-sans whitespace-normal select-none",
            !inGutter &&
              "absolute end-2 top-0 flex h-(--code-block-line-height)",
            /* ABSOLUTE and centred on the row's START EDGE: `left-0` is where
               the code column begins (the row box already excludes the
               gutter), and the -50% translate hangs the control half over the
               number column, half over the code - the editor treatment. Being
               out of flow on BOTH axes is the point: an in-flow version
               pushed the code right by its own width, and an earlier block
               level one broke the row onto a new line. The control travels
               with the code on a horizontal scroll; it cannot also be sticky. */
            inGutter &&
              "absolute top-1/2 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          )}
        >
          {actions({ line: line.number, text: line.text, state })}
        </span>
      ) : null}
      <span data-slot="code-block-line-content">
        {/* An empty line needs an explicit break. Copying a selection relies on
            the browser emitting a newline between block-level rows, and a row
            with no text at all contributes neither text nor separator, so a
            blank line silently vanishes from the pasted source. */}
        {line.tokens.length === 0 ? <br /> : null}
        <CodeBlockTokens tokens={line.tokens} />
        {folded && hiddenCount > 0 ? (
          /* `select-none` is doing real work: a manual drag-select over a
             folded block would otherwise paste this chip into the middle of
             the source. The copy button reads the raw code and never sees it. */
          <button
            type="button"
            tabIndex={selectable ? -1 : undefined}
            data-slot="code-block-fold-marker"
            aria-label={`Unfold ${hiddenCount} hidden lines`}
            onClick={(event) => {
              event.stopPropagation()
              onToggleFold?.(line.number)
            }}
            /* Same centring as the fold toggle: chip height matches the fold
               channel and the translate makes up the difference to the line
               box, so the label sits on the code baseline's visual centre
               instead of riding high. */
            className="bg-muted/80 text-muted-foreground hover:bg-muted ml-2 inline-flex h-(--code-block-fold-width) translate-y-[calc((var(--code-block-line-height)-var(--code-block-fold-width))/2)] cursor-pointer items-center rounded-sm px-1.5 align-top text-[0.8em] leading-none select-none"
          >
            {`... ${hiddenCount} lines`}
          </button>
        ) : null}
        {caret ? (
          <span
            data-slot="code-block-caret"
            aria-hidden="true"
            /* An underline caret: a thin strip on the baseline, the shape a
               terminal uses, instead of a bold block that outweighs the text
               it follows. */
            className="ml-0.5 inline-block h-[0.12em] w-[0.55em] translate-y-[0.02em] animate-pulse rounded-[1px] bg-(--code-block-caret-color) motion-reduce:animate-none"
          />
        ) : null}
      </span>
    </span>
  )
})

/* -------------------------------------------------------------------------- */
/*                                     Root                                    */
/* -------------------------------------------------------------------------- */

export type CodeBlockProps = {
  code?: string
  language?: string
  lines?: CodeBlockLine[]
  themes?: CodeBlockThemes
  highlight?: boolean
  showLineNumbers?: boolean
  startLine?: number
  wrap?: boolean
  defaultWrap?: boolean
  onWrapChange?: (wrap: boolean) => void
  maxLines?: number
  variant?: "default" | "ghost"
  label?: string
  highlightedLines?: CodeBlockLineSpec
  highlightedWords?: CodeBlockWordSpec[]
  focusedLines?: CodeBlockLineSpec
  diff?: CodeBlockDiffSpec
  lineLevels?: CodeBlockLevelSpec
  transformers?: CodeBlockTransformer[]
  streaming?: boolean
  selectable?: boolean
  selectedLines?: number[]
  defaultSelectedLines?: number[]
  onSelectedLinesChange?: (lines: number[]) => void
  /** Screen-reader text announced when a stream finishes, for localisation. */
  completeAnnouncement?: string
  /** Collapsed state under `maxLines`, controlled. */
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Detects fold regions from indentation and renders a toggle per region. */
  foldable?: boolean
  /**
   * Replaces the indentation heuristic with your own regions (source-numbered,
   * like every line spec) - grammar folding, JSON blocks, patch hunks.
   * Implies nothing about `foldable`; pass both.
   */
  foldRegions?: CodeBlockFoldRegion[]
  /** Folded regions by start line, 1-based within `code`. Controlled. */
  folded?: number[]
  /** Folded regions by their start line, uncontrolled. */
  defaultFolded?: number[]
  onFoldedChange?: (folded: number[]) => void
  children?: ReactNode
} & Omit<ComponentProps<"div">, "children" | "onSelect">

/**
 * The root. `<CodeBlock code={code} language="tsx" />` is a complete block;
 * passing `lines` from a server component skips the client highlighter and
 * shiki entirely. Children are CHROME ONLY: the root renders the code surface
 * itself, so child order never matters and a wrapper cannot break scrolling.
 */
function CodeBlock({
  code,
  language,
  lines: linesProp,
  themes,
  highlight = true,
  showLineNumbers = false,
  startLine = 1,
  wrap: wrapProp,
  defaultWrap = false,
  onWrapChange,
  maxLines,
  variant = "default",
  label,
  highlightedLines,
  highlightedWords,
  focusedLines,
  diff,
  lineLevels,
  transformers,
  streaming = false,
  selectable = false,
  selectedLines,
  defaultSelectedLines,
  onSelectedLinesChange,
  completeAnnouncement,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  foldable = false,
  foldRegions: foldRegionsProp,
  folded,
  defaultFolded,
  onFoldedChange,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const contentId = useId()
  const source = code ?? ""
  const resolvedLanguage = resolveCodeBlockLanguage(language)

  /* The deferred copy is what a fast stream tokenises against. React keeps the
     previous render on screen while the new one is prepared, so the block never
     blanks and the main thread is never blocked by a chunk. */
  const deferredSource = useDeferredValue(source)

  const plainLines = useMemo(
    () => toPlainLines(deferredSource, startLine),
    [deferredSource, startLine]
  )

  /* The result is tagged with the exact inputs that produced it. Without the
     tag, swapping `code` kept rendering the PREVIOUS document for the whole
     async highlight pass - or spliced two files together when the old result
     was shorter than the new source. */
  const [highlighted, setHighlighted] = useState<{
    source: string
    spec: string
    lines: CodeBlockLine[]
  } | null>(null)

  const shouldHighlight =
    !linesProp && highlight && Boolean(resolvedLanguage) && source.length > 0

  /* Presentation props enter the effect as ONE serialized key: they are
     inline literals at most call sites, and reference deps would re-tokenize
     per parent render. The effect parses its inputs back out of the key, so
     used and depended-on values cannot drift. `transformers` holds functions
     and stays a reference dep - hoist it to module scope. */
  const specKey = JSON.stringify([
    themes ?? null,
    startLine,
    highlightedLines ?? null,
    highlightedWords ?? null,
    focusedLines ?? null,
    diff ?? null,
    lineLevels ?? null,
  ])

  const transformersWarnedRef = useRef(false)
  const previousTransformersRef = useRef(transformers)
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      streaming &&
      previousTransformersRef.current !== transformers &&
      !transformersWarnedRef.current
    ) {
      transformersWarnedRef.current = true
      console.warn(
        "[code-block] `transformers` changed identity during a stream, which " +
          "re-tokenizes the whole document per chunk. Hoist the array to " +
          "module scope or memoize it."
      )
    }
    previousTransformersRef.current = transformers
  }, [transformers, streaming])

  useEffect(() => {
    if (!shouldHighlight) {
      setHighlighted(null)
      return
    }

    const [
      specThemes,
      specStartLine,
      specHighlightedLines,
      specHighlightedWords,
      specFocusedLines,
      specDiff,
      specLineLevels,
    ] = JSON.parse(specKey) as [
      CodeBlockThemes | null,
      number,
      CodeBlockLineSpec | null,
      CodeBlockWordSpec[] | null,
      CodeBlockLineSpec | null,
      CodeBlockDiffSpec | null,
      CodeBlockLevelSpec | null,
    ]

    let active = true
    void highlightCode(deferredSource, {
      language,
      instanceKey: contentId,
      themes: specThemes ?? undefined,
      transformers,
      startLine: specStartLine,
      highlightedLines: specHighlightedLines ?? undefined,
      highlightedWords: specHighlightedWords ?? undefined,
      focusedLines: specFocusedLines ?? undefined,
      diff: specDiff ?? undefined,
      lineLevels: specLineLevels ?? undefined,
    }).then((next) => {
      if (active) {
        setHighlighted({ source: deferredSource, spec: specKey, lines: next })
      }
    })

    return () => {
      active = false
    }
  }, [shouldHighlight, deferredSource, language, transformers, specKey])

  /* Plain text is the floor, never a blank frame: the highlighter runs a
     chunk behind a stream, so its lines show as-is and the remainder appends
     as plain text that gains colour a frame later. */
  const lines = useMemo(() => {
    if (linesProp) return linesProp
    if (!shouldHighlight || !highlighted) return plainLines
    /* The merge below is only valid under the STREAMING invariant: the
       highlighted source must be a prefix of what is on screen, with the same
       presentation spec. A swapped `code` or spec falls back to plain text
       for one highlight pass instead of showing the previous document. */
    if (
      highlighted.spec !== specKey ||
      !deferredSource.startsWith(highlighted.source)
    ) {
      return plainLines
    }
    if (highlighted.lines.length >= plainLines.length) return highlighted.lines
    return [...highlighted.lines, ...plainLines.slice(highlighted.lines.length)]
  }, [
    linesProp,
    shouldHighlight,
    highlighted,
    plainLines,
    deferredSource,
    specKey,
  ])

  const focusMode = useMemo(
    () => lines.some((line) => line.state?.focused),
    [lines]
  )

  const hasDiff = useMemo(() => lines.some((line) => line.state?.diff), [lines])

  const [internalWrap, setInternalWrap] = useState(defaultWrap)
  const wrap = wrapProp ?? internalWrap
  const setWrap = useCallback(
    (next: boolean) => {
      if (wrapProp === undefined) setInternalWrap(next)
      onWrapChange?.(next)
    },
    [wrapProp, onWrapChange]
  )

  const collapsible = typeof maxLines === "number" && lines.length > maxLines
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const expanded = expandedProp ?? internalExpanded
  const setExpanded = useCallback(
    (next: boolean) => {
      if (expandedProp === undefined) setInternalExpanded(next)
      onExpandedChange?.(next)
    },
    [expandedProp, onExpandedChange]
  )
  const isExpanded = collapsible ? expanded : true

  const [internalSelected, setInternalSelected] = useState<number[]>(
    defaultSelectedLines ?? []
  )
  const selection = selectedLines ?? internalSelected
  const selectedSet = useMemo(() => new Set(selection), [selection])
  const lastSelectedRef = useRef<number | null>(null)

  /* Latest-value refs, so the toggle callbacks below can be created ONCE.
     With state in their dep lists every selection or fold change minted new
     identities, which reached every row through `onSelect`/`onToggleFold` and
     busted the row memo the streaming design rests on. */
  const selectionStateRef = useRef({
    selection,
    selectedSet,
    controlled: selectedLines !== undefined,
    onSelectedLinesChange,
  })
  selectionStateRef.current = {
    selection,
    selectedSet,
    controlled: selectedLines !== undefined,
    onSelectedLinesChange,
  }

  const commitSelection = useCallback((next: number[]) => {
    if (!selectionStateRef.current.controlled) setInternalSelected(next)
    selectionStateRef.current.onSelectedLinesChange?.(next)
  }, [])

  const toggleLine = useCallback(
    (line: number, extend: boolean) => {
      const anchor = lastSelectedRef.current
      const { selection, selectedSet } = selectionStateRef.current

      if (extend && anchor !== null) {
        const from = Math.min(anchor, line)
        const to = Math.max(anchor, line)
        const range: number[] = []
        for (let value = from; value <= to; value += 1) range.push(value)
        commitSelection(range)
        return
      }

      lastSelectedRef.current = line
      commitSelection(
        selectedSet.has(line)
          ? selection.filter((value) => value !== line)
          : [...selection, line].sort((a, b) => a - b)
      )
    },
    [commitSelection]
  )

  /* Regions are SOURCE-numbered (1-based within `code`), like every other
     line spec, so `folded` values and `highlightedLines` values interchange. */
  const foldRegions = useMemo(() => {
    if (!foldable) return EMPTY_FOLD_REGIONS
    if (foldRegionsProp) return foldRegionsProp
    return computeFoldRegions(lines).map((region) => ({
      start: region.start - startLine + 1,
      end: region.end - startLine + 1,
    }))
  }, [foldable, foldRegionsProp, lines, startLine])

  const foldStarts = useMemo(
    () => new Map(foldRegions.map((region) => [region.start, region])),
    [foldRegions]
  )

  const [internalFolded, setInternalFolded] = useState<number[]>(
    defaultFolded ?? []
  )
  const foldedValue = folded ?? internalFolded
  const foldedSet = useMemo(() => new Set(foldedValue), [foldedValue])

  /* Same latest-value shape as selection, for the same row-memo reason. */
  const foldStateRef = useRef({
    foldedValue,
    foldedSet,
    controlled: folded !== undefined,
    onFoldedChange,
  })
  foldStateRef.current = {
    foldedValue,
    foldedSet,
    controlled: folded !== undefined,
    onFoldedChange,
  }

  const commitFolded = useCallback((next: number[]) => {
    if (!foldStateRef.current.controlled) setInternalFolded(next)
    foldStateRef.current.onFoldedChange?.(next)
  }, [])

  const toggleFold = useCallback(
    (start: number) => {
      const { foldedValue, foldedSet } = foldStateRef.current
      commitFolded(
        foldedSet.has(start)
          ? foldedValue.filter((value) => value !== start)
          : [...foldedValue, start].sort((a, b) => a - b)
      )
    },
    [commitFolded]
  )

  /**
   * A line is hidden when ANY folded region covers it, and that one rule is
   * what makes nesting work without a tree: folding an outer region swallows
   * the inner toggles as well, their own folded state survives untouched
   * underneath, and unfolding the outer one restores exactly what the reader
   * left behind rather than a flattened block.
   */
  const renderedLines = useMemo(() => {
    if (!foldable || foldedSet.size === 0) return lines
    const hidden = new Set<number>()
    for (const start of foldedSet) {
      const region = foldStarts.get(start)
      if (!region) continue
      for (let n = region.start + 1; n <= region.end; n += 1) {
        hidden.add(n + startLine - 1)
      }
    }
    return lines.filter((line) => !hidden.has(line.number))
  }, [foldable, foldedSet, foldStarts, lines, startLine])

  const configValue = useMemo<CodeBlockConfigValue>(
    () => ({
      language,
      resolvedLanguage,
      showLineNumbers,
      wrap,
      setWrap,
      wrapControlled: wrapProp !== undefined,
      expanded: isExpanded,
      setExpanded,
      collapsible,
      streaming,
      contentId,
    }),
    [
      language,
      resolvedLanguage,
      showLineNumbers,
      wrap,
      setWrap,
      wrapProp,
      isExpanded,
      collapsible,
      streaming,
      contentId,
    ]
  )

  const clearSelection = useCallback(
    () => commitSelection([]),
    [commitSelection]
  )

  const documentValue = useMemo<CodeBlockDocumentValue>(
    () => ({
      code: source,
      lines,
      selected: selectedSet,
      selectable,
      toggleLine,
      clearSelection,
      foldable,
      foldRegions,
      folded: foldedSet,
      toggleFold,
      setFolded: commitFolded,
    }),
    [
      source,
      lines,
      selectedSet,
      selectable,
      toggleLine,
      clearSelection,
      foldable,
      foldRegions,
      foldedSet,
      toggleFold,
      commitFolded,
    ]
  )

  const visibleLines = collapsible && !isExpanded ? maxLines : undefined

  /* Detected from the element type rather than a `:has()` selector. This repo
     has measured `:has()` at 85-120ms of style invalidation per DOM mutation,
     and a streaming block mutates on every chunk, so the primitive uses none. */
  const hasHeader = containsElementType(children, CodeBlockHeader)

  const [lineActions, setLineActions] =
    useState<CodeBlockLineActionsRender | null>(null)
  const [actionsSide, setActionsSide] =
    useState<CodeBlockLineActionsSide>("end")
  const actionsOwnerRef = useRef<object | null>(null)
  const actionsRegistry = useMemo(
    () => ({
      /* Wrapped in a setter callback: a render prop IS a function, so passing
         it to setState bare would run it as a state updater. Ownership makes
         a stale unmount a no-op and makes a SECOND live group loud in dev -
         the registry holds one render prop, so the second silently won. */
      register: (
        owner: object,
        render: CodeBlockLineActionsRender | null,
        side: CodeBlockLineActionsSide = "end"
      ) => {
        if (render) {
          if (
            process.env.NODE_ENV !== "production" &&
            actionsOwnerRef.current &&
            actionsOwnerRef.current !== owner
          ) {
            console.warn(
              "[code-block] Two CodeBlockLineActions are mounted; the block " +
                "renders ONE action group and the later mount replaces the " +
                "earlier one."
            )
          }
          actionsOwnerRef.current = owner
        } else if (actionsOwnerRef.current !== owner) {
          return
        } else {
          actionsOwnerRef.current = null
        }
        setLineActions(() => render)
        setActionsSide(side)
      },
    }),
    []
  )

  /* One channel between the numbers and the code, shared by the fold toggle
     and a gutter-side action. Reserved only when something asks for it, so a
     plain block keeps the gutter it always had. */
  /* Only FOLDING reserves gutter space. A gutter-side action floats over the
     row's start edge instead of widening anything, so a block with actions is
     geometrically identical to one without. */
  const gutterChannel = foldable

  /* Walked rather than registered, so server HTML never carries a doubled
     surface. Sees through plain wrappers; a consumer component boundary is
     opaque, which the dev-mode guard in CodeBlockContent reports. */
  const hasContent = containsElementType(children, CodeBlockContent)

  const surfaceProps: CodeBlockSurfaceProps = {
    lines: renderedLines,
    gutterMax: lines[lines.length - 1]?.number ?? startLine,
    foldable,
    gutterChannel,
    actionsSide,
    foldStarts,
    foldedSet,
    onToggleFold: toggleFold,
    expandClearance: collapsible && isExpanded,
    wrap,
    startLine,
    showLineNumbers,
    focusMode,
    selectable,
    selectedSet,
    toggleLine,
    visibleLines,
    streaming,
    label: label ?? (language ? `${language} code` : "Code"),
    contentId,
    actions: lineActions,
    completeAnnouncement,
    builtInSurfaceRendered: !hasContent,
  }

  return (
    <CodeBlockConfigContext.Provider value={configValue}>
      <CodeBlockDocumentContext.Provider value={documentValue}>
        <CodeBlockActionsContext.Provider value={actionsRegistry}>
          <div
            data-slot="code-block"
            data-variant={variant}
            data-streaming={streaming || undefined}
            data-has-diff={hasDiff || undefined}
            data-foldable={foldable || undefined}
            data-gutter-channel={gutterChannel || undefined}
            data-has-header={hasHeader || undefined}
            className={cn(
              ROOT_BASE_CLASS,
              ROOT_RADIUS_CLASS,
              ROOT_TOKEN_CLASS,
              variant === "default" && ROOT_SURFACE_CLASS,
              variant === "ghost" && ROOT_GHOST_CLASS,
              className
            )}
            {...props}
          >
            <CodeBlockSurfacePropsContext.Provider value={surfaceProps}>
              {children}
              {!hasContent && <CodeBlockSurface {...surfaceProps} />}
            </CodeBlockSurfacePropsContext.Provider>
          </div>
        </CodeBlockActionsContext.Provider>
      </CodeBlockDocumentContext.Provider>
    </CodeBlockConfigContext.Provider>
  )
}

/**
 * The code surface as a composable part: inside your own ScrollArea the block
 * stops scrolling internally and the ancestor owns both axes (`maxLines`'
 * height cap no longer applies). Omitted, the root renders the same surface
 * itself, exactly as before.
 */
function CodeBlockContent({ className }: { className?: string }) {
  const surface = useContext(CodeBlockSurfacePropsContext)
  if (!surface) {
    throw new Error("CodeBlockContent must be used within a CodeBlock")
  }

  /* The render-time walk cannot see through a consumer's own component
     boundary; when that happens the root also renders its built-in surface
     and the code appears twice. Silent double content is the worst failure
     mode, so development says exactly what to do. */
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    if (surface.builtInSurfaceRendered) {
      console.error(
        "CodeBlockContent is hidden behind a component boundary, so CodeBlock " +
          "also rendered its built-in surface and the code appears twice. " +
          "Compose <CodeBlockContent /> directly in the CodeBlock's children " +
          "(plain wrappers like a ScrollArea are fine)."
      )
    }
  }, [surface.builtInSurfaceRendered])

  return <CodeBlockSurface {...surface} scroll={false} className={className} />
}

/**
 * Sees through plain element wrappers (a ScrollArea, a div) but not through a
 * consumer's own component boundary - unrendered children are opaque. Compose
 * `CodeBlockContent` directly in the block's subtree.
 */
function containsElementType(node: ReactNode, type: unknown): boolean {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    if (child.type === type) return true
    const inner = (child.props as { children?: ReactNode }).children
    if (inner && containsElementType(inner, type)) return true
  }
  return false
}

/* -------------------------------------------------------------------------- */
/*                                   Surface                                   */
/* -------------------------------------------------------------------------- */

type CodeBlockSurfaceProps = {
  lines: CodeBlockLine[]
  wrap: boolean
  startLine: number
  showLineNumbers: boolean
  focusMode: boolean
  selectable: boolean
  selectedSet: Set<number>
  toggleLine: (line: number, extend: boolean) => void
  visibleLines?: number
  gutterMax: number
  foldable: boolean
  gutterChannel: boolean
  actionsSide: CodeBlockLineActionsSide
  foldStarts: Map<number, CodeBlockFoldRegion>
  foldedSet: Set<number>
  onToggleFold: (start: number) => void
  expandClearance: boolean
  streaming: boolean
  label: string
  contentId: string
  actions?: CodeBlockLineActionsRender | null
  completeAnnouncement?: string
  /** true when the root rendered its own surface (no CodeBlockContent found). */
  builtInSurfaceRendered?: boolean
  /** false = no scroll container of its own; an ancestor scrolls instead. */
  scroll?: boolean
  className?: string
}

function CodeBlockSurface({
  lines,
  wrap,
  startLine,
  showLineNumbers,
  focusMode,
  selectable,
  selectedSet,
  toggleLine,
  visibleLines,
  gutterMax,
  foldable,
  gutterChannel,
  actionsSide,
  foldStarts,
  foldedSet,
  onToggleFold,
  expandClearance,
  streaming,
  label,
  contentId,
  actions,
  completeAnnouncement,
  scroll = true,
  className,
}: CodeBlockSurfaceProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const preRef = useRef<HTMLPreElement | null>(null)
  const [activeLine, setActiveLine] = useState<number | null>(null)
  const stickRef = useRef(true)

  /* Stick-to-bottom disengages the moment the reader scrolls up, and re-engages
     when they come back. Reading the scroll position on the event is enough
     here because nothing is written back during the same frame. */
  /* Announced once when a stream ends, so a screen reader learns the code is
     complete without hearing it assembled character by character. */
  const [announcement, setAnnouncement] = useState("")
  const wasStreaming = useRef(streaming)
  useEffect(() => {
    if (wasStreaming.current && !streaming) {
      setAnnouncement(
        completeAnnouncement ??
          `Code generation complete, ${lines.length} lines.`
      )
    }
    wasStreaming.current = streaming
  }, [streaming, lines.length, completeAnnouncement])

  /* Stick-to-bottom follows whichever element ACTUALLY scrolls - writing
     scrollTop to the composed mode's inert viewport was a silent no-op.
     Resolved per commit: a short block becomes its own scroller the moment
     it outgrows its cap. */
  const resolveScroller = useCallback((): HTMLElement | null => {
    const viewport = viewportRef.current
    if (!viewport) return null
    if (viewport.scrollHeight > viewport.clientHeight + 1) return viewport

    let node: HTMLElement | null = viewport.parentElement
    while (node && node !== document.body) {
      const overflowY = getComputedStyle(node).overflowY
      if (
        (overflowY === "auto" ||
          overflowY === "scroll" ||
          overflowY === "overlay") &&
        node.scrollHeight > node.clientHeight + 1
      ) {
        return node
      }
      node = node.parentElement
    }

    /* An AI transcript's default shape scrolls the PAGE. The walk above never
       reaches the root elements, so without this branch the stream wrote
       scrollTop to an inert viewport and drifted off screen. */
    const page = document.scrollingElement as HTMLElement | null
    if (page && page.scrollHeight > page.clientHeight + 1) return page

    return viewport
  }, [])

  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const distance =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    stickRef.current = distance < 24
  }, [])

  /* The ancestor case needs its own listener: the reader's intent has to be
     recorded BEFORE the next chunk grows the content, or the distance already
     includes what just arrived. Re-attached per chunk rather than diffed,
     which is a handful of listener swaps a second and keeps this correct when
     the scrolling element changes underneath. */
  useEffect(() => {
    if (!streaming) return
    const scroller = resolveScroller()
    if (!scroller || scroller === viewportRef.current) return

    const onScroll = () => {
      const distance =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight
      stickRef.current = distance < 24
    }

    /* Page scrolls fire on window, not on the scrolling element. */
    const target: EventTarget =
      scroller === document.scrollingElement ? window : scroller
    target.addEventListener("scroll", onScroll, { passive: true })
    return () => target.removeEventListener("scroll", onScroll)
  }, [streaming, lines.length, resolveScroller])

  useIsoLayoutEffect(() => {
    if (!streaming || !stickRef.current) return
    const scroller = resolveScroller()
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }, [lines, streaming, resolveScroller])

  /* One listener for the whole surface rather than a handler per line: the
     active row is resolved from the event target, so the floating action group
     costs one element no matter how long the file is. Focus is tracked as well
     as hover, or the actions would be unreachable without a pointer. */
  const trackActive = useCallback(
    (event: { target: EventTarget | null }) => {
      if (!actions && !selectable) return
      const target = event.target as HTMLElement | null
      const row = target?.closest?.("[data-code-line]") as HTMLElement | null
      const value = row?.getAttribute("data-code-line")

      /* No row under the pointer means the gutter, which lives in the <pre>'s
       PADDING and so is covered by no row element. Keep the active line
       rather than clearing it: clearing here unmounted a gutter action the
       moment the pointer left the code toward it, so the control vanished
       before it could be pressed. `onPointerLeave` still clears on exit. */
      if (!value) return
      setActiveLine(Number(value))
    },
    [actions, selectable]
  )

  const clearActive = useCallback(() => setActiveLine(null), [])

  /* Rows and keyboard speak DISPLAYED numbers (the gutter, data-code-line);
     selection state speaks SOURCE numbers like every other line spec. This is
     the one conversion point between them. */
  const toggleDisplayed = useCallback(
    (displayed: number, extend: boolean) =>
      toggleLine(displayed - startLine + 1, extend),
    [toggleLine, startLine]
  )

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (!selectable) return

      if (event.key === "Escape") {
        setActiveLine(null)
        return
      }

      /* Toggle IN PLACE. Shift+Arrow selects while moving, but without this a
         keyboard user could never deselect a single line. */
      if ((event.key === "Enter" || event.key === " ") && activeLine !== null) {
        event.preventDefault()
        toggleDisplayed(activeLine, event.shiftKey)
        return
      }

      const isArrow = event.key === "ArrowDown" || event.key === "ArrowUp"
      if (!isArrow && event.key !== "Home" && event.key !== "End") return
      event.preventDefault()

      /* Step by RENDERED index, not by number arithmetic: folding removes
         rows, and numeric stepping walked the active line into hidden lines
         where it silently vanished. */
      let next: number
      if (event.key === "Home") {
        next = lines[0]?.number ?? startLine
      } else if (event.key === "End") {
        next = lines[lines.length - 1]?.number ?? startLine
      } else {
        const step = event.key === "ArrowDown" ? 1 : -1
        const index = lines.findIndex((line) => line.number === activeLine)
        const nextIndex =
          index === -1
            ? step === 1
              ? 0
              : lines.length - 1
            : Math.min(lines.length - 1, Math.max(0, index + step))
        next = lines[nextIndex]?.number ?? startLine
      }

      setActiveLine(next)
      const row = preRef.current?.querySelector<HTMLElement>(
        `[data-code-line="${next}"]`
      )
      row?.scrollIntoView({ block: "nearest" })
      if (isArrow && event.shiftKey) toggleDisplayed(next, true)
    },
    [selectable, lines, startLine, activeLine, toggleDisplayed]
  )

  const lastLineNumber = lines[lines.length - 1]?.number

  /* `startLine` is just a counter reset. Gutter width follows the widest
     number in the DOCUMENT (not the folded view, or folding the tail would
     shift every row); `ch` is one digit in the mono `pre`, and the floor of 2
     stops the column twitching as a stream crosses line 9. Lines carrying
     their own gutter label (a patch's dual numbers) widen it to the longest
     label instead. */
  const gutterDigits = Math.max(
    2,
    String(gutterMax ?? startLine).length,
    ...lines.map((line) => line.gutter?.length ?? 0)
  )

  const surfaceStyle = {
    "--code-block-gutter-width": gutterChannel
      ? `calc(${gutterDigits}ch + var(--code-block-fold-width) + var(--code-block-gutter-gap) + var(--code-block-padding))`
      : `calc(${gutterDigits}ch + var(--code-block-gutter-gap) + var(--code-block-padding))`,
    counterReset: `cb-line ${startLine - 1}`,
  } as CSSProperties

  return (
    <div
      data-slot="code-block-content"
      className={cn(
        "relative min-w-0 rounded-[inherit]",
        /* Clipping is the scroll-mode contract only: composed, a clipped pre
           would hide its own width from the ancestor's viewport and the
           horizontal scrollbar would never render. */
        scroll && "flex-1 overflow-hidden"
      )}
    >
      {/* A polite status, deliberately NOT an aria-live region on the code
          itself: a live region over streaming code narrates every token. */}
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
      {/* A plain overflow container, deliberately not a ScrollArea primitive.
          The scroll must stay INSIDE the block (the sticky gutter, the
          stick-to-bottom stream and `maxLines` all anchor to it), but nothing
          here needs custom scrollbar machinery, and dropping it leaves the
          block with no UI-library dependency at all - which is why both twins
          are the same file. Compose Card, Frame, or your own ScrollArea
          around the block for outer framing. */}
      <div
        ref={viewportRef}
        data-slot="code-block-viewport"
        id={contentId}
        role="region"
        aria-label={label}
        aria-busy={streaming || undefined}
        aria-activedescendant={
          selectable && activeLine !== null
            ? `${contentId}-L${activeLine}`
            : undefined
        }
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className={cn(
          "focus-visible:ring-ring/50 relative min-w-0 rounded-[inherit] outline-none focus-visible:ring-[3px]",
          /* Composed under an ancestor scroller the surface scrolls NOTHING
             itself: both axes belong to the ancestor, whose viewport picks up
             the pre's overflowing width, and the sticky number cell anchors
             to that viewport instead. Mixed ownership shipped once and read
             as two scrollbar styles on one block. */
          scroll && "[scrollbar-width:thin] overflow-auto",
          scroll && visibleLines && "max-h-(--cb-max-height)",
          className
        )}
        style={
          scroll && visibleLines
            ? ({
                "--cb-max-height": `calc(${visibleLines} * var(--code-block-line-height) + 2 * var(--code-block-padding))`,
              } as CSSProperties)
            : undefined
        }
      >
        <pre
          ref={preRef}
          dir="ltr"
          data-code-line-numbers={showLineNumbers || undefined}
          data-wrap={wrap || undefined}
          role={selectable ? "listbox" : undefined}
          data-selectable={selectable || undefined}
          aria-multiselectable={selectable || undefined}
          aria-label={selectable ? `${label} lines` : undefined}
          onPointerOver={trackActive}
          onPointerLeave={clearActive}
          onFocus={trackActive}
          className={cn(
            "w-max min-w-full py-(--code-block-padding) font-mono text-(length:--code-block-font-size)",
            TOKEN_COLOR_CLASS,
            TOKEN_MOTION_CLASS,
            /* `min-w-0` must beat the `min-w-full` above, or the pre keeps
                   a floor of 100% of a scroll container that is itself wider
                   than the viewport, and wrapping still leaves a stray
                   horizontal scrollbar. */
            wrap && "w-full max-w-full min-w-0 break-words whitespace-pre-wrap",
            showLineNumbers && "pl-(--code-block-gutter-width)",
            /* The expand control floats over the surface in BOTH states, so
                   an expanded block reserves a row of clearance rather than
                   growing a bordered footer under the code. */
            expandClearance && "pb-(--code-block-expand-clearance)"
          )}
          style={surfaceStyle}
        >
          {/* `content-visibility: auto` is a measured dead end on BOTH axes:
                  its style containment breaks the shared gutter counter
                  (every number renders as 1), and per-row it still fails -
                  the paint containment clips the number cell, which is
                  deliberately pulled left OUT of the row's box (verified in
                  Chrome: forcing one row visible restored only that row's
                  number). Windowing here means rendering fewer rows, not
                  containing them. */}
          {/* presentation, so the listbox owns its options directly. */}
          <code
            data-slot="code-block-code"
            role={selectable ? "presentation" : undefined}
          >
            {lines.map((line) => (
              <CodeBlockLineRow
                key={line.number}
                line={line}
                selectable={selectable}
                selected={selectedSet.has(line.number - startLine + 1)}
                focusMode={focusMode}
                active={activeLine === line.number}
                caret={streaming && line.number === lastLineNumber}
                actions={activeLine === line.number ? actions : null}
                actionsSide={actionsSide}
                domIdBase={contentId}
                startLine={startLine}
                onSelect={toggleDisplayed}
                foldable={foldable}
                foldRegion={foldStarts.get(line.number - startLine + 1)}
                folded={foldedSet.has(line.number - startLine + 1)}
                onToggleFold={onToggleFold}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Chrome                                   */
/* -------------------------------------------------------------------------- */

/**
 * Opt-in header. Absent, the block renders no chrome, so it nests in a Card or
 * Frame without a doubled bar. Presence flips `data-has-header` on the root,
 * detected from the element type rather than a `:has()` selector.
 */
function CodeBlockHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <CodeBlockHeaderContext.Provider value={true}>
      <div
        data-slot="code-block-header"
        className={cn(
          "border-border flex min-h-9 shrink-0 items-center gap-2 border-b px-3 py-0 text-sm",
          className
        )}
        {...props}
      />
    </CodeBlockHeaderContext.Provider>
  )
}

function CodeBlockTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "text-muted-foreground min-w-0 truncate font-mono text-xs",
        className
      )}
      {...props}
    />
  )
}

/**
 * The resolved language as a label, no props needed. It shows what the
 * highlighter actually resolved, so an unsupported grammar becomes visible
 * instead of silently rendering plain.
 */
function CodeBlockLanguage({
  className,
  children,
  ...props
}: ComponentProps<"span">) {
  const { language, resolvedLanguage } = useInternalConfig("CodeBlockLanguage")
  const label = children ?? resolvedLanguage ?? language

  if (!label) return null

  return (
    <span
      data-slot="code-block-language"
      data-unsupported={!resolvedLanguage || undefined}
      className={cn(
        "border-border bg-muted/60 text-muted-foreground inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none uppercase",
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Copy button                                */
/* -------------------------------------------------------------------------- */

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

export type CodeBlockCopyButtonProps = {
  value?: string
  timeout?: number
  onCopy?: (value: string) => void
  onCopyError?: (error: unknown) => void
  /** Accessible names, for localisation. */
  labels?: { copy?: string; copied?: string }
  /** `pinned` floats over the surface; `inline` sits in a header. */
  position?: "auto" | "pinned" | "inline"
  alwaysVisible?: boolean
} & Omit<ComponentProps<typeof Button>, "value" | "onCopy">

/**
 * Copy button. Inline inside a header, pinned over the surface anywhere else.
 * Pinning is absolute against the root, not `position: sticky`: sticky still
 * slides away under HORIZONTAL scroll, and code scrolls sideways constantly.
 * Notation comments are stripped from the payload, matching what is rendered.
 */
function CodeBlockCopyButton({
  value,
  timeout = 2000,
  onCopy,
  onCopyError,
  labels,
  position = "auto",
  alwaysVisible = false,
  className,
  variant = "ghost",
  size,
  children,
  ...props
}: CodeBlockCopyButtonProps) {
  const context = useContext(CodeBlockConfigContext)
  const inHeader = useContext(CodeBlockHeaderContext)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  const resolvedPosition =
    position === "auto" ? (inHeader ? "inline" : "pinned") : position

  /* A header is chrome, so the button takes the smaller icon rung there and the
     full one when it floats over the code. Both are per-style ladders in the
     shadcn button, so this stays style-aware instead of pinning a pixel size. */
  const resolvedSize =
    size ?? (resolvedPosition === "inline" ? "icon-sm" : "icon")

  useEffect(() => {
    if (!copied || timeout === 0) return
    const id = window.setTimeout(() => setCopied(false), timeout)
    return () => window.clearTimeout(id)
  }, [copied, timeout])

  useEffect(() => {
    if (!copyFailed) return
    const id = window.setTimeout(() => setCopyFailed(false), 2000)
    return () => window.clearTimeout(id)
  }, [copyFailed])

  const document_ = useContext(CodeBlockDocumentContext)

  const handleClick = useCallback(() => {
    /* Server-highlighted blocks pass `lines` and no `code`, so the document
       text is the fallback; without it this rendered a labelled control that
       did nothing on the exact path the docs advertise. */
    const fallback =
      document_?.code || document_?.lines.map((line) => line.text).join("\n")
    const payload = stripNotationComments(value ?? fallback ?? "")
    if (!payload) return
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return
    }

    navigator.clipboard.writeText(payload).then(
      () => {
        setCopied(true)
        onCopy?.(payload)
      },
      /* Rejection is routine: a denied permission, or a document that lost
         focus. Without the handler it surfaced as an unhandled rejection in
         the consumer's error monitoring. */
      (error: unknown) => {
        setCopyFailed(true)
        onCopyError?.(error)
      }
    )
  }, [value, context, document_, onCopy, onCopyError])

  return (
    <Button
      type="button"
      data-slot="code-block-copy"
      data-copied={copied || undefined}
      data-copy-failed={copyFailed || undefined}
      data-position={resolvedPosition}
      aria-label={
        copied ? (labels?.copied ?? "Copied") : (labels?.copy ?? "Copy code")
      }
      variant={variant}
      size={resolvedSize}
      onClick={handleClick}
      className={cn(
        "shrink-0 [&_svg]:size-3.5",
        resolvedPosition === "pinned" &&
          /* Physical `right`, not logical `end`: the code surface is forced
             dir="ltr", so in an RTL app the logical inset landed the button
             over the first characters instead of the trailing edge. */
          "absolute top-(--code-block-copy-top) right-(--code-block-copy-inset) z-20",
        resolvedPosition === "pinned" &&
          !alwaysVisible &&
          "opacity-0 transition-opacity group-hover/code-block:opacity-100 focus-visible:opacity-100",
        className
      )}
      {...props}
    >
      {children ?? <CopyIcon copied={copied} />}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Wrap and expand                                */
/* -------------------------------------------------------------------------- */

function CodeBlockWrapToggle({
  className,
  children,
  variant = "ghost",
  size = "sm",
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { wrap, setWrap } = useInternalConfig("CodeBlockWrapToggle")

  return (
    <Button
      type="button"
      data-slot="code-block-wrap-toggle"
      data-state={wrap ? "on" : "off"}
      aria-pressed={wrap}
      variant={variant}
      size={size}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setWrap(!wrap)
      }}
      className={cn("shrink-0", className)}
      {...props}
    >
      {children ?? (wrap ? "No wrap" : "Wrap")}
    </Button>
  )
}

/**
 * Expands a block collapsed by `maxLines`.
 *
 * Renders nothing when the content is shorter than the cut, so a consumer can
 * always compose it without guarding on line count themselves.
 */
function CodeBlockExpandButton({
  className,
  children,
  variant = "ghost",
  size = "sm",
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { expanded, setExpanded, collapsible, contentId } = useInternalConfig(
    "CodeBlockExpandButton"
  )

  if (!collapsible) return null

  return (
    <div
      data-slot="code-block-expand"
      data-state={expanded ? "expanded" : "collapsed"}
      className={cn(
        /* Both states float over the surface. Expanded used to rejoin the flex
           column as a bordered strip, which read as a card footer and moved the
           block's bottom edge on the first click; the surface reserves a row of
           clearance instead, so only the label changes. */
        "absolute inset-x-0 bottom-0 z-10 order-last flex items-end justify-center pt-10 pb-2",
        /* The fade means "there is more below", so it belongs to the collapsed
           state only. Expanded, the surface already reserves a clear row for
           this control, and keeping the gradient just dimmed the last real
           line of code. */
        !expanded && "from-card via-card/85 bg-gradient-to-t to-transparent",
        className
      )}
    >
      <Button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        variant={variant}
        size={size}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) setExpanded(!expanded)
        }}
        {...props}
      >
        {children ?? (expanded ? "Show less" : "Show more")}
      </Button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Line actions                                */
/* -------------------------------------------------------------------------- */

export type CodeBlockLineActionsProps = {
  children: CodeBlockLineActionsRender
  /**
   * `end` floats the group over the end of the active row. `gutter` puts it in
   * the channel beside the line number, which is where a "add this line"
   * affordance belongs. A fold toggle owns that channel when both are on, so a
   * gutter action on a fold-start row falls back to `end`.
   */
  side?: CodeBlockLineActionsSide
}

/**
 * Actions on the hovered or focused line. ONE group exists for the whole
 * block, rendered inside the active row: a 2,000 line file mounts one button
 * group, not 2,000.
 */
const LANGUAGE_EXTENSIONS: Record<string, string> = {
  bash: "sh",
  c: "c",
  cpp: "cpp",
  csharp: "cs",
  css: "css",
  diff: "patch",
  docker: "dockerfile",
  go: "go",
  graphql: "graphql",
  html: "html",
  java: "java",
  javascript: "js",
  json: "json",
  jsx: "jsx",
  kotlin: "kt",
  markdown: "md",
  php: "php",
  python: "py",
  ruby: "rb",
  rust: "rs",
  sql: "sql",
  swift: "swift",
  toml: "toml",
  tsx: "tsx",
  typescript: "ts",
  xml: "xml",
  yaml: "yaml",
}

export type CodeBlockDownloadButtonProps = {
  /** Text to save. Defaults to the block's code with notation stripped. */
  value?: string
  /** Defaults to `code.<ext>` from the block's language. */
  filename?: string
  onDownload?: (filename: string) => void
  /** `pinned` floats over the surface; `inline` sits in a header. */
  position?: "auto" | "pinned" | "inline"
  alwaysVisible?: boolean
  /** Accessible name, for localisation. */
  label?: string
} & Omit<ComponentProps<typeof Button>, "value">

/**
 * Saves the block's code as a file - the sibling the copy button was missing
 * for builder-style output, where the result IS a file and disk is the next
 * step. Same placement contract as the copy button.
 */
function CodeBlockDownloadButton({
  value,
  filename,
  onDownload,
  position = "auto",
  alwaysVisible = false,
  label,
  className,
  variant = "ghost",
  size,
  children,
  ...props
}: CodeBlockDownloadButtonProps) {
  const context = useContext(CodeBlockConfigContext)
  const document_ = useContext(CodeBlockDocumentContext)
  const inHeader = useContext(CodeBlockHeaderContext)

  const resolvedPosition =
    position === "auto" ? (inHeader ? "inline" : "pinned") : position
  const resolvedSize =
    size ?? (resolvedPosition === "inline" ? "icon-sm" : "icon")

  const handleClick = useCallback(() => {
    const fallback =
      document_?.code || document_?.lines.map((line) => line.text).join("\n")
    const payload = stripNotationComments(value ?? fallback ?? "")
    if (!payload || typeof window === "undefined") return

    const extension =
      LANGUAGE_EXTENSIONS[context?.resolvedLanguage ?? ""] ?? "txt"
    const name = filename ?? `code.${extension}`
    const url = URL.createObjectURL(
      new Blob([payload], { type: "text/plain;charset=utf-8" })
    )
    const anchor = window.document.createElement("a")
    anchor.href = url
    anchor.download = name
    anchor.click()
    /* Deferred: revoking synchronously races the browser starting the save. */
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    onDownload?.(name)
  }, [value, filename, context, document_, onDownload])

  return (
    <Button
      type="button"
      data-slot="code-block-download"
      data-position={resolvedPosition}
      aria-label={label ?? "Download code"}
      variant={variant}
      size={resolvedSize}
      onClick={handleClick}
      className={cn(
        "shrink-0 [&_svg]:size-3.5",
        resolvedPosition === "pinned" &&
          "absolute top-(--code-block-copy-top) right-(--code-block-copy-inset) z-20",
        resolvedPosition === "pinned" &&
          !alwaysVisible &&
          "opacity-0 transition-opacity group-hover/code-block:opacity-100 focus-visible:opacity-100",
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      )}
    </Button>
  )
}

function CodeBlockLineActions({
  children,
  side = "end",
}: CodeBlockLineActionsProps) {
  const registry = useContext(CodeBlockActionsContext)
  const owner = useRef({}).current

  useEffect(() => {
    registry?.register(owner, children, side)
    return () => registry?.register(owner, null)
  }, [registry, owner, children, side])

  return null
}

/**
 * Live folding for anything composed inside the block - a "fold all" control,
 * a region count. Mirrors `useCodeBlockSelection`; region and start numbers
 * are source-based like every line spec.
 */
function useCodeBlockFolding() {
  const document = useContext(CodeBlockDocumentContext)
  if (!document) {
    throw new Error("useCodeBlockFolding must be used within a CodeBlock")
  }

  const { foldable, foldRegions, folded, toggleFold, setFolded } = document
  const foldedStarts = useMemo(
    () => [...folded].sort((a, b) => a - b),
    [folded]
  )
  const foldAll = useCallback(
    () => setFolded(foldRegions.map((region) => region.start)),
    [setFolded, foldRegions]
  )
  const unfoldAll = useCallback(() => setFolded([]), [setFolded])

  return {
    foldable,
    regions: foldRegions,
    foldedStarts,
    toggleFold,
    foldAll,
    unfoldAll,
  }
}

/**
 * Live selection for anything composed inside the block - a line action, a
 * header control. Returns the selected lines as a sorted array plus the same
 * toggle the rows use, so an "add selection to chat" affordance can act on the
 * whole range instead of only the hovered line.
 */
function useCodeBlockSelection() {
  const document = useContext(CodeBlockDocumentContext)
  if (!document) {
    throw new Error("useCodeBlockSelection must be used within a CodeBlock")
  }

  const { selected, selectable, toggleLine, clearSelection } = document
  const selectedLines = useMemo(
    () => [...selected].sort((a, b) => a - b),
    [selected]
  )

  return { selectable, selectedLines, toggleLine, clearSelection }
}

/* Re-exported so a consumer wires an AI transcript from one import path. */
export { markdownCodeProps, markdownFences }
export {
  ansiToLines,
  parseUnifiedDiff,
} from "@/registry-reui/bases/radix/reui/code-block/code-block-highlight"
export type {
  CodeBlockDiffSpec,
  CodeBlockHighlightOptions,
  CodeBlockLevelSpec,
  CodeBlockLine,
  CodeBlockLineActionsRender,
  CodeBlockLineSpec,
  CodeBlockLineState,
  CodeBlockPatchFile,
  CodeBlockThemes,
  CodeBlockToken,
  CodeBlockTransformer,
  CodeBlockWordSpec,
} from "@/registry-reui/bases/radix/reui/code-block/code-block-highlight"

export {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockDownloadButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockLineActions,
  CodeBlockTitle,
  CodeBlockContent,
  CodeBlockWrapToggle,
  useCodeBlockConfig,
  useCodeBlockFolding,
  useCodeBlockSelection,
}
