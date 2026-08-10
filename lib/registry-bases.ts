/**
 * Which shadcn component bases ReUI actually ships.
 *
 * `registry/` is a mirror of the upstream shadcn registry, so
 * `registry/bases.ts` and `registry/config.ts` will list every base shadcn
 * ships, whether or not ReUI has primitives and components for it. That is on
 * purpose: the mirror stays lossless and updating it stays a straight copy.
 *
 * This module is the single global gate deciding which of those bases are
 * shown, routed, and built. It lives in `lib/` rather than `registry/`
 * precisely so refreshing the mirror can never clobber it.
 *
 * Dependency-free on purpose (no imports, no path aliases) so app code and the
 * build scripts run through `tsx` can both import it without resolution issues.
 *
 * To ship a base later:
 *   1. add its source under `registry-reui/bases/<name>/`,
 *   2. install the base's runtime dependency (React Aria needs `react-aria-components`),
 *   3. add the name to AVAILABLE_BASES below.
 *
 * Nothing else needs to change: every consumer already filters through here.
 */

/**
 * The bases ReUI ships, as an allowlist.
 *
 * Deliberately an allowlist rather than a denylist of unsupported bases. A
 * denylist only knows about the bases that exist today, so the next base shadcn
 * adds would default to "available" and silently activate a base with no
 * content behind it. With an allowlist, anything new upstream is inert until
 * someone opts it in here.
 *
 * `aria` (React Aria), added upstream in the July 2026 shadcn release, is
 * therefore excluded simply by not being listed.
 */
export const AVAILABLE_BASES: readonly string[] = ["base", "radix"]

const AVAILABLE_BASE_SET: ReadonlySet<string> = new Set(AVAILABLE_BASES)

/** True when ReUI ships this base and it may be shown, routed, or built. */
export function isBaseAvailable(name: string): boolean {
  return AVAILABLE_BASE_SET.has(name)
}

/**
 * Narrow a list of mirrored bases down to the ones ReUI ships.
 *
 * Generic and deliberately unconstrained in its element type. `BASES` is
 * inferred as `unknown[]` (the zod `registryItemSchema` inference does not
 * survive the re-export through `registry/config.ts`), which is why callers
 * already cast it with `as any[]`. Reading the name defensively here keeps
 * every call site cast-free while preserving the element type.
 *
 * Entries without a string `name` pass through untouched: they are not bases,
 * so this is not the place to drop them.
 */
export function filterAvailableBases<T>(bases: readonly T[]): T[] {
  return bases.filter((base) => {
    const name = (base as { name?: unknown } | null)?.name
    return typeof name === "string" ? isBaseAvailable(name) : true
  })
}
