"use client"

import { useCallback, useState } from "react"
import { Badge, type BadgeProps } from "@/registry-reui/bases/radix/reui/badge"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@/registry-reui/bases/radix/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/radix/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-nav"
import type {
  CascaderLoadContext,
  CascaderLoadResult,
  CascaderNode,
} from "@/registry-reui/bases/radix/reui/cascader/cascader-types"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const folderIcon = (
  <IconPlaceholder
    lucide="FolderIcon"
    tabler="IconFolder"
    hugeicons="Folder01Icon"
    phosphor="FolderIcon"
    remixicon="RiFolderLine"
    className="size-4"
  />
)
const fileIcon = (
  <IconPlaceholder
    lucide="FileTextIcon"
    tabler="IconFileText"
    hugeicons="File01Icon"
    phosphor="FileTextIcon"
    remixicon="RiFileTextLine"
    className="size-4"
  />
)

/* -------------------------------------------------------------------------- */
/*                              A pretend backend                             */
/* -------------------------------------------------------------------------- */

/**
 * The one fact a row's trailing badge carries.
 *
 * Every level has a different one - a repository's kind, a release's channel,
 * an asset's size - and none of them repeat the numeric child count the row
 * already prints, so the badge always adds something the label cannot.
 */
interface RowMeta {
  badge: string
  /**
   * How loudly that fact should read. Set where the row is built, because only
   * the level that knows what the string MEANS can say whether it is the
   * default pick, a supported alternative, or a download worth a second look.
   */
  tone: Tone
}

type Tone = "primary" | "success" | "info" | "warning"

/**
 * Tone to chip.
 *
 * All four are SEMANTIC outline variants. Plain `outline` is `bg-transparent`
 * in light mode, so a highlighted row washed straight through the chip; these
 * are `bg-background`, an actual fill, and they carry the meaning in their text
 * colour rather than in a second element.
 *
 * `pin` repeats each variant's own text colour with `!`. A highlighted row
 * repaints every descendant with `text-accent-foreground`, which would grey the
 * chip out under the pointer, the way the primitive pins its own accent count.
 */
const TONE_BADGE: Record<
  Tone,
  { variant: BadgeProps["variant"]; pin: string }
> = {
  primary: { variant: "primary-outline", pin: "text-primary!" },
  success: { variant: "success-outline", pin: "text-success-foreground!" },
  info: { variant: "info-outline", pin: "text-info-foreground!" },
  warning: { variant: "warning-outline", pin: "text-warning-foreground!" },
}

/** Past this, the size is worth reading twice before you pick the row. */
const LARGE_ASSET_MB = 5

const REPOSITORIES = [
  { name: "reui", kind: "components" },
  { name: "keenicons", kind: "icons" },
  { name: "metronic", kind: "templates" },
  { name: "reui-blocks", kind: "blocks" },
  { name: "reui-icons", kind: "icons" },
  { name: "reui-mcp", kind: "mcp" },
  { name: "reui-templates", kind: "templates" },
  { name: "reui-cli", kind: "cli" },
]
const RELEASES_PER_REPOSITORY = 4
const ASSETS_PER_RELEASE = 20
const PAGE_SIZE = 8

/**
 * Nothing is known up front, and `items` still has to be given something.
 * Hoisted so the array keeps one identity across renders, and so `T` is
 * inferred as `RowMeta` from it - which is what types `node.data` inside
 * `renderLabel`.
 */
const NO_ITEMS: CascaderNode<RowMeta>[] = []

/** Every asset lives under `repository / release / file`, generated on demand. */
function releasesFor(repository: string) {
  return Array.from({ length: RELEASES_PER_REPOSITORY }, (_, i) => {
    const major = RELEASES_PER_REPOSITORY - i
    return {
      value: `${repository}/v${major}`,
      label: `v${major}.0`,
      icon: folderIcon,
      // Without `hasChildren` an unfetched branch renders as a selectable leaf:
      // the cascader has no other way to know a level exists before it is loaded.
      hasChildren: true,
      count: ASSETS_PER_RELEASE,
      // The newest release is the one you usually want, so it takes the brand
      // accent; the rest are supported, not stale, so they read as `success`
      // rather than as a greyed-out alternative.
      data:
        i === 0
          ? { badge: "latest", tone: "primary" as const }
          : { badge: "stable", tone: "success" as const },
    }
  }) satisfies CascaderNode<RowMeta>[]
}

function filesFor(release: string, offset: number) {
  const length = Math.min(PAGE_SIZE, ASSETS_PER_RELEASE - offset)
  return Array.from({ length }, (_, i) => {
    const n = offset + i + 1
    // Derived from the index rather than randomised. A paged row that showed a
    // different size every time it was fetched would read as data moving under
    // the user, which is the opposite of what this example is about.
    const megabytes = 0.6 + n * 0.37
    return {
      value: `${release}/asset-${n}`,
      label: `asset-${String(n).padStart(2, "0")}.tar.gz`,
      icon: fileIcon,
      // A size only earns a colour once it changes your mind about the row, so
      // the amber starts at the point a download stops being free.
      data: {
        badge: `${megabytes.toFixed(1)} MB`,
        tone:
          megabytes >= LARGE_ASSET_MB
            ? ("warning" as const)
            : ("info" as const),
      },
    }
  }) satisfies CascaderNode<RowMeta>[]
}

/**
 * Deliberately slow.
 *
 * The behaviour this example exists to show is what happens BETWEEN the press
 * and the new level, so a 150ms fake latency would hide it: the spinner would
 * flash for two frames and the panel would look like it navigated instantly.
 * 700ms is long enough to read the row you pressed, watch its chevron become a
 * spinner, and see that the level under it did not move until the children
 * landed. Real registries are slower than this.
 */
const LATENCY_MS = 700

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    })
  })

/**
 * Async drill-down: load BEFORE you move.
 *
 * Nothing is known up front. The root level, each release and each page of
 * assets is fetched as it comes into view, and `getChildren` is asked for one
 * level at a time.
 *
 * The part worth watching is what a press does while the fetch is in flight.
 * The panel does NOT navigate and then show a loading screen. It stays on the
 * level you are reading and turns THAT row's chevron into a spinner in the same
 * 16px box, so nothing reflows, the rows around it stay readable, and a failed
 * request leaves you where you were with a retry on the row you pressed rather
 * than on an error screen for a level you never saw. The sub-level renders only
 * once its children exist.
 *
 * `getChildren` hands back a cursor when there is more, which turns the last
 * row of a level into a "Load more" affordance - a real, keyboard reachable
 * option rather than an invisible scroll sentinel.
 *
 * Loaded pages are cached until `loadKey` changes, so walking back up the tree
 * and down again costs nothing.
 *
 * Every row is one line: icon, label, trailing badge. `renderLabel` replaces
 * only the label block, so the count, the chevron and the spinner that takes
 * its place all keep working while the badge rides along beside them. A second
 * line under the label would push the loading affordance further from the text
 * it belongs to and halve the number of rows a level can show.
 *
 * That badge is a semantic outline variant, picked per row from `TONE_BADGE`.
 * The row it sits on turns `bg-accent` under the pointer, so the chip needs a
 * fill of its own and a pinned text colour to survive the highlight.
 */
export default function Pattern() {
  const [value, setValue] = useState("")
  const [failNext, setFailNext] = useState(false)

  const getChildren = useCallback(
    async (
      node: CascaderNode<RowMeta> | null,
      context: CascaderLoadContext
    ): Promise<CascaderLoadResult<RowMeta>> => {
      await wait(LATENCY_MS, context.signal)

      if (failNext) {
        setFailNext(false)
        throw new Error("The registry is unreachable.")
      }

      // The root level: the repositories themselves.
      if (node === null) {
        return {
          items: REPOSITORIES.map((repository) => ({
            value: repository.name,
            label: repository.name,
            icon: folderIcon,
            hasChildren: true,
            count: RELEASES_PER_REPOSITORY,
            // A repository's kind is a classification, not a verdict on it, so
            // every root row reads at the same weight.
            data: { badge: repository.kind, tone: "info" as const },
          })),
        }
      }

      // A repository: its releases. One response, no paging.
      if (REPOSITORIES.some((repository) => repository.name === node.value)) {
        return { items: releasesFor(node.value) }
      }

      // A release: assets, eight at a time.
      const offset = context.cursor ? Number(context.cursor) : 0
      const items = filesFor(node.value, offset)
      const next = offset + items.length
      const more = next < ASSETS_PER_RELEASE
      return {
        items,
        nextCursor: more ? String(next) : undefined,
        hasMore: more,
      }
    },
    [failNext]
  )

  return (
    <div className="flex w-full flex-col items-center gap-3 p-4">
      <Cascader
        items={NO_ITEMS}
        getChildren={getChildren}
        value={value}
        onValueChange={setValue}
        // One line per row: the icon and the trailing affordances stay where
        // the default put them, and the badge sits between the label and them.
        // The paging row never reaches this - it renders its own body - so the
        // absent `data` there needs no special case.
        renderLabel={(node) => (
          <span className="flex w-full min-w-0 items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-start">
              {node.label}
            </span>
            {node.data ? (
              <Badge
                variant={TONE_BADGE[node.data.tone].variant}
                className={cn("shrink-0", TONE_BADGE[node.data.tone].pin)}
              >
                {node.data.badge}
              </Badge>
            ) : null}
          </span>
        )}
      >
        <CascaderTrigger
          aria-label="Release asset"
          render={
            <Button
              variant="outline"
              className="w-80 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue placeholder="Select a release asset" />
        </CascaderTrigger>

        {/* The branch spinner is drawn by the primitive at `size-4`, the size
            of the chevron it replaces. Scoped down to 3.5 here, which is what
            the paging row's own spinner already uses, so the two loading
            states in one panel are the same weight. The 16px affordance box is
            untouched, so nothing reflows when the glyph swaps. */}
        <CascaderContent className="w-80 **:data-[slot=spinner]:size-3.5">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            {/* One element that swaps its children between loading, error and
                empty, so an async level never announces "No results found."
                on its way to being loaded. */}
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>

      <p className="text-muted-foreground max-w-80 text-center text-xs text-balance">
        Each level is fetched on press, {LATENCY_MS}ms per request.
      </p>

      <Button
        variant="outline"
        size="sm"
        disabled={failNext}
        onClick={() => setFailNext(true)}
      >
        {failNext ? "Next request will fail" : "Fail the next request"}
      </Button>
    </div>
  )
}
